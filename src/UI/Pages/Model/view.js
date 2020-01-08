import React, { Component } from "react";
import { extraStyles } from "./extraStyles";
import { View, Text, StyleSheet, connectStyles } from "src/Utility/PathExport";
import CustomButton from "src/UI/CustomView/CustomButton";
import { NavigationBarOptions } from "src/Utility/PathExport";
import { translateString } from "src/Localizations/I18n";

/**
 * view.js中只有最基本的组件。所有的事件全都由index.js处理.所有的模块导入，只能从PathExport,react中导入。
 */

const originalStyle = {
	container: {
		flex: 1
	}
};

//导航栏设置
export const navOpt = NavigationBarOptions.navigationOptions(
	{
		title: translateString("main", "Example")
	},
	{
		/**
		 * rightItem: NavigationBarOptions.HeaderItem(
			<Text style={originalStyle.item}>Item</Text>,
			"navBtnClick"
		)
		 * leftItem: null,
		 * headerBackgroundImage: ImageManager.nav_background,
		 */
	}
);
//状态栏配置
export const statusBarConfig = {
	contentType: "light-content"
};

export type Props = {};
class MainView extends Component<Props> {
	componentDidMount = () => {};
	render() {
		const styles = this.props.finalStyles;
		return (
			<View style={styles.container}>
				<Text category={"main"} style={styles.textStyle}>
					{`Hello`}
				</Text>
			</View>
		);
	}
}

export default connectStyles(MainView)(originalStyle, extraStyles);
