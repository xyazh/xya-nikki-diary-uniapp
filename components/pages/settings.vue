<template>
	<view class="setting">
		<view class="setting-title" :style="{ color: COLORS.SUB_TITLE1}">常规</view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="theme">主题（{{theme_name}}）</view>
		<view class="setting-line"></view>

		<view class="setting-title" :style="{ color: COLORS.SUB_TITLE1}">导出</view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="exportPlainText">导出为明文</view>
		<view class="setting-line"></view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="exportDayOne">导出为DAY ONE日记文件</view>
		<view class="setting-line"></view>

		<view class="setting-title" :style="{ color: COLORS.SUB_TITLE1}">日记</view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="checkDiaryTime">校验日记时间错误</view>
		<view class="setting-line"></view>

		<view class="setting-title" :style="{ color: COLORS.SUB_TITLE1}">记录</view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="clearEvents">清理事件</view>
		<view class="setting-line"></view>

		<view class="setting-title" :style="{ color: COLORS.SUB_TITLE1}">故事集</view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="clearTags">清理TAG</view>
		<view class="setting-line"></view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="rebuildHierarchy">重建上下关系</view>
		<view class="setting-line"></view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="rebuildLinks">重建链接</view>
		<view class="setting-line"></view>

		<view class="setting-title" :style="{ color: COLORS.SUB_TITLE1}">安全</view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="deletePassword">删除密码</view>
		<view class="setting-line"></view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="clearData">清除数据</view>
		<view class="setting-line"></view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="setSubPassword">设置页面子密码</view>
		<view class="setting-line"></view>

		<view class="setting-title" :style="{ color: COLORS.SUB_TITLE1}">其他</view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="github">仓库地址</view>
		<view class="setting-line"></view>
		<view class="setting-item" :style="{ color: COLORS.SUB_ITEM1}" @tap="about">关于</view>

	</view>
	<view class="setting-msg">xya日记</view>
	<view class="setting-msg">Made by xyazh since 2021.5.5</view>
</template>

<script>
	import Utils from '@/js/Utils.js'
	import DataManager from '@/js/DataManager.js'
	import Nikkis from '../../js/Nikkis.js'
	import Tekoki from '@/js/Tekoki.js'
	import VIAR_TREE from '@/js/ViArTree.js'
	import PASSWORD_BOOK from '@/js/PasswordBook.js';
	import COLORS from "@/js/Colors.js";
	const TNEME_NAMES = ["默认", "深色", "黑色", "暖黄", "浅绿", "灰蓝", "浅粉", "深蓝", "灰紫", "ACCEED"]

	let _theme_index = uni.getStorageSync("theme");
	if (!_theme_index) {
		_theme_index = 0;
	}
	if (_theme_index >= TNEME_NAMES.length) {
		_theme_index = 0;
	} else if (_theme_index < 0) {
		_theme_index = TNEME_NAMES.length - 1;
	}
	const THIS_TNEME_INDEX = _theme_index;

	let count_clear = 0;
	setInterval(() => {
		count_clear = 0;
	}, 5000);

	export default {
		emits: ['page-mounted'],
		data() {
			return {
				COLORS: COLORS,
				theme_name: TNEME_NAMES[THIS_TNEME_INDEX],
			}
		},
		methods: {
			theme() {
				let theme_index = uni.getStorageSync("theme");
				if (!theme_index) {
					theme_index = 0;
				}
				theme_index += 1;
				if (theme_index >= TNEME_NAMES.length) {
					theme_index = 0;
				} else if (theme_index < 0) {
					theme_index = TNEME_NAMES.length - 1;
				}
				this.theme_name = TNEME_NAMES[theme_index];
				uni.setStorageSync("theme", theme_index);
				uni.showToast({
					title: "重启后生效",
					icon: "none"
				});
			},
			exportPlainText() {
				DataManager.exportFile(false);
			},
			exportDayOne() {
				const file_name = `backup-one-day-${Date.now()}.json`;
				const systemInfo = uni.getSystemInfoSync();
				const result = {
					metadata: {
						version: "2023.25",
						xya_info: "This is export from xya-nikki"
					},
					entries: []
				};
				const nikkis = Nikkis.getNikkiList();
				for (const nikki of nikkis) {
					const text = nikki.text;
					let text_data = {
						contents: [{
							text: text
						}],
						meta: {
							created: {
								platform: "com.bloombuilt.dayone-android",
								version: 407
							},
							"small-lines-removed": true,
							version: 1
						}
					};
					text_data = JSON.stringify(text_data);
					const date = Utils.formatTimestampUTC(nikki.date);
					const data = {
						uuid: Utils.md5(text_data).toUpperCase(),
						starred: false,
						pinned: false,
						text: text,
						richText: text_data,
						creationDate: date,
						modifiedDate: date,
						creationDevice: systemInfo.model || "",
						creationOSName: systemInfo.osName || "",
						creationOSVersion: systemInfo.osVersion || "",
						creationDeviceType: systemInfo.deviceBrand || "",
						timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						v: {}
					};
					result.entries.push(data);
				}
				if (process.env.UNI_PLATFORM === 'h5') {
					const jsonStr = JSON.stringify(result);
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
					const jsonStr = JSON.stringify(result);
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
					uni.showToast({
						title: `导出成功: ${path}`,
						icon: 'none'
					});
					DataManager.shareFile(path);
				}
			},
			checkDiaryTime() {
				Nikkis.checkNikkiTime().save();
				uni.showToast({
					title: `校验日记时间`,
					icon: 'none'
				});
			},
			clearEvents() {
				Tekoki.reCreateTekok().save();
				uni.showToast({
					title: `已清理事件`,
					icon: 'none'
				});
			},
			deleteEvents() {},
			clearTags() {
				VIAR_TREE.reCreateTags().save();
				uni.showToast({
					title: `已清理TAG`,
					icon: 'none'
				});
			},
			rebuildHierarchy() {},
			rebuildLinks() {},
			deletePassword() {
				Utils.switchPage("setpassword", "删除密码", true);
				uni.showToast({
					title: `输入旧密码删除密码`,
					icon: 'none'
				});
			},
			clearData() {
				if (count_clear < 10) {
					count_clear++;
					uni.showToast({
						title: `请连续点击${10-count_clear}次清除所有数据`,
						icon: 'none'
					});
				} else {
					count_clear = 0;
					uni.clearStorageSync();
					if (process.env.UNI_PLATFORM === 'h5') {
						window.location.reload();
					}
					const sys = uni.getSystemInfoSync();
					if ((sys.platform === 'android' || sys.platform === 'ios') && typeof plus !==
						'undefined' && plus
						.runtime) {
						plus.runtime.quit();
					}
					uni.showToast({
						title: `已删除`,
						icon: 'none'
					});
				}
			},
			setSubPassword() {},
			github() {
				const url = "https://github.com/xyazh/xya-nikki-diary-uniapp";
				if (process.env.UNI_PLATFORM === 'h5') {
					window.location.href = url;
				}
				if (process.env.UNI_PLATFORM === 'app') {
					plus.runtime.openURL(url)
				}
			},
			about() {
				uni.showToast({
					title: `v${Utils.version}`,
					icon: 'none'
				});
			},
		},
		mounted() {
			this.$emit('page-mounted');
		},
		unmounted() {},
	}
</script>

<style>
	.setting {
		width: 100%;
	}

	.setting-title {
		font-size: 28rpx;
		margin: 10rpx 20rpx;
		font-weight: bold;
	}

	.setting-item {
		height: 100rpx;
		line-height: 100rpx;
		margin-left: 20rpx;
		color: #000;
		font-size: 29rpx;
		align-items: center;
	}

	.setting-line {
		border-bottom: 1px solid #ccc;
		width: 100%;
	}

	.setting-msg {
		width: 100%;
		color: #999;
		font-size: 18rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>