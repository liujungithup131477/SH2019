import { Dimensions } from "react-native";
//UI设计时所用的尺寸
const UI_STANDARD_WIDTH = 375;
const UI_STANDARD_HEIGHT = 667;
//横屏设计所用的尺寸
const UI_LANDSCAPE_STABDARD_WIDTH = 667;
const UI_LANDSCAPE_STABDARD_HEIGHT = 375;
//布局工具类

export default class Constant {
	//涉及到屏幕横竖切换的情况不要使用getScreenWidth和getScreenHeight
	// static
	static getScreenWidth = () => {
		return Dimensions.get("window").width;
	};
	static getScreenHeight = () => {
		return Dimensions.get("window").height;
	};
	/*@params contentHeight : 内容总高度
	 *        standard : 设计图所用尺寸
	 */
	static getScale = (
		contentHeight = UI_STANDARD_HEIGHT,
		standard = UI_STANDARD_WIDTH
	) => {
		//取短的为宽
		let w = Dimensions.get("window").width;
		let h = Dimensions.get("window").height;
		let screenW = w > h ? h : w;
		let screenH = w > h ? w : h;
		//使用strand缩放后内容的高度
		let height = (screenW / standard) * contentHeight;
		if (height < screenH) {
			return screenW / standard;
		}
		return screenH / contentHeight;
	};

	//横屏获取缩放比
	static getLandScapeScale = (
		contentHeight = UI_LANDSCAPE_STABDARD_HEIGHT,
		standard = UI_LANDSCAPE_STABDARD_WIDTH
	) => {
		//取长的为宽
		let w = Dimensions.get("window").width;
		let h = Dimensions.get("window").height;
		let screenW = w < h ? h : w;
		let screenH = w > h ? h : w;
		//使用strand缩放后内容的高度
		let height = (screenW / standard) * contentHeight;
		if (height < screenH) {
			return screenW / standard;
		}
		return screenH / contentHeight;
	};

	//将子视图放入父空间不被遮盖所能放入的最大比列。ContentSize是剩余空间的大小。InputSize是放入空间的大小 返回值为InputSize要等比缩放的最大比例
	static constantScale(ContentSize, InputSize) {
		if (ContentSize.width == 0 || ContentSize.height == 0) return 0;
		if (
			ContentSize.width / InputSize.width >= 1 &&
			ContentSize.height / InputSize.height >= 1
		)
			return 1;
		let widthScale = ContentSize.width / InputSize.width;
		let heightScale = ContentSize.height / InputSize.height;
		//返回比较小的比例
		return widthScale < heightScale ? widthScale : heightScale;
	}
}
export const createFinalStyles = (styles, extraStyles, scale = 1) => {
	const newStyles = {};
	const scaleStyle = style => {
		//不支持缩放的style列表
		const notSupportStyles = ["zIndex", "flex"];
		const newStyle = {};
		for (const key in style) {
			if (style.hasOwnProperty(key)) {
				const element = style[key];
				if (
					typeof element === "number" &&
					notSupportStyles.indexOf(key) === -1
				) {
					//样式为number且是支持缩放的
					newStyle[key] = element * scale;
				} else {
					newStyle[key] = element;
				}
			}
		}
		return newStyle;
	};
	for (const key in styles) {
		if (styles.hasOwnProperty(key)) {
			const element = styles[key];
			const extraStyle = extraStyles[key];
			if (extraStyle) {
				//和并新的styles
				newStyles[key] = scaleStyle({
					...element,
					...extraStyle
				});
			} else {
				newStyles[key] = scaleStyle(element);
			}
		}
	}
	return newStyles;
};
