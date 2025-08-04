import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

export default function SwipeButton(props) {
	// Valeurs : Like, Dislike, SuperLike
	const [buttonType, setButtonType] = useState(props.type);

	const userInfos = useSelector((state) => state.user.value);

	const buttonSize = 80;

	let actionType = "Like";
	let colorStyle = "buttonLike";
	let mainComponent = <AntDesign name="heart" size={buttonSize} color="red" />;

	if (buttonType === "Dislike") {
		actionType = "Dislike";
		colorStyle = "buttonDislike";
		mainComponent = <Entypo name="circle-with-cross" size={buttonSize} color="purple" />;
	}
	if (buttonType === "Superlike") {
		actionType = "Superlike";
		colorStyle = "buttonSuperLike";
		mainComponent = <AntDesign name="staro" size={buttonSize} color="yellow" />;
	}

	async function handleDecide() {
		console.log(actionType);

		// try {
		// 	const response = await fetch(process.env.EXPO_PUBLIC_IP + "/profils/swipe", {
		// 		method: "PUT",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			Authorization: userInfos.token,
		// 		},
		// 		body: JSON.stringify({
		// 			action: actionType,
		// 			userId: /* A ajouter */,
		// 		}),
		// 	});
		// 	const data = await response.json();
		// 	console.log(data);
		// } catch (error) {
		// 	console.error("Erreur réseau :", error);
		// }
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
