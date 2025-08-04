import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function SwipeButton(props) {
	// Valeurs : Accept, Refuse, SuperLike
	const [buttonType, setButtonType] = useState(props.type);

	let texteAfficher = "Like";
	if (buttonType === "Dislike") texteAfficher = "Dislike";
	if (buttonType === "Superlike") texteAfficher = "Superlike";

	function handleDecide() {
		console.log(texteAfficher);
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handleDecide} style={styles.button}>
				<Text style={styles.buttonText}>{texteAfficher}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
