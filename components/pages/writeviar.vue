<template>
	<input class="viar-title-input" v-model="TEMP_VIAR.title" placeholder="标题" />
	<!-- 工具栏 -->
	<view v-show="input_mode">
		<view class="editor-toolbar">
			<view class="editor-toolbar__item" @click="setBold">
				<text class="editor-toolbar__text bold">B</text>
			</view>

			<view class="editor-toolbar__item" @click="setItalic">
				<text class="editor-toolbar__text italic">I</text>
			</view>

			<view class="editor-toolbar__item" @click="setStrike">
				<text class="editor-toolbar__text delete">划去</text>
			</view>

			<view class="editor-toolbar__item" @click="setSpoiler">
				<text class="editor-toolbar__text">防剧透</text>
			</view>
		</view>
		<editor id="editor" class="viar-editor" :class="{ 'viar-editor-full': full }" placeholder="写些什么罢"
			@ready="onEditorReady" @input="onEditorInput"></editor>
	</view>
	<textarea v-show="!input_mode" v-model="TEMP_VIAR.text" class="viar-editor" :class="{ 'viar-editor-full': full }"
		placeholder="写些什么罢" :maxlength="-1"></textarea>
	<view class="divider"></view>
	<view class="writeviar-btn-line">
		<text class="writeviar-title-btn" @tap="smode()">切换</text>
		<text class="writeviar-title-btn" @tap="sfull()">全屏</text>
	</view>
	<text class="viar-srh-title">Tags</text>
	<view class="viar-srh-line">
		<input v-model="srh_tag" class="viar-srh-input" placeholder="搜索或创建" />
		<text class="writeviar-title-btn" @tap="srhTag()">搜索</text>
	</view>
	<view class="viar-tag-box">
		<view class="viar-tag" v-for="(tag_color,tag_name) in RENDER_TAGS" :key="tag_name"
			:style="{ backgroundColor: tag_color }" @tap="selectSrhTag(tag_name)">
			<view class="viar-tag-text">{{ tag_name }}</view>
		</view>
	</view>
	<view class="viar-tag-box">
		<view class="viar-tag" v-for="(tag_color,tag_name) in TEMP_VIAR.tags" :key="tag_name"
			:style="{ backgroundColor: tag_color }" @tap="unSelectSrhTag(tag_name)">
			<view class="viar-tag-text">{{ tag_name }}</view>
		</view>
	</view>
	<view class="divider"></view>
	<view class="writeviar-node">{{TEMP_VIAR.parent.format()}}</view>
	<text class="writeviar-btn" @tap="selectParent()">父节点</text>
	<view class="divider"></view>
	<view v-for="(node,index) in TEMP_VIAR.links" :key="node.id" class="writeviar-node" @tap="unSelectLink(node,index)">
		{{node.format()}}
	</view>
	<text class="writeviar-btn" @tap="selectLink()">链接</text>
	<view class="divider"></view>
	<input class="viar-meta-input" v-model="TEMP_VIAR.meta" placeholder="编辑meta" />
	<view class="fixed-button" @tap="viarSave()">
		<image src="@/static/icon/8z.png" class="fixed-button-icon" mode="widthFix"></image>
	</view>
</template>

<script>
	import Utils from '@/js/Utils.js'
	import VIAR_TREE from '@/js/ViArTree.js'
	import {
		ref,
		reactive,
		shallowReactive
	} from "vue"

	const RENDER_LIST = VIAR_TREE.getRenderList();
	const RENDER_TAGS = VIAR_TREE.getRenderTags();
	const TAGS = VIAR_TREE.getTags();
	const TEMP_VIAR = VIAR_TREE.getTempViar();

	export default {
		data() {
			return {
				Utils,
				srh_tag: "",
				full: false,
				editorCtx: null,
				syncing: false,
				input_mode: false,
				RENDER_LIST,
				RENDER_TAGS,
				TEMP_VIAR,
			}
		},
		methods: {
			smode() {
				this.input_mode = !this.input_mode;
			},
			sfull() {
				this.full = !this.full;
			},
			selectParent() {
				VIAR_TREE.last_page = ["writeviar", "写故事"];
				VIAR_TREE.srhing_node = null;
				VIAR_TREE.srhing_mode = true;
				VIAR_TREE.srhing_code = 1;
				Utils.switchPage("viar", "故事集");
			},
			selectLink() {
				VIAR_TREE.last_page = ["writeviar", "写故事"];
				VIAR_TREE.srhing_node = null;
				VIAR_TREE.srhing_mode = true;
				VIAR_TREE.srhing_code = 2;
				Utils.switchPage("viar", "故事集");
			},
			unSelectLink(node, index) {
				TEMP_VIAR.links.splice(index, 1);
			},
			viarSave() {
				let html = TEMP_VIAR.text || '';
				const count = (html.match(/■/g) || []).length;
				if (count % 2 === 1) {
					const pIndex = html.lastIndexOf('</p>');
					if (pIndex !== -1) {
						html = html.slice(0, pIndex) + '■' + html.slice(pIndex);
					} else {
						html += '■';
					}
				}
				let open = false;
				html = html.replace(/■/g, () => {
					open = !open
					return open ? '<hb>' : '</hb>';
				})
				if (TEMP_VIAR.id !== null) {
					if (html == "") {
						VIAR_TREE.delNode(TEMP_VIAR.id);
					} else if (TEMP_VIAR.title == "") {
						VIAR_TREE.delNode(TEMP_VIAR.id);
					} else {
						VIAR_TREE.updateNode(
							TEMP_VIAR.id,
							TEMP_VIAR.parent,
							TEMP_VIAR.title,
							html,
							Object.keys(TEMP_VIAR.tags),
							TEMP_VIAR.links,
							TEMP_VIAR.meta
						);
					}
				} else {
					if (html == "") {
						
					} else if (TEMP_VIAR.title == "") {
						
					} else {
						VIAR_TREE.newNode(
							TEMP_VIAR.parent,
							TEMP_VIAR.title,
							html,
							Object.keys(TEMP_VIAR.tags),
							TEMP_VIAR.links,
							TEMP_VIAR.meta
						);
					}
				}
				VIAR_TREE.save()
					.initRenderList();
				TEMP_VIAR.title = "";
				TEMP_VIAR.meta = "";
				TEMP_VIAR.text = "";
				TEMP_VIAR.links.length = 0;
				Utils.clearObj(TEMP_VIAR.tags);
				TEMP_VIAR.parent = VIAR_TREE.getNode("root");
				TEMP_VIAR.id = null;
				Utils.switchPage("viar", "故事集");
			},
			selectSrhTag(tag_name) {
				TEMP_VIAR.tags[tag_name] = TAGS[tag_name];
			},
			unSelectSrhTag(tag_name) {
				delete TEMP_VIAR.tags[tag_name];
			},
			srhTag() {
				if (this.srh_tag == "") {
					VIAR_TREE.renderTagsIdentity();
					return;
				}
				VIAR_TREE.searchTag(this.srh_tag, true);
			},
			onEditorReady() {
				uni.createSelectorQuery()
					.select('#editor')
					.context(res => {
						this.editorCtx = res.context;
						try {
							this.editorCtx.setContents({
								html: TEMP_VIAR.text,
								success: () => {
									this.syncing = false;
								}
							})
						} catch (e) {
							this.syncing = false;
							return;
						}
					})
					.exec();
			},
			onEditorInput(e) {
				if (this.syncing) return;
				this.syncing = true;
				TEMP_VIAR.text = e.detail.html || '';
				this.$nextTick(() => {
					this.syncing = false;
				})
			},
			setBold() {
				this.editorCtx && this.editorCtx.format('bold');
			},

			setItalic() {
				this.editorCtx && this.editorCtx.format('italic');
			},

			setStrike() {
				this.editorCtx && this.editorCtx.format('strike');
			},
			setSpoiler() {
				if (!this.editorCtx) return;
				this.editorCtx.insertText({
					text: '■',
				});
			},
		},
		watch: {
			'TEMP_VIAR.text'(val) {
				if (this.syncing) return;
				if (!this.editorCtx) return;
				this.syncing = true;
				try {
					this.editorCtx.setContents({
						html: val,
						success: () => {
							this.syncing = false;
						}
					})
				} catch (e) {
					this.syncing = false;
					return;
				}
			}
		},
		mounted() {
			while (VIAR_TREE.srhing_mode) {
				if (!VIAR_TREE.srhing_node) {
					break;
				}
				if (VIAR_TREE.srhing_code == 1) {
					TEMP_VIAR.parent = VIAR_TREE.srhing_node;
				} else if (VIAR_TREE.srhing_code == 2) {
					TEMP_VIAR.links.push(VIAR_TREE.srhing_node);
				}
				VIAR_TREE.srhing_mode = false;
				VIAR_TREE.srhing_node = null;
				VIAR_TREE.srhing_node = 0;
				break;
			}

		},
	}
</script>

<style lang="scss">
	.viar-title-input {
		font-size: 38rpx;
		height: 40rpx;
		line-height: 40rpx;
		margin: 20rpx 10rpx;
		border-bottom: 1px solid #111;
	}

	.viar-meta-input {
		font-size: 22rpx;
		height: 3rpx;
		line-height: 30rpx;
		margin: 20rpx 10rpx;
		border-bottom: 1px solid #111;
	}

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

	.writeviar-node {
		font-size: 20rpx;
		margin: 20rpx 0;
		height: 22rpx;
		line-height: 22rpx;
		color: #333;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.writeviar-btn-line {
		width: 100%;
		height: 64rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.writeviar-title-btn {
		font-size: 20rpx;
		margin: 0 20rpx;
		height: 64rpx;
		line-height: 64rpx;
		color: #2da7ff;
		display: flex;
		justify-content: right;
		align-items: center;
	}

	.writeviar-btn {
		font-size: 20rpx;
		margin: 0 10rpx;
		height: 64rpx;
		line-height: 64rpx;
		color: #2da7ff;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.divider {
		height: 1px;
		background-color: #333;
		margin: 1px 10rpx;
	}

	.viar-editor {
		width: 100%;
		min-height: 50vh;
		font-size: 30rpx;
		line-height: 40rpx;
		color: #000;
		margin: 10rpx;
	}

	.viar-editor-full {
		width: 100vh;
		height: 100vh;
	}

	.editor-toolbar {
		height: 30px;
		line-height: 30px;
		margin: 20rpx 0;
		width: 100%;
		display: flex;
		align-items: center;
		background-color: #ececec;
		font-size: 16px;
		color: #525252;
	}

	.editor-toolbar__item {
		padding: 0 6px;
		cursor: pointer;
		white-space: nowrap;
		margin: 0 10rpx;
	}

	.editor-toolbar__text {
		display: inline-block;
	}

	/* 语义样式 */
	.editor-toolbar__text.bold {
		font-weight: bold;
	}

	.editor-toolbar__text.italic {
		font-style: italic;
	}

	.editor-toolbar__text.delete {
		text-decoration: line-through;
	}

	.viar-srh-title {
		display: block;
		font-size: 20rpx;
		color: #666666;
		margin: 10rpx 20rpx 0 20rpx;
	}

	.viar-srh-line {
		display: flex;
		align-items: center;
		width: 100%;
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
</style>