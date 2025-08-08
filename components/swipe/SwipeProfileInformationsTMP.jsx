import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { capitalize } from "../../Utils/utils";

const { width, height } = Dimensions.get("window");

export default function InfosProfilScreen(props) {
	const navigation = props.navigation;
	const route = props.route;

	// Données de test pour l'affichage
	const profileData = {
		username: "Emma",
		birthdate: "1995-06-15",
		distance: "12 km",
		relationship: "Expresso",
		photoList: ["https://picsum.photos/seed/user1/800/600", "https://picsum.photos/seed/user2/800/600", "https://picsum.photos/seed/user3/800/600"],
		tastesList: [
			{ category: "interest", value: "photographie", star: true },
			{ category: "interest", value: "randonnée", star: true },
			{ category: "interest", value: "cuisine", star: true },
			{ category: "interest", value: "yoga", star: false },
			{ category: "interest", value: "lecture", star: true },
		],
	};

	const calculateAge = (birthdate) => {
		const birthDate = new Date(birthdate);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	const handleGoBack = () => {
		navigation.goBack();
	};

	const handleSendMessage = () => {
		navigation.navigate("ConversationScreen", { userId: "test123" });
	};

	const age = calculateAge(profileData.birthdate);
	const starredTastes = profileData.tastesList.filter((taste) => taste.star === true);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
						<AntDesign name="left" size={24} color="#965A51" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Profil</Text>
					<View style={styles.headerSpacer}></View>
				</View>

				<ScrollView contentContainerStyle={styles.scrollContainer}>
					<View style={styles.photosContainer}>
						{profileData.photoList && profileData.photoList.length > 0 ? (
							<Swiper
								style={styles.swiperContainer}
								showsButtons={false}
								dot={<View style={styles.paginationDot} />}
								activeDot={<View style={styles.paginationActiveDot} />}
								paginationStyle={styles.paginationStyle}
							>
								{profileData.photoList.map((photoUri, index) => (
									<View key={index} style={styles.photoContainer}>
										<Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />
									</View>
								))}
							</Swiper>
						) : (
							<View style={styles.noPhotoContainer}>
								<Text style={styles.noPhotoText}>Aucune photo disponible</Text>
							</View>
						)}
					</View>

					<View style={styles.infoSection}>
						<Text style={styles.userName}>{profileData.username || "Utilisateur"}</Text>
						<Text style={styles.userAge}>{age} ans</Text>
						<Text style={styles.userDistance}>{profileData.distance || "Distance inconnue"}</Text>

						{profileData.relationship && (
							<View style={styles.relationshipContainer}>
								<Text style={styles.relationshipLabel}>Recherche :</Text>
								<Text style={styles.relationshipValue}>{profileData.relationship}</Text>
							</View>
						)}
					</View>

					{starredTastes.length > 0 && (
						<View style={styles.tastesSection}>
							<Text style={styles.tastesTitle}>Centres d'intérêt</Text>
							<View style={styles.tastesContainer}>
								{starredTastes.map((taste, index) => (
									<View key={index} style={styles.tasteItem}>
										<Text style={styles.tasteText}>#{capitalize(taste.value)}</Text>
									</View>
								))}
							</View>
						</View>
					)}
				</ScrollView>

				<View style={styles.bottomContainer}>
					<TouchableOpacity style={styles.messageButton} onPress={handleSendMessage}>
						<Text style={styles.messageButtonText}>Envoyer un message</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5EBE6",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		paddingVertical: 10,
		backgroundColor: "#F5EBE6",
	},
	backButton: {
		padding: 5,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#965A51",
	},
	headerSpacer: {
		width: 34,
	},
	scrollContainer: {
		paddingBottom: 80,
	},
	photosContainer: {
		height: height * 0.5,
		marginHorizontal: 20,
		marginTop: 10,
		borderRadius: 20,
		overflow: "hidden",
		backgroundColor: "#BC8D85",
	},
	swiperContainer: {
		height: "100%",
	},
	photoContainer: {
		flex: 1,
	},
	photo: {
		width: "100%",
		height: "100%",
	},
	noPhotoContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noPhotoText: {
		color: "#FFF5F0",
		fontSize: 16,
		fontWeight: "bold",
	},
	paginationStyle: {
		bottom: 20,
	},
	paginationDot: {
		backgroundColor: "rgba(255, 255, 255, 0.5)",
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
	},
	paginationActiveDot: {
		backgroundColor: "#FFF5F0",
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
	},
	infoSection: {
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	userName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#965A51",
		marginBottom: 5,
	},
	userAge: {
		fontSize: 18,
		color: "#BC8D85",
		marginBottom: 5,
	},
	userDistance: {
		fontSize: 16,
		color: "#BC8D85",
		marginBottom: 15,
	},
	relationshipContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	relationshipLabel: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#965A51",
		marginRight: 10,
	},
	relationshipValue: {
		fontSize: 16,
		color: "#BC8D85",
	},
	tastesSection: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	tastesTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#965A51",
		marginBottom: 15,
	},
	tastesContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	tasteItem: {
		backgroundColor: "#BC8D85",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 15,
		marginRight: 10,
		marginBottom: 10,
	},
	tasteText: {
		color: "#FFF5F0",
		fontSize: 14,
		fontWeight: "bold",
	},
	bottomContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "#F5EBE6",
		paddingHorizontal: 20,
		paddingVertical: 15,
	},
	messageButton: {
		backgroundColor: "#965A51",
		height: 45,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 2px 3px #896761",
	},
	messageButtonText: {
		color: "#F5EBE6",
		fontSize: 16,
		fontWeight: "bold",
	},
});
