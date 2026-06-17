<template>
	<view class="diary-read-length-box" :style="{ backgroundColor: COLORS.BG}">
		<text class="diary-length"  :style="{ color: COLORS.DIS_TEXT}">共{{Utils.read_nikki.text.length}}字</text>
	</view>

	<view class="fixed-button" :style="{ backgroundColor: COLORS.MAIN}" @tap="openWriter()">
		<image src="@/static/icon/6G.png" class="fixed-button-icon" :style="{filter: COLORS.IMGF2}" mode="widthFix">
		</image>
	</view>

	<view class="diary-read-card-box">
		<view class="diary-card" :style="{ backgroundColor: COLORS.BG_CARD}" >
			<view class="card-content">
				<!-- 左侧日期 -->
				<view class="date-box">
					<text class="day" :style="{ color: COLORS.DIS_TEXT}">{{Utils.read_nikki.day}}</text>
					<br>
					<text class="month-week" :style="{ color: COLORS.DIS_TEXT}">{{Utils.read_nikki.month}}月
						{{Utils.read_nikki.week}}</text>
				</view>
				<!-- 右侧内容 -->
				<view class="content-box">
					<text class="year" :style="{ color: COLORS.DIS_TEXT}"
						v-if="Utils.read_nikki.year !== CURRENT_YEAR">{{Utils.read_nikki.year}}</text>
					<text class="read-nikki-text"  :style="{ color: COLORS.TEXT}">
						{{Utils.read_nikki.text}}
					</text>
					<text class="time"
						:style="{ color: COLORS.DIS_TEXT}">{{Utils.addZero(Utils.read_nikki.hours)}}:{{Utils.addZero(Utils.read_nikki.minu)}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Utils from '@/js/Utils.js'
	import COLORS from "@/js/Colors.js";
	export default {
		emits: ['page-mounted'],
		data() {
			return {
				Utils,
				CURRENT_YEAR: new Date().getFullYear(),
				COLORS: COLORS,
			}
		},
		methods: {
			openWriter() {
				let tn = Utils.temp_nikki;
				let rn = Utils.read_nikki;
				Object.assign(tn, rn);
				Utils.switchPage("writenikki", "写日记");
			}
		},
		mounted() {
			this.$emit('page-mounted');
		},
		unmounted() {},
	}
</script>


<style lang="scss">
	$diary-length-box-height: 64rpx;

	.fixed-button-icon {
		width: 105rpx;
		height: 105rpx;
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
		box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.2);
		z-index: 4;
	}

	.diary-read-length-box {
		position: fixed;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: $diary-length-box-height;
	}

	.diary-length {
		font-size: 26rpx;
	}

	.diary-read-card-box {
		margin-top: calc(5rpx + $diary-length-box-height);
	}

	.diary-card {
		margin-bottom: 10rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;
		border-radius: 2rpx;
		padding: 10rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
	}

	.card-content {
		display: flex;
		flex-direction: row;
	}

	.date-box {
		width: 100rpx;
		text-align: center;
		flex-shrink: 0;
		margin-top: 12rpx;
	}

	.day {
		font-size: 52rpx;
		line-height: 52rpx;
	}

	.month-week {
		font-size: 24rpx;
		white-space: nowrap;
	}

	.content-box {
		flex: 1;
		padding-left: 15rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.year {
		font-size: 24rpx;
	}

	.read-nikki-text {
		font-size: 30rpx;
		color: #333;
		line-height: 40rpx;
		margin: 5rpx 0;
		display: -webkit-box;
		word-break: break-all;
	}

	.time {
		font-size: 24rpx;
		align-self: flex-start;
		width: 100%;
	}
</style>