<template>
	<view class="diary-status-box" :class="{ 'diary-status-box-on': status_box_on }">
		<view class="diary-srh-box" :class="{ 'diary-srh-line-on': status_box_on }">
			<view class="stat">
				<view class="stat-title">统计</view>
				<view class="stat-sub">- 总计</view>
				<text class="stat-line">总字数：{{COUNT_TEXT}}</text>
			</view>
			<view class="diary-srh-line" :class="{ 'diary-srh-line-on': status_box_on }">
				<input v-model="srh_text" class="diary-srh-input" placeholder="搜索" />
			</view>
		</view>
		<view class="diary-status-btn-line">
			<text v-if="status_box_on" class="diary-status-btn" @tap="srh()">搜索</text>
			<text v-if="status_box_on" class="diary-status-btn" @tap="unrsh()">重置</text>
			<text @click="openStatus()" class="diary-status-btn">{{status_box_on ? "收起" : "展开"}}</text>
		</view>
	</view>
	<view class="diary-length-box" :class="{ 'dlb-offset': status_box_on }">
		<text class="diary-length">共{{SRH_ON ? RENDER_NIKKI_LIST.length : NIKKI_LIST.length}}篇</text>
	</view>
	<view class="fixed-button" @tap="openWriter()">
		<image src="@/static/icon/ck.png" class="fixed-button-icon" mode="widthFix"></image>
	</view>
	<view v-show="!SRH_ON" v-if="loaded" class="diary-card-box" :class="{ 'dcb-offset': status_box_on }">
		<view class="diary-card" v-for="(item,index) in NIKKI_LIST" :key="item.id" @tap="openItem(item)">
			<view class="card-content">
				<view class="date-box">
					<text class="day">{{item.day}}</text>
					<br>
					<text class="month-week">{{item.month}}月 {{item.week}}</text>
				</view>
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
	<view v-show="SRH_ON" class="diary-card-box" :class="{ 'dcb-offset': status_box_on }">
		<view class="diary-card" v-for="(item,index) in RENDER_NIKKI_LIST" :key="index" @tap="openItem(item)">
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
	const RENDER_NIKKI_LIST = NIKKIS.getRenderNikkiList();
	const COUNT_TEXT = NIKKIS.getCountText();
	const SRH_ON = NIKKIS.getSrhON();
	export default {
		data() {
			return {
				NIKKIS: NIKKIS,
				Utils,
				NIKKI_LIST: NIKKI_LIST,
				RENDER_NIKKI_LIST: RENDER_NIKKI_LIST,
				COUNT_TEXT: COUNT_TEXT,
				CURRENT_YEAR: new Date().getFullYear(),
				activeId: -1,
				status_box_on: false,
				SRH_ON: SRH_ON,
				srh_text: "",
				loaded: false,
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
			},
			srh() {
				if (this.srh_text == "") {
					SRH_ON.value = false;
					return;
				}
				NIKKIS.srh(this.srh_text);
				SRH_ON.value = true;
			},
			unrsh() {
				this.srh_text = "";
				SRH_ON.value = false;
			},
		},
		mounted() {
		    setTimeout(() => {
		        this.loaded = true;
		    }, 500);
		},
		unmounted() {
			this.loaded = false;
		},
	}
</script>


<style lang="scss">
	$dis-text-color: #757575;
	$diary-length-box-height: 64rpx;
	$diary-status-box-height-off: 64rpx;
	$diary-status-box-height-on: 260rpx;


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

	.diary-srh-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		overflow: hidden;
		height: 0;
		transition: height 0.3s ease;
	}

	.diary-srh-line {
		display: flex;
		align-items: center;
		width: 100%;
	}


	.diary-srh-line-on {
		height: calc($diary-status-box-height-on - $diary-status-box-height-off);
	}

	.diary-srh-input {
		flex: 1;
		height: 28rpx;
		line-height: 28rpx;
		font-size: 26rpx;
		border: none;
		outline: none;
		border-bottom: 1rpx solid #333;
		margin: 0 20rpx;
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

	.stat {
		padding: 10rpx 20rpx;
	}

	.stat-title {
		color: #77aaff;
		font-size: 28rpx;
		margin-bottom: 10rpx;
		font-weight: bold;
	}

	.stat-sub {
		font-weight: bold;
		color: #666666;
		margin: 5rpx 0;
		font-size: 26rpx;
	}

	.stat-line {
		display: block;
		font-size: 26rpx;
		color: #666666;
		margin: 5rpx 0;
	}
</style>