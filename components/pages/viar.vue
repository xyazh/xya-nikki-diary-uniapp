<template>
	<view class="viar-status-box" :class="{ 'viar-status-box-on': status_box_on }">
		<view class="viar-srh-box" :class="{ 'viar-srh-line-on': status_box_on }">
			<view class="stat">
				<view class="stat-title">统计</view>
				<view class="stat-sub">- 总计</view>
				<text class="stat-line">故事数：{{RENDER_LIST.length}}</text>
			</view>
			<view class="line"></view>
			<text class="viar-srh-title">搜索条件</text>
			<view class="viar-srh-line" :class="{ 'viar-srh-line-on': status_box_on }">
				<input v-model="srh_text" class="viar-srh-input" placeholder="搜索" />
			</view>
			<text class="viar-srh-title">Tags</text>
			<view class="viar-srh-line" :class="{ 'viar-srh-line-on': status_box_on }">
				<input v-model="srh_tag" class="viar-srh-input" placeholder="搜索" />
				<text class="viar-status-btn" @tap="srhTag()">搜索</text>
			</view>
			<view class="viar-tag-box">
				<view class="viar-tag" v-for="(tag_color,tag_name) in RENDER_TAGS" :key="tag_name"
					:style="{ backgroundColor: tag_color }" @tap="selectSrhTag(tag_name)">
					<view class="viar-tag-text">{{ tag_name }}</view>
				</view>
			</view>
			<view class="viar-tag-box">
				<view class="viar-tag" v-for="(tag_color,tag_name) in SRHING_TAGS" :key="tag_name"
					:style="{ backgroundColor: tag_color }" @tap="unSelectSrhTag(tag_name)">
					<view class="viar-tag-text">{{ tag_name }}</view>
				</view>
			</view>
		</view>
		<view class="viar-status-btn-line">
			<text v-if="status_box_on" class="viar-status-btn" @tap="unrsh()">重置</text>
			<text v-if="status_box_on" class="viar-status-btn" @tap="srh()">搜索</text>
			<text @click="openStatus()" class="viar-status-btn">{{status_box_on ? "收起" : "展开"}}</text>
		</view>
	</view>
	<view class="fixed-button" @tap="openWriter()">
		<image src="@/static/icon/ck.png" class="fixed-button-icon" mode="widthFix"></image>
	</view>
	<view class="viar-card-box" :class="{ 'vcb-offset': status_box_on }">
		<view class="viar-card" v-for="(item,index) in RENDER_LIST" :key="item.id" @tap="openItem(item.id)">
			<view class="viar-text">{{item.time}}</view>
			<view class="viar-title">{{item.title}}</view>
			<view class="viar-text">{{item.meta}}</view>
			<view class="line"></view>
			<view class="viar-text">Tags</view>
			<view class="viar-tag-box">
				<view class="viar-tag" v-for="(tag_color,tag_name) in item.tags" :key="tag_name"
					:style="{ backgroundColor: tag_color }">
					<view class="viar-tag-text">{{ tag_name }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Utils from '@/js/Utils.js'
	import VIAR_TREE from '@/js/ViArTree.js'


	const RENDER_LIST = VIAR_TREE.getRenderList();
	const RENDER_TAGS = VIAR_TREE.getRenderTags();
	const SRHING_TAGS = VIAR_TREE.getSthingTag();
	const TAGS = VIAR_TREE.getTags();

	export default {
		data() {
			return {
				Utils: Utils,
				RENDER_LIST: RENDER_LIST,
				RENDER_TAGS: RENDER_TAGS,
				SRHING_TAGS: SRHING_TAGS,
				status_box_on: false,
				srh_text: "",
				srh_tag: "",
			}
		},
		methods: {
			openItem(id) {
				VIAR_TREE.read_viar = VIAR_TREE.getNode(id);
				Utils.switchPage("readviar", "查看故事");
			},
			openWriter() {
				Utils.switchPage("writeviar", "写故事");
			},
			openStatus() {
				this.status_box_on = !this.status_box_on;
			},
			srh() {
				VIAR_TREE.useSearch(this.srh_text);
			},
			unrsh() {
				this.srh_text = "";
				this.srh_tag = "";
				VIAR_TREE.renderTagsIdentity();
				Utils.clearObj(SRHING_TAGS);
				VIAR_TREE.initRenderList();
			},
			selectSrhTag(tag_name) {
				SRHING_TAGS[tag_name] = TAGS[tag_name];
			},
			unSelectSrhTag(tag_name) {
				delete SRHING_TAGS[tag_name];
			},
			srhTag() {
				if (this.srh_tag == "") {
					VIAR_TREE.renderTagsIdentity();
					return;
				}
				VIAR_TREE.searchTag(this.srh_tag);
			},
		},
		mounted() {},
		unmounted() {},
	}
</script>


<style lang="scss">
	$dis-text-color: #757575;
	$viar-length-box-height: 5rpx;
	$viar-status-box-height-off: 64rpx;
	$viar-status-box-height-on: 540rpx;

	.line {
		width: 100%;
		height: 0;
		padding: 0;
		margin: 0;
		border-top: 1rpx solid #ddd;
	}

	.viar-tag-box {
		display: flex;
		align-items: center;
		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;
		width: 100%;
		height: 100%;
		max-height: 28px;
		margin-top: 10rpx;
		-webkit-overflow-scrolling: touch;
	}

	.viar-tag {
		height: 32rpx;
		display: flex;
		margin: 0 5rpx;
		align-items: center;
		justify-content: center;
	}

	.viar-tag-text {
		line-height: normal;
		margin: 3rpx 8rpx;
		font-size: 22rpx;
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

	.viar-status-box {
		position: fixed;
		width: 100%;
		display: block;
		height: $viar-status-box-height-off;
		background-color: #fff;
		border-bottom: 1rpx solid #ddd;
		transition: height 0.3s ease;
	}

	.viar-status-box-on {
		height: $viar-status-box-height-on;
	}

	.viar-status-btn-line {
		width: 100%;
		height: $viar-status-box-height-off;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.viar-status-btn {
		font-size: 20rpx;
		margin: 0 20rpx;
		height: $viar-status-box-height-off;
		line-height: $viar-status-box-height-off;
		color: #2da7ff;
		display: flex;
		justify-content: right;
		align-items: center;
	}

	.viar-srh-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
		height: 0;
		transition: height 0.3s ease;
	}

	.viar-srh-line {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.viar-srh-title {
		display: block;
		font-size: 20rpx;
		color: #666666;
		margin: 10rpx 20rpx 0 20rpx;
	}


	.viar-srh-line-on {
		height: calc($viar-status-box-height-on - $viar-status-box-height-off);
	}

	.viar-srh-input {
		flex: 1;
		height: 26rpx;
		line-height: 26rpx;
		font-size: 24rpx;
		border: none;
		outline: none;
		border-bottom: 1rpx solid #333;
		margin: 0 20rpx;
	}

	.viar-length-box {
		position: fixed;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: $viar-status-box-height-off;
		height: $viar-length-box-height;
		background-color: #fff;
		border-top: 1rpx solid #ddd;
		transition: margin-top 0.3s ease;
	}

	.viar-length {
		color: $dis-text-color;
		font-size: 26rpx;
	}

	.viar-card-box {
		margin-top: calc(5rpx + $viar-length-box-height + $viar-status-box-height-off);
		transition: margin-top 0.3s ease;
	}

	.viar-card {
		background-color: #fff;
		margin-bottom: 10rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;
		border-radius: 2rpx;
		padding: 10rpx;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
	}

	.viar-text {
		font-size: 24rpx;
		color: $dis-text-color;
	}

	.viar-title {
		font-size: 45rpx;
		color: #000;
	}

	.vcb-offset {
		margin-top: calc(5rpx + $viar-length-box-height + $viar-status-box-height-on);
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