// NavigationService.js

import {
	NavigationActions,
	StackActions,
	DrawerActions
} from "react-navigation";

let _navigator;

function setTopLevelNavigator(navigatorRef) {
	_navigator = navigatorRef;
}

function navigate(routeName, params) {
	_navigator.dispatch(
		NavigationActions.navigate({
			routeName,
			params
		})
	);
}

function back(key) {
	_navigator.dispatch(
		NavigationActions.back({
			key
		})
	);
}

//StackNavitgationAction
function reset(routeName) {
	const resetAction = StackActions.reset({
		index: 0,
		actions: [NavigationActions.navigate({ routeName })]
	});
	_navigator.dispatch(resetAction);
}

function popToTop() {
	const popToTopAction = StackActions.popToTop();
	_navigator.dispatch(popToTopAction);
}

//DrawNavigation
function openDrawer() {
	const openAction = DrawerActions.openDrawer();
	_navigator.dispatch(openAction);
}

function closeDrawer() {
	const closeAction = DrawerActions.closeDrawer();
	_navigator.dispatch(closeAction);
}

// add other navigation functions that you need and export them

export default {
	navigate,
	setTopLevelNavigator,
	reset,
	back,
	popToTop,
	openDrawer,
	closeDrawer
};
