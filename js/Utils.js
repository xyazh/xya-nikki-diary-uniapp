import CryptoJS from 'crypto-js'
import {
	reactive
} from "vue"

const Utils = {};

const version = "1.0.0";

let _SWITCH_PAGE = null;
let _UPDATE_SET_PASSWORD = null;

Utils.version = version;
Utils.read_nikki = {};
Utils.temp_nikki = reactive({
	year: "1970",
	month: "1",
	day: "1",
	hours: "08",
	minu: "00",
	week: "周四",
	date: 0,
	id: 0,
	text: "",
	is_new: true
});
Utils.page_stack = [];

Utils.copyObj = function(obj) {
	let new_obj = JSON.parse(JSON.stringify(obj));
	return new_obj;
}


Utils.registerSwitchPage = function(fn) {
	_SWITCH_PAGE = fn;
};

Utils.switchPage = function(page, title) {
	if (_SWITCH_PAGE) {
		_SWITCH_PAGE({
			key: page,
			title: title
		});
	} else {
		console.warn('Utils.switchPage: not registered');
	}
};

Utils.registerUpdateSetPassword = function(fn) {
	_UPDATE_SET_PASSWORD = fn;
}

Utils.updateSetPassword = function() {
	if (_UPDATE_SET_PASSWORD) {
		_UPDATE_SET_PASSWORD();
	} else {
		console.warn('Utils.updateSetpassword: not registered');
	}
}

Utils.md5 = function(str) {
	return CryptoJS.MD5(str).toString();
}

Utils.sha512 = function(str) {
	return CryptoJS.SHA512(str).toString();
}

Utils.decrypt = function(data, pw) {
	const key = CryptoJS.enc.Utf8.parse(pw)
	const decrypted = CryptoJS.AES.decrypt(data, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}

Utils.encrypt = function(data, pw) {
	const key = CryptoJS.enc.Utf8.parse(pw)
	const encrypted = CryptoJS.AES.encrypt(data, key, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	})
	return encrypted.toString()
}

Utils.addZero = function(num) {
	num = "" + num;
	if (num.length == 1) {
		num = "0" + num;
	}
	return num;
}

Utils.ttToDatetime = function(ymd, hm) {
	ymd = ymd.replace(/-/g, "/")
	return Date.parse(ymd + " " + hm)
}

Utils.dictGet = function(obj, key, defVal = undefined) {
	return obj.hasOwnProperty(key) ? obj[key] : defVal;
}

Utils.getDaysInMonth = function(year, month) {
	return new Date(year, month, 0).getDate();
}

Utils.getFirstDayOfWeek = function(year, month) {
	var first_day_of_month = new Date(year, month - 1, 1);
	return first_day_of_month.getDay();
}

Utils.objIsEmpty = function(obj) {
	return Object.keys(obj).length === 0;
}

Utils.formatTimestampUTC = function(timestamp) {
	var date = new Date(timestamp);
	var year = date.getUTCFullYear();
	var month = String(date.getUTCMonth() + 1).padStart(2, '0');
	var day = String(date.getUTCDate()).padStart(2, '0');
	var hours = String(date.getUTCHours()).padStart(2, '0');
	var minutes = String(date.getUTCMinutes()).padStart(2, '0');
	var seconds = String(date.getUTCSeconds()).padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

Utils.formatTimestamp = function(timestamp) {
	var date = new Date(timestamp);
	var year = date.getFullYear();
	var month = (date.getMonth() + 1).toString().padStart(2, '0');
	var day = date.getDate().toString().padStart(2, '0');
	var hours = date.getHours().toString().padStart(2, '0');
	var minutes = date.getMinutes().toString().padStart(2, '0');
	var seconds = date.getSeconds().toString().padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

Utils.splitKeyword = function(str) {
	var result = [];
	for (var len = 1; len <= str.length; len++) {
		for (var start = 0; start <= str.length - len; start++) {
			result.push(str.substring(start, start + len));
		}
	}
	return result;
}

Utils.invertColor = function(hex) {
	hex = hex.substring(1);
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);
	r = 255 - r;
	g = 255 - g;
	b = 255 - b;
	var inverted_hex = "#" +
		("0" + r.toString(16)).slice(-2) +
		("0" + g.toString(16)).slice(-2) +
		("0" + b.toString(16)).slice(-2);
	return inverted_hex;
}

Utils.parseTimeString = function(time_string) {
	const regexes = [
		/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?(?:\s(\d{1,2}):(\d{1,2}):(\d{1,2}))?$/,
		/^(\d{4})年(?:-(\d{1,2})月)?(?:-(\d{1,2})日)?(?:\s(\d{1,2})时(\d{1,2})分(\d{1,2})秒)?$/,
		/^(\d{4})年(\d{1,2})月(\d{1,2})日(?:\s(\d{1,2})时(\d{1,2})分(\d{1,2})秒)?$/
	];
	for (var regex of regexes) {
		var match = time_string.match(regex);
		if (match) {
			var [_, year, month, day, hour, minute, second] = match;
			var result = {
				year: year || null,
				month: month || null,
				day: day || null,
				hour: hour || null,
				minute: minute || null,
				second: second || null
			};
			return result;
		}
	}
	return null;
}

Utils.countYear = function(last, frist) {
	let count_all_year = last[0] - frist[0];
	if (last[1] < frist[1] || (last[1] === frist[1] && last[2] < frist[2])) {
		count_all_year--;
	}
	return count_all_year;
}

Utils.countMonth = function(last, frist) {
	let count_all_month = (last[0] - frist[0]) * 12 + (last[1] - frist[1]);
	if (last[2] < frist[2]) {
		count_all_month--;
	}
	return count_all_month;
}

Utils.countDay = function(last, frist) {
	let start = new Date(frist[0], frist[1] - 1, frist[2]);
	let end = new Date(last[0], last[1] - 1, last[2]);
	return Math.floor((end - start) / (24 * 60 * 60 * 1000));
}

export default Utils;