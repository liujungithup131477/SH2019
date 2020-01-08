/**
 * 将所有可能会批量改动的颜色提取出来，并且留好备注,备注会在用户定制时显示
 */

const colors = {
	page_background: {
		des: "Page default background color",
		color: "#EAEAEA"
	},
	//Text
	text_primary: {
		des: "Text default color,use for most of text",
		color: "#4A4A4A"
	},
	text_secondary: {
		des: "",
		color: "#9B9B9B"
	},
	text_light: {
		des: "Light text color",
		color: "#C7C7C7"
	},
	text_high: {
		des: "High text color",
		color: "#F5A73E"
	},
	text_important: {
		des: "Important text color",
		color: "#F33B3F"
	},
	//buton
	button_text_primary: {
		des: "Button text color",
		color: "#FFFFFF"
	},
	button_background_primary: {
		des: "Button background color",
		color: "#545D73"
	},
	button_text_secondary: {
		des: "Button text color",
		color: "#FFFFFF"
	},
	button_background_secondary: {
		des: "Button background color",
		color: "#545D73"
	},

	//Nav背景颜色控制最好不要用RGB来设置，但是Nav为透明色时，使用透明的图片，底部的背景也是也要设置为透明
	nav_tint_primary: {
		des: "Nav default color",
		color: "#ffffff"
	},
	nav_tint_transparent: {
		des: "Transparent nav style's color",
		color: "transparent"
	}
};

export default colors;
