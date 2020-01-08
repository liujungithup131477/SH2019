import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
	ImageManager,
	ColorManager,
	FontManager
} from "src/Utility/PathExport";

const styles = StyleSheet.create({
	ButtonStyle: {
		justifyContent: "center",
		alignItems: "center",
		width: 304,
		height: 50
	},
	contentStyle: {
		backgroundColor: "transparent"
	},
	Text: {
		textAlign: "center",
		color: ColorManager.button_text_primary.color,
		fontFamily: FontManager.Medium,
		fontSize: 18
	},
	backgroundImage: {
		width: "100%",
		height: "100%",
		position: "absolute",
		zIndex: -2,
		alignSelf: "center"
	}
});

type Props = {
	style: Object,
	enable: boolean,
	textStyle: string,
	backgroundImage: any,
	backgroundImageStyle: Object,
	category: string,
	title: string,
	type: string
};
class Button extends React.Component<Props> {
	constructor(props) {
		super(props);
	}
	static defaultProps = {
		style: {},
		enable: true,
		textStyle: {},
		backgroundImage: null,
		backgroundImageStyle: {},
		type: ""
	};
	//默认Image背景图
	_backgroundImage = () => {
		if (this.props.backgroundImage) {
			return (
				<Image
					source={this.props.backgroundImage}
					style={[styles.backgroundImage, this.props.backgroundImageStyle]}
				/>
			);
		}
		if (this.props.type == "default") {
			return (
				<Image
					source={ImageManager.setup_002_default}
					style={[styles.backgroundImage, this.props.backgroundImageStyle]}
				/>
			);
		}
		return null;
	};

	render() {
		return (
			//可点击
			<TouchableOpacity
				onPress={this.props.onPress}
				style={[styles.ButtonStyle, this.props.style]}
				disabled={
					this.props.hasOwnProperty("enable") ? !this.props.enable : false
				}
			>
				{this.props.hasOwnProperty("title") ? (
					<Text
						category={this.props.category}
						style={[styles.Text, this.props.textStyle]}
					>
						{this.props.title}
					</Text>
				) : null}
				{this._backgroundImage()}
				<View style={styles.contentStyle} />
			</TouchableOpacity>
		);
	}
}

export default Button;
