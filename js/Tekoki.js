import DataManager from '@/js/DataManager.js'
import Utils from '@/js/Utils.js'
import {
	reactive
} from "vue"


const DM = new DataManager("tekokis");
const TEKOKIS = {
	events: [],
	data: {}
};

export const TEKOKI_DATA = reactive({
	count_all_year: 0,
	count_all_month: 0,
	count_all_day: 0,
	count_all_count: 0,
	all_day_max: 0,
	first_today: 0,
	last_today: 0,
	count_year_day: 0,
	count_year_count: 0,
	year_day_max: 0,
	count_month_day: 0,
	count_month_count: 0,
	month_day_max: 0,
});
export const TEKOKI_EVENTS = reactive([]);
export const TEKOKI_TEBLE = reactive([]);
for (let i = 1; i <= 42; i++) {
	TEKOKI_TEBLE.push({
		rate: 0,
		day: "",
		count: 0,
		id: i - 1,
	});
}


class Tekoki {
	static loadData() {
		DM.load();
		var tekokis = DM.get("tekokis", null);
		if (tekokis == null) {
			return;
		}
		TEKOKIS.data = tekokis.data;
		TEKOKIS.events = tekokis.events;
		Tekoki.setTekokikEvents(tekokis.events);
	}

	static importFile(data) {
		let out_tekoki = data.out_tekoki;
		TEKOKIS.data = out_tekoki.data;
		TEKOKIS.events = out_tekoki.events;
		Tekoki.setTekokikEvents(out_tekoki.events);
		Tekoki.save();
	}
	
	static exportFile(){
		const data = {};
		data.out_tekoki = {};
		data.out_tekoki.data = TEKOKIS.data;
		data.out_tekoki.events = TEKOKIS.events;
		return data;
	}

	static passwordChange() {
		Tekoki.save();
	}

	static setTekokikEvents(events) {
		TEKOKI_EVENTS.length = 0;
		TEKOKI_EVENTS.push(...events);
		if (!TEKOKI_EVENTS.includes("默认")) {
			TEKOKI_EVENTS.push("默认");
		}
	}

	static getTekokiTable() {
		return TEKOKI_TEBLE;
	}

	static getTekokiData() {
		return TEKOKI_DATA;
	}

	static getTekokiEvents() {
		return TEKOKI_EVENTS;
	}

	static getTekokiDataResult(event_name, year, month) {
		let result = [];
		let key = `${year}-${month}`;
		if (TEKOKIS.data[key] === undefined) {
			return result;
		}
		for (var i in TEKOKIS.data[key]) {
			var events = TEKOKIS.data[key][i].events;
			if (event_name in events) {
				result.push(TEKOKIS.data[key][i]);
			}
		}
		return result;
	}

	static clearTekokiTable() {
		for (let slot of TEKOKI_TEBLE) {
			slot.rate = 0;
			slot.day = "";
			slot.count = 0;
		}
		return Tekoki;
	}

	static clearTekoki() {
		TEKOKIS.data = {};
		TEKOKIS.events.length = 0;
		return Tekoki;
	}

	static add(event_name, year, month, day, number) {
		var key = year + "-" + month;
		if (!TEKOKIS.events.includes(event_name)) {
			TEKOKIS.events.push(event_name);
		}
		if (!TEKOKI_EVENTS.includes(event_name)) {
			TEKOKI_EVENTS.push(event_name);
		}
		if (TEKOKIS.data[key] == undefined) {
			TEKOKIS.data[key] = {};
		}
		if (TEKOKIS.data[key][day] == undefined) {
			TEKOKIS.data[key][day] = {
				day: parseInt(day),
				events: {}
			};
		}
		TEKOKIS.data[key][day].events[event_name] = number;
		return Tekoki;
	}

	static reCreateTekok() {
		var re_events = new Set();
		for (var year_mouth in TEKOKIS.data) {
			var days = TEKOKIS.data[year_mouth];
			for (var day in days) {
				var events = days[day].events;
				for (var event_name in events) {
					if (events[event_name] <= 0) {
						continue;
					}
					re_events.add(event_name);
				}
			}
		}
		TEKOKIS.events = Array.from(re_events);
		return Tekoki;
	}

	static delTekoki(event_name) {
		var index = TEKOKIS.events.indexOf(event_name);
		if (index !== -1) {
			TEKOKIS.events.splice(index, 1);
		}
		for (var key in TEKOKIS.data) {
			if (TEKOKIS.data.hasOwnProperty(key)) {
				for (var day in TEKOKIS.data[key]) {
					if (TEKOKIS.data[key].hasOwnProperty(day)) {
						if (TEKOKIS.data[key][day].events.hasOwnProperty(event_name)) {
							delete TEKOKIS.data[key][day].events[event_name];
						}
						if (Object.keys(TEKOKIS.data[key][day].events).length === 0) {
							delete TEKOKIS.data[key][day];
						}
					}
				}
				if (Object.keys(TEKOKIS.data[key]).length === 0) {
					delete TEKOKIS.data[key];
				}
			}
		}
		return Tekoki;
	};

	static setTekokiTable(event_name, year, month) {
		const data = this.getTekokiDataResult(event_name, year, month);
		let max = 0;
		let count = 0;
		const events = {};
		for (const d of data) {
			const n = d.events[event_name] || 0;
			count += n;
			max = Math.max(max, n);
			events[d.day] = n;
		}
		const first_day = Utils.getFirstDayOfWeek(year, month);
		const days_in_month = Utils.getDaysInMonth(year, month);
		for (let i = 0; i < 42; i++) {
			const slot = TEKOKI_TEBLE[i];
			const day = i - first_day + 1;
			if (day < 1 || day > days_in_month) {
				slot.day = "";
				slot.rate = 0;
				continue;
			}
			slot.day = day;
			const value = events[day] || 0;
			slot.rate = max > 0 ? value / max : 0;
			slot.count = value;
		}
		Tekoki.stat1(event_name, year, month);
		return Tekoki;
	}

	static save() {
		DM.set("tekokis", TEKOKIS)
			.save();
		return Tekoki;
	}

	static stat1(event_name, on_year, on_month) {
		on_year = Number(on_year);
		on_month = Number(on_month);
		let frist = [9999, 12, 31];
		let flag_frist = false;
		let last = [0, 0, 0];
		let flag_last = false;
		let year_set = new Set();
		let month_set = new Set();
		let all_day_count = 0;
		let all_count = 0;
		let day_max = 0;
		let year_day_count = 0;
		let year_count = 0;
		let year_max = 0;
		let month_day_count = 0;
		let month_count = 0;
		let month_max = 0;
		for (let k0 in TEKOKIS.data) {
			let v0 = TEKOKIS.data[k0]
			let parts = k0.split('-');
			let y = Number(parts[0]);
			let m = Number(parts[1]);
			for (let k1 in v0) {
				let v1 = v0[k1];
				let d = v1.day;
				let event_names = v1.events;
				if (event_name in event_names) {
					let n = event_names[event_name] || 0;
					if (n <= 0) {
						continue;
					}
					all_count += n;
					day_max = Math.max(day_max, n);
					all_day_count += 1;
					year_set.add(y);
					month_set.add(k0);
					if (y == on_year) {
						year_count += n;
						year_max = Math.max(year_max, n);
						year_day_count += 1;
						if (m == on_month) {
							month_count += n;
							month_max = Math.max(month_max, n);
							month_day_count += 1;
						}
					}
					let cur = y * 10000 + m * 100 + d;
					let old_frist = frist[0] * 10000 + frist[1] * 100 + frist[2];
					let old_last = last[0] * 10000 + last[1] * 100 + last[2];
					if (cur < old_frist) {
						flag_frist = true;
						frist[0] = y;
						frist[1] = m;
						frist[2] = d;
					}
					if (cur > old_last) {
						flag_last = true;
						last[0] = y;
						last[1] = m;
						last[2] = d;
					}
				}
			}
		}
		let now = new Date();
		let now_time = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
		TEKOKI_DATA.count_all_year = year_set.size;
		TEKOKI_DATA.count_all_month = month_set.size;
		TEKOKI_DATA.count_all_day = all_day_count;
		TEKOKI_DATA.count_all_count = all_count;
		TEKOKI_DATA.all_day_max = day_max;
		if (flag_frist) {
			TEKOKI_DATA.first_today = Utils.countDay(now_time, frist);
		}
		if (flag_last) {
			TEKOKI_DATA.last_today = Utils.countDay(now_time, last);
		}
		TEKOKI_DATA.count_year_day = year_day_count;
		TEKOKI_DATA.count_year_count = year_count;
		TEKOKI_DATA.year_day_max = year_max;
		TEKOKI_DATA.count_month_day = month_day_count;
		TEKOKI_DATA.count_month_count = month_count;
		TEKOKI_DATA.month_day_max = month_max;
		return Tekoki;
	}
}

DataManager.onLoadData(Tekoki.loadData);
DataManager.onImportFile(Tekoki.importFile);
DataManager.onExportFile(Tekoki.exportFile);
DataManager.onPasswordChange(Tekoki.passwordChange);

export default Tekoki;