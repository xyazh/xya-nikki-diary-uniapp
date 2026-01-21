import DataManager from '@/js/DataManager.js'
import Utils from '@/js/Utils.js'
import {
	reactive,
	shallowReactive
} from "vue"

export const NIKKI_LIST = shallowReactive([]);
export const NIKKI_LIST_SRH = reactive([]);
const DM = new DataManager("nikkis");


class Nikkis {
	static loadData() {
		DM.load();
		var nikki_list = DM.get("nikki_list", []);
		NIKKI_LIST.push(...nikki_list);
		Nikkis.sort();
	}

	static importFile(data) {
		let out_nikki = data.out_nikki;
		Nikkis.reset(out_nikki)
		.sort()
		.save();
	}
	
	static exportFile(){
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
		Nikkis.del(nikki.id);
		NIKKI_LIST.push(nikki);
		return Nikkis;
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
		return Nikkis;
	}

	static insert(nikki) {
		Nikkis.del(nikki.id);
		if (nikki.text.length > 0) {
			NIKKI_LIST.push(nikki);
		}
		Nikkis.sort();
		return Nikkis;
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
	
	static getNikkiFromId(id){
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

	static getNikkiList() {
		return NIKKI_LIST;
	}
	
	static getNikkiSrhList() {
		return NIKKI_LIST_SRH;
	}
}

DataManager.onLoadData(Nikkis.loadData);
DataManager.onImportFile(Nikkis.importFile);
DataManager.onExportFile(Nikkis.exportFile);
DataManager.onPasswordChange(Nikkis.passwordChange);


export default Nikkis;