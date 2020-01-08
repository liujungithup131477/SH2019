import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { connect } from "react-redux";
const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "absolute",
		width: "100%",
		height: "100%"
	}
});

type props = {};

class TopViews extends React.Component<props> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}

	render() {
		const { topViews } = this.props.PageManagerReducer;
		if (topViews.length === 0) {
			//没有顶层View
			return null;
		}
		return (
			<View style={styles.container}>
				{topViews.map((e, i) => {
					const element = e.element;

					return element;
				})}
			</View>
		);
	}
}

const useReducers = store => {
	return {
		//Reducers
		PageManagerReducer: store.PageManagerReducer
	};
};
export default connect(useReducers)(TopViews);
