import React from "react";
import { connect } from "react-redux";
import { View } from "src/Utility/PathExport";
import BaseComponent from "src/UI/Pages/BaseComponent";
import MainView, { navOpt, statusBarConfig } from "./view";
import { showHud } from "src/Redux/actions/PageManagerAction";
import CustomToast from "src/UI/CustomView/CustomToast";

import { addTopView, removeTopView } from "src/Redux/actions/PageManagerAction";
import CustomAlertTextInputView from "src/UI/CustomView/CustomAlertTextInputView";

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
		alert("Back On Press");
		return true;
	};
	BaseComponentDidMount = () => {
		this.props.navigation.setParams({ navBtnClick: this.navBtnClicked });
	};
	navBtnClicked = () => {
		alert("Nav button on Clicked");
	};
	_showHud = () => {
		this.props.dispatch(showHud(true));
		this.timer = setTimeout(() => {
			this.props.dispatch(showHud(false));
		}, 3000);
	};
	_showToast = () => {
		this.toast.show("这是一个toast");
	};
	_push = () => {
		this.props.navigation.push("Example");
	};
	_addTopView = () => {
		this.props.dispatch(
			addTopView(
				<CustomAlertTextInputView
					key={"alertView"}
					title="Title"
					description="This is a textInput"
					keyboardType="default"
					placeholder="placholder"
					leftButtonTitle="Cancel"
					leftButtonFunc={text => {
						this.props.dispatch(removeTopView("alertView"));
						alert("Left" + text);
					}}
					rightButtonTitle="Confirm"
					maxLength={999}
					rightButtonFunc={text => {
						this.props.dispatch(removeTopView("alertView"));
						alert("Right" + text);
					}}
				/>,
				"alertView"
			)
		);
	};

	BaseComponentWillUnmount = () => {};
	BaseRender = () => {
		const { showHud, hudMessage } = this.props.PageManagerReducer;
		const params = {
			showHud,
			showToast: this._showToast,
			showHudView: this._showHud,
			push: this._push,
			addTopView: this._addTopView
		};
		return (
			<View style={{ flex: 1 }}>
				<MainView {...params} />
				<CustomToast
					ref={e => {
						this.toast = e;
					}}
				/>
			</View>
		);
	};
}

const useReducers = store => {
	return {
		//Reducers
		PageManagerReducer: store.PageManagerReducer
	};
};
export default connect(useReducers)(index);
