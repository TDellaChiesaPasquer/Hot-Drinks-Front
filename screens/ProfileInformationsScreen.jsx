import React from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { capitalize } from "../Utils/utils.js";
import AntDesign from "@expo/vector-icons/AntDesign";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const SURFACE_BG = "#F5EBE6";
const CARD_BG = "#BC8D85";

// Tableau des types de relation avec leurs descriptions
const relationTypes = {
	Allongé: "Relation sérieuse",
	Thé: "Plus si affinités",
	Expresso: "Sans prise de tête",
	Ristretto: "Un shot de plaisir",
	Matcha: "Relation amicale",
};

const PrefRow = ({ icon, label, value }) => (
	<View style={styles.prefRow}>
		{icon ? <FontAwesome name={icon} size={14} color="#965A51" style={styles.prefIcon} /> : null}
		<Text style={styles.prefLabel}>{label}</Text>
		<Text style={styles.prefValue}>{value}</Text>
	</View>
);

const EmptyItems = ({ username }) => (
	<View style={styles.emptyState}>
		<Text style={styles.emptyText}>{username || "Ce profil"} n'a pas encore indiqué ses préférences...</Text>
	</View>
);

function InfoItem({ label, value }) {
	// return (
	// 	<View style={styles.infoItem}>
	// 		<Text style={styles.infoLabel}>{label}</Text>
	// 		<Text style={styles.infoValue}>{value}</Text>
	// 	</View>
	// );
	return <PrefRow icon="heart" label={label} value={value} />;
}

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

const isValidDistance = (distance) => {
	return distance !== undefined && distance !== null && String(distance).trim().toLowerCase() !== "nan";
};

// Sous-composant: username + age (âge un peu plus grand) + distance à droite
const HeaderBasics = ({ username, age, distance }) => {
	const ageIsNumber = typeof age === "number" && !isNaN(age);
	const ageText = ageIsNumber ? `${age} an${age > 1 ? "s" : ""}` : "?";
	return (
		<View style={styles.headerBasics}>
			<View style={styles.headerTopRow}>
				<View style={styles.nameAgeRow}>
					<Text style={styles.nameText}>{username.trim() + ", "}</Text>
					<Text style={styles.ageText}>{ageText}</Text>
				</View>

				{isValidDistance(distance) && (
					<View style={styles.distanceRight}>
						<FontAwesome name="map-marker" size={14} color="#965A51" style={styles.distanceIcon} />
						<Text style={styles.distanceText}>{distance}</Text>
					</View>
				)}
			</View>
		</View>
	);
};

export default function SwipeProfileInformations() {
	const navigation = useNavigation();
	const route = useRoute();

	// Récupération de TOUTES les données du profil
	const profileData = route?.params?.profileData || {};
	const { username = "Anonyme", birthdate, gender = "Non spécifié", orientation = "Non spécifié", relationship = "Non spécifié", distance, tastesList = [] } = profileData;

	// Calcul de l'âge
	const age = calculateAge(birthdate) || "?";

	// Récupération de la première image
	const firstImageFromRoute = route?.params?.firstImage || null;

	// Utiliser l'image passée en paramètre
	const imageSource = firstImageFromRoute || {
		uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1080&h=607&q=80",
	};

	// Déterminer la description du type de relation
	const relationDescription = relationTypes[relationship] || capitalize(relationship);

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonLeft}>
					<AntDesign name="left" size={24} color="#965A51" />
				</TouchableOpacity>
				<Text style={styles.title}>Informations du profil</Text>
				<View style={styles.buttonLeft}></View>
			</View>

			<ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.wrapper} alwaysBounceVertical={true}>
				<Image key={0} source={imageSource} style={styles.image} contentFit="cover" accessibilityLabel="Photo de la personne" />

				{/* Infos basiques et préférences (sans cadre) */}
				<View style={styles.infoSection}>
					<HeaderBasics username={username} age={age} distance={distance} />

					<PrefRow icon="venus-mars" label="Genre" value={capitalize(gender)} />
					<PrefRow icon="search" label="Recherche" value={capitalize(orientation)} />
					<PrefRow icon="heart" label="relationship" value={capitalize(relationDescription)} />
				</View>

				{/* Goûts */}
				<View style={styles.infoSection}>
					<Text style={styles.sectionTitle}>Goûts</Text>

					{tastesList.length === 0 ? (
						<EmptyItems username={username} />
					) : (
						tastesList.map((taste, index) => <InfoItem key={index} label={capitalize(taste?.category || "Goût")} value={capitalize(taste?.value || "")} />)
					)}
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
		alignItems: "center",
		color: "#965A51",
		fontWeight: "bold",
		fontSize: 20,
		marginVertical: 10,
	},
	wrapper: {
		width: width,
		minHeight: height * 0.5,
		paddingLeft: 24,
		paddingRight: 24,
		paddingBottom: 40,
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
		boxShadow: "0 2px 3px #896761",
	},

	// Sections
	infoSection: {
		marginTop: 20,
		marginBottom: 30,
		width: "100%",
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#965A51",
		marginBottom: 12,
	},

	// Header (username + âge + distance à droite)
	headerBasics: {
		marginBottom: 10,
	},
	headerTopRow: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
	},
	nameAgeRow: {
		flexDirection: "row",
		alignItems: "flex-end",
		flexWrap: "wrap",
		flexShrink: 1,
	},
	nameText: {
		color: "#965A51",
		fontSize: 26,
		fontWeight: "800",
		lineHeight: 28,
	},
	ageText: {
		color: "#965A51",
		opacity: 0.8,
		fontSize: 18,
		fontWeight: "700",
		lineHeight: 26,
		marginLeft: 6,
	},

	// Distance alignée à droite
	distanceRight: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 16,
	},
	distanceIcon: {
		marginRight: 6,
	},
	distanceText: {
		color: "#965A51",
		fontSize: 16,
		fontWeight: "800",
		opacity: 0.9,
		textAlign: "right",
	},

	// Lignes d'infos (préférences)
	prefRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 10,
		paddingVertical: 4,
	},
	prefIcon: {
		marginRight: 10,
	},
	prefLabel: {
		color: "#965A51",
		opacity: 0.7,
		fontSize: 15,
		fontWeight: "600",
		flexShrink: 0,
		marginRight: 8,
	},
	prefValue: {
		color: "#965A51",
		fontSize: 17,
		fontWeight: "800",
		flex: 1,
		textAlign: "right",
	},

	// Goûts
	infoItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: CARD_BG,
		borderRadius: 15,
		padding: 15,
		marginBottom: 10,
		boxShadow: "0 2px 3px #896761",
	},
	infoLabel: {
		fontSize: 16,
		fontWeight: "bold",
		color: SURFACE_BG,
	},
	infoValue: {
		fontSize: 16,
		color: SURFACE_BG,
		fontWeight: "500",
	},

	// Empty state
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
		fontSize: 18,
		fontWeight: "600",
	},
	buttonLeft: {
		height: 50,
		width: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	top: {
		height: 50,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "100%",
	},
});
