import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import ColorManager from "../Configs/UIConfigs/ColorManager";
import CustomActivityIndicatorView from "../UI/CustomView/CustomActivityIndicatorView";
import RootNavigator from "src/UI/Navigator/RootNavigator/RootNavigator";
import CustomGlobalView from "src/UI/CustomView/CustomGlobalView";

class Root extends Component {
	UNSAFE_componentWillMount() {
		//初始化Manager
	}
	componentDidMount = () => {
		//文件载入完成后，隐藏启动页面
		SplashScreen.hide();
	};

	render() {
		return (
			<View style={styles.container}>
				{/* RootNav位置 */}
				<RootNavigator />
				{/* 全局Hud */}
				<CustomActivityIndicatorView />
				{/* 置顶的View，通过Redux添加View到应用最上层 */}
				<CustomGlobalView />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: ColorManager.page_background_color,
		flex: 1
	}
});

export default Root;
