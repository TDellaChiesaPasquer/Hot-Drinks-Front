import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function SwipeButton(props) {
	// Valeurs : Accept, Refuse, SuperLike
	const [buttonType, setButtonType] = useState(props.type);

	let texteAfficher = "Like";
	let colorStyle = "buttonLike";

	if (buttonType === "Dislike") {
		texteAfficher = "Dislike";
		colorStyle = "buttonDislike";
	}
	if (buttonType === "Superlike") {
		texteAfficher = "Superlike";
		colorStyle = "buttonSuperLike";
	}

	function handleDecide() {
		console.log(texteAfficher);
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handleDecide} style={[styles.button, styles[colorStyle]]}>
				<Text style={styles.buttonText}>{texteAfficher}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	button: {
		flex: 1,
		textAlign: "center",
		width: 100,
		height: 100,
		borderRadius: 100,
		color: "red",
	},
	buttonLike: {
		backgroundColor: "green",
	},
	buttonDislike: {
		backgroundColor: "red",
	},
	buttonSuperLike: {
		backgroundColor: "yellow",
	},
});
