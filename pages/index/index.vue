<template>
	<!-- 密码输入遮罩 -->
	<view v-if="showMask" class="inpw-mask">
		<view class="inpw-inline">
			<text class="inpw-text">密码：</text>
			<input password v-model="password" placeholder="请输入密码" />
		</view>
		<button class="inpw-ok-btn" type="primary" @click="inptConfirm()">确认</button>
	</view>
	<view class="app-status-bar"></view>
	<view class="app-bar">
		<view class="left" @click="toggleSidebar">
			<image class="menu-btn" src="/static/icon/Dc.png"></image>
		</view>
		<view class="title">{{title}}</view>
	</view>
	<view class="container">
		<!-- 页面内容 -->
		<view class="page-content">
			<component :is="currentPage"></component>
		</view>
		<view class="overlay" :class="{ 'overlay-show': sidebarVisible }" @click="closeSidebar">
		</view>
		<view class="sidebar" :class="{ 'sidebar-open': sidebarVisible }">
			<view class="sidebar-block">
			</view>
			<scroll-view scroll-y="true" class="sidebar-scroll-view" show-scrollbar="false">
				<view class="sidebar-list-item" v-for="item in sidebaItems" :key="item.key" @click="switchPage(item)">
					<image :src="item.icon" class="sidebar-item-icon" mode="widthFix"></image>
					<text class="sidebar-item-text">{{item.title}}</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import {
		useRoute
	} from 'vue-router';

	const sidebarVisible = ref(false);

	const toggleSidebar = () => {
		sidebarVisible.value = !sidebarVisible.value;
	};

	const closeSidebar = () => {
		sidebarVisible.value = false;
	};
</script>

<script sub>
	import home from '@/components/pages/home.vue'
	import nikki from '@/components/pages/nikki.vue'
	import readnikki from '@/components/pages/readnikki.vue'
	import writenikki from '@/components/pages/writenikki.vue'
	import tekoki from '@/components/pages/tekoki.vue'
	import viar from '@/components/pages/viar.vue'
	import readviar from '@/components/pages/readviar.vue'
	import setpassword from '@/components/pages/setpassword.vue'
	import settings from '@/components/pages/settings.vue'
	import about from '@/components/pages/about.vue';

	import Utils from '@/js/Utils.js';
	import DataManager from '@/js/DataManager';

	// 页面标题
	const title = ref('主页');
	if (process.env.UNI_PLATFORM === 'h5') {
		location.hash = `#home|${encodeURIComponent('主页')}`;
	}

	const sidebaItems = ref([{
			title: "主页",
			key: "home",
			icon: "/static/icon/lS.png"
		},
		{
			title: "日记",
			key: "nikki",
			icon: "/static/icon/_N.png"
		},
		{
			title: "记录",
			key: "tekoki",
			icon: "/static/icon/6G.png"
		},
		{
			title: "故事集",
			key: "viar",
			icon: "/static/icon/ls2.png"
		},
		{
			title: "密码簿",
			key: "home",
			icon: "/static/icon/NP.png"
		},
		{
			title: DataManager.hasPassword() ? "修改密码" : "创建密码",
			key: "setpassword",
			icon: "/static/icon/ul2.png"
		},
		{
			title: "导出",
			key: "export",
			icon: "/static/icon/D8.png"
		},
		{
			title: "导入",
			key: "import",
			icon: "/static/icon/KY.png"
		},
		{
			title: "设置",
			key: "settings",
			icon: "/static/icon/i1.png"
		},
		{
			title: "退出",
			key: "home",
			icon: "/static/icon/6y.png"
		}
	]);

	export default {
		data() {
			return {
				showMask: DataManager.hasPassword(),
				password: "",
				currentPage: "home",
				pages: {
					home,
					nikki,
					readnikki,
					writenikki,
					tekoki,
					viar,
					readviar,
					setpassword,
					settings,
					about
				},
			};
		},
		components: {
			home,
			nikki,
			readnikki,
			writenikki,
			tekoki,
			viar,
			readviar,
			setpassword,
			settings,
			about
		},
		methods: {
			inptConfirm() {
				let ok = DataManager.checkPassword(this.password);
				if (ok) {
					DataManager.password = Utils.md5(this.password);
					for (let fuc of DataManager.ON_LOAD) {
						fuc();
					}
					DataManager.ON_LOAD = null;
					this.showMask = false;
					uni.showToast({
						title: "密码正确",
						icon: "none"
					});
				} else {
					uni.showToast({
						title: "密码错误",
						icon: "none"
					});
					setTimeout(this.outOrWait, 1500);
				}
			},
			outOrWait() {
				const sys = uni.getSystemInfoSync();
				if (
					(sys.platform === 'android' || sys.platform === 'ios') &&
					typeof plus !== 'undefined' &&
					plus.runtime
				) {
					plus.runtime.quit();
				} else {
					while (true) {}
				}
			},
			switchPage(item) {
				if (item.key == "import") {
					DataManager.importFile();
					return;
				}
				if (item.key == "export") {
					DataManager.exportFile();
					return;
				}
				if (process.env.UNI_PLATFORM === 'h5') {
					this.currentPage = item.key;
					title.value = item.title;
					location.hash = `#${item.key}|${encodeURIComponent(item.title)}`;
				} else {
					Utils.page_stack.push({
						key: this.currentPage,
						title: title.value
					});
					this.currentPage = item.key;
					title.value = item.title;
				}
			},

			updateSetPassword(flag) {
				for (let item of sidebaItems.value) {
					if (item.key == "setpassword") {
						item.title = DataManager.hasPassword() ? "修改密码" : "创建密码";
						title.value = item.title;
						return;
					}
				}
			},

			onHashchange() {
				const hash = location.hash.replace('#', '');
				if (!hash) return;
				let [key, t_title] = hash.split('|');
				if (key === undefined || t_title === undefined) {
					return;
				}
				if (this.currentPage === key) return;
				this.currentPage = key;
				t_title = decodeURIComponent(t_title);
				t_title && (title.value = t_title);
			}
		},

		mounted() {
			Utils.registerSwitchPage(this.switchPage);
			Utils.registerUpdateSetPassword(this.updateSetPassword);
			if (process.env.UNI_PLATFORM === 'h5') {
				if (!location.hash) {
					location.hash = `#${item.key}|${encodeURIComponent(item.title)}`;
				}
				window.addEventListener('hashchange', this.onHashchange);
			}
			if (!DataManager.hasPassword()) {
				for (let fuc of DataManager.ON_LOAD) {
					fuc();
				}
			}
		},
		onReachBottom() {
			Utils.onReachBottom();
		},
		onBackPress() {
			if (Utils.page_stack.length > 0) {
				let item = Utils.page_stack.pop();
				this.currentPage = item.key;
				title.value = item.title;
				return true;
			}
			return false;
		}
	}
</script>


<style scoped lang="scss">
	$status-bar-height: var(--status-bar-height);
	$topbar-height: 110rpx;

	.inpw-mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #ffffff;
		align-items: center;
		justify-content: center;
		z-index: 4;
	}

	.inpw-inline {
		display: flex;
		align-items: center;
		margin-top: calc(50vh - 60rpx);
		padding: 0 15rpx;
	}

	.inpw-text {
		font-size: 32rpx;
		color: #000;
		width: 100rpx;
	}

	.inpw-inline input {
		flex: 1;
		height: 60rpx;
		font-size: 32rpx;
		border: none;
		outline: none;
		background: transparent;
		border-bottom: 3rpx solid #333;
	}

	.inpw-ok-btn {
		margin: 25rpx auto;
		width: 160rpx;
		height: 70rpx;
		background-color: #e5e5e5;
		color: #000;
		font-size: 28rpx;
		border-radius: 3rpx;
		box-shadow: 1rpx 0 8rpx rgba(0, 0, 0, 0.2);
	}


	.container {
		width: 100%;
		min-height: 100%;
	}

	.menu-btn {
		width: 48rpx;
		height: 48rpx;
		filter: invert(100%);
	}

	.app-status-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: $status-bar-height;
		z-index: 1;
		background-color: #77aaff;
	}

	.app-bar {
		position: fixed;
		top: $status-bar-height;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		padding: 0 16rpx;
		height: $topbar-height;
		z-index: 1;
		background-color: #77aaff;
		color: #ffffff;
	}

	.left {
		width: 64rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		flex: 1;
		font-size: 36rpx;
		margin-left: 42rpx;
	}

	/* 页面内容 */
	.page-content {
		padding-top: calc($status-bar-height + $topbar-height);
		min-height: calc(100vh - $status-bar-height - $topbar-height);
		width: 100%;
	}

	/* 遮罩层 */
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0);
		z-index: 2;
		transition: background-color 0.3s ease;
		pointer-events: none;
	}

	.overlay-show {
		background-color: rgba(0, 0, 0, 0.4);
		pointer-events: auto;
	}

	/* 侧边栏 */
	.sidebar {
		position: fixed;
		top: 0;
		left: -488rpx;
		width: 480rpx;
		height: 100%;
		background-color: #fff;
		z-index: 3;
		box-shadow: 2rpx 0 8rpx rgba(0, 0, 0, 0.2);
		padding: 0rpx;
		transition: left 0.3s ease;
	}

	.sidebar-open {
		left: 0;
	}

	.sidebar-block {
		width: 100%;
		height: 360rpx;
		background-color: #77aaff;
	}

	.sidebar-scroll-view {
		width: 100%;
		height: calc(100% - 360rpx);
	}

	.sidebar-list-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 50rpx 10rpx;
	}

	.sidebar-item-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 16rpx;
		display: block;
		filter: invert(64%) sepia(56%) saturate(3224%) hue-rotate(195deg) brightness(107%) contrast(101%);
	}

	.sidebar-item-text {
		font-size: 30rpx;
		color: #000000;
		line-height: 50rpx;
	}
</style>