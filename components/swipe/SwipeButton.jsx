import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

// Import intile si on n'utilise pas les SGV
import HeartIcon from "../../assets/swipeButtons/heart.svg";
import StarIcon from "../../assets/swipeButtons/star.svg";
import CrossIcon from "../../assets/swipeButtons/cross.svg";

// Icones d'expo (inutiles si on utilise le SVG)
import { FontAwesome } from "@expo/vector-icons";

// Variable globale : choix entre SVG ou icônes Expo
const isFromSVG = false;

// Taille de l'icône
const iconSize = 34;

export default function SwipeButton(props) {
	const [buttonType] = useState(props.type);

	// Choix du composant graphique principal
	function getMainComponent(type) {
		if (isFromSVG) return getSVGComponent(type);
		return getExpoIconComponent(type);
	}

	// Sous-fonction pour les SVG (non utilisée ici)
	function getSVGComponent(type) {
		if (type === "Like") {
			return <HeartIcon width={iconSize} height={iconSize} />;
		}
		if (type === "Dislike") {
			return <CrossIcon width={iconSize} height={iconSize} />;
		}
		if (type === "Superlike") {
			return <StarIcon width={iconSize} height={iconSize} />;
		}
		return null;
	}

	// Sous-fonction pour les icônes Expo
	function getExpoIconComponent(type) {
		if (type === "Like") {
			return <FontAwesome name="heart" size={iconSize} color="#FF4D80" />;
		}
		if (type === "Dislike") {
			return <FontAwesome name="times" size={iconSize} color="#8A2BE2" />;
		}
		if (type === "Superlike") {
			return <FontAwesome name="star" size={iconSize} color="#FFA500" />;
		}
		return null;
	}

	// Gestion du clic sur le bouton
	function handlePress() {
		if (props.onChoice) {
			console.log(buttonType);
			props.onChoice(buttonType);
		}
	}

	// Affichage final
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePress} style={[styles.button, props.style]}>
				{getMainComponent(buttonType)}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerBouton: {
		height: "100%",
		width: "100%",
	},
	button: {
		justifyContent: "center",
		alignItems: "center",
		width: 60,
		height: 60,
		borderRadius: 45,
		backgroundColor: "#FFF5F0",
		elevation: 3,
    boxShadow: "0 2px 3px #896761",
	},
	buttonLike: { backgroundColor: "#FF4D80" },
	buttonDislike: { backgroundColor: "#8A2BE2" },
	buttonSuperLike: { backgroundColor: "#FFA500" },
});
