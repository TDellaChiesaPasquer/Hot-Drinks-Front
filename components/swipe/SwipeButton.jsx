import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import HeartIcon from "../../assets/swipeButtons/heart.svg";
import StarIcon from "../../assets/swipeButtons/star.svg";
import CrossIcon from "../../assets/swipeButtons/cross.svg";

export default function SwipeButton(props) {
	const [buttonType] = useState(props.type);

	let mainComponent = <HeartIcon width={44} height={44} />;
	if (buttonType === "Dislike") mainComponent = <CrossIcon width={44} height={44} />;
	if (buttonType === "Superlike") mainComponent = <StarIcon width={44} height={44} />;

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => {
					if (props.onSwipe) props.onSwipe(buttonType);
				}}
				style={[styles.button, props.style]}
			>
				{mainComponent}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		justifyContent: "center",
		alignItems: "center",
		width: 80,
		height: 80,
		borderRadius: 45,
		backgroundColor: "#FFF5F0",
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 3,
	},
	buttonLike: { backgroundColor: "#FF4D80" },
	buttonDislike: { backgroundColor: "#8A2BE2" },
	buttonSuperLike: { backgroundColor: "#FFA500" },
	container: { flex: 1 },
});
