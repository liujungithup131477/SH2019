import React, { Component } from "react";
import { Text } from "react-native";
import { FontManager, I18n } from "src/Utility/PathExport";

class MyText extends Component {
	_getKey = (category, en) => {
		en = en != null ? en : "";
		let formatEnglish = this.translateEnglishStringToKeyFormat(en);

		let key = `${category}_${formatEnglish}`;
		return key;
	};

	translateEnglishStringToKeyFormat = key => {
		key = key ? key : "";
		// 如果切断的部分有通配符，则不切
		if (
			key.length > 100 &&
			key.indexOf("%@", 99) < 0 &&
			key.indexOf("%s", 99) < 0 &&
			key.indexOf("%d", 99) < 0 &&
			key.indexOf("%f", 99) < 0
		) {
			key = key.substr(0, 100);
		}

		key = key.replace("%@", "[[holders]]");
		key = key.replace("%d", "[[holderd]]");
		key = key.replace("%s", "[[holders]]");
		key = key.replace("%f", "[[holderf]]");
		key = key.replace(/[^A-Za-z0-9]/g, "_");
		// trim
		// key = key.replace(/^_*/, "").replace(/_*$/, "");
		return key;
	};

	_translateString = string => {
		if (string === "\n" || this.props.category == null) {
			return string;
		}
		let newStr = I18n.t(this._getKey(this.props.category, string));
		if (newStr.startsWith("[missing")) {
			newStr = string;
		}

		return newStr;
	};

	_textChildren = () => {
		const children = this.props.children;
		let newChildren = [];
		if (typeof children === "string") {
			//单一String.直接翻译
			newChildren = this._translateString(children);
		} else if (Array.isArray(children)) {
			for (const child of children) {
				if (typeof child === "string") {
					newChildren.push(this._translateString(child));
				} else {
					newChildren.push(child);
				}
			}
		} else {
			newChildren = children;
		}
		return newChildren;
	};
	render() {
		return (
			<Text
				allowFontScaling={false}
				{...this.props}
				style={[
					{
						fontFamily: FontManager.Default
					},
					this.props.style
				]}
			>
				{this._textChildren()}
			</Text>
		);
	}
}
export default MyText;
