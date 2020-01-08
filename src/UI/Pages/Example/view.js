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
		flex: 1,
		alignItems: "center"
	},
	textStyle: {
		color: "blue",
		backgroundColor: "yellow",
		height: 50,
		lineHeight: 50,
		alignItems: "center",
		fontSize: 16
	},
	item: {
		color: "white"
	},
	btnStyle: {
		marginTop: 20
	}
};

//导航栏设置
export const navOpt = NavigationBarOptions.navigationOptions(
	{
		title: translateString("main", "Example")
	},
	{
		/**
		 * rightItem: null,
		 * leftItem: null,
		 * headerBackgroundImage: ImageManager.nav_background,
		 */
		rightItem: NavigationBarOptions.HeaderItem(
			<Text style={originalStyle.item}>Item</Text>,
			"navBtnClick"
		)
	}
);
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
				<Text
					category={"main"}
					extraStyleName="textStyle"
					style={styles.textStyle}
				>
					{this.props.showHud ? "Hud is showing" : "Hud  is not showing"}
				</Text>
				<CustomButton
					type="default"
					category={"main"}
					style={styles.btnStyle}
					title={`Show hud`}
					onPress={this.props.showHudView}
				/>
				<CustomButton
					type="default"
					category={"main"}
					style={styles.btnStyle}
					title={`Show Toast`}
					onPress={this.props.showToast}
				/>
				<CustomButton
					type="default"
					category={"main"}
					style={styles.btnStyle}
					title={`Add Top View`}
					onPress={this.props.addTopView}
				/>
				<CustomButton
					type="default"
					category={"main"}
					style={styles.btnStyle}
					title={`Push To Next `}
					onPress={this.props.push}
				/>
			</View>
		);
	}
}

export default connectStyles(MainView)(originalStyle, extraStyles);
