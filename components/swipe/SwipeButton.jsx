import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

export default function SwipeButton(props) {
	// Valeurs : Accept, Refuse, SuperLike
	const [buttonType, setButtonType] = useState(props.type);

	const buttonSize = 80;

	let texteAfficher = "Like";
	let colorStyle = "buttonLike";
	let mainComponent = <AntDesign name="heart" size={buttonSize} color="red" />;

	if (buttonType === "Dislike") {
		texteAfficher = "Dislike";
		colorStyle = "buttonDislike";
		mainComponent = <Entypo name="circle-with-cross" size={buttonSize} color="purple" />;
	}
	if (buttonType === "Superlike") {
		texteAfficher = "Superlike";
		colorStyle = "buttonSuperLike";
		mainComponent = <AntDesign name="staro" size={buttonSize} color="yellow" />;
	}

	function handleDecide() {
		console.log(texteAfficher);
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handleDecide} style={styles.button}>
				{mainComponent}
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
