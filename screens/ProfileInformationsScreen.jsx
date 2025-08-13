import React from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { Image } from "expo-image";
import { capitalize } from "../Utils/utils.js";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const SURFACE_BG = "#F5EBE6";
const CARD_BG = "#BC8D85";

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

const EmptyItems = ({ username }) => (
	<View style={styles.emptyState}>
		<Text style={styles.emptyText}>{username || "Ce profil"} n'a pas encore indiqué ses préférences...</Text>
	</View>
);

// Fonction pour calculer l'âge à partir de la date de naissance
function calculateAge(birthdate) {
	if (!birthdate) return null;

	const today = new Date();
	const birthDate = new Date(birthdate);
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

export default function SwipeProfileInformations() {
	const navigation = useNavigation();
	const route = useRoute();

	// Récupération de TOUTES les données du profil
	const profileData = route?.params?.profileData || {};
	const { username = "Anonyme", birthdate, gender = "Non spécifié", orientation = "Non spécifié", relationship = "Non spécifié", distance = "Distance inconnue", tastesList = [] } = profileData;

	// Calcul de l'âge
	const age = calculateAge(birthdate) || "?";

	// Récupération de la première image
	const firstImageFromRoute = route?.params?.firstImage || null;

	// Construction des données de goûts à afficher
	const dataToDisplay = tastesList.map((t) => ({
		label: t?.category || "Goût",
		value: t?.value || "",
	}));

	// Générer les éléments JSX pour chaque goût
	const itemsJSX = dataToDisplay.map((item, i) => <TasteItem key={i} label={capitalize(item.label)} value={capitalize(item.value)} />);

	// Utiliser l'image passée en paramètre
	const imageSource = firstImageFromRoute || {
		uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1080&h=607&q=80",
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Informations du profil</Text>

			{/* Bouton de retour (flèche gauche) */}
			<View style={styles.backButtonWrapper}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
					<FontAwesome name="arrow-left" size={20} color="#000" />
				</TouchableOpacity>
			</View>

			<ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.wrapper} alwaysBounceVertical={true}>
				<Image key={0} source={imageSource} style={styles.image} contentFit="cover" />

				{/* Informations de base */}
				<View style={styles.infoSection}>
					<Text style={styles.sectionTitle}>Informations</Text>

					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Nom</Text>
						<Text style={styles.infoValue}>{username}</Text>
					</View>

					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Âge</Text>
						<Text style={styles.infoValue}>{age} ans</Text>
					</View>

					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Genre</Text>
						<Text style={styles.infoValue}>{gender}</Text>
					</View>

					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Recherche</Text>
						<Text style={styles.infoValue}>{orientation}</Text>
					</View>

					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Type de relation</Text>
						<Text style={styles.infoValue}>{relationship}</Text>
					</View>

					<View style={styles.infoItem}>
						<Text style={styles.infoLabel}>Distance</Text>
						<Text style={styles.infoValue}>{distance}</Text>
					</View>
				</View>

				{/* Goûts et préférences */}
				<View style={styles.infoSection}>
					<Text style={styles.sectionTitle}>Goûts et préférences</Text>
					{itemsJSX.length === 0 ? <EmptyItems username={username} /> : itemsJSX}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5EBE6",
		alignItems: "center",
	},
	title: {
		fontSize: 20,
		alignItems: "center",
		color: "#965A51",
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 10,
	},
	wrapper: {
		width: width,
		minHeight: height * 0.5,
		paddingLeft: 24,
		paddingRight: 24,
		paddingBottom: 40,
	},
	item: {
		width: "100%",
		minHeight: 56,
		marginBottom: 16,
		borderRadius: 40,
		backgroundColor: CARD_BG,
		paddingVertical: 10,
		paddingHorizontal: 24,
		justifyContent: "center",
	},
	label: {
		fontWeight: "bold",
		fontSize: 13,
		color: SURFACE_BG,
		marginBottom: 4,
	},
	valueBox: {
		width: "100%",
		borderRadius: 8,
		backgroundColor: SURFACE_BG,
		paddingVertical: 12,
		paddingHorizontal: 14,
		justifyContent: "center",
	},
	value: {
		fontWeight: "600",
		fontSize: 16,
		color: "#000",
	},
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
	image: {
		justifyContent: "center",
		height: height * 0.6,
		marginBottom: 20,
		marginTop: 20,
		borderRadius: 12,
	},
	// Nouveaux styles
	infoSection: {
		marginTop: 20,
		marginBottom: 30,
		width: "100%",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#965A51",
		marginBottom: 15,
	},
	infoItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: CARD_BG,
		borderRadius: 15,
		padding: 15,
		marginBottom: 10,
	},
	infoLabel: {
		fontSize: 14,
		fontWeight: "bold",
		color: SURFACE_BG,
	},
	infoValue: {
		fontSize: 14,
		color: SURFACE_BG,
		fontWeight: "500",
	},
	emptyState: {
		padding: 20,
		alignItems: "center",
		backgroundColor: "#FFF5F0",
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "rgba(188, 141, 133, 0.25)",
	},
	emptyText: {
		color: "#965A51",
		textAlign: "center",
		fontSize: 16,
		fontWeight: "600",
	},
});
