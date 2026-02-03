import Utils from '@/js/Utils.js'
import DataManager from '@/js/DataManager.js'
import ViArNode from '@/js/ViArNode.js'
import {
	ref,
	reactive,
	shallowReactive
} from "vue"

const DM = new DataManager("viar");



const RENDER_LIST = reactive([]);
const RENDER_TAGS = reactive({});
const SRHING_TAGS = reactive({});
const TAGS = {};

const SRH_TEXT = ref("");


const ViArTree = function() {
	this._root = ViArNode.newRootNode();
	this.node_map = {};

	this.read_viar = null;
	this.temp_viar = null;

	this.tags = TAGS;

	this.srhing_mode = false;
	this.srhing_node = null;
	this.srhing_code = 0;
	this.last_page = [];

	this.renderTagsIdentity = () => {
		Utils.clearObj(RENDER_TAGS);
		Object.assign(RENDER_TAGS, this.tags);
		return this;
	}

	this.addDisTags = () => {
		this.tags["无"] = Utils.invertColor(Utils.md5("无"));
		this.tags["root"] = Utils.invertColor(Utils.md5("root"));
		this.renderTagsIdentity();
	}

	this.addDisTags();

	this.getRenderList = () => {
		return RENDER_LIST;
	}

	this.getRenderTags = () => {
		return RENDER_TAGS;
	}

	this.getSrhText = () => {
		return SRH_TEXT;
	}

	this.getTempViar = () => {
		return TEMP_VIAR;
	}

	this.initRenderList = () => {
		this.clearRenderList();
		this.forEachNode((node) => {
			if (node instanceof ViArNode) {
				RENDER_LIST.push(node.getRenderNode());
			}
		});
	};

	this.getRoot = () => {
		return this._root;
	}

	this.getTags = () => {
		return this.tags;
	}

	this.getSthingTag = () => {
		return SRHING_TAGS;
	}

	this.clearRenderList = () => {
		if (RENDER_LIST.length > 1) {
			RENDER_LIST.length = 1;
		}
		if (RENDER_LIST.length = 1) {
			RENDER_LIST.pop();
		}
	}


	this.getRenderList = () => {
		return RENDER_LIST;
	}

	this.useNodeLinks = (node) => {
		this.clearRenderList();
		if (typeof node == "string") {
			node = this.getNode(node);
		}
		if (!(node instanceof ViArNode)) {
			return;
		}
		for (var link of node.links) {
			if (typeof link == "string") {
				link = this.getNode(link);
			}
			if (!(link instanceof ViArNode)) {
				continue;
			}
			RENDER_LIST.push(link.getRenderNode());
		}
	}

	this.useNodeChilds = (node) => {
		this.clearRenderList();
		if (typeof node == "string") {
			node = this.getNode(node);
		}
		if (!(node instanceof ViArNode)) {
			return;
		}
		for (var child of node.childs) {
			if (typeof child == "string") {
				child = this.getNode(child);
			}
			if (!(child instanceof ViArNode)) {
				continue;
			}
			RENDER_LIST.push(child.getRenderNode());
		}
	}

	this.useNodeParent = (node) => {
		this.clearRenderList();
		if (typeof node == "string") {
			node = this.getNode(node);
		}
		if (!(node instanceof ViArNode)) {
			return;
		}
		if (node.parent != null) {
			var parent = node.parent;
			if (typeof parent == "string") {
				parent = this.getNode(parent);
			}
			if (!(parent instanceof ViArNode)) {
				return;
			}
			RENDER_LIST.push(parent.getRenderNode());
		}
	}

	this.newNode = (parent, title, content, tag_list, links, meta) => {
		if (typeof parent == "string") {
			parent = this.getNode(parent);
		}
		if (!(parent instanceof ViArNode)) {
			return null;
		}
		var in_links = [];
		for (var link of links) {
			if (typeof link == "string") {
				link = this.getNode(link);
			}
			if (!(link instanceof ViArNode)) {
				continue;
			}
			in_links.push(link);
		}
		var node = ViArNode.newNode(title, content, tag_list, parent, in_links, meta);
		this.node_map[node.id] = node;
		return node;
	}

	this.delNode = (node, clear_parent) => {
		if (clear_parent == undefined) {
			clear_parent = true;
		}
		if (node == this._root || node == "root") {
			return false;
		}
		if (typeof node == "string") {
			var node_id = node;
			node = this.getNode(node_id);
			if (node == undefined) {
				return false;
			}
		} else if (node instanceof ViArNode) {
			var node_id = node.id;
		} else {
			return false;
		}
		for (var link_node_id of node.links) {
			var link_node = this.getNode(link_node_id);
			if (link_node == undefined) {
				continue;
			}
			link_node.links.delete(node_id);
		}
		for (var child of node.childs) {
			this.delNode(child, false);
		}
		if (clear_parent) {
			var parent_node = this.getNode(node.parent);
			if (parent_node != undefined) {
				parent_node.childs.delete(node_id);
			}
		}
		delete this.node_map[node_id];
		return true;
	}

	this.updateNode = (node, parent, title, content, tag_list, links, meta) => {
		if (node == this._root || node == "root") {
			return false;
		}
		if (typeof node == "string") {
			var node_id = node;
			node = this.getNode(node_id);
			if (node == undefined) {
				return false;
			}
		} else if (node instanceof ViArNode) {
			var node_id = node.id;
		} else {
			return false;
		}
		var old_links = node.links;
		var old_parent = this.getNode(node.parent);
		if (old_parent != undefined) {
			old_parent.childs.delete(node.id);
		}
		for (var old_link of old_links) {
			old_link = this.getNode(old_link);
			if (old_link != undefined) {
				old_link.links.delete(node_id);
			}
		}
		if (typeof parent == "string") {
			parent = this.getNode(parent);
		}
		if (parent instanceof ViArNode) {
			parent.childs.add(node_id);
		}
		for (var link of links) {
			if (typeof link == "string") {
				link = this.getNode(link);
			}
			if (!(link instanceof ViArNode)) {
				continue;
			}
			link.links.add(node_id);
		}
		node.update(parent, title, content, tag_list, links, meta);
	}

	this.getNode = (id) => {
		if (id == "root") {
			return this._root;
		}
		return this.node_map[id];
	}

	this.getNodesWithLinks = (node) => {
		var result = [];
		if (typeof node == "string") {
			node = this.getNode(node);
		}
		if (!(node instanceof ViArNode)) {
			return result;
		}
		for (var link of node.links) {
			result.push(link);
		}
		return result;
	}

	this.getNodesWithChild = (node) => {
		var result = [];
		if (typeof node == "string") {
			node = this.getNode(node);
		}
		if (!(node instanceof ViArNode)) {
			return result;
		}
		for (var child of node.childs) {
			result.push(child);
		}
		return result;
	}

	this.findNodesWithTag = (tag) => {
		var result = [];
		this.forEachNode((node, result) => {
			if (tag in node.tags) {
				result.push(node);
			}
		}, result);
		return result;
	}

	this.save = () => {
		var node_save_map = {};
		for (var node_id in this.node_map) {
			var node = this.node_map[node_id];
			node_save_map[node_id] = node.save();
		}
		DM.set("data", {
			root: this._root.save(),
			node_map: node_save_map,
			tags: Object.keys(this.tags),
		}).save();
		return this;
	}

	this.passwordChange = () => {
		this.save();
	}

	this.loadData = () => {
		DM.load();
		let data = DM.get("data", {});
		this.load(data);
	}

	this.load = (data) => {
		if (data.root != undefined) {
			this._root = ViArNode.loadNode(data.root);
		}
		if (data.node_map != undefined) {
			for (var key in this.node_map) {
				delete this.node_map[key];
			}
			for (var node_id in data.node_map) {
				this.node_map[node_id] = ViArNode.loadNode(data.node_map[node_id]);
			}
		}
		if (data.tags != undefined) {
			Utils.clearObj(this.tags);
			for (var tag of data.tags) {
				this.tags[tag] = Utils.invertColor(Utils.md5(tag));
			}
			this.renderTagsIdentity();
		}
		this.initRenderList();
		return this;
	}

	this.importFile = (data) => {
		let out_viar = JSON.parse(data.out_viar);
		this.load(out_viar)
			.save();
	}

	this.exportFile = () => {
		const node_save_map = {
			node_map:{},
			root:this._root.save(),
			tags:Object.keys(TAGS),
		};
		for (var node_id in this.node_map) {
			var node = this.node_map[node_id];
			node_save_map.node_map[node_id] = node.save();
		}
		const data = {};
		data.out_viar = JSON.stringify(node_save_map);
		return data;
	}

	this.forEachNode = (callback, args) => {
		callback(this._root, args);
		for (var node_id in this.node_map) {
			callback(this.getNode(node_id), args);
		}
	}

	this.useSearch = (keyword) => {
		let result = this.search(keyword);
		this.clearRenderList();
		for (let viar_warp of result) {
			RENDER_LIST.push(viar_warp.node.getRenderNode());
		}
	}

	this.search = (keyword) => {
		let tag_list = Object.keys(SRHING_TAGS);
		var nodes = new Set();
		if (tag_list != undefined && tag_list.length > 0) {
			for (var tag of tag_list) {
				var tag_nodes = this.findNodesWithTag(tag);
				for (var tag_node of tag_nodes) {
					nodes.add(tag_node);
				}
			}
		} else {
			this.forEachNode((node, nodes) => {
				nodes.add(node);
			}, nodes);
		}
		var result = [];
		if (keyword == undefined || keyword == "" || keyword == null) {
			for (var node of nodes) {
				result.push({
					node: node,
					score: 1,
				});
			}
			return result;
		}
		var keywords = Utils.splitKeyword(keyword);
		for (var node of nodes) {
			var n = 0;
			for (keyword of keywords) {
				if (node.title.includes(keyword)) {
					n += 1;
				}
				if (node.content.includes(keyword)) {
					n += 1;
				}
			}
			if (n <= 0) {
				continue;
			}
			result.push({
				node: node,
				score: n,
			});
		}
		result.sort((a, b) => b.score - a.score);
		return result;
	}


	this.searchTag = (raw_keyword, create = false) => {
		var result = [];
		var keywords = Utils.splitKeyword(raw_keyword);
		for (var tag in this.tags) {
			tag = String(tag);
			var n = 0;
			for (let keyword of keywords) {
				if (tag.includes(keyword)) {
					n += 1;
				}
			}
			if (n <= 0) {
				continue;
			}
			result.push({
				tag: tag,
				score: n,
			});
		}
		result.sort((a, b) => b.score - a.score);
		Utils.clearObj(RENDER_TAGS);
		if (create) {
			let color = Utils.invertColor(Utils.md5(raw_keyword));
			RENDER_TAGS[raw_keyword] = color;
			TAGS[raw_keyword] = color;
		}
		for (let tag_warp of result) {
			RENDER_TAGS[tag_warp.tag] = TAGS[tag_warp.tag];
		}
		return this;
	}

	this.reCreateTags = () => {
		Utils.clearObj(this.tags);
		this.addDisTags();
		this.forEachNode((node) => {
			for (var tag in node.tags) {
				this.tags[tag] = node.tags[tag];
			}
		});
		this.renderTagsIdentity();
		return this;
	}
}
const VIAR_TREE = new ViArTree();

const TEMP_VIAR = reactive({
	title: "",
	meta: "",
	text: "",
	links: [],
	tags: {},
	parent: VIAR_TREE.getNode("root"),
	id: null,
});


DataManager.onLoadData(VIAR_TREE.loadData);
DataManager.onImportFile(VIAR_TREE.importFile);
DataManager.onExportFile(VIAR_TREE.exportFile);
DataManager.onPasswordChange(VIAR_TREE.passwordChange);

export default VIAR_TREE;