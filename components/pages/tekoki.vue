<template>
	<view class="tekoki-dl-mask" :class="{ 'tekoki-dl-mask-show': tekoki_dl_mask}" @click="closeDl()">
	</view>
	<view v-if="tekoki_dl1" class="tekoki-dl1">
		<view class="tekoki-dl-bar">
			<view class="tekoki-dl-bar-title">选择</view>
		</view>
		<view class="tekoki-dl-bar-body">
			<view v-for="(event,index) in TEKOKI_EVENTS" :key="index" class="events-item" @click="onEventsClick(event)">
				{{ event }}
			</view>
		</view>
	</view>
	<view v-if="tekoki_dl2" class="tekoki-dl1">
		<view class="tekoki-dl-bar">
			<view class="tekoki-dl-bar-title">记录</view>
		</view>
		<view class="tekoki-dl-bar-body1">
			<input type="number" v-model="text1" class="tekoki-dis-input" placeholder="次数" />
			<input type="number" v-model="text2" class="tekoki-dis-input" placeholder="次数增量" />
			<view class="tekoki-combo tekoki-dis-input">
				<input class="tekoki-combo-input" v-model="text3" placeholder="请选择或输入事件" @focus="show = true"
					@blur="onBlur" />
				<text class="tekoki-combo-arrow">▼</text>
				<view class="tekoki-panel" v-if="show">
					<view v-for="item in TEKOKI_EVENTS" :key="item" class="tekoki-panel-item"
						@mousedown.prevent="select(item)">
						{{ item }}
					</view>
				</view>
			</view>
		</view>
		<view class="tekoki-footer">
			<view class="tekoki-add-btn" @click="onCancel">取消</view>
			<view class="tekoki-add-btn" @click="onConfirm">确定</view>
		</view>
	</view>
	<view class="ym-bar">
		<view class="ym-item">
			<view class="arrow" @click="lastYear()">＜</view>
			<picker mode="date" fields="year" :value="on_year + '-01-01'" @change="onYearChange">
				<view class="y-text">{{ on_year }}年</view>
			</picker>
			<view class="arrow" @click="nextYear()">＞</view>
		</view>
		<view class="ym-item">
			<view class="arrow" @click="lastMonth()">＜</view>
			<picker mode="date" fields="month" :value="on_year + '-' + on_month + '-01'" @change="onMonthChange">
				<view class="m-text">{{ on_month }}月</view>
			</picker>
			<view class="arrow" @click="nextMonth()">＞</view>
		</view>
	</view>

	<view class="month-summary">
		本月共{{TEKOKI_DATA.count_month_day}}天 {{TEKOKI_DATA.count_month_count}}次
	</view>
	<view class="calendar-box">
		<view class="week-row">
			<text v-for="w in ['日','一','二','三','四','五','六']" :key="w" class="week-item">
				{{ w }}
			</text>
		</view>
		<view class="calendar">
			<view v-for="d in TEKOKI_TABLE" :key="d.id" class="calendar-day" @click="openDl2(d)">
				<view class="calendar-day-bg" :style="{ '--rate': d.rate }"></view>
				<text class="calendar-day-text">{{ d.day }}</text>
			</view>
		</view>
	</view>
	<view class="btn-wrap">
		<view class="tekoki-btn" @click="openDl1()">{{tekoking_event}}</view>
	</view>
	<view class="stat">
		<view class="stat-title">统计</view>
		<view class="stat-sub">- 总计</view>
		<text class="stat-line">总年数：{{TEKOKI_DATA.count_all_year}}</text>
		<text class="stat-line">总月数：{{TEKOKI_DATA.count_all_month}}</text>
		<text class="stat-line">总天数：{{TEKOKI_DATA.count_all_day}}</text>
		<text class="stat-line">总次数：{{TEKOKI_DATA.count_all_count}}</text>
		<text class="stat-line">总单日最高：{{TEKOKI_DATA.all_day_max}}</text>
		<text class="stat-line">首日至今：{{TEKOKI_DATA.first_today}}</text>
		<text class="stat-line">最近至今：{{TEKOKI_DATA.last_today}}</text>
		<text class="stat-line">区间：{{TEKOKI_DATA.first_today-TEKOKI_DATA.last_today}}</text>
		<view class="stat-sub">- 按年</view>
		<text class="stat-line">年日数：{{TEKOKI_DATA.count_year_day}}</text>
		<text class="stat-line">年次数：{{TEKOKI_DATA.count_year_count}}</text>
		<text class="stat-line">年单日最高：{{TEKOKI_DATA.year_day_max}}</text>
		<view class="stat-sub">- 按月</view>
		<text class="stat-line">月日数：{{TEKOKI_DATA.count_month_day}}</text>
		<text class="stat-line">月次数：{{TEKOKI_DATA.count_month_count}}</text>
		<text class="stat-line">月单日最高：{{TEKOKI_DATA.month_day_max}}</text>
	</view>
</template>


<script>
	import Tekoki from '@/js/Tekoki.js'
	import Utils from '@/js/Utils.js'

	let now = new Date();

	export default {
		data() {
			return {
				TEKOKI: Tekoki,
				TEKOKI_TABLE: Tekoki.getTekokiTable(),
				TEKOKI_DATA: Tekoki.getTekokiData(),
				TEKOKI_EVENTS: Tekoki.getTekokiEvents(),
				tekoki_dl_mask: false,
				tekoki_dl1: false,
				tekoki_dl2: false,
				tekoking_event: "默认",
				on_year: now.getFullYear(),
				on_month: now.getMonth() + 1,
				on_day: 1,
				text1: '',
				text2: '',
				text3: '默认',
				show: false,
			}
		},
		methods: {
			openDl1() {
				this.tekoki_dl_mask = true;
				this.tekoki_dl1 = true;
			},
			openDl2(d) {
				if (d.day == "") {
					return
				}
				let on_day = parseInt(d.day);
				if (isNaN(on_day)) {
					return;
				}
				if (on_day < 1 || on_day > 31) {
					return;
				}
				this.on_day = on_day;
				this.tekoki_dl_mask = true;
				this.tekoki_dl2 = true;
				this.text1 = d.count;
				this.text3 = this.tekoking_event;
			},
			closeDl() {
				this.tekoki_dl_mask = false;
				this.tekoki_dl1 = false;
				this.tekoki_dl2 = false;
			},
			onEventsClick(event) {
				this.tekoking_event = event;
				this.closeDl();
				Tekoki.setTekokiTable(
					this.tekoking_event,
					this.on_year,
					this.on_month
				);
			},
			lastMonth() {
				let on_month = this.on_month - 1;
				if (on_month <= 0) {
					this.on_year -= 1;
					on_month = 12;
				}
				this.on_month = on_month;
				Tekoki.setTekokiTable(
					this.tekoking_event,
					this.on_year,
					this.on_month
				);
			},
			nextMonth() {
				let on_month = this.on_month + 1;
				if (on_month >= 13) {
					this.on_year += 1;
					on_month = 1;
				}
				this.on_month = on_month;
				Tekoki.setTekokiTable(
					this.tekoking_event,
					this.on_year,
					this.on_month
				);
			},
			lastYear() {
				this.on_year -= 1;
				Tekoki.setTekokiTable(
					this.tekoking_event,
					this.on_year,
					this.on_month
				);
			},
			nextYear() {
				this.on_year += 1;
				Tekoki.setTekokiTable(
					this.tekoking_event,
					this.on_year,
					this.on_month
				);
			},
			onYearChange(e) {
				const year = e.detail.value.split('-')[0]
				this.on_year = Number(year)
				Tekoki.setTekokiTable(
					this.tekoking_event,
					this.on_year,
					this.on_month
				);
			},
			onMonthChange(e) {
				const parts = e.detail.value.split('-')
				this.on_year = Number(parts[0])
				this.on_month = Number(parts[1])
				Tekoki.setTekokiTable(
					this.tekoking_event,
					this.on_year,
					this.on_month
				);
			},
			select(val) {
				this.text3 = val;
				this.show = false;
			},
			onBlur() {
				setTimeout(() => {
					this.show = false;
				}, 200)
			},
			onCancel() {
				this.closeDl();
			},
			onConfirm() {
				this.tekoking_event = this.text3;
				Tekoki.add(
						this.text3,
						this.on_year,
						this.on_month, 
						this.on_day,
						Number(this.text1) + Number(this.text2))
					.save()
					.setTekokiTable(
						this.tekoking_event,
						this.on_year,
						this.on_month
					);
				this.text2 = "";
				this.closeDl();
			},
		},
		mounted() {
			Tekoki.setTekokiTable(
				this.tekoking_event,
				this.on_year,
				this.on_month
			);
		}
	}
</script>

<style lang="scss">
	$dis-text-color: #757575;
	$topbar-height: 110rpx;

	.tekoki-dl-mask {
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

	.tekoki-dl-mask-show {
		background-color: rgba(0, 0, 0, 0.4);
		transition: background-color 0.3s ease;
		pointer-events: auto;
	}

	.tekoki-dl-bar {
		display: flex;
		align-items: center;
		width: 100%;
		height: $topbar-height;
		background-color: #77aaff;
		color: #ffffff;
	}

	.tekoki-dl-bar-body {
		width: 100%;
		height: calc(100% - $topbar-height);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.tekoki-dl-bar-body1 {
		width: 100%;
		height: calc(100% - $topbar-height - 110rpx);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.tekoki-dl-bar-title {
		flex: 1;
		font-size: 36rpx;
		margin-left: 42rpx;
	}

	.tekoki-dl1 {
		position: fixed;
		left: 80rpx;
		top: 380rpx;
		right: 80rpx;
		bottom: 380rpx;
		background-color: #fff;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.2);
		z-index: 5;
	}

	.events-item {
		display: flex;
		width: 100%;
		height: 90rpx;
		padding: 0 30rpx;
		align-items: center;
		font-size: 28rpx;
		color: $dis-text-color;
		border-bottom: 1rpx solid #ddd;
	}

	.tekoki-dis-input {
		border-bottom: 1rpx solid #000;
		height: 36rpx;
		line-height: 36rpx;
		font-size: 30rpx;
		margin: 40rpx 10rpx;
	}

	.tekoki-combo {
		position: relative;
		font-size: 30rpx;
		padding-bottom: 8rpx;
	}

	.tekoki-combo-input {
		width: 100%;
		padding-right: 40rpx;
		font-size: 30rpx;
		box-sizing: border-box;
		border: none;
		background: transparent;
	}

	.tekoki-combo-arrow {
		position: absolute;
		right: 1rpx;
		padding: 0;
		margin: 0;
		top: 50%;
		font-size: 24rpx;
		transform: translateY(-50%);
		color: #666;
		pointer-events: none;
	}

	.tekoki-panel {
		position: absolute;
		left: 0;
		right: 0;
		max-height: 25vh;
		background: #fff;
		border: 1px solid #ddd;
		z-index: 6;
		overflow-y: auto;
		overflow-x: hidden;
		box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.2);
	}

	.tekoki-panel-item {
		padding: 16rpx;
		width: 100%;
	}

	.tekoki-footer {
		width: 100%;
		height: 110rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.tekoki-add-btn {
		min-width: 120rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		border-radius: 28rpx;
		font-size: 26rpx;
		margin: auto 5rpx;
		color: #2da7ff;
	}

	/* 年月 */
	.ym-bar {
		display: flex;
		justify-content: center;
		margin-top: 20rpx;
	}

	.ym-item {
		display: flex;
		align-items: center;
		margin: 0 30rpx;
		font-size: 30rpx;
	}

	.arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #666666;
		font-size: 30rpx;
		width: 75rpx;
		font-weight: 500;
		text-shadow: 0.5rpx 0 0 currentColor;
	}

	.y-text {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 150rpx;
		color: #666666;
		font-weight: 500;
		text-shadow: 0.5rpx 0 0 currentColor;

	}

	.m-text {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 112rpx;
		color: #666666;
		font-weight: 500;
		text-shadow: 0.5rpx 0 0 currentColor;
	}

	/* 本月统计 */
	.month-summary {
		text-align: center;
		color: $dis-text-color;
		margin: 20rpx 0;
		font-size: 26rpx;
	}

	.calendar-box {
		margin: 0 20rpx 20rpx 20rpx;
	}

	/* 星期 */
	.week-row {
		display: flex;
		justify-content: space-around;
		padding: 10rpx 0;
	}

	.week-item {
		width: 14%;
		text-align: center;
		color: $dis-text-color;
		font-size: 30rpx;
	}

	/* 日历 */
	.calendar {
		display: flex;
		flex-wrap: wrap;
	}

	.calendar-day {
		position: relative;
		/* 新增 */
		width: 14.2857%;
		margin-top: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.calendar-day-bg {
		position: absolute;
		bottom: 0;
		width: 48rpx;
		height: calc(var(--rate) * 100%);
		background-color: #77aaff;
		transition: height 0.3s ease;
	}

	.calendar-day-text {
		position: relative;
		font-size: 30rpx;
		color: $dis-text-color;
	}


	/* 按钮 */
	.btn-wrap {
		display: flex;
		justify-content: left;
		margin: 60rpx 0 0 0;
		padding-bottom: 18rpx;
		width: 100%;
		border-bottom: 1rpx solid #aaa;
	}

	.tekoki-btn {
		width: 160rpx;
		height: 75rpx;
		margin-left: 54rpx;
		background: #2da7ff;
		color: #fff;
		text-align: center;
		line-height: 75rpx;
		border-radius: 2rpx;
		font-size: 28rpx;
		box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.2);
	}

	/* 统计 */
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