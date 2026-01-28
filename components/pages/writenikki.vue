<template>
	<view class="fixed-button" @tap="nikkiSave()">
		<image src="@/static/icon/8z.png" class="fixed-button-icon" mode="widthFix"></image>
	</view>
	<textarea class="diary-input" placeholder="写些什么罢" v-model="tn.text" :maxlength="-1" />
	<view class="divider"></view>
	<view class="datetime-row">
		<!-- 日期 -->
		<picker mode="date" value="{{`${tn.year}-${tn.month}-${tn.day}`}}" @change="onDateChange">
			<view class="dt-btn">{{`${tn.year}-${tn.month}-${tn.day}`}}</view>
		</picker>

		<!-- 时间 -->
		<picker mode="time" value="{{`${tn.hours}:${tn.minu}`}}" @change="onTimeChange">
			<view class="dt-btn">{{`${tn.hours}:${tn.minu}`}}</view>
		</picker>
	</view>
</template>

<script>
	import Nikkis from '@/js/Nikkis.js'
	import Utils from '@/js/Utils.js'
	import {
		ref,
	} from 'vue';

	const tn = Utils.temp_nikki;



	export default {
		data() {
			return {
				Utils,
				tn,
			}
		},
		methods: {
			onDateChange(e) {
				if (!e.detail?.value) return
				const [y, m, d] = e.detail.value.split('-');
				let tn = this.tn;
				Object.assign(tn, {
					year: y,
					month: m,
					day: d
				})
				let now = new Date(
					Number(tn.year),
					Number(tn.month),
					Number(tn.day),
					Number(tn.hours),
					Number(tn.minu), 0);
				tn.date = now.getTime();
				tn.week = "周" + "日一二三四五六".charAt(now.getDay());
			},
			onTimeChange(e) {
				if (!e.detail?.value) return
				const [h, mi] = e.detail.value.split(':');
				let tn = this.tn;
				Object.assign(tn, {
					hours: h,
					minu: mi
				})
				let now = new Date(
					Number(tn.year),
					Number(tn.month),
					Number(tn.day),
					Number(tn.hours),
					Number(tn.minu), 0);
				tn.date = now.getTime();
				tn.week = "周" + "日一二三四五六".charAt(now.getDay());
			},
			nikkiSave() {
				const NIKKIS = Nikkis;
				let tn = this.tn;
				if (tn.is_new === true) {
					return;
				} else if (tn.text == "") {
					NIKKIS.del(tn.id)
					.sort()
					.countAllText()
					.save();
					this.tn.is_new = true;
					Utils.switchPage("nikki", "日记");
					return;
				}
				NIKKIS.add(Utils.copyObj(this.tn))
					.sort()
					.countAllText()
					.save();
				this.tn.is_new = true;
				this.tn.text = "";
				Utils.switchPage("nikki", "日记");
			}
		},
		mounted() {
			if (tn.is_new === true || tn.text == "") {
				let now = new Date();
				tn.date = now.getTime();
				tn.id = tn.date;

				tn.year = now.getFullYear().toString();
				tn.month = (now.getMonth() + 1).toString().padStart(2, '0');
				tn.day = now.getDate().toString().padStart(2, '0');

				tn.hours = now.getHours().toString().padStart(2, '0');
				tn.minu = now.getMinutes().toString().padStart(2, '0');

				tn.week = "周" + "日一二三四五六".charAt(now.getDay());
				tn.is_new = false;
			}
		},
	}
</script>

<style lang="scss">
	$dis-text-color: #757575;

	.fixed-button-icon {
		width: 105rpx;
		height: 105rpx;
		filter: invert(100%) sepia(0%) saturate(2%) hue-rotate(233deg) brightness(106%) contrast(101%);
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
		z-index: 4;
	}

	/* 输入框 */
	.diary-input {
		width: 100%;
		min-height: 40vh;
		font-size: 32rpx;
		color: #000;
		margin: 10rpx;
	}

	/* 分割线 */
	.divider {
		height: 2rpx;
		background-color: #222;
		margin: 2rpx 10rpx;
	}

	/* 日期时间行 */
	.datetime-row {
		display: flex;
		gap: 20rpx;
		padding: 10rpx;
	}

	/* 日期/时间按钮 */
	.dt-btn {
		background-color: #1ea7ff;
		color: #fff;
		padding: 19rpx 31rpx;
		border-radius: 3rpx;
		font-size: 30rpx;
		box-shadow: 2rpx 0 8rpx rgba(0, 0, 0, 0.2);
	}
</style>