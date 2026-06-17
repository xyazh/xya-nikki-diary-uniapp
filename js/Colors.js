const COLORS = {};

let theme_index = uni.getStorageSync("theme");

switch (theme_index) {
	case 0: // 默认
		COLORS.BG = "#ffffff";
		COLORS.BG_TEXT1 = "#000000";
		COLORS.BG_CARD = "#ffffff";
		
		COLORS.MAIN = "#77aaff";
		COLORS.MAIN_TITLE = "#ffffff";
		COLORS.IMGF = "invert(64%) sepia(56%) saturate(3224%) hue-rotate(195deg) brightness(107%) contrast(101%)";
		COLORS.IMGF2 = "invert(100%) sepia(100%) saturate(0%) hue-rotate(357deg) brightness(109%)";
		
		COLORS.DIS_TEXT = "#757575";
		COLORS.TEXT = "#000000";
		
		COLORS.BTN_TEXT1 = "#000000";
		COLORS.BTN_BG1 = "#e5e5e5"
		COLORS.BTN_TEXT2 = "#2da7ff";
		COLORS.BTN_TEXT3 = "#ffffff";
		COLORS.BTN_BG3 = "#1ea7ff";
		COLORS.BTN_TEXT4 = "#e64545";
		
		COLORS.SUB_TITLE = "#77aaff";
		COLORS.SUB_ITEM = "#666666";
		COLORS.SUB_TITLE1 = "#77aaff";
		COLORS.SUB_ITEM1 = "#000000";
		
		COLORS.HOVER = "#000000";
		COLORS.HOVERED = "#666666";
		COLORS.HOVER_TEXT = "#000000";
		COLORS.HOVERED_TEXT = "#000000";
		
		COLORS.TOOLBAR = "#ececec";
		COLORS.TOOLBAR_TEXT = "#525252";
		break;

	case 1: // 深色
		COLORS.BG = "#000000";
		COLORS.BG_TEXT1 = "#d4d4d4";
		COLORS.BG_CARD = "#212224";

		COLORS.MAIN = "#1e1e1e";
		COLORS.MAIN_TITLE = "#cccccc";

		COLORS.DIS_TEXT = "#d4d4d4";
		COLORS.TEXT = "#ffffff";
		COLORS.IMGF = "invert(95%) sepia(0%) saturate(2158%) hue-rotate(346deg) brightness(81%)";
		COLORS.IMGF2 = "invert(95%) sepia(0%) saturate(2158%) hue-rotate(346deg) brightness(81%)";
		
		COLORS.BTN_TEXT1 = "#d4d4d4";
		COLORS.BTN_BG1 = "#2d2d30";
		COLORS.BTN_TEXT2 = "#d4d4d4";
		COLORS.BTN_TEXT3 = "#d4d4d4";
		COLORS.BTN_BG3 = "#2d2d30";
		COLORS.BTN_TEXT4 = "#e64545";

		COLORS.SUB_TITLE = "#d4d4d4";
		COLORS.SUB_ITEM = "#666666";
		COLORS.SUB_TITLE1 = "#777777";
		COLORS.SUB_ITEM1 = "#ffffff";

		COLORS.HOVER = "#ffffff";
		COLORS.HOVERED = "#666666";
		COLORS.HOVER_TEXT = "#ffffff";
		COLORS.HOVERED_TEXT = "#ffffff";

		COLORS.TOOLBAR = "#525252";
		COLORS.TOOLBAR_TEXT = "#ececec";
		break;

	case 2: // 黑色
		COLORS.BG = "#000000";
		COLORS.BG_TEXT1 = "#ffffff";
		COLORS.BG_CARD = "#111111";
		
		COLORS.MAIN = "#111111";
		COLORS.MAIN_TITLE = "#ffffff";
		COLORS.IMGF = "invert(97%) sepia(93%) saturate(28%) hue-rotate(3deg) brightness(105%) contrast(100%)";
		COLORS.IMGF2 = "invert(97%) sepia(93%) saturate(28%) hue-rotate(3deg) brightness(105%) contrast(100%)";
		
		COLORS.DIS_TEXT = "#aaaaaa";
		COLORS.TEXT = "#ffffff";

		COLORS.BTN_TEXT1 = "#ffffff";
		COLORS.BTN_BG1 = "#1a1a1a";
		COLORS.BTN_TEXT2 = "#00bfff";
		COLORS.BTN_TEXT3 = "#ffffff";
		COLORS.BTN_BG3 = "#00bfff";
		COLORS.BTN_TEXT4 = "#ff6666";

		COLORS.SUB_TITLE = "#00bfff";
		COLORS.SUB_ITEM = "#888888";
		COLORS.SUB_TITLE1 = "#00bfff";
		COLORS.SUB_ITEM1 = "#ffffff";

		COLORS.HOVER = "#ffffff";
		COLORS.HOVERED = "#00bfff";
		COLORS.HOVER_TEXT = "#ffffff";
		COLORS.HOVERED_TEXT = "#000000";

		COLORS.TOOLBAR = "#111111";
		COLORS.TOOLBAR_TEXT = "#ffffff";
		break;

	case 3: // 暖黄
		COLORS.BG = "#FFF8E7";
		COLORS.BG_TEXT1 = "#4A3A24";
		COLORS.BG_CARD = "#FFFCF5";

		COLORS.MAIN = "#D9A441";
		COLORS.MAIN_TITLE = "#FFFFFF";
		COLORS.IMGF = "invert(21%) sepia(21%) saturate(975%) hue-rotate(355deg) brightness(92%) contrast(89%)";
		COLORS.IMGF2 = "invert(98%) sepia(1%) saturate(14%) hue-rotate(63deg) brightness(112%) contrast(100%)";
		
		COLORS.DIS_TEXT = "#8B7355";
		COLORS.TEXT = "#4A3A24";

		COLORS.BTN_TEXT1 = "#4A3A24";
		COLORS.BTN_BG1 = "#F4E5C1";
		COLORS.BTN_TEXT2 = "#D9A441";
		COLORS.BTN_TEXT3 = "#FFFFFF";
		COLORS.BTN_BG3 = "#D9A441";
		COLORS.BTN_TEXT4 = "#C0392B";

		COLORS.SUB_TITLE = "#D9A441";
		COLORS.SUB_ITEM = "#8B7355";
		COLORS.SUB_TITLE1 = "#D9A441";
		COLORS.SUB_ITEM1 = "#4A3A24";

		COLORS.HOVER = "#4A3A24";
		COLORS.HOVERED = "#D9A441";
		COLORS.HOVER_TEXT = "#4A3A24";
		COLORS.HOVERED_TEXT = "#FFFFFF";

		COLORS.TOOLBAR = "#F6E9C8";
		COLORS.TOOLBAR_TEXT = "#4A3A24";
		break;

	case 4: // 浅绿
		COLORS.BG = "#F5FBF3";
		COLORS.BG_TEXT1 = "#29412C";
		COLORS.BG_CARD = "#FFFFFF";

		COLORS.MAIN = "#6FAF76";
		COLORS.MAIN_TITLE = "#FFFFFF";
		COLORS.IMGF = "invert(16%) sepia(62%) saturate(359%) hue-rotate(77deg) brightness(94%) contrast(83%)";
		COLORS.IMGF2 = "invert(98%) sepia(1%) saturate(14%) hue-rotate(63deg) brightness(112%) contrast(100%)";

		COLORS.DIS_TEXT = "#6C7D6E";
		COLORS.TEXT = "#29412C";

		COLORS.BTN_TEXT1 = "#29412C";
		COLORS.BTN_BG1 = "#DDEDDC";
		COLORS.BTN_TEXT2 = "#6FAF76";
		COLORS.BTN_TEXT3 = "#FFFFFF";
		COLORS.BTN_BG3 = "#6FAF76";
		COLORS.BTN_TEXT4 = "#C0392B";

		COLORS.SUB_TITLE = "#6FAF76";
		COLORS.SUB_ITEM = "#6C7D6E";
		COLORS.SUB_TITLE1 = "#6FAF76";
		COLORS.SUB_ITEM1 = "#29412C";

		COLORS.HOVER = "#29412C";
		COLORS.HOVERED = "#6FAF76";
		COLORS.HOVER_TEXT = "#29412C";
		COLORS.HOVERED_TEXT = "#FFFFFF";

		COLORS.TOOLBAR = "#E5F3E4";
		COLORS.TOOLBAR_TEXT = "#29412C";
		break;

	case 5: // 灰蓝
		COLORS.BG = "#F7F9FA";
		COLORS.BG_TEXT1 = "#34434D";
		COLORS.BG_CARD = "#FFFFFF";

		COLORS.MAIN = "#6E8CA0";
		COLORS.MAIN_TITLE = "#FFFFFF";
		COLORS.IMGF = "invert(56%) sepia(39%) saturate(274%) hue-rotate(161deg) brightness(88%) contrast(85%)";
		COLORS.IMGF2 = "invert(100%) sepia(100%) saturate(0%) hue-rotate(357deg) brightness(109%)";

		COLORS.DIS_TEXT = "#7A8B95";
		COLORS.TEXT = "#34434D";

		COLORS.BTN_TEXT1 = "#34434D";
		COLORS.BTN_BG1 = "#E4EBEF";
		COLORS.BTN_TEXT2 = "#6E8CA0";
		COLORS.BTN_TEXT3 = "#FFFFFF";
		COLORS.BTN_BG3 = "#6E8CA0";
		COLORS.BTN_TEXT4 = "#C0392B";

		COLORS.SUB_TITLE = "#6E8CA0";
		COLORS.SUB_ITEM = "#7A8B95";
		COLORS.SUB_TITLE1 = "#6E8CA0";
		COLORS.SUB_ITEM1 = "#34434D";

		COLORS.TOOLBAR = "#E9EFF2";
		COLORS.TOOLBAR_TEXT = "#34434D";
		break;

	case 6: // 浅粉
		COLORS.BG = "#FCF8F8";
		COLORS.BG_TEXT1 = "#55484A";
		COLORS.BG_CARD = "#FFFFFF";

		COLORS.MAIN = "#C89BA3";
		COLORS.MAIN_TITLE = "#FFFFFF";
		COLORS.IMGF = "invert(77%) sepia(14%) saturate(622%) hue-rotate(300deg) brightness(87%) contrast(78%)";
		COLORS.IMGF2 = "invert(100%) sepia(100%) saturate(0%) hue-rotate(357deg) brightness(109%)";

		COLORS.DIS_TEXT = "#918184";
		COLORS.TEXT = "#55484A";

		COLORS.BTN_TEXT1 = "#55484A";
		COLORS.BTN_BG1 = "#F1E5E7";
		COLORS.BTN_TEXT2 = "#C89BA3";
		COLORS.BTN_TEXT3 = "#FFFFFF";
		COLORS.BTN_BG3 = "#C89BA3";
		COLORS.BTN_TEXT4 = "#C0392B";

		COLORS.SUB_TITLE = "#C89BA3";
		COLORS.SUB_ITEM = "#918184";
		COLORS.SUB_TITLE1 = "#C89BA3";
		COLORS.SUB_ITEM1 = "#55484A";

		COLORS.TOOLBAR = "#F5ECEE";
		COLORS.TOOLBAR_TEXT = "#55484A";
		break;

	case 7: // 深蓝
		COLORS.BG = "#07141F";
		COLORS.BG_TEXT1 = "#E6F7FF";
		COLORS.BG_CARD = "#102332";

		COLORS.MAIN = "#0099CC";
		COLORS.MAIN_TITLE = "#FFFFFF";
		COLORS.IMGF = "invert(39%) sepia(43%) saturate(1848%) hue-rotate(162deg) brightness(103%)";
		COLORS.IMGF2 = "invert(100%) sepia(100%) saturate(0%) hue-rotate(357deg) brightness(109%)";

		COLORS.DIS_TEXT = "#8AA4B2";
		COLORS.TEXT = "#E6F7FF";

		COLORS.BTN_TEXT1 = "#E6F7FF";
		COLORS.BTN_BG1 = "#183444";
		COLORS.BTN_TEXT2 = "#00C3FF";
		COLORS.BTN_TEXT3 = "#FFFFFF";
		COLORS.BTN_BG3 = "#0099CC";
		COLORS.BTN_TEXT4 = "#FF7777";

		COLORS.SUB_TITLE = "#00C3FF";
		COLORS.SUB_ITEM = "#8AA4B2";
		COLORS.SUB_TITLE1 = "#00C3FF";
		COLORS.SUB_ITEM1 = "#E6F7FF";

		COLORS.TOOLBAR = "#102332";
		COLORS.TOOLBAR_TEXT = "#E6F7FF";
		break;

	case 8: // 灰紫
		COLORS.BG = "#282A36";
		COLORS.BG_TEXT1 = "#F8F8F2";
		COLORS.BG_CARD = "#343746";

		COLORS.MAIN = "#BD93F9";
		COLORS.MAIN_TITLE = "#FFFFFF";
		COLORS.IMGF = "invert(63%) sepia(62%) saturate(1514%) hue-rotate(212deg) brightness(101%)";
		COLORS.IMGF2 = "invert(100%) sepia(100%) saturate(0%) hue-rotate(357deg) brightness(109%)";

		COLORS.DIS_TEXT = "#BFBFBF";
		COLORS.TEXT = "#F8F8F2";

		COLORS.BTN_TEXT1 = "#F8F8F2";
		COLORS.BTN_BG1 = "#44475A";
		COLORS.BTN_TEXT2 = "#BD93F9";
		COLORS.BTN_TEXT3 = "#FFFFFF";
		COLORS.BTN_BG3 = "#BD93F9";
		COLORS.BTN_TEXT4 = "#FF6B6B";

		COLORS.SUB_TITLE = "#BD93F9";
		COLORS.SUB_ITEM = "#BFBFBF";
		COLORS.SUB_TITLE1 = "#BD93F9";
		COLORS.SUB_ITEM1 = "#F8F8F2";

		COLORS.TOOLBAR = "#343746";
		COLORS.TOOLBAR_TEXT = "#F8F8F2";
		break;

	case 9: // ACCEED
		COLORS.BG = "#F7FBFF";
		COLORS.BG_TEXT1 = "#2E4A62";
		COLORS.BG_CARD = "#FFFFFF";
	
		COLORS.MAIN = "#ACCEED";
		COLORS.MAIN_TITLE = "#FFFFFF";
		COLORS.IMGF = "invert(79%) sepia(13%) saturate(991%) hue-rotate(179deg) brightness(96%) contrast(92%)";
		COLORS.IMGF2 = "invert(100%) sepia(100%) saturate(0%) hue-rotate(357deg) brightness(109%)";
	
		COLORS.DIS_TEXT = "#7D96AC";
		COLORS.TEXT = "#2E4A62";
	
		COLORS.BTN_TEXT1 = "#2E4A62";
		COLORS.BTN_BG1 = "#E7F2FC";
		COLORS.BTN_TEXT2 = "#6DA9DE";
		COLORS.BTN_TEXT3 = "#24415A";
		COLORS.BTN_BG3 = "#ACCEED";
		COLORS.BTN_TEXT4 = "#D65A5A";
	
		COLORS.SUB_TITLE = "#6DA9DE";
		COLORS.SUB_ITEM = "#7D96AC";
		COLORS.SUB_TITLE1 = "#8BBBE6";
		COLORS.SUB_ITEM1 = "#2E4A62";
	
		COLORS.HOVER = "#2E4A62";
		COLORS.HOVERED = "#ACCEED";
		COLORS.HOVER_TEXT = "#2E4A62";
		COLORS.HOVERED_TEXT = "#24415A";
	
		COLORS.TOOLBAR = "#EAF4FD";
		COLORS.TOOLBAR_TEXT = "#35536D";
		break;

	default:
		COLORS.BG = "#ffffff";
		COLORS.BG_TEXT1 = "#000000";
		COLORS.BG_CARD = "#ffffff";
		
		COLORS.MAIN = "#77aaff";
		COLORS.MAIN_TITLE = "#ffffff";
		COLORS.IMGF = "invert(64%) sepia(56%) saturate(3224%) hue-rotate(195deg) brightness(107%) contrast(101%)";
		COLORS.IMGF2 = "invert(100%) sepia(100%) saturate(0%) hue-rotate(357deg) brightness(109%)";
		
		COLORS.DIS_TEXT = "#757575";
		COLORS.TEXT = "#000000";
		
		COLORS.BTN_TEXT1 = "#000000";
		COLORS.BTN_BG1 = "#e5e5e5"
		COLORS.BTN_TEXT2 = "#2da7ff";
		COLORS.BTN_TEXT3 = "#ffffff";
		COLORS.BTN_BG3 = "#1ea7ff";
		COLORS.BTN_TEXT4 = "#e64545";
		
		COLORS.SUB_TITLE = "#77aaff";
		COLORS.SUB_ITEM = "#666666";
		COLORS.SUB_TITLE1 = "#77aaff";
		COLORS.SUB_ITEM1 = "#000000";
		
		COLORS.HOVER = "#000000";
		COLORS.HOVERED = "#666666";
		COLORS.HOVER_TEXT = "#000000";
		COLORS.HOVERED_TEXT = "#000000";
		
		COLORS.TOOLBAR = "#ececec";
		COLORS.TOOLBAR_TEXT = "#525252";
		break;
}
export default COLORS;