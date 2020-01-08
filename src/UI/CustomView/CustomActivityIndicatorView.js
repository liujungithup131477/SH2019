import React from "react";
import { View, Animated, StyleSheet, Text, Easing } from "react-native";
import { ImageManager, Constant } from "src/Utility/PathExport";
import { connect } from "react-redux";

const scale = Constant.getScale();
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		width: "100%",
		height: "100%"
	},
	contentView: {
		width: 172 * scale,
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 15 * scale
	},
	imageStyle: {
		marginTop: 12 * scale,
		width: 40 * scale,
		height: 40 * scale
	},
	text: {
		color: "black",
		fontSize: 12 * scale,
		lineHeight: 17 * scale,
		marginTop: 17 * scale,
		marginBottom: 23 * scale,
		width: 160 * scale,
		textAlign: "center"
	}
});

type props = {};

class CustomActivityIndicatorView extends React.Component<props> {
	constructor(props) {
		super(props);

		this.state = {
			animating: true,
			ContentFadeValue: new Animated.Value(0),
			rotateValue: new Animated.Value(0)
		};
	}
	changeContentFadeAnimated = fadeValue => {
		Animated.timing(this.state.ContentFadeValue, {
			toValue: fadeValue,
			duration: 150
		}).start();
	};
	_rotateAnimated = () => {
		this.state.rotateValue.setValue(0);
		Animated.timing(this.state.rotateValue, {
			toValue: 1, //角度从0变1
			duration: 1000, //从0到1的时间
			easing: Easing.out(Easing.linear) //线性变化，匀速旋转
		}).start(() => {
			this._rotateAnimated();
		});
	};

	componentDidMount() {
		this.changeContentFadeAnimated(1);
		this._rotateAnimated();
	}
	render() {
		const { showHud, hudMessage } = this.props.PageManagerReducer;
		if (!showHud) {
			return null;
		}
		return (
			<Animated.View
				style={[styles.container, { opacity: this.state.ContentFadeValue }]}
			>
				<View style={styles.contentView}>
					<Animated.Image
						source={ImageManager.hud}
						style={[
							styles.imageStyle,
							{
								transform: [
									{
										rotate: this.state.rotateValue.interpolate({
											inputRange: [0, 1],
											outputRange: ["0deg", "360deg"]
										})
									}
								]
							}
						]}
					/>
					<Text style={styles.text}>{hudMessage}</Text>
				</View>
			</Animated.View>
		);
	}
}

const useReducers = store => {
	return {
		//Reducers
		PageManagerReducer: store.PageManagerReducer
	};
};
export default connect(useReducers)(CustomActivityIndicatorView);
