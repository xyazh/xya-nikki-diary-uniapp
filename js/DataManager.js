import Utils from '@/js/Utils.js'
import LZString from "@/js/LZString.js"
import {
	enc
} from 'crypto-js';



class DataManager {
	static ON_IMPORT = [];
	static ON_EXPORT = [];
	static ON_LOAD = [];
	static ON_PASSWORD_CHANGE = [];
	static password = null;
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
		const has_pw = use_pw && DataManager.passwordKeeping();
		const is_plain = !has_pw;
		const data = DataManager.writeData(has_pw);
		const plain_str = is_plain ? "-plain" : "";
		const file_name = `backup${plain_str}-${Date.now()}.json`
		if (process.env.UNI_PLATFORM === 'h5') {
			const jsonStr = JSON.stringify(data, null, 2);
			const blob = new Blob([jsonStr], {
				type: 'application/json;charset=utf-8'
			});
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
			const Context = plus.android.importClass('android.content.Context');
			const File = plus.android.importClass('java.io.File');
			const FileOutputStream = plus.android.importClass('java.io.FileOutputStream');
			const StringClass = plus.android.importClass('java.lang.String');
			const dir = main.getExternalFilesDir(null);
			const file = new File(dir, fileName);
			const fos = new FileOutputStream(file);
			const javaStr = new StringClass(jsonStr);
			fos.write(javaStr.getBytes('UTF-8'));
			fos.close();
			const path = file.getAbsolutePath();
			console.log('文件路径:', path);
			uni.showToast({
				title: `导出成功: ${path}`,
				icon: 'none'
			});
			DataManager.shareFile(path);;
		}
	}

	static shareFile(path) {
		if (process.env.UNI_PLATFORM !== 'app') return;
		const Intent = plus.android.importClass('android.content.Intent');
		const Uri = plus.android.importClass('android.net.Uri');
		const File = plus.android.importClass('java.io.File');
		const file = new File(path);
		const uri = Uri.fromFile(file);
		const intent = new Intent(Intent.ACTION_SEND);
		intent.setType('*/*');
		intent.putExtra(Intent.EXTRA_STREAM, uri);
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		const chooser = Intent.createChooser(intent, '分享文件');
		plus.android.runtimeMainActivity().startActivity(chooser);
	}

	static importFile() {
		if (process.env.UNI_PLATFORM === 'h5') {
			uni.chooseFile({
				count: 1,
				type: 'all',
				success: res => {
					const file = res.tempFiles[0]
					file.text().then(text => {
						try {
							DataManager.readData(text);
						} catch (e) {
							console.error(e);
							uni.showToast({
								title: `导入失败: ${e}`,
								icon: "none"
							});
						}
					})
				}
			})
			return;
		}
		if (process.env.UNI_PLATFORM === 'app') {
			new Promise((resolve, reject) => {
				DataManager.pickTextFileAndroid(resolve, reject);
			}).then(text => {
				try {
					DataManager.readData(text);
				} catch (e) {
					console.error(e);
					uni.showToast({
						title: `导入失败: ${e}`,
						icon: "none"
					});
				}
			});
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
					if (requestCode !== 1001 || !data) return;
					const uri = data.getData();
					const ContentResolver = plus.android.importClass(
						'android.content.ContentResolver'
					);
					const InputStreamReader = plus.android.importClass(
						'java.io.InputStreamReader'
					);
					const BufferedReader = plus.android.importClass(
						'java.io.BufferedReader'
					);
					const resolver = main.getContentResolver();
					const inputStream = plus.android.invoke(
						resolver,
						'openInputStream',
						uri
					);
					const reader = new BufferedReader(
						new InputStreamReader(inputStream)
					);
					let line;
					let text = '';
					while ((line = reader.readLine()) !== null) {
						text += line + '\n'
					};
					setTimeout(() => {
						try {
							reader.close();
							inputStream.close();
						} catch (e) {}
					}, 0);
					setTimeout(() => resolve(text), 0);
				} catch (e) {
					setTimeout(() => reject(e), 0);
				}
			}
		} catch (e) {
			reject(e);
		}
	}

	static writeData(has_pw) {
		const data = {};
		data.version = Utils.version;
		data.crypt_version = 1
		data.is_encrypt = has_pw;
		data.is_plain = !has_pw;
		let out_data = {};
		for (let fuc of DataManager.ON_EXPORT) {
			let sub_out_data = fuc();
			out_data = Object.assign(out_data, sub_out_data);
		}
		if (has_pw) {
			let pw = DataManager.password;
			out_data.salt = Math.floor(Math.random() * 1000000000) + 1;
			let raw_json = JSON.stringify(out_data);
			let co_data = LZString.compressToBase64(raw_json);
			let en_data = Utils.encrypt(co_data, pw);
			data.data = en_data;
		} else {
			let raw_json = JSON.stringify(out_data);
			data.data = raw_json;
		}
		return data;
	}

	static readData(raw_all_data) {
		let all_data = JSON.parse(raw_all_data);
		let is_plain = all_data.is_plain;
		if (is_plain) {
			var data = JSON.parse(all_data.data);
		} else {
			let crypt_version = all_data.crypt_version;
			switch (crypt_version) {
				case 1:
					var data = DataManager.importV1(all_data);
					break;
				default:
					var data = DataManager.importVBeta(all_data);
			}
		}
		if (data == null) {
			return;
		}
		for (var fuc of DataManager.ON_IMPORT) {
			var flag = true;
			try {
				fuc(data);
			} catch (e) {
				flag = false;
				console.error("导入数据发生异常:", e);
				console.error(fuc);
				console.error(data);
				uni.showToast({
					title: "导入数据发生异常:" + e,
					icon: "none"
				});
			}
		}
		if (flag) {
			uni.showToast({
				title: "导入成功",
				icon: "none"
			});
		}
	}

	static importV1(all_data) {
		let version = all_data.version;
		let is_encrypt = all_data.is_encrypt;
		let raw_data = all_data.data;
		let pw = DataManager.password;
		if (!DataManager.passwordKeeping()) {
			uni.showToast({
				title: "该文件已经加密，请先设置正确密码后再加载",
				icon: "none"
			});
			return null;
		}
		try {
			let de_data = Utils.decrypt(raw_data, pw);
			let dec_data = LZString.decompressFromBase64(de_data);
			return JSON.parse(dec_data);
		} catch (e) {
			console.error("导入文件发生异常:", e);
			uni.showToast({
				title: "导入文件发生异常:" + e,
				icon: "none"
			});
			return null;
		}
	}

	static importVBeta = function(all_data) {
		var load_nikki = all_data.out_nikki;
		var load_tekoki = all_data.out_tekoki;
		var load_event = all_data.out_tekoki_event;
		//this._importNikkiVBeta(load_nikki);
		//this._importTekokiVBeta(load_tekoki, load_event);
		return null;
	}

	static hasPassword() {
		let has_password = uni.getStorageSync("has_password");
		if (!has_password || typeof has_password !== 'boolean') {
			has_password = false;
		}
		return has_password;
	}

	static passwordKeeping() {
		let pw = DataManager.password;
		if (pw == null) {
			return false;
		}
		if (pw == undefined) {
			return false;
		}
		if (typeof pw !== "string") {
			return false;
		}
		if (pw == "") {
			return false;
		}
		if (!pw) {
			return false;
		}
		return true;
	}

	static setPassword(raw_password) {
		if (raw_password == "") {
			uni.setStorageSync("has_password", false);
			DataManager.password = null;
			uni.setStorageSync("password_hash", "");
		} else {
			uni.setStorageSync("has_password", true);
			DataManager.password = Utils.md5(raw_password);
			uni.setStorageSync("password_hash", Utils.sha512(raw_password));
		}
		for (let fuc of DataManager.ON_PASSWORD_CHANGE) {
			fuc();
		}
	}

	static checkPassword(raw_password) {
		let password_hash = uni.getStorageSync("password_hash");
		if (!password_hash || typeof password_hash !== 'string') {
			password_hash = "";
		}
		let password = Utils.sha512(raw_password);
		return password == password_hash;
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
		let is_plain = Utils.dictGet(raw_data, "is_plain", true);
		if (is_plain) {
			this.data = Utils.dictGet(raw_data, "data", {});
		} else {
			if (!DataManager.passwordKeeping()) {
				console.error("加载文件发生异常:无有效密码");
				uni.showToast({
					title: "加载文件发生异常:无有效密码",
					icon: "none"
				});
				return;
			}
			let enc_data = Utils.dictGet(raw_data, "data");
			if (enc_data == undefined) {
				this.data = {};
				return;
			}
			let dec_data = {};
			try {
				dec_data = JSON.parse(Utils.decrypt(enc_data, DataManager.password));
			} catch (e) {
				console.error("加载文件发生异常:", e);
				uni.showToast({
					title: "加载文件发生异常:" + e,
					icon: "none"
				});
			}
			this.data = Utils.dictGet(dec_data, "data", {});
		}
	}

	save() {
		let data = {};
		if (DataManager.passwordKeeping()) {
			let enc_data = Utils.encrypt(JSON.stringify({
				data: this.data,
				salt: Math.floor(Math.random() * 1000000000) + 1,
			}), DataManager.password);
			data.data = enc_data;
			data.is_plain = false;
		} else {
			data.data = this.data;
			data.is_plain = true;
		}
		uni.setStorageSync(this.name, data);
		return this;
	}

	get(key, defVal = null) {
		if (key === undefined) return this.data;
		return this.data.hasOwnProperty(key) ? this.data[key] : defVal;
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
		return this.data.hasOwnProperty(key);
	}

	clear() {
		this.data = {};
		uni.removeStorageSync(this.name);
		return this;
	}

	onImportFile(fuc) {
		DataManager.onImportFile(fuc);
	}
}

export default DataManager;