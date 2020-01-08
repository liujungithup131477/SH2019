import React, { Component } from "react";
import {
	Text,
	View,
	TextInput,
	StyleSheet,
	FontManager,
	connectStyles
} from "src/Utility/PathExport";

const borderWidth = 0.3;
const styles = {
	conatiner: {
		width: "100%",
		height: "100%",
		backgroundColor: "rgba(0,0,0,0.6)",
		alignItems: "center"
	},
	alertView: {
		width: 270,
		backgroundColor: `#F8F8F8`,
		borderRadius: 12,
		overflow: "hidden",
		marginTop: 137,
		alignItems: "center",
		paddingTop: 20
	},
	title: {
		fontSize: 17
	},
	text: {
		fontSize: 13,
		fontFamily: FontManager.Default,
		textAlign: "center",

		lineHeight: 16,
		marginTop: 3,
		width: 238
	},

	textFieldContainer: {
		width: 238,
		height: 25,
		marginTop: 21,
		backgroundColor: `white`,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: `#8E8E93`
	},
	textField: {
		marginLeft: 5,
		height: 25,
		width: 233
	},
	line: {
		width: "100%",
		height: borderWidth,
		backgroundColor: `#3F3F3F`,
		marginTop: 12
	},
	buttonView: {
		width: "100%",
		height: 44,
		alignItems: "center",
		flexDirection: "row"
	},
	buttonLeft: {
		width: 134.5,
		height: 44,
		lineHeight: 44,
		fontSize: 17,
		textAlign: "center",
		color: `#007AFF`,
		borderRightWidth: 1,
		borderStyle: "solid",
		fontFamily: FontManager.Default,
		borderColor: `#8E8E93`
	},
	buttonLine: {
		width: borderWidth,
		height: "100%",
		backgroundColor: `#3F3F3F`
	},
	buttonRight: {
		flex: 1,
		height: 44,
		lineHeight: 44,
		textAlign: "center",
		color: `#007AFF`,
		fontSize: 17
	}
};

class CustomAlertTextInputView extends Component {
	static defaultProps = {
		title: "",
		description: "",
		keyboardType: "default",
		placeholder: "",
		leftButtonTitle: "Cancel",
		leftButtonFunc: () => {},
		rightButtonTitle: "Confirm",
		maxLength: 999,
		rightButtonFunc: () => {}
	};
	constructor(props) {
		super(props);
		this.state = {
			name: ""
		};
	}
	render() {
		const { finalStyles } = this.props;
		return (
			<View style={finalStyles.conatiner}>
				<View />
				<View style={finalStyles.alertView}>
					<Text style={finalStyles.title}>{this.props.title}</Text>
					<Text style={finalStyles.text}>{this.props.description}</Text>
					<View style={finalStyles.textFieldContainer}>
						<TextInput
							ref={e => {
								this._textInput = e;
							}}
							placeholder={this.props.placeholder}
							underlineColorAndroid="transparent"
							keyboardType={this.props.keyboardType}
							maxLength={this.props.maxLength}
							onChangeText={text => {
								if (text.length > this.props.maxLength) {
									return;
								}
								this.name = text;
								this.setState({ name: text });
							}}
							style={finalStyles.textField}
							autoFocus={true}
							clearButtonMode={"always"}
							value={this.state.name}
							onSubmitEditing={() => {}}
							onFocus={() => {}}
							onBlur={() => {}}
						/>
					</View>

					<View style={finalStyles.line} />
					<View style={finalStyles.buttonView}>
						<Text
							onPress={() => {
								this.props.leftButtonFunc(this.state.name);
							}}
							style={finalStyles.buttonLeft}
						>
							{this.props.leftButtonTitle}
						</Text>
						<View style={finalStyles.buttonLine} />
						<Text
							onPress={() => {
								this.props.rightButtonFunc(this.state.name);
							}}
							style={finalStyles.buttonRight}
						>
							{this.props.rightButtonTitle}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

export default connectStyles(CustomAlertTextInputView)(styles);
