import I18n from "react-native-i18n";
//import { getLanguages } from "react-native-i18n";
import en from "./en";
import zh from "./zh-Hans";

I18n.fallbacks = true;
//默认支持EN，ZH
I18n.translations = {
	en,
	zh
};

export default I18n;

const translateEnglishStringToKeyFormat = key => {
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
	return key;
};

//通过类和字符串获取文字的key
const _getKey = (category, en) => {
	category = category ? category : "global";
	en = en != null ? en : "";
	let formatEnglish = translateEnglishStringToKeyFormat(en);

	let key = `${category}_${formatEnglish}`;
	return key;
};

export const translateString = (category, string) => {
	if (string === "\n") {
		return string;
	}
	let newStr = I18n.t(_getKey(category, string));
	//[missing是I18n库找不到翻译时显示的
	if (newStr.startsWith("[missing")) {
		newStr = string;
	}
	return newStr;
};
