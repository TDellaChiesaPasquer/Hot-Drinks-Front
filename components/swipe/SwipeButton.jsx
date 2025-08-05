import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

export default function SwipeButton(props) {
	// Valeurs : Like, Dislike, SuperLike
	const [buttonType, setButtonType] = useState(props.type);

	// Id du profile affiché
	const idProfile = props.profileID;
	// Id de l'utilisateur connecté à l'app
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

		try {
			const response = await fetch(process.env.EXPO_PUBLIC_IP + "/profils/swipe", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: userInfos.token,
				},
				body: JSON.stringify({
					action: actionType,
					userId: idProfile,
				}),
			});
			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error("Erreur réseau :", error);
		}
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handleDecide} style={styles.button}>
				{mainComponent}
			</TouchableOpacity>
		</View>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 	},
// 	button: {
// 		flex: 1,
// 		textAlign: "center",
// 		width: 100,
// 		height: 100,
// 		borderRadius: 100,
// 		color: "red",
// 	},
// 	buttonLike: {
// 		backgroundColor: "green",
// 	},
// 	buttonDislike: {
// 		backgroundColor: "red",
// 	},
// 	buttonSuperLike: {
// 		backgroundColor: "yellow",
// 	},
// });

const styles = StyleSheet.create({
	/* bouton rond taille fixe */
	button: {
		justifyContent: "center",
		alignItems: "center",
		width: 90,
		height: 90,
		borderRadius: 45,
		backgroundColor: "#FFF5F0",
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 3,
	},

	/* couleurs arrière-plan supplémentaires (non appliquées tant que JSX n’est pas modifié) */
	buttonLike: { backgroundColor: "#FF4D80" },
	buttonDislike: { backgroundColor: "#8A2BE2" },
	buttonSuperLike: { backgroundColor: "#FFA500" },
});
