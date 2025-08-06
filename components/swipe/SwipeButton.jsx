import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
// import HeartIcon from "../../assets/swipeButtons/heart.svg";
// import StarIcon from "../../assets/swipeButtons/star.svg";
// import CrossIcon from "../../assets/swipeButtons/cross.svg";
import { FontAwesome } from "@expo/vector-icons";

export default function SwipeButton(props) {
	const [buttonType] = useState(props.type);

	const iconeSize = 40;

	let mainComponent = (
		// <HeartIcon width={iconeSize} height={iconeSize} />
		// Icone pleine Expo : cœur
		<FontAwesome name="heart" size={iconeSize} color="#FF4D80" />
	);
	if (buttonType === "Dislike") {
		mainComponent = (
			// <CrossIcon width={iconeSize} height={iconeSize} />
			// Icone pleine Expo : croix
			<FontAwesome name="times" size={iconeSize} color="#8A2BE2" />
		);
	}
	if (buttonType === "Superlike") {
		mainComponent = (
			// <StarIcon width={iconeSize} height={iconeSize} />
			// Icone pleine Expo : étoile
			<FontAwesome name="star" size={iconeSize} color="#FFA500" />
		);
	}

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
		width: 70,
		height: 70,
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
