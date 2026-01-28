import DataManager from '@/js/DataManager.js'
import Utils from '@/js/Utils.js'
import {
	ref,
	reactive,
	shallowReactive
} from "vue"

export const COUNT_TEXT = ref(0);
export const NIKKI_LIST = reactive([]);
export const RENDER_NIKKI_LIST = reactive([]);
export const SRH_ON = ref(false);
const DM = new DataManager("nikkis");


class Nikkis {
	static loadData() {
		DM.load();
		var nikki_list = DM.get("nikki_list", []);
		NIKKI_LIST.push(...nikki_list);
		Nikkis.sort()
			.countAllText();
	}

	static importFile(data) {
		let out_nikki = data.out_nikki;
		Nikkis.reset(out_nikki)
			.sort()
			.countAllText()
			.save();
	}

	static exportFile() {
		const data = {};
		data.out_nikki = NIKKI_LIST;
		return data;
	}

	static passwordChange() {
		Nikkis.sort()
			.save();
	}

	static sort() {
		NIKKI_LIST.sort((a, b) => b.date - a.date);
		return Nikkis;
	}

	static add(nikki) {
		return Nikkis.insert(nikki);
	}

	static reset(nikkis) {
		Nikkis.clear();
		for (let nikki of nikkis) {
			nikki.is_new = false;
			NIKKI_LIST.push(nikki);
		}
		return Nikkis;
	}

	static clear() {
		NIKKI_LIST.length = 0;
		COUNT_TEXT.value = 0;
		return Nikkis;
	}

	static insert(nikki) {
		let old_nikki = Nikkis.get(nikki.id);
		if (old_nikki == null) {
			NIKKI_LIST.push(nikki);
		} else {
			Object.assign(old_nikki, nikki);
		}
		Nikkis.sort();
		return Nikkis;
	}

	static has(id) {
		for (var i = 0; i < NIKKI_LIST.length; i++) {
			if (NIKKI_LIST[i].id === id) {
				return true;
			}
		}
		return false;
	}

	static get(id) {
		for (var i = 0; i < NIKKI_LIST.length; i++) {
			if (NIKKI_LIST[i].id === id) {
				return NIKKI_LIST[i];
			}
		}
		return null;
	}

	static del(id) {
		for (var i = 0; i < NIKKI_LIST.length; i++) {
			if (NIKKI_LIST[i].id === id) {
				NIKKI_LIST.splice(i, 1);
				break;
			}
		}
		return Nikkis;
	}

	static getNikkiFromId(id) {
		for (var i = 0; i < NIKKI_LIST.length; i++) {
			if (NIKKI_LIST[i].id === id) {
				return NIKKI_LIST[i];
			}
		}
		return null;
	}

	static checkNikkiTime() {
		var nikkis = [];
		for (var nikki of NIKKI_LIST) {
			var date = new Date(nikki.date);
			nikki.year = date.getFullYear();
			nikki.month = date.getMonth() + 1;
			nikki.day = date.getDate();
			nikki.hours = Utils.addZero(date.getHours());
			nikki.minu = Utils.addZero(date.getMinutes());
			nikki.week = "周" + "日一二三四五六".charAt(date.getDay());
			nikkis.push(nikki);
		}
		Nikkis.clear();
		NIKKI_LIST.push(...nikkis);
		Nikkis.sort();
		return Nikkis;
	}

	static save() {
		DM.set("nikki_list", NIKKI_LIST)
			.save();
	}

	static srh(keyword) {
		var result = [];
		if (keyword == undefined || keyword == "" || keyword == null) {
			return result;
		}
		var times = Utils.parseTimeString(keyword);
		var keywords = Utils.splitKeyword(keyword);
		for (var item of NIKKI_LIST) {
			var n = 0;
			if (times != null) {
				if (item.year == times.year) {
					n += 500;
				}
				if (item.month == times.month) {
					n += 500;
				}
				if (item.day == times.day) {
					n += 500;
				}
				if (item.hours == times.hour) {
					n += 500;
				}
				if (item.minu == times.minute) {
					n += 500;
				}
			}
			if (keyword == item.week) {
				n += 500;
			}
			for (keyword of keywords) {
				if (item.text.includes(keyword)) {
					n += 1;
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
		RENDER_NIKKI_LIST.length = 0;
		for(let nikki_warp of result){
			RENDER_NIKKI_LIST.push(nikki_warp.item);
		}
	}

	static getNikkiList() {
		return NIKKI_LIST;
	}

	static getRenderNikkiList() {
		return RENDER_NIKKI_LIST;
	}

	static getCountText() {
		return COUNT_TEXT;
	}
	static getSrhON() {
		return SRH_ON;
	}

	static countAllText() {
		let n = 0;
		for (let nikki of NIKKI_LIST) {
			n += nikki.text.length;
		}
		COUNT_TEXT.value = n;
		return Nikkis;
	}
}

DataManager.onLoadData(Nikkis.loadData);
DataManager.onImportFile(Nikkis.importFile);
DataManager.onExportFile(Nikkis.exportFile);
DataManager.onPasswordChange(Nikkis.passwordChange);


export default Nikkis;