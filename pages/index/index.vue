<template>
	<view v-if="base_on_page">
		<!-- 密码输入遮罩 -->
		<view v-if="showMask" class="inpw-mask" :style="{ backgroundColor: COLORS.BG}">
			<view class="inpw-inline" :style="{ color: COLORS.BG_TEXT1}">
				<text class="inpw-text">密码：</text>
				<input password v-model="password" placeholder="请输入密码" />
			</view>
			<button class="inpw-ok-btn" :style="{ backgroundColor: COLORS.BTN_BG1, color: COLORS.BTN_TEXT1}"
				type="primary" @click="inptConfirm()">确认</button>
		</view>
		<view class="app-status-bar" :style="{ backgroundColor: COLORS.MAIN}"></view>
		<view class="app-bar" :style="{ backgroundColor: COLORS.MAIN, color: COLORS.MAIN_TITLE}">
			<view class="left" @click="toggleSidebar">
				<image class="menu-btn" src="/static/icon/Dc.png"></image>
			</view>
			<view class="title">{{title}}</view>
		</view>
		<view class="container" :style="{ backgroundColor: COLORS.BG}">
			<!-- 页面内容 -->
			<view class="page-content">
				<component :is="currentPage" @page-mounted="onPageMounted"></component>
			</view>

			<view class="overlay" :class="{ 'overlay-show': sidebarVisible }" @click="closeSidebar">
			</view>
			<view class="sidebar"  :class="{ 'sidebar-open': sidebarVisible }" :style="{ backgroundColor: COLORS.BG}">
				<view class="sidebar-block" :style="{ backgroundColor: COLORS.MAIN}">
				</view>
				<scroll-view scroll-y="true" class="sidebar-scroll-view" show-scrollbar="false">
					<view class="sidebar-list-item" v-for="item in sidebaItems" :key="item.key"
						@click="switchPage(item)">
						<image :src="item.icon" class="sidebar-item-icon" :style="{filter: COLORS.IMGF}" mode="widthFix"></image>
						<text class="sidebar-item-text" :style="{ color: COLORS.BG_TEXT1}">{{item.title}}</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		markRaw,
	} from "vue"
	import {
		getCurrentInstance
	} from 'vue'
	import home from '@/components/pages/home.vue'
	import nikki from '@/components/pages/nikki.vue'
	import readnikki from '@/components/pages/readnikki.vue'
	import writenikki from '@/components/pages/writenikki.vue'
	import tekoki from '@/components/pages/tekoki.vue'
	import viar from '@/components/pages/viar.vue'
	import readviar from '@/components/pages/readviar.vue'
	import writeviar from '@/components/pages/writeviar.vue'
	import passwordbook from '@/components/pages/passwordbook.vue'
	import setpassword from '@/components/pages/setpassword.vue'
	import settings from '@/components/pages/settings.vue'
	import about from '@/components/pages/about.vue';

	import Utils from '@/js/Utils.js';
	import DataManager from '@/js/DataManager';

	import COLORS from "@/js/Colors.js";

	if (process.env.UNI_PLATFORM === 'h5') {
		location.hash = `#home`;
	}
	export default {
		data() {
			return {
				COLORS: COLORS,
				base_on_page: true,
				showMask: DataManager.hasPassword(),
				sidebarVisible: false,
				password: "",
				title: "主页",
				currentPage: "home",
				scrollPositions: {},
				sidebaItems: [{
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
						key: "passwordbook",
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
						key: "exit",
						icon: "/static/icon/6y.png"
					}
				],
				pages: {
					home: markRaw(home),
					nikki: markRaw(nikki),
					readnikki: markRaw(readnikki),
					writenikki: markRaw(writenikki),
					tekoki: markRaw(tekoki),
					viar: markRaw(viar),
					readviar: markRaw(readviar),
					writeviar: markRaw(writeviar),
					passwordbook: markRaw(passwordbook),
					setpassword: markRaw(setpassword),
					settings: markRaw(settings),
					about: markRaw(about)
				},
				pages_back: {
					readnikki: ["nikki", "日记"],
					writenikki: ["nikki", "日记"],
					readviar: ["viar", "故事集"],
					writeviar: ["viar", "故事集"],
				}
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
			writeviar,
			passwordbook,
			setpassword,
			settings,
			about
		},
		methods: {
			onPageMounted() {
				if (process.env.UNI_PLATFORM === 'h5') {
					requestAnimationFrame(() => {
						this.$nextTick(() => {
							uni.pageScrollTo({
								scrollTop: this.scrollPositions[this.currentPage] || 0,
								duration: 0
							});
						});
					});
				} else {
					this.$nextTick(() => {
						uni.pageScrollTo({
							scrollTop: this.scrollPositions[this.currentPage] || 0,
							duration: 0
						});
					});
				}
			},
			toggleSidebar() {
				this.sidebarVisible = !this.sidebarVisible;
			},
			closeSidebar() {
				this.sidebarVisible = false;
			},
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
				this.destroyVueApp();
				const sys = uni.getSystemInfoSync();
				if (
					(sys.platform === 'android' || sys.platform === 'ios') &&
					typeof plus !== 'undefined' &&
					plus.runtime
				) {
					plus.runtime.quit();
				} else {
					this.handleExit();
				}
			},
			isElectron() {
				return navigator.userAgent.toLowerCase().includes('electron')
			},
			handleExit() {
				if (this.isElectron()) {
					try {
						const {
							ipcRenderer
						} = require('electron')
						ipcRenderer.send('app-quit')
					} catch (e) {
						console.error('Electron exit failed', e)
					}
				} else {
					while (true) {}
				}
			},
			destroyVueApp() {
				this.base_on_page = false;
				document.body.style.pointerEvents = 'none';
			},
			switchPage(item) {
				this.closeSidebar();
				setTimeout(() => {
					// 处理页面切换逻辑
					if (item.key === "import") {
						DataManager.importFile();
						return;
					}
					if (item.key === "export") {
						DataManager.exportFile();
						return;
					}
					if (item.key === "exit") {
						const sys = uni.getSystemInfoSync();
						if ((sys.platform === 'android' || sys.platform === 'ios') && typeof plus !==
							'undefined' && plus
							.runtime) {
							plus.runtime.quit();
						}
						return;
					}
					this.currentPage = item.key;
					this.title = item.title;

					if (process.env.UNI_PLATFORM === 'h5') {
						location.hash = `#${item.key}`;
					} else {
						Utils.page_stack.push({
							key: this.currentPage,
							title: this.title
						});
					}
				}, 150);
			},

			updateSetPassword(flag) {
				for (let item of this.sidebaItems) {
					if (item.key == "setpassword") {
						item.title = DataManager.hasPassword() ? "修改密码" : "创建密码";
						this.title = item.title;
						return;
					}
				}
			},

			onHashchange() {
				let hash = location.hash.replace('#', '');
				if (!hash) {
					this.currentPage = "home";
					location.hash = `#${this.currentPage}`;
					return;
				}
				if (this.currentPage == hash) {
					return;
				}
				let back_page = this.pages_back[this.currentPage];
				if (back_page) {
					this.currentPage = back_page[0];
					this.title = back_page[1];
				} else {
					this.currentPage = "home";
					this.title = "主页";
				}
				location.hash = `#${this.currentPage}`;
			}
		},

		mounted() {
			Utils.registerSwitchPage(this.switchPage);
			Utils.registerUpdateSetPassword(this.updateSetPassword);
			if (process.env.UNI_PLATFORM === 'h5') {
				if (!location.hash) {
					location.hash = `#${item.key}`;
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
			if (this.currentPage == "home") {
				return false;
			}
			let back_page = this.pages_back[this.currentPage];
			if (back_page) {
				this.currentPage = back_page[0];
				this.title = back_page[1];
			} else {
				this.currentPage = "home";
				this.title = "主页";
			}
			return true;
		},
		onPageScroll: function(e) {
			this.scrollPositions[this.currentPage] = e.scrollTop;
		},
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
		z-index: 3;
		box-shadow: 2rpx 0 8rpx rgba(0, 0, 0, 0.4);
		padding: 0rpx;
		transition: left 0.3s ease;
	}

	.sidebar-open {
		left: 0;
	}

	.sidebar-block {
		width: 100%;
		height: 360rpx;
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
	}

	.sidebar-item-text {
		font-size: 30rpx;
		line-height: 50rpx;
	}
</style>