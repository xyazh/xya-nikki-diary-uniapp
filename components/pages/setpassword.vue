<template>
	<view class="page-home">
		<view v-if="has_password" class="stpw-inline">
			<text class="stpw-text">旧密码:</text>
			<view class="stpw-input-warp" :class="{ 'stpw-input-error': err0 }">
				<input password v-model="password0" class="stpw-input" placeholder="请输入密码" @input="err0 = ''" />
				<view class="stpw-error-icon-off" :class="{ 'stpw-error-icon-on': err0 }">!</view>
			</view>
		</view>
		<view class="stpw-error-text-off" :class="{ 'stpw-error-text-on': err0 }">{{err0}}</view>
		<view class="stpw-inline">
			<text class="stpw-text">密码:</text>
			<view class="stpw-input-warp" :class="{ 'stpw-input-error': err1 }">
				<input password v-model="password1" class="stpw-input" placeholder="请输入密码(留空删除密码)" @input="err1 = ''" />
				<view class="stpw-error-icon-off" :class="{ 'stpw-error-icon-on': err1 }">!</view>
			</view>
		</view>
		<view class="stpw-error-text-off" :class="{ 'stpw-error-text-on': err1 }">{{err1}}</view>
		<view class="stpw-inline">
			<text class="stpw-text">确认密码:</text>
			<view class="stpw-input-warp" :class="{ 'stpw-input-error': err2 }">
				<input password v-model="password2" class="stpw-input" placeholder="请输入密码(留空删除密码)" @input="err2 = ''" />
				<view class="stpw-error-icon-off" :class="{ 'stpw-error-icon-on': err2 }">!</view>
			</view>
		</view>
		<view class="stpw-error-text-off" :class="{ 'stpw-error-text-on': err2 }">{{err2}}</view>
		<button class="stpw-ok-btn" type="primary" @click="setPassword()">确认</button>
	</view>
</template>


<script>
	import Utils from '@/js/Utils.js';
	import DataManager from '@/js/DataManager';

	export default {
		data() {
			return {
				has_password: DataManager.hasPassword(),
				password0: "",
				password1: "",
				password2: "",
				err0: "",
				err1: "",
				err2: "",
			}
		},
		methods: {
			setPassword() {
				this.err0 = "";
				this.err1 = "";
				this.err2 = "";

				if (this.has_password) {
					if (!this.password0) {
						this.err0 = "请输入旧密码";
						return;
					}
					if (!DataManager.checkPassword(this.password0)) {
						this.err0 = "旧密码错误";
						return;
					}
				}
				if (this.password1 !== this.password2) {
					this.err2 = "两次输入的密码不一致";
					return;
				}
				DataManager.setPassword(this.password1);
				this.password0 = "";
				this.password1 = "";
				this.password2 = "";
				this.has_password = DataManager.hasPassword();
				Utils.updateSetPassword();
				Utils.switchPage("home", "主页");
				uni.showToast({
					title: "密码修改成功",
					icon: "none"
				});
			},
		},
		mounted() {

		},
	}
</script>

<style lang="scss">
	$dis-text-color: #757575;

	.stpw-error-icon-off {
		width: 0;
		height: 36rpx;
		border-radius: 50%;
		background: #e54d42;
		color: #fff;
		font-size: 26rpx;
		line-height: 36rpx;
		text-align: center;
		margin-left: 12rpx;
		position: relative;
		opacity: 0;
		transform: scale(0.8);
		pointer-events: none;
		transition: opacity 0.25s ease, transform 0.25s ease;
	}

	.stpw-error-icon-on {
		width: 36rpx;
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.stpw-error-text-off {
		overflow: hidden;
		width: 100%;
		height: 0;
		font-size: 26rpx;
		color: #e54d42;
		text-align: right;
		transition: height 0.25s ease;
	}

	.stpw-error-text-on {
		height: 36rpx;
	}


	.page-home {
		margin: 0 20rpx;
		height: 45vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}

	.stpw-inline {
		display: flex;
		align-items: center;
		padding: 0 15rpx;
		margin: 10rpx 0;
		width: 100%;
	}

	.stpw-text {
		font-size: 32rpx;
		color: #000;
		text-align: justify;
		text-align-last: justify;
		margin-right: 10rpx;
		width: 160rpx;
	}

	.stpw-input-warp {
		display: flex;
		align-items: center;
		border-bottom: 3rpx solid #333;
		flex: 1;
	}

	.stpw-input {
		flex: 1;
		height: 60rpx;
		font-size: 32rpx;
		border: none;
		outline: none;
		background: transparent;

	}

	.stpw-input-error {
		border-bottom: 3rpx solid #e54d42;
	}

	.stpw-ok-btn {
		margin: 25rpx auto;
		width: 160rpx;
		height: 70rpx;
		background-color: #e5e5e5;
		color: #000;
		font-size: 28rpx;
		border-radius: 3rpx;
		box-shadow: 1rpx 0 8rpx rgba(0, 0, 0, 0.2);
	}
</style>