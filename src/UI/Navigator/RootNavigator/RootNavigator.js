import {
	createStackNavigator,
	createDrawerNavigator,
	createAppContainer
} from "react-navigation";
import Example from "src/UI/Pages/Example";

import { Constant } from "src/Utility/PathExport";

const scale = Constant.getScale();

export const StackNav = createStackNavigator(
	{
		Example: { screen: Example }
	},
	{
		mode: "card",
		headerLayoutPreset: "center",
		headerBackTitleVisible: false,
		navigationOptions: {
			gesturesEnabled: true,
			titleStyle: {
				textAlign: "center"
			}
		}
	}
);
StackNav.navigationOptions = ({ navigation }) => {
	let drawerLockMode = "unlocked";
	if (navigation.state.index > 0) {
		drawerLockMode = "locked-closed";
	}
	return {
		drawerLockMode
	};
};
const AppContainer = createAppContainer(StackNav);

export default AppContainer;
