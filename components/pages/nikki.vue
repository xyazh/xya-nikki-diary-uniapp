<template>
	<view class="diary-status-box" :class="{ 'diary-status-box-on': status_box_on }">
		<view class="diary-srh-line" :class="{ 'diary-srh-line-on': status_box_on }">

		</view>
		<view class="diary-status-btn-line">
			<text class="diary-status-btn">搜索</text>
			<text class="diary-status-btn">重置</text>
			<text @click="openStatus()" class="diary-status-btn">{{status_box_on ? "收起" : "展开"}}</text>
		</view>
	</view>
	<view class="diary-length-box" :class="{ 'dlb-offset': status_box_on }">
		<text class="diary-length">共{{NIKKI_LIST.length}}篇</text>
	</view>
	<view class="fixed-button" @tap="openWriter()">
		<image src="@/static/icon/ck.png" class="fixed-button-icon" mode="widthFix"></image>
	</view>
	<view v-if="!srhing" class="diary-card-box" :class="{ 'dcb-offset': status_box_on }">
		<view class="diary-card" v-for="(item,index) in NIKKI_LIST" :key="index" @tap="openItem(item)">
			<view class="card-content">
				<!-- 左侧日期 -->
				<view class="date-box">
					<text class="day">{{item.day}}</text>
					<br>
					<text class="month-week">{{item.month}}月 {{item.week}}</text>
				</view>
				<!-- 右侧内容 -->
				<view class="content-box">
					<text class="year" v-if="item.year !== CURRENT_YEAR">{{item.year}}</text>
					<text class="text" :class="{ expanded: activeId === item.id }">
						{{ item.text }}
					</text>
					<text class="time"
						@tap.stop="expandItem(item)">{{Utils.addZero(item.hours)}}:{{Utils.addZero(item.minu)}}</text>
				</view>
			</view>
		</view>
	</view>
	<view class="diary-card-box" v-if="srhing" :class="{ 'dcb-offset': status_box_on }">
		<view class="diary-card" v-for="(item,index) in NIKKI_LIST_SRH" :key="index" @tap="openItem(item)">
			<view class="card-content">
				<!-- 左侧日期 -->
				<view class="date-box">
					<text class="day">{{item.day}}</text>
					<br>
					<text class="month-week">{{item.month}}月 {{item.week}}</text>
				</view>
				<!-- 右侧内容 -->
				<view class="content-box">
					<text class="year" v-if="item.year !== CURRENT_YEAR">{{item.year}}</text>
					<text class="text" :class="{ expanded: activeId === item.id }">
						{{ item.text }}
					</text>
					<text class="time"
						@tap.stop="expandItem(item)">{{Utils.addZero(item.hours)}}:{{Utils.addZero(item.minu)}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Nikkis from '@/js/Nikkis.js'
	import Utils from '@/js/Utils.js'

	const NIKKIS = Nikkis;
	const NIKKI_LIST = NIKKIS.getNikkiList();
	const NIKKI_LIST_SRH = NIKKIS.getNikkiSrhList();
	export default {
		data() {
			return {
				NIKKIS: NIKKIS,
				Utils,
				NIKKI_LIST: NIKKI_LIST,
				NIKKI_LIST_SRH: NIKKI_LIST_SRH,
				CURRENT_YEAR: new Date().getFullYear(),
				activeId: -1,
				srhing: false,
				status_box_on: false,
			}
		},
		methods: {
			openItem(item) {
				Utils.read_nikki = item;
				Utils.switchPage("readnikki", "查看日记");
			},
			expandItem(item) {
				if (this.activeId == item.id) {
					this.activeId = -1;
				} else {
					this.activeId = item.id;
				}
			},
			openWriter() {
				Utils.switchPage("writenikki", "写日记");
			},
			openStatus() {
				this.status_box_on = !this.status_box_on;
			}
		},
		mounted() {},
	}
</script>


<style lang="scss">
	$dis-text-color: #757575;
	$diary-length-box-height: 64rpx;
	$diary-status-box-height-off: 64rpx;
	$diary-status-box-height-on: 224rpx;


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
	}

	.fixed-button-icon {
		width: 105rpx;
		height: 105rpx;
		filter: invert(100%) sepia(0%) saturate(2%) hue-rotate(233deg) brightness(106%) contrast(101%);
	}

	.diary-status-box {
		position: fixed;
		width: 100%;
		display: block;
		height: $diary-status-box-height-off;
		background-color: #fff;
		border-bottom: 1rpx solid #ddd;
		transition: height 0.3s ease;
	}

	.diary-status-box-on {
		height: $diary-status-box-height-on;
	}

	.diary-status-btn-line {
		width: 100%;
		height: $diary-status-box-height-off;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.diary-status-btn {
		font-size: 20rpx;
		margin: 0 20rpx;
		height: $diary-status-box-height-off;
		line-height: $diary-status-box-height-off;
		color: #2da7ff;
		display: flex;
		justify-content: right;
		align-items: center;
	}

	.diary-srh-line {
		width: 100%;
		background-color: #2da7ff;
		overflow: hidden;
		height: 0;
		transition: height 0.3s ease;
	}

	.diary-srh-line-on {
		height: calc($diary-status-box-height-on - $diary-status-box-height-off);
	}

	.diary-length-box {
		position: fixed;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: $diary-status-box-height-off;
		height: $diary-length-box-height;
		background-color: #fff;
		border-top: 1rpx solid #ddd;
		transition: margin-top 0.3s ease;
	}

	.diary-length {
		color: $dis-text-color;
		font-size: 26rpx;
	}

	.diary-card-box {
		margin-top: calc(5rpx + $diary-length-box-height + $diary-status-box-height-off);
		transition: margin-top 0.3s ease;
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

	.text {
		font-size: 30rpx;
		color: #333;
		line-height: 40rpx;
		margin: 5rpx 0;
		display: -webkit-box;
		-webkit-line-clamp: 10;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
	}

	.text.expanded {
		display: block;
		-webkit-line-clamp: unset;
		-webkit-box-orient: unset;
		overflow: visible;
	}

	.time {
		font-size: 24rpx;
		color: $dis-text-color;
		align-self: flex-start;
		width: 100%;
	}

	.dlb-offset {
		margin-top: $diary-status-box-height-on;
	}

	.dcb-offset {
		margin-top: calc(5rpx + $diary-length-box-height + $diary-status-box-height-on);
	}
</style>