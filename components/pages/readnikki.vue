<template>
	<view class="diary-read-length-box">
		<text class="diary-length">共{{Utils.read_nikki.text.length}}字</text>
	</view>
	
	<view class="fixed-button" @tap="openWriter()">
		<image src="@/static/icon/6G.png" class="fixed-button-icon" mode="widthFix"></image>
	</view>

	<view class="diary-read-card-box">
		<view class="diary-card">
			<view class="card-content">
				<!-- 左侧日期 -->
				<view class="date-box">
					<text class="day">{{Utils.read_nikki.day}}</text>
					<br>
					<text class="month-week">{{Utils.read_nikki.month}}月 {{Utils.read_nikki.week}}</text>
				</view>
				<!-- 右侧内容 -->
				<view class="content-box">
					<text class="year" v-if="Utils.read_nikki.year !== CURRENT_YEAR">{{Utils.read_nikki.year}}</text>
					<text class="read-nikki-text">
						{{Utils.read_nikki.text}}
					</text>
					<text
						class="time">{{Utils.addZero(Utils.read_nikki.hours)}}:{{Utils.addZero(Utils.read_nikki.minu)}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Utils from '@/js/Utils.js'
	export default {
		data() {
			return {
				Utils,
				CURRENT_YEAR: new Date().getFullYear()
			}
		},
		methods: {
			openWriter(){
				let tn = Utils.temp_nikki;
				let rn = Utils.read_nikki;
				Object.assign(tn, rn);
				Utils.switchPage("writenikki", "写日记");
			}
		},
	}
</script>


<style lang="scss">
	$dis-text-color: #757575;
	$diary-length-box-height: 64rpx;
	
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

	.diary-read-length-box {
		position: fixed;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: $diary-length-box-height;
		background-color: #fff;
	}
	
	.diary-length {
		color: $dis-text-color;
		font-size: 26rpx;
	}

	.diary-read-card-box {
		margin-top: calc(5rpx + $diary-length-box-height);
	}

	.diary-card {
		background-color: #fff;
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
		color: $dis-text-color;
	}

	.month-week {
		font-size: 24rpx;
		color: $dis-text-color;
		white-space: nowrap;
		/* 不换行 */
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
		color: $dis-text-color;
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
		color: $dis-text-color;
		align-self: flex-start;
		width: 100%;
	}
</style>