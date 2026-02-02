<template>
	<view class="readviar-title-box" :class="{ 'readviar-title-box-on': title_box_on }">
		<view class="readviar-title-text-box" :class="{ 'readviar-title-text-box-on': title_box_on }">
			<view class="readviarviar-text">{{node.id}}</view>
			<view class="readviarviar-text">{{node.getTime()}}</view>
			<view class="readviarviar-text">{{node.meta}}</view>
			<view class="viar-tag-box">
				<view class="viar-tag" v-for="(tag_color,tag_name) in node.tags" :key="tag_name"
					:style="{ backgroundColor: tag_color }">
					<view class="viar-tag-text">{{ tag_name }}</view>
				</view>
			</view>
			<view class="readviarviar-title-text">{{node.title}}</view>
		</view>
		<view class="readviar-btn-line">
			<text class="readviar-title-btn" @tap="openLink()">链接</text>
			<text class="readviar-title-btn" @tap="openHigh()">上级</text>
			<text class="readviar-title-btn" @tap="openLow()">下级</text>
			<text @click="openTitle()" class="readviar-title-btn">{{title_box_on ? "收起" : "展开"}}</text>
		</view>
	</view>
	<view class="readviar-box" :class="{ 'rvcb-offset': title_box_on }" v-html="STYLE_CONTENT+node.content">
	</view>
	<view class="fixed-button" @tap="openWriter()" v-if="title_box_on">
		<image src="@/static/icon/6G.png" class="fixed-button-icon" mode="widthFix"></image>
	</view>
</template>

<script>
	import Utils from '@/js/Utils.js'
	import VIAR_TREE from '@/js/ViArTree.js'

	const STYLE_CONTENT = `
	<style>	
	hb {
		background-color: #000000;
		color: #000000;
	}
	hb:hover {
		background-color: rgba(200, 200, 200, 127);
	}</style>
	`;
	
	const SRH_TEXT = VIAR_TREE.getSrhText();

	export default {
		data() {
			return {
				Utils,
				STYLE_CONTENT,
				fullscreen: false,
				title_box_on: true,
				node: VIAR_TREE.read_viar,
				TAGS: {
					'test': '#ACCEED'
				},
				viar_reader: {
					progress: false,
					width: 600,
				},
			}
		},
		methods: {
			openWriter() {
				const TEMP_VIAR = VIAR_TREE.getTempViar();
				TEMP_VIAR.title = VIAR_TREE.read_viar.title;
				TEMP_VIAR.meta = VIAR_TREE.read_viar.meta;
				TEMP_VIAR.text = VIAR_TREE.read_viar.content;
				TEMP_VIAR.parent = VIAR_TREE.getNode(VIAR_TREE.read_viar.parent);
				if (!TEMP_VIAR.parent) {
					TEMP_VIAR.parent = VIAR_TREE.getNode("root");
				}
				for (let node_id of VIAR_TREE.read_viar.links) {
					TEMP_VIAR.links.push(VIAR_TREE.getNode(node_id));
				}
				Utils.clearObj(TEMP_VIAR.tags);
				Object.assign(TEMP_VIAR.tags,VIAR_TREE.read_viar.tags);
				TEMP_VIAR.id = VIAR_TREE.read_viar.id;
				Utils.switchPage("writeviar", "写故事");
			},
			openTitle() {
				this.title_box_on = !this.title_box_on;
			},
			openHigh(){
				VIAR_TREE.clearRenderList();
				const RENDER_LIST = VIAR_TREE.getRenderList();
				let node = VIAR_TREE.getNode(VIAR_TREE.read_viar.parent);
				if(node){
					RENDER_LIST.push(node);
				}
				Utils.switchPage("viar", "故事集");
				SRH_TEXT.value ="查看父级:" + VIAR_TREE.read_viar.format();
			},
			openLow(){
				VIAR_TREE.clearRenderList();
				const RENDER_LIST = VIAR_TREE.getRenderList();
				for(let node_id of VIAR_TREE.getNodesWithChild(VIAR_TREE.read_viar)){
					let node = VIAR_TREE.getNode(node_id);
					if(!node){
						continue;
					}
					RENDER_LIST.push(node);
				}
				Utils.switchPage("viar", "故事集");
				SRH_TEXT.value = "查看子级:" + VIAR_TREE.read_viar.format();
			},
			openLink(){
				VIAR_TREE.clearRenderList();
				const RENDER_LIST = VIAR_TREE.getRenderList();
				for(let node_id of VIAR_TREE.read_viar.links){
					let node = VIAR_TREE.getNode(node_id);
					if(!node){
						continue;
					}
					RENDER_LIST.push(node);
				}
				Utils.switchPage("viar", "故事集");
				SRH_TEXT.value = "查看链接:" + VIAR_TREE.read_viar.format();
			},
		},
		mounted() {
		},
		unmounted() {},
	}
</script>

<style lang="scss">
	$dis-text-color: #757575;
	$readviar-length-box-height: 5rpx;
	$readviar-status-box-height-off: 64rpx;
	$readviar-status-box-height-on: 220rpx;

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

	.readviar-title-box {
		position: fixed;
		width: 100%;
		display: block;
		height: $readviar-status-box-height-off;
		background-color: #fff;
		border-bottom: 1rpx solid #ddd;
		transition: height 0.3s ease;
	}

	.readviar-title-box-on {
		height: $readviar-status-box-height-on;
	}

	.readviar-title-text-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: hidden;
		height: 0;
		transition: height 0.3s ease;
	}

	.readviar-title-text-box-on {
		height: calc($readviar-status-box-height-on - $readviar-status-box-height-off);
	}

	.readviar-btn-line {
		width: 100%;
		height: $readviar-status-box-height-off;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.readviar-title-btn {
		font-size: 20rpx;
		margin: 0 20rpx;
		height: $readviar-status-box-height-off;
		line-height: $readviar-status-box-height-off;
		color: #2da7ff;
		display: flex;
		justify-content: right;
		align-items: center;
	}

	.readviarviar-text {
		font-size: 16rpx;
		color: $dis-text-color;
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

	.readviarviar-title-text {
		margin-top: 10rpx;
		display: flex;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		color: #000;
		align-items: center;
		justify-content: center;
		font-size: 38rpx;
	}

	.readviar-box {
		width: 100%;
		margin-top: calc(5rpx + $readviar-length-box-height + $readviar-status-box-height-off);
		transition: margin-top 0.3s ease;
		font-size: 30rpx;
		line-height: 40rpx;
	}

	.rvcb-offset {
		margin-top: calc(5rpx + $readviar-length-box-height + $readviar-status-box-height-on);
	}
</style>