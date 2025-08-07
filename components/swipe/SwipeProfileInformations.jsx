import React from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const SURFACE_BG = "#F5EBE6";
const CARD_BG = "#BC8D85";

const infoList = [
	{ label: "Goût", value: "Jazz" },
	{ label: "Goût", value: "Cuisine italienne" },
	{ label: "Goût", value: "Randonnée" },
	{ label: "Goût", value: "Lecture" },
	{ label: "Goût", value: "Photographie" },
	{ label: "Goût", value: "Films d’action" },
	{ label: "Goût", value: "Chocolat noir" },
	{ label: "Goût", value: "Voyages urbains" },
	{ label: "Goût", value: "Natation" },
	{ label: "Goût", value: "Thé vert" },
	{ label: "Goût", value: "Musées" },
	{ label: "Goût", value: "Séries policières" },
	{ label: "Goût", value: "Vélo" },
	{ label: "Goût", value: "Peinture" },
	{ label: "Goût", value: "Animaux" },
];

function TasteItem(props) {
	return (
		<View style={styles.item}>
			<Text style={styles.label}>{props.label}</Text>
			<View style={styles.valueBox}>
				<Text style={styles.value}>{props.value}</Text>
			</View>
		</View>
	);
}

export default function SwipeProfileInformations(props) {
	const itemsJSX = [];
	for (var i = 0; i < infoList.length; i++) {
		var item = infoList[i];
		itemsJSX.push(<TasteItem key={i} label={item.label} value={item.value} />);
	}
	return (
		// <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.wrapper}>
		<View style={styles.wrapper}>
			{itemsJSX}
		</View>
	//  </ScrollView>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		width: width, // largeur = largeur de l'écran en pixels
		minHeight: height * 0.5, // min height pour bien scroller sur mobile
		paddingLeft: 24, // 24px
		paddingRight: 24,
		paddingBottom: 40, // 40px
		backgroundColor: "#FFF", // Pour debug visuel
	},

	item: {
		width: "100%",
		minHeight: 56, // hauteur mini pilule
		marginBottom: 16, // 16px d’espace entre les éléments
		borderRadius: 40, // pilule arrondie
		backgroundColor: CARD_BG,
		paddingVertical: 10, // 10px haut/bas
		paddingHorizontal: 24, // 24px gauche/droite
		justifyContent: "center",
	},

	label: {
		fontWeight: "bold",
		fontSize: 13, // 13px
		color: SURFACE_BG,
		marginBottom: 4, // 4px
	},

	valueBox: {
		width: "100%",
		borderRadius: 8, // 8px
		backgroundColor: SURFACE_BG,
		paddingVertical: 12, // 12px
		paddingHorizontal: 14, // 14px
		justifyContent: "center",
	},

	value: {
		fontWeight: "600",
		fontSize: 16, // 16px
		color: "#000",
	},
});
