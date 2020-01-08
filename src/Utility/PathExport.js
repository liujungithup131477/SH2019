import {
	Image,
	StyleSheet,
	TouchableOpacity,
	Easing,
	Animated,
	View,
	ScrollView,
	FlatList,
	TextInput
} from "react-native";
import Text from "src/UI/CustomView/CustomText";
import CustomActivityIndicatorView from "src/UI/CustomView/CustomActivityIndicatorView";
import CustomToast from "src/UI/CustomView/CustomToast";
import ColorManager from "src/Configs/UIConfigs/ColorManager";
import FontManager from "src/Configs/UIConfigs/FontManager";
import ImageManager from "src/Configs/UIConfigs/ImageManager";
import NavigationBarOptions from "src/UI/Navigator/NavigationBarOptions";
import I18n from "src/Localizations/I18n";
import Constant, { createFinalStyles } from "src/Utility/GlobalUI";
import connectStyles from "src/Utility/connectStyles";

export {
	//Component
	View,
	Text,
	Animated,
	Easing,
	TouchableOpacity,
	Image,
	StyleSheet,
	CustomActivityIndicatorView,
	CustomToast,
	ScrollView,
	FlatList,
	TextInput,
	//Configs
	ColorManager,
	FontManager,
	ImageManager,
	NavigationBarOptions,
	I18n,
	createFinalStyles,
	Constant,
	connectStyles
};
