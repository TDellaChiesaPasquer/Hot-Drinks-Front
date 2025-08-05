import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

import HeartIcon from "../../assets/swipeButtons/heart.svg";
import StarIcon from "../../assets/swipeButtons/star.svg";
import CrossIcon from "../../assets/swipeButtons/cross.svg";

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
	// let mainComponent = <AntDesign name="heart" size={buttonSize} color="red" />;
	let mainComponent = <HeartIcon width={44} height={44} />;

	if (buttonType === "Dislike") {
		actionType = "Dislike";
		colorStyle = "buttonDislike";
		// mainComponent = <Entypo name="circle-with-cross" size={buttonSize} color="purple" />;
		mainComponent = <CrossIcon width={44} height={44} />;
	}
	if (buttonType === "Superlike") {
		actionType = "Superlike";
		colorStyle = "buttonSuperLike";
		// mainComponent = <AntDesign name="staro" size={buttonSize} color="yellow" />;
		mainComponent = <StarIcon width={44} height={44} />;
	}

async function handleDecide() {
	console.log(actionType);

	try {
		const response = await fetch(process.env.EXPO_PUBLIC_IP + "/profils/swipe", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization:
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQ0MDUxMjIsImV4cCI6NTM1NDQwNTEyMn0.EGriV0lC1HLV2RBlNsOM-Qf293a6yQTafNBPIHedOQU",
				// authorization: userInfos.token,
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
			<TouchableOpacity onPress={handleDecide} style={[styles.button, props.style]}>
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

	/* couleurs arrière-plan supplémentaires (non appliquées tant que JSX n’est pas modifié) */
	buttonLike: { backgroundColor: "#FF4D80" },
	buttonDislike: { backgroundColor: "#8A2BE2" },
	buttonSuperLike: { backgroundColor: "#FFA500" },
});
