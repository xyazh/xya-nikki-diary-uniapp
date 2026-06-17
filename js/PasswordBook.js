import DataManager from '@/js/DataManager.js'
import Utils from '@/js/Utils.js'
import {
	ref,
	reactive,
	shallowReactive
} from "vue"

const DM = new DataManager("password");

const RENDER_LIST = reactive([]);
const TEMP_PASSWORD = reactive({
	site: "",
	username: "",
	password: "",
	email: "",
	phone: "",
	keycode: "",
	meta: "",
	id: Utils.createUUID(),
});

const PASSWORD_LIST = [];

class PasswordBook {
	getRenderList() {
		return RENDER_LIST;
	}

	getTempPassword() {
		return TEMP_PASSWORD;
	}

	getPasswordList() {
		return PASSWORD_LIST;
	}

	clearTempPassword() {
		Object.assign(TEMP_PASSWORD, {
			site: "",
			username: "",
			password: "",
			email: "",
			phone: "",
			keycode: "",
			meta: "",
			id: Utils.createUUID(),
		});
		return this;
	}

	save() {
		DM.set("password_list", PASSWORD_LIST)
			.save();
		return this;
	}

	loadData() {
		DM.load();
		var li = DM.get("password_list", []);
		PASSWORD_LIST.push(...li);
		this.renderIdentity();
	}

	importFile(data) {
		let out_pwb = data.out_pwb;
		if (!out_pwb) {
			return;
		}
		PASSWORD_LIST.length = 0;
		PASSWORD_LIST.push(...out_pwb);
		this.renderIdentity();
	}

	exportFile() {
		const data = {};
		data.out_pwb = PASSWORD_LIST;
		return data;
	}

	passwordChange() {
		this.save();
	}

	clearRender() {
		RENDER_LIST.length = 0;
		return this;
	}

	renderIdentity() {
		this.clearRender();
		RENDER_LIST.push(...PASSWORD_LIST);
		return this;
	}

	srh(keyword) {
		var result = [];
		if (keyword == undefined || keyword == "" || keyword == null) {
			return result;
		}
		var keywords = Utils.splitKeyword(keyword);
		for (var item of PASSWORD_LIST) {
			var n = 0;
			for (keyword of keywords) {
				if (item.site.includes(keyword)) {
					n += 3;
				}
				if (item.username.includes(keyword)) {
					n += 10;
				}
				if (item.password.includes(keyword)) {
					n += 2;
				}
				if (item.email.includes(keyword)) {
					n += 5;
				}
				if (item.phone.includes(keyword)) {
					n += 5;
				}
				if (item.keycode.includes(keyword)) {
					n += 1;
				}
				if (item.meta.includes(keyword)) {
					n += 5;
				}
			}
			if (n <= 0) {
				continue;
			}
			result.push({
				item: item,
				score: n,
			});
		}
		result.sort((a, b) => b.score - a.score);
		this.clearRender();
		for (let pw_warp of result) {
			RENDER_LIST.push(pw_warp.item);
		}
	}

	add(item) {
		PASSWORD_LIST.push(item);
		return this;
	}

	del(id) {
		for (var i = 0; i < PASSWORD_LIST.length; i++) {
			if (PASSWORD_LIST[i].id === id) {
				PASSWORD_LIST.splice(i, 1);
				break;
			}
		}
		return this;
	}

	has(id) {
		for (var i = 0; i < PASSWORD_LIST.length; i++) {
			if (PASSWORD_LIST[i].id === id) {
				return true;
			}
		}
		return false;
	}

	get(id) {
		for (var i = 0; i < PASSWORD_LIST.length; i++) {
			if (PASSWORD_LIST[i].id === id) {
				return PASSWORD_LIST[i];
			}
		}
		return null;
	}
}

const PASSWORD_BOOK = new PasswordBook();


DataManager.onLoadData(PASSWORD_BOOK.loadData.bind(PASSWORD_BOOK));
DataManager.onImportFile(PASSWORD_BOOK.importFile.bind(PASSWORD_BOOK));
DataManager.onExportFile(PASSWORD_BOOK.exportFile.bind(PASSWORD_BOOK));
DataManager.onPasswordChange(PASSWORD_BOOK.passwordChange.bind(PASSWORD_BOOK));

export default PASSWORD_BOOK;