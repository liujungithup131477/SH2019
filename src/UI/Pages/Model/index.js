import React from "react";
//import { connect } from "react-redux";
import { View } from "react-native";
import BaseComponent from "src/UI/Pages/BaseComponent";
import MainView, { navOpt, statusBarConfig } from "./view";

/**
 * index.js文件用于将所有事件抽离出来。保证所有的UI都在view.js,
 * index.js中用BaseComponentDidMount等代替原有的ComponentDidMount等生命周期，方法一定要写成箭头函数的形式，否则不识别
 */

export class index extends BaseComponent {
	static navigationOptions = navOpt;
	//状态栏配置。BaseComponent会读取,涉及到样式配置全都写在view.js里
	_statusBarConfig = statusBarConfig;
	_onBackButtonPressAndroid = () => {
		//当return true时，会阻止默认的返回事件
		return true;
	};
	BaseComponentDidMount = () => {};
	BaseComponentWillUnmount = () => {};
	BaseRender = () => {
		const params = {};
		return (
			<View style={{ flex: 1 }}>
				<MainView {...params} />
			</View>
		);
	};
}

//使用Redux 时导出
// const useReducers = store => {
// 	return {
// 		//Reducers
// 		PageManagerReducer: store.PageManagerReducer
// 	};
// };
// export default connect(useReducers)(index);
export default index;
