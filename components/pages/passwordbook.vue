<template>
	<view class="pwb-dl-mask" :class="{ 'pwb-dl-mask-show': pwb_dl_mask}" @click="closeDl()"></view>
	<view v-if="pwb_dl_mask" class="pwb-dl">
		<view class="pwb-dl-bar">
			<view class="pwb-dl-bar-title">记录密码</view>
		</view>
		<view class="pwb-dl-bar-body">
			<view class="pwb-dialog">
				<view class="pwb-dialog-body">
					<view class="pwb-field">
						<text class="pwb-label">Web/App</text>
						<text v-if="copy_mode" class="pwb-input"
							@tap="copy(TEMP_PASSWORD.site)">{{TEMP_PASSWORD.site}}</text>
						<input v-if="!copy_mode" v-model="TEMP_PASSWORD.site" class="pwb-input" type="text"
							placeholder="如：GitHub / 银行 App" />
					</view>
					<view class="pwb-field">
						<text class="pwb-label">用户名</text>
						<text v-if="copy_mode" class="pwb-input"
							@tap="copy(TEMP_PASSWORD.username)">{{TEMP_PASSWORD.username}}</text>
						<input v-if="!copy_mode" v-model="TEMP_PASSWORD.username" class="pwb-input" type="text"
							placeholder="登录用户名" />
					</view>
					<view class="pwb-field">
						<text class="pwb-label">密码</text>
						<text v-if="copy_mode" class="pwb-input"
							@tap="copy(TEMP_PASSWORD.password)">{{TEMP_PASSWORD.password}}</text>
						<input v-if="!copy_mode" v-model="TEMP_PASSWORD.password" class="pwb-input"
							placeholder="登录密码" />
					</view>
					<view class="pwb-field">
						<text class="pwb-label">邮箱</text>
						<text v-if="copy_mode" class="pwb-input"
							@tap="copy(TEMP_PASSWORD.email)">{{TEMP_PASSWORD.email}}</text>
						<input v-if="!copy_mode" v-model="TEMP_PASSWORD.email" class="pwb-input" type="text"
							placeholder="绑定邮箱" />
					</view>
					<view class="pwb-field">
						<text class="pwb-label">电话</text>
						<text v-if="copy_mode" class="pwb-input"
							@tap="copy(TEMP_PASSWORD.phone)">{{TEMP_PASSWORD.phone}}</text>
						<input v-if="!copy_mode" v-model="TEMP_PASSWORD.phone" class="pwb-input" type="text"
							placeholder="绑定手机号" />
					</view>
					<view class="pwb-field">
						<text class="pwb-label">KeyCode</text>
						<text v-if="copy_mode" class="pwb-input"
							@tap="copy(TEMP_PASSWORD.keycode)">{{TEMP_PASSWORD.keycode}}</text>
						<input v-if="!copy_mode" v-model="TEMP_PASSWORD.keycode" class="pwb-input" type="text"
							placeholder="API Key / Token / 密钥" />
					</view>
					<view class="pwb-field">
						<text class="pwb-label">备注</text>
						<text v-if="copy_mode" class="pwb-input"
							@tap="copy(TEMP_PASSWORD.meta)">{{TEMP_PASSWORD.meta}}</text>
						<input v-if="!copy_mode" v-model="TEMP_PASSWORD.meta" class="pwb-input" type="text"
							placeholder="用途说明、注意事项" />
					</view>
				</view>
			</view>
		</view>
		<view class="pwb-footer">
			<view class="pwb-add-btn pwb-btn-delete" @click="onDelete" v-if="!copy_mode">删除</view>
			<view class="pwb-add-btn" @click="onCancel">取消</view>
			<view class="pwb-add-btn" @click="onConfirm" v-if="!copy_mode">确定</view>
			<view class="pwb-add-btn" @click="onUpdate">{{copy_mode?"修改":"复制"}}</view>
		</view>
	</view>

	<view class="pwb-box" :class="{ 'pwb-box-on': pwb_box_on }">
		<view class="pwb-srh-box" :class="{ 'pwb-srh-line-on': pwb_box_on }">
			<view class="pwb-srh-line" :class="{ 'pwb-srh-line-on': pwb_box_on }">
				<input v-model="srh_text" class="pwb-srh-input" placeholder="搜索" />
			</view>
		</view>
		<view class="pwb-btn-line">
			<text v-if="pwb_box_on" class="pwb-btn" @tap="srh()">搜索</text>
			<text v-if="pwb_box_on" class="pwb-btn" @tap="unrsh()">重置</text>
			<text @click="openBox()" class="pwb-btn">{{pwb_box_on ? "收起" : "展开"}}</text>
		</view>
	</view>
	<view class="fixed-button" @tap="addPassword()">
		<image src="@/static/icon/ck.png" class="fixed-button-icon" mode="widthFix"></image>
	</view>
<view class="pwb-length-box" :class="{ 'pwb-length-box-offset': pwb_box_on }">
		<text class="pwb-length">共{{RENDER_LIST.length}}篇</text>
	</view>
	<view class="pwb-list" :class="{ 'pwb-list-on': pwb_box_on }">
		<view class="pwb-item" v-for="item in RENDER_LIST" :key="item.id" @tap="openItem(item)">
			<view class="pwb-row pwb-row-main">
				<text class="pwb-site">{{item.site?item.site:"无"}}</text>
				<text class="pwb-app">Web/App</text>
			</view>
			<view v-if="item.username" class="pwb-row">
				<text class="pwb-label">用户名</text>
				<text class="pwb-value">{{item.username}}</text>
			</view>
			<view v-if="item.password" class="pwb-row">
				<text class="pwb-label">密码</text>
				<text class="pwb-value">{{item.password}}</text>
			</view>
			<view v-if="item.email" class="pwb-row">
				<text class="pwb-label">邮箱</text>
				<text class="pwb-value">{{item.email}}</text>
			</view>
			<view v-if="item.phone" class="pwb-row">
				<text class="pwb-label">电话</text>
				<text class="pwb-value">{{item.phone}}</text>
			</view>
			<view v-if="item.keycode" class="pwb-row">
				<text class="pwb-label">KeyCode</text>
				<text class="pwb-value">{{item.keycode}}</text>
			</view>
			<view v-if="item.meta" class="pwb-row pwb-row-note">
				<text class="pwb-note">{{item.meta}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Utils from '@/js/Utils.js'
	import PASSWORD_BOOK from '@/js/PasswordBook.js';

	const RENDER_LIST = PASSWORD_BOOK.getRenderList();
	const TEMP_PASSWORD = PASSWORD_BOOK.getTempPassword();

	export default {
		data() {
			return {
				pwb_box_on: false,
				srh_text: "",
				pwb_dl_mask: false,
				copy_mode: true,
				RENDER_LIST,
				TEMP_PASSWORD,
			}
		},
		methods: {
			openBox() {
				this.pwb_box_on = !this.pwb_box_on;
			},
			openDl() {
				this.pwb_dl_mask = true;
			},
			openItem(item) {
				PASSWORD_BOOK.clearTempPassword();
				Object.assign(TEMP_PASSWORD,item);
				this.openDl();
			},
			addPassword(){
				this.copy_mode = false;
				this.openDl();
			},
			srh() {
				PASSWORD_BOOK.srh(this.srh_text);
			},
			unrsh() {
				this.srh_text = "";
				PASSWORD_BOOK.renderIdentity();
			},
			copy(text) {
				if (!text) {
					return;
				}
				uni.setClipboardData({
					data: text,
					success() {
						uni.showToast({
							title: `已复制:${text}到剪切板`,
							icon: 'none'
						});
					},
					fail(err) {
						uni.showToast({
							title: `复制${text}失败${err}`,
							icon: 'none'
						});
						console.error(err);
					}
				});
			},
			closeDl() {
				this.pwb_dl_mask = false;
				this.copy_mode = true;
			},
			onCancel() {
				PASSWORD_BOOK.clearTempPassword();
				this.closeDl();
			},
			onConfirm() {
				PASSWORD_BOOK.del(TEMP_PASSWORD.id)
					.add(Utils.copyObj(TEMP_PASSWORD))
					.clearTempPassword()
					.save()
					.renderIdentity();
				this.closeDl();
			},
			onDelete() {
				PASSWORD_BOOK.del(TEMP_PASSWORD.id)
					.clearTempPassword()
					.save()
					.renderIdentity();
				this.closeDl();
			},
			onUpdate() {
				this.copy_mode = !this.copy_mode;
			},
		},
		mounted() {},
		unmounted() {},
	}
</script>

<style lang="scss">
	$dis-text-color: #757575;
	$topbar-height: 110rpx;
	$pwb-box-height-off: 64rpx;
	$pwb-box-height-on: 160rpx;
	$pwb-length-box-height: 64rpx;

	.pwb-dl-mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0);
		transition: background-color 0.3s ease;
		align-items: center;
		justify-content: center;
		z-index: 4;
		pointer-events: none;
	}

	.pwb-dl-mask-show {
		background-color: rgba(0, 0, 0, 0.4);
		transition: background-color 0.3s ease;
		pointer-events: auto;
	}

	.pwb-dl {
		position: fixed;
		left: 80rpx;
		top: 100rpx;
		right: 80rpx;
		bottom: 100rpx;
		background-color: #fff;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.2);
		z-index: 5;
	}

	.pwb-dl-bar {
		display: flex;
		align-items: center;
		width: 100%;
		height: $topbar-height;
		background-color: #77aaff;
		color: #ffffff;
	}

	.pwb-dl-bar-body {
		width: 100%;
		height: calc(100% - $topbar-height - 110rpx);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.pwb-dl-bar-title {
		flex: 1;
		font-size: 36rpx;
		margin-left: 42rpx;
	}

	.pwb-footer {
		width: 100%;
		height: 110rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.pwb-add-btn {
		min-width: 120rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		border-radius: 28rpx;
		font-size: 26rpx;
		margin: auto 5rpx;
		color: #2da7ff;
	}

	.pwb-btn-delete {
		margin-right: auto;
		color: #e64545;
	}

	.pwb-box {
		position: fixed;
		width: 100%;
		display: block;
		height: $pwb-box-height-off;
		background-color: #fff;
		border-bottom: 1rpx solid #ddd;
		transition: height 0.3s ease;
	}

	.pwb-box-on {
		height: $pwb-box-height-on;
	}

	.pwb-btn-line {
		width: 100%;
		height: $pwb-box-height-off;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.pwb-btn {
		font-size: 20rpx;
		margin: 0 20rpx;
		height: $pwb-box-height-off;
		line-height: $pwb-box-height-off;
		color: #2da7ff;
		display: flex;
		justify-content: right;
		align-items: center;
	}

	.pwb-srh-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
		height: 0;
		transition: height 0.3s ease;
	}

	.pwb-srh-line {
		display: flex;
		align-items: center;
		width: 100%;
	}


	.pwb-srh-line-on {
		height: calc($pwb-box-height-on - $pwb-box-height-off);
	}

	.pwb-srh-input {
		flex: 1;
		height: 28rpx;
		line-height: 28rpx;
		font-size: 26rpx;
		border: none;
		outline: none;
		border-bottom: 1rpx solid #333;
		margin: 0 20rpx;
	}


	.fixed-button {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: calc(100% - 160rpx);
		left: calc(100% - 160rpx);
		width: 110rpx;
		height: 110rpx;
		background-color: #77aaff;
		box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.2);
		z-index: 1;
	}

	.fixed-button-icon {
		width: 105rpx;
		height: 105rpx;
		filter: invert(100%) sepia(0%) saturate(2%) hue-rotate(233deg) brightness(106%) contrast(101%);
	}

	.pwb-list {
		padding: 0 24rpx;
		margin-top: calc(10rpx + $pwb-box-height-off + $pwb-length-box-height);
		transition: margin-top 0.3s ease;
	}

	.pwb-list-on {
		margin-top: calc(10rpx + $pwb-box-height-on + $pwb-length-box-height);
		transition: margin-top 0.3s ease;
	}

	.pwb-item {
		background-color: #ffffff;
		border: 1rpx solid #e0e0e0;
		margin-top: 24rpx;
		padding: 20rpx 24rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
	}

	.pwb-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 12rpx;
	}

	.pwb-row-main {
		margin-top: 0;
		margin-bottom: 8rpx;
	}

	.pwb-label {
		width: 120rpx;
		font-size: 24rpx;
		color: #666666;
	}

	.pwb-value {
		flex: 1;
		font-size: 26rpx;
		color: #222222;
		word-break: break-all;
	}

	.pwb-site {
		font-size: 30rpx;
		font-weight: bold;
		color: #111111;
	}

	.pwb-app {
		margin-left: 16rpx;
		font-size: 22rpx;
		color: #888888;
	}

	.pwb-row-note {
		margin-top: 16rpx;
	}

	.pwb-note {
		font-size: 24rpx;
		color: #555555;
	}

	.pwb-item-empty {
		text-align: center;
		padding: 48rpx 0;
	}

	.pwb-empty-text {
		font-size: 26rpx;
		color: #999999;
	}

	.pwb-dialog {
		background-color: #ffffff;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.pwb-dialog-body {
		padding: 16rpx 24rpx;
	}

	.pwb-field {
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.pwb-label {
		font-size: 24rpx;
		color: #666666;
		margin-bottom: 8rpx;
	}

	.pwb-input {
		height: 72rpx;
		line-height: 72rpx;
		justify-content: center;
		padding: 0 16rpx;
		border: 1rpx solid #cccccc;
		font-size: 26rpx;
		color: #222222;
		background-color: #ffffff;
	}
	
	.pwb-length-box {
		position: fixed;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: $pwb-box-height-off;
		height: $pwb-length-box-height;
		background-color: #fff;
		border-top: 1rpx solid #ddd;
		transition: margin-top 0.3s ease;
	}
	
	.pwb-length {
		color: $dis-text-color;
		font-size: 26rpx;
	}
	
	.pwb-length-box-offset {
		margin-top: $pwb-box-height-on;
	}
</style>