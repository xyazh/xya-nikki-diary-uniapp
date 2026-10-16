import Utils from '@/js/Utils.js'
import LZString from "@/js/LZString.js"
import CryptoJS from 'crypto-js';


class DataManager {
	static ON_IMPORT = [];
	static ON_EXPORT = [];
	static ON_LOAD = [];
	static ON_PASSWORD_CHANGE = [];
	/*
	 * V1 legacy password
	 *
	 * password = MD5(raw_password)
	 *
	 * 只用于读取：
	 * - crypt_version = 1 的旧备份文件
	 * - 没有 crypt_version 的旧本地数据
	 *
	 * 新数据绝对不要再使用这个 key 加密。
	 */
	static password = null;

	static raw_password = null;
	static PASSWORD_KDF_ITERATIONS = Utils.PASSWORD_KDF_ITERATIONS;
	static DMS = new Set();


	static onImportFile(fuc) {
		DataManager.ON_IMPORT.push(fuc);
	}
	static onExportFile(fuc) {
		DataManager.ON_EXPORT.push(fuc);
	}
	static onLoadData(fuc) {
		if (DataManager.ON_LOAD === null) {
			fuc();
			return;
		}
		DataManager.ON_LOAD.push(fuc);
	}
	static onPasswordChange(fuc) {
		DataManager.ON_PASSWORD_CHANGE.push(fuc);
	}

	static exportFile(use_pw = true) {
		if (use_pw && DataManager.hasPassword() && !DataManager.passwordKeeping()) {
			uni.showToast({
				title: "请先输入密码解锁后再导出",
				icon: "none"
			});
			return;
		}
		const has_pw = use_pw && DataManager.hasPassword() && DataManager.passwordKeeping();
		const is_plain = !has_pw;
		const data = DataManager.writeData(has_pw);
		const plain_str = is_plain ? "-plain" : "";
		const file_name = `backup${plain_str}-${Date.now()}.json`;

		if (process.env.UNI_PLATFORM === 'h5') {
			const jsonStr = JSON.stringify(data, null, 2);
			const blob = new Blob(
				[jsonStr], {
					type: 'application/json;charset=utf-8'
				}
			);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = file_name;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			return;
		}

		if (process.env.UNI_PLATFORM === 'app') {
			const jsonStr = JSON.stringify(data, null, 2);
			const fileName = file_name;
			const main = plus.android.runtimeMainActivity();
			const File = plus.android.importClass('java.io.File');
			const FileOutputStream = plus.android.importClass('java.io.FileOutputStream');
			const StringClass = plus.android.importClass('java.lang.String');
			const dir = main.getExternalFilesDir(null);
			const file = new File(dir, fileName);
			const fos = new FileOutputStream(file);
			const javaStr = new StringClass(jsonStr);
			try {
				fos.write(javaStr.getBytes('UTF-8'));
			} finally {
				fos.close();
			}
			const path = file.getAbsolutePath();
			uni.showToast({
				title: `导出成功: ${path}`,
				icon: 'none'
			});
			DataManager.shareFile(path);
		}
	}

	static shareFile(filePath) {
		if (!filePath) {
			console.error("文件路径不能为空");
			return;
		}
		const localPath = plus.io.convertLocalFileSystemURL(filePath);
		plus.runtime.openFile(
			localPath,
			function(res) {
				console.log("打开成功");
			},
			function(err) {
				console.error("打开失败：" + JSON.stringify(err));
			}
		);
	}

	static importFile() {
		if (process.env.UNI_PLATFORM === 'h5') {
			uni.chooseFile({
				count: 1,
				type: 'all',
				success: res => {
					const file = res.tempFiles[0];
					file.text().then(
						text => {
							try {
								DataManager.readData(text);
							} catch (e) {
								console.error(e);
								uni.showToast({
									title: `导入失败: ${e}`,
									icon: "none"
								});
							}
						}
					);
				}
			});
			return;
		}

		if (process.env.UNI_PLATFORM === 'app') {
			new Promise((resolve, reject) => {
				DataManager
					.pickTextFileAndroid(
						resolve,
						reject
					);
			}).then(
				text => {
					try {
						DataManager.readData(text);
					} catch (e) {
						console.error(e);
						uni.showToast({
							title: `导入失败: ${e}`,
							icon: "none"
						});
					}
				}
			).catch(
				e => {
					console.error(e);
					uni.showToast({
						title: `读取文件失败: ${e}`,
						icon: "none"
					});
				}
			);
		}
	}

	static pickTextFileAndroid(resolve, reject) {
		try {
			const main = plus.android.runtimeMainActivity();
			const Intent = plus.android.importClass('android.content.Intent');
			const intent = new Intent(Intent.ACTION_GET_CONTENT);
			intent.setType('*/*');
			intent.addCategory(Intent.CATEGORY_OPENABLE);
			main.startActivityForResult(intent, 1001);
			main.onActivityResult = (requestCode, resultCode, data) => {
				try {
					if (
						requestCode !== 1001 || !data
					) {
						return;
					}
					const uri = data.getData();
					const InputStreamReader = plus.android.importClass('java.io.InputStreamReader');
					const BufferedReader = plus.android.importClass('java.io.BufferedReader');
					const resolver = main.getContentResolver();
					const inputStream = plus.android.invoke(resolver, 'openInputStream', uri);
					const reader = new BufferedReader(new InputStreamReader(inputStream));
					let line;
					let text = '';
					while ((line = reader.readLine()) !== null) {
						text += line + '\n';
					}
					try {
						reader.close();
					} catch (e) {}
					try {
						inputStream.close();
					} catch (e) {}
					resolve(text);
				} catch (e) {
					reject(e);
				}
			};
		} catch (e) {
			reject(e);
		}
	}

	static writeData(has_pw) {
		const data = {};
		data.version = Utils.version;
		data.is_encrypt = has_pw;
		data.is_plain = !has_pw;
		let out_data = {};
		for (const fuc of DataManager.ON_EXPORT) {
			const sub_out_data = fuc();
			if (sub_out_data && typeof sub_out_data === "object") {
				out_data = Object.assign(out_data, sub_out_data);
			}
		}
		if (has_pw) {
			if (!DataManager.passwordKeeping()) {
				throw new Error(
					"Password not loaded"
				);
			}
			data.crypt_version = 2;
			const raw_json = JSON.stringify(out_data);
			const compressed = LZString.compressToBase64(raw_json);
			const encrypted = Utils.encryptV2(compressed, DataManager.raw_password);
			data.kdf = encrypted.kdf;
			data.iterations = encrypted.iterations;
			data.salt = encrypted.salt;
			data.iv = encrypted.iv;
			data.mac = encrypted.mac;
			data.data = encrypted.data;
		} else {
			data.data = JSON.stringify(out_data);
		}
		return data;
	}

	static readData(raw_all_data) {
		let all_data;
		try {
			all_data = JSON.parse(raw_all_data);
		} catch (e) {
			console.error("文件格式错误:", e);
			uni.showToast({
				title: "文件格式错误",
				icon: "none"
			});
			return;
		}
		let data = null;
		if (all_data.is_plain) {
			try {
				data = JSON.parse(all_data.data);
			} catch (e) {
				console.error("明文数据解析失败:", e);
				uni.showToast({
					title: "数据格式错误",
					icon: "none"
				});
				return;
			}
		} else {
			const crypt_version = all_data.crypt_version;
			switch (crypt_version) {
				case 2:
					data = DataManager.importV2(all_data);
					break;
				case 1:
					data = DataManager.importV1(all_data);
					break;
				default:
					data = DataManager.importVBeta(all_data);
					break;
			}
		}
		if (data == null) {
			return;
		}
		let success = true;
		for (const fuc of DataManager.ON_IMPORT) {
			try {
				fuc(data);
			} catch (e) {
				success = false;
				console.error("导入数据发生异常:", e);
				console.error(fuc);
				console.error(data);
				uni.showToast({
					title: "导入数据发生异常:" + e,
					icon: "none"
				});
			}
		}
		if (success) {
			uni.showToast({
				title: "导入成功",
				icon: "none"
			});
		}
	}

	static importV2(all_data) {
		if (!DataManager.passwordKeeping()) {
			uni.showToast({
				title: "请输入密码",
				icon: "none"
			});
			return null;
		}
		const decrypted = Utils.decryptV2(all_data, DataManager.raw_password);
		if (typeof decrypted !== "string") {
			uni.showToast({
				title: "密码错误或文件已损坏",
				icon: "none"
			});
			return null;
		}
		try {
			const raw_json = LZString.decompressFromBase64(decrypted);
			if (typeof raw_json !== "string") {
				throw new Error("数据解压失败");
			}
			return JSON.parse(raw_json);
		} catch (e) {
			console.error("V2 数据解析失败:", e);
			uni.showToast({
				title: "V2 数据格式错误",
				icon: "none"
			});
			return null;
		}
	}

	static importV1(all_data) {
		const raw_data = all_data.data;
		const pw = DataManager.password;
		if (!DataManager.passwordKeeping() || typeof pw !== "string" || !pw) {
			uni.showToast({
				title: "该文件已经加密，请先设置正确密码后再加载",
				icon: "none"
			});
			return null;
		}
		try {
			const de_data = Utils.decrypt(raw_data, pw);
			const dec_data = LZString.decompressFromBase64(de_data);
			if (typeof dec_data !== "string") {
				throw new Error("旧版数据解压失败");
			}
			return JSON.parse(dec_data);
		} catch (e) {
			console.error("导入 V1 文件发生异常:", e);
			uni.showToast({
				title: "旧版文件密码错误或文件损坏",
				icon: "none"
			});
			return null;
		}
	}

	static importVBeta(all_data) {
		const load_nikki = all_data.out_nikki;
		const load_tekoki = all_data.out_tekoki;
		const load_event = all_data.out_tekoki_event;
		// this._importNikkiVBeta(load_nikki);
		// this._importTekokiVBeta(load_tekoki, load_event);
		return null;
	}

	static hasPassword() {
		let has_password = uni.getStorageSync("has_password");
		if (typeof has_password !== "boolean") {
			has_password = false;
		}
		return has_password;
	}

	static passwordKeeping() {
		const pw = DataManager.raw_password;
		return (typeof pw === "string" && pw.length > 0);
	}

	static keepPassword(raw_password) {
		if (typeof raw_password !== "string" || raw_password === "") {
			DataManager.raw_password = null;
			DataManager.password = null;
			return;
		}

		DataManager.raw_password = raw_password;
		DataManager.password = Utils.md5(raw_password);
	}

	static lockPassword() {
		DataManager.raw_password = null;
		DataManager.password = null;
	}

	static createPasswordVerifier(raw_password) {
		const iterations = DataManager.PASSWORD_KDF_ITERATIONS;
		const salt = CryptoJS.lib.WordArray.random(16);
		const verifier = CryptoJS.PBKDF2(raw_password, salt, {
			keySize: 256 / 32,
			iterations: iterations,
			hasher: CryptoJS.algo.SHA256
		});
		uni.setStorageSync("password_verifier_version", 2);
		uni.setStorageSync("password_verifier_kdf", "PBKDF2-SHA256");
		uni.setStorageSync("password_verifier_iterations", iterations);
		uni.setStorageSync("password_verifier_salt", salt.toString(CryptoJS.enc.Base64));
		uni.setStorageSync("password_verifier", verifier.toString(CryptoJS.enc.Base64));
	}


	static clearPasswordVerifier() {
		uni.removeStorageSync("password_verifier_version");
		uni.removeStorageSync("password_verifier_kdf");
		uni.removeStorageSync("password_verifier_iterations");
		uni.removeStorageSync("password_verifier_salt");
		uni.removeStorageSync("password_verifier");
	}

	static constantTimeEqual(a, b) {
		if (!a || !b || typeof a.sigBytes !== "number" || typeof b.sigBytes !== "number") {
			return false;
		}
		let diff = a.sigBytes ^ b.sigBytes;
		const length = Math.max(a.sigBytes, b.sigBytes);
		for (let i = 0; i < length; i++) {
			let aByte = 0;
			let bByte = 0;
			if (i < a.sigBytes) {
				const shift = 24 - (i % 4) * 8;
				aByte = (a.words[i >>> 2] >>> shift) & 0xff;
			}
			if (i < b.sigBytes) {
				const shift = 24 - (i % 4) * 8;
				bByte = (b.words[i >>> 2] >>> shift) & 0xff;
			}
			diff |= aByte ^ bByte;
		}
		return diff === 0;
	}


	static checkPasswordV2(raw_password) {
		const verifierBase64 = uni.getStorageSync("password_verifier");
		const saltBase64 = uni.getStorageSync("password_verifier_salt");
		let iterations = uni.getStorageSync("password_verifier_iterations");
		if (typeof verifierBase64 !== "string" || !verifierBase64 || typeof saltBase64 !== "string" ||
			!saltBase64) {
			return false;
		}
		if (typeof iterations !== "number" || !Number.isFinite(iterations) || iterations <= 0) {
			return false;
		}
		try {
			const salt = CryptoJS.enc.Base64.parse(saltBase64);
			const expectedVerifier = CryptoJS.enc.Base64.parse(verifierBase64);
			const actualVerifier =
				CryptoJS.PBKDF2(raw_password, salt, {
					keySize: 256 / 32,
					iterations: iterations,
					hasher: CryptoJS.algo.SHA256
				});
			return DataManager.constantTimeEqual(actualVerifier, expectedVerifier);

		} catch (e) {
			console.error("V2 密码验证失败:", e);
			return false;
		}
	}

	static checkPassword(raw_password) {
		if (typeof raw_password !== "string") {
			return false;
		}
		if (!DataManager.hasPassword()) {
			return raw_password === "";
		}
		const verifier = uni.getStorageSync("password_verifier");
		if (typeof verifier === "string" && verifier) {
			return DataManager.checkPasswordV2(raw_password);
		}
		const oldHash = uni.getStorageSync("password_hash");
		if (typeof oldHash === "string" && oldHash) {
			const candidate = Utils.sha512(raw_password);
			const ok = candidate === oldHash;
			if (ok) {
				DataManager.createPasswordVerifier(raw_password);
				uni.removeStorageSync("password_hash");
			}
			return ok;
		}
		return false;
	}

	static setPassword(raw_password) {
		if (typeof raw_password !== "string" || raw_password === "") {
			uni.setStorageSync("has_password", false);
			DataManager.lockPassword();
			DataManager.clearPasswordVerifier();
			uni.removeStorageSync("password_hash");
		} else {
			uni.setStorageSync("has_password", true);
			DataManager.keepPassword(raw_password);
			DataManager.createPasswordVerifier(raw_password);
			uni.removeStorageSync("password_hash");
		}
		for (const fuc of DataManager.ON_PASSWORD_CHANGE) {
			fuc();
		}
	}

	constructor(name) {
		this.name = name;
		this.is_load = false;
		this.data = {};
		DataManager.DMS.add(this);
	}

	load() {
		this.is_load = true;
		let raw_data = uni.getStorageSync(this.name);
		if (!raw_data || typeof raw_data !== 'object') {
			raw_data = {};
		}
		const is_plain = Utils.dictGet(raw_data, "is_plain", true);
		if (is_plain) {
			this.data = Utils.dictGet(raw_data, "data", {});
			return this;
		}
		if (!DataManager.passwordKeeping()) {
			console.error("加载数据失败: 无有效密码");
			uni.showToast({
				title: "加载数据失败: 请先输入密码",
				icon: "none"
			});
			return this;
		}
		const crypt_version = Utils.dictGet(raw_data, "crypt_version", 1);
		try {
			let dec_data;
			switch (crypt_version) {
				case 2: {
					const decrypted = Utils.decryptV2(raw_data, DataManager.raw_password);
					if (typeof decrypted !== "string") {
						throw new Error(
							"密码错误或数据已损坏"
						);
					}
					dec_data = JSON.parse(decrypted);
					break;
				}
				case 1:
				default: {
					const enc_data = Utils.dictGet(raw_data, "data");
					if (typeof enc_data !== "string" || !enc_data) {
						this.data = {};
						return this;
					}
					const decrypted = Utils.decrypt(enc_data, DataManager.password);
					dec_data = JSON.parse(decrypted);
					break;
				}
			}
			this.data = Utils.dictGet(dec_data, "data", {});
		} catch (e) {
			console.error("加载数据发生异常:", e);
			uni.showToast({
				title: "加载数据失败: 密码错误或数据损坏",
				icon: "none"
			});
		}
		return this;
	}

	save() {
		let data = {};
		if (DataManager.hasPassword()) {
			if (!DataManager.passwordKeeping()) {
				console.error("保存失败: 已设置密码但当前未解锁");
				uni.showToast({
					title: "保存失败: 请先输入密码",
					icon: "none"
				});
				return this;
			}
			const raw_json = JSON.stringify({
				data: this.data
			});
			const encrypted = Utils.encryptV2(raw_json, DataManager.raw_password);
			data = {
				is_plain: false,
				is_encrypt: true,
				crypt_version: 2,
				kdf: encrypted.kdf,
				iterations: encrypted.iterations,
				salt: encrypted.salt,
				iv: encrypted.iv,
				mac: encrypted.mac,
				data: encrypted.data
			};
		} else {
			data = {
				is_plain: true,
				is_encrypt: false,
				data: this.data
			};
		}
		uni.setStorageSync(this.name, data);
		return this;
	}

	get(key, defVal = null) {
		if (key === undefined) {
			return this.data;
		}
		return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : defVal;
	}


	set(key, val) {
		this.data[key] = val;
		return this;
	}


	del(key) {
		delete this.data[key];
		return this;
	}


	has(key) {
		return Object.prototype.hasOwnProperty.call(this.data, key);
	}


	clear() {
		this.data = {};
		uni.removeStorageSync(this.name);
		return this;
	}


	onImportFile(fuc) {
		DataManager.onImportFile(fuc);
		return this;
	}
}

export default DataManager;