//用于同一样式的高阶组件
import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Constant from "src/Utility/GlobalUI";
//缩放比
const scale = Constant.getScale();
//不支持缩放的css number
const notSupportStyles = ["zIndex", "flex", "opacity", "shadowOpacity"];
const createFinalStyles = (styles = {}, extraStyles = {}) => {
	const newStyles = {};
	const scaleStyle = style => {
		//不支持缩放的style列表
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

//调用方式 connectStyles(Component)(styles,extraStyles)
const connectStyles = WrappedComponent => {
	//第一个Styles是页面用的Style，第二个是客户定制的Styles
	return (styles = {}, extraStyles = {}) => {
		const finalStyles = StyleSheet.create(
			createFinalStyles(styles, extraStyles)
		);

		return class extends Component {
			static displayName = `withHOC(${WrappedComponent.displayName ||
				WrappedComponent.name})`;
			render() {
				if (this.props.forwardedRef) {
					const { forwardedRef, ...rest } = this.props;
					return (
						<WrappedComponent
							ref={forwardedRef}
							{...rest}
							finalStyles={finalStyles}
							scale={scale}
						/>
					);
				}
				return (
					<WrappedComponent
						{...this.props}
						scale={scale}
						finalStyles={finalStyles}
					/>
				);
			}
		};
	};
};

export default connectStyles;
