<template>
	<view class="setting">
		<view class="setting-title">常规</view>
		<view class="setting-item" @tap="theme">主题</view>
		<view class="setting-line"></view>

		<view class="setting-title">导出</view>
		<view class="setting-item" @tap="exportPlainText">导出为明文</view>
		<view class="setting-line"></view>
		<view class="setting-item" @tap="exportDayOne">导出为DAY ONE日记文件</view>
		<view class="setting-line"></view>

		<view class="setting-title">日记</view>
		<view class="setting-item" @tap="checkDiaryTime">校验日记时间错误</view>
		<view class="setting-line"></view>

		<view class="setting-title">记录</view>
		<view class="setting-item" @tap="clearEvents">清理事件</view>
		<view class="setting-line"></view>
		<view class="setting-item" @tap="deleteEvents">删除事件</view>
		<view class="setting-line"></view>

		<view class="setting-title">故事集</view>
		<view class="setting-item" @tap="clearTags">清理TAG</view>
		<view class="setting-line"></view>
		<view class="setting-item" @tap="rebuildHierarchy">重建上下关系</view>
		<view class="setting-line"></view>
		<view class="setting-item" @tap="rebuildLinks">重建链接</view>
		<view class="setting-line"></view>

		<view class="setting-title">安全</view>
		<view class="setting-item" @tap="deletePassword">删除密码</view>
		<view class="setting-line"></view>
		<view class="setting-item" @tap="clearData">清除数据</view>
		<view class="setting-line"></view>
		<view class="setting-item" @tap="setSubPassword">设置页面子密码</view>
		<view class="setting-line"></view>

		<view class="setting-title">其他</view>
		<view class="setting-item" @tap="github">仓库地址</view>
		<view class="setting-line"></view>
		<view class="setting-item" @tap="about">关于</view>

	</view>
	<view class="setting-msg">xya日记</view>
	<view class="setting-msg">Made by xyazh since 2021.5.5</view>
</template>

<script>
	import Utils from '@/js/Utils.js'
	import DataManager from '@/js/DataManager.js'
	import Tekoki from '@/js/Tekoki.js'
	import VIAR_TREE from '@/js/ViArTree.js'

	export default {
		data() {
			return {}
		},
		methods: {
			theme() {},
			exportPlainText() {
				DataManager.exportFile(false);
			},
			exportDayOne() {},
			checkDiaryTime() {},
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
			deletePassword() {},
			clearData() {},
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
		mounted() {},
		unmounted() {},
	}
</script>

<style>
	.setting {
		width: 100%;
	}

	.setting-title {
		color: #77aaff;
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