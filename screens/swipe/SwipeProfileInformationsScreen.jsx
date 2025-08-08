import React from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

// tmp pour le test
import Swiper from "react-native-swiper";
import { Image } from "expo-image";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const SURFACE_BG = "#F5EBE6";
const CARD_BG = "#BC8D85";

// Liste fallback si aucun goût n'est passé via la navigation
const infoList = [
	{ label: "Goût", value: "Jazz" },
	{ label: "Goût", value: "Cuisine italienne" },
	{ label: "Goût", value: "Randonnée" },
	{ label: "Goût", value: "Lecture" },
	{ label: "Goût", value: "Photographie" },
	{ label: "Goût", value: "Films d'action" },
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
	const navigation = useNavigation();
	const route = useRoute();

	// Récupération des goûts passés depuis la page de swipe
	const tastesFromRoute = Array.isArray(route?.params?.tastesList) ? route.params.tastesList : null;

	// Construction des données à afficher au format "type de goût -> goût"
	const dataToDisplay = tastesFromRoute
		? tastesFromRoute.map((t) => ({
				label: t?.category || "Goût",
				value: t?.value || "",
		  }))
		: infoList;

	const itemsJSX = [];
	for (var i = 0; i < dataToDisplay.length; i++) {
		var item = dataToDisplay[i];
		itemsJSX.push(<TasteItem key={i} label={item.label} value={item.value} />);
	}

	// tmp pour le test
	const imagesList = [
		{ uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1080&h=607&q=80" },
		{ uri: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1080&h=607&q=80" },
		{ uri: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1080&h=607&q=80" },
		{ uri: "https://images.unsplash.com/photo-1558981283-cc59d621f562?auto=format&fit=crop&w=1080&h=607&q=80" },
	];


	return (
		<View style={{ flex: 1, backgroundColor: "#F5EBE6" }}>
			{/* Bouton de retour (flèche gauche) */}
			<View style={styles.backButtonWrapper}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
					<FontAwesome name="arrow-left" size={20} color="#000" />
				</TouchableOpacity>
			</View>

			<ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.wrapper}>
				{/* <Swiper
					loop={false}
					showsButtons
					nextButton={<Text style={{ color: "#F5EBE6", fontSize: 30 }}>›</Text>}
					prevButton={<Text style={{ color: "#F5EBE6", fontSize: 30 }}>‹</Text>}
					activeDotColor="white"
				>
					{imagesList.map(function (imageSource, imageIndex) {
						return <Image key={imageIndex} source={imageSource} style={styles.image} contentFit="cover" />;
					})}
				</Swiper> */}

				{itemsJSX}
			</ScrollView>
		</View>
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

	// Nouveau: bouton retour (flèche gauche)
	backButtonWrapper: {
		position: "absolute",
		top: 16,
		left: 16,
		zIndex: 10,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#FFF5F0",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 3,
	},
	// tmp pour le test
	image: {
		width,
		height: height * 0.6,
	},
});
