import React, { useRef, useState, useEffect, useCallback } from "react";
import { ScrollView, View, StyleSheet, Dimensions, Text, Button, Modal, TouchableOpacity, Pressable } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import Swiper from "react-native-deck-swiper";
import SwipeContainer from "../../components/swipe/SwipeContainer";
import PagerView from "react-native-pager-view";
import SwipeButton from "../../components/swipe/SwipeButton";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { newSuperlike } from "../../reducers/user";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const maxNumberOfCards = 10;
const enTest = false;

export default function SwipeScreen(props) {
	const swiperReference = useRef(null);
	const [profileList, setProfileList] = useState([]);
	const [swiperComponentKey, setSwiperComponentKey] = useState(0);
	const dispatch = useDispatch();
	const minDuration = 1000;
	const [lastTimeSwipe, setLastTimeSwipe] = useState(new Date());
	function canTriggerAction() {
		const now = new Date;
		// Ne conserver que les taps dans la fenêtre temporelle
    if ((new Date()).valueOf() - lastTimeSwipe.valueOf() < minDuration) {
      return false;
    }
    setLastTimeSwipe(now);
    return true;
	}

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				return true;
			};
			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

			return () => subscription.remove();
		}, [])
	);

	let userToken = useSelector(function (state) {
		return state.user.value.token;
	});

	let thisUserId = useSelector(function (state) {
		return state.user.value.user && String(state.user.value.user._id);
	});

	useEffect(function () {
		fetchProfilesFromAPI();
	}, []);

	function fetchProfilesFromAPI() {
		let profil = "profil";
		if (enTest) profil = "profilTMP";
		fetch(process.env.EXPO_PUBLIC_IP + "/profils/" + profil, {
			headers: {
				"Content-Type": "application/json",
				authorization: userToken,
			},
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (jsonResponse) {
				const fetchedProfiles = jsonResponse.profilList || [];
				setProfileList(fetchedProfiles);
				setSwiperComponentKey(function (previousKey) {
					return previousKey + 1;
				});
			})
			.catch(function (error) {
				console.error("fetch /profils/profil:", error);
				setProfileList([]);
			});
	}

	function handleUserChoice(choiceAction) {
		if (!swiperReference.current) return;

		// Anti-spam: max 3 appuis/s
		if (!canTriggerAction()) {
			// Optionnel: afficher un feedback utilisateur
			// console.warn("Action trop rapide, réessayez dans un instant.");
			return;
		}

		if (choiceAction === "Like") {
			swiperReference.current.swipeRight();
		}
		if (choiceAction === "Dislike") {
			swiperReference.current.swipeLeft();
		}
		if (choiceAction === "Superlike") {
			dispatch(newSuperlike());
			swiperReference.current.swipeTop();
		}
	}

	function handleSwipe(cardIndex, action) {
		const profile = profileList[cardIndex];
		if (profile && profile._id) {
			sendSwipeToServer(profile._id, action);
		}
	}
	function sendSwipeToServer(userId, userAction) {
		const apiUrl = process.env.EXPO_PUBLIC_IP + "/profils/swipe";

		const payload = {
			action: userAction.toLowerCase(),
			userId: userId,
		};
		const fetchOptions = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: userToken,
			},
			body: JSON.stringify(payload),
		};
		fetch(apiUrl, fetchOptions)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				if (data.match) console.log("Vous avez un match !");
			})
			.catch(function (error) {
				console.error("Erreur réseau lors du swipe :", error);
			});
	}

	function renderCardForIndex(profile, index) {
		// Vérifier si l'utilisateur actuel a été superliké par ce profil
		const isSuperliked =
			profile &&
			profile.superlikesList &&
			profile.superlikesList.some(function (superlikerId) {
				return String(superlikerId) === thisUserId;
			});
		return (
			<View style={[styles.card, isSuperliked && styles.cardSuperliked]}>
				<SwipeContainer profile={profile} onChoice={handleUserChoice} />
			</View>
		);
	}
	return (
		<View style={styles.container}>
			{profileList.length !== 0 ? (
				<View style={styles.cardCcontainer}>
					<Swiper
						cardStyle={styles.innerCard}
						key={swiperComponentKey}
						ref={swiperReference}
						cards={profileList}
						renderCard={(card, index) => renderCardForIndex(card, index)}
						keyExtractor={(card) =>  card ? card._id : 26}
						onSwipedAll={() => setTimeout(fetchProfilesFromAPI, 500)}
						backgroundColor="transparent"
            stackSize={3}
						onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, "Dislike")}
						onSwipedRight={(cardIndex) => handleSwipe(cardIndex, "Like")}
						onSwipedTop={(cardIndex) => handleSwipe(cardIndex, "SuperLike")}
						verticalSwipe={false}
					/>
				</View>
			) : (
				<NoProfilesMessage onRefresh={() => setTimeout(fetchProfilesFromAPI, 500)} />
			)}
			<View style={styles.buttons}>
				{["Dislike", "Superlike", "Like"].map(function (buttonType) {
					return <SwipeButton key={buttonType} type={buttonType} onChoice={handleUserChoice} />;
				})}
			</View>
		</View>
	);
}

function NoProfilesMessage(props) {
	return (
		<View style={styles.noProfilesContainer}>
			{/* Icône principale */}
			<View style={styles.iconContainer}>
				<Text style={styles.heartIcon}>💝</Text>
			</View>

			{/* Titre */}
			<Text style={styles.noProfilesTitle}>Plus de profils !</Text>

			{/* Message */}
			<Text style={styles.noProfilesSubtitle}>Plus de nouveaux profils à swiper pour l'instant</Text>

			{/* Message encourageant */}
			<View style={styles.encouragementBox}>
				<Text style={styles.encouragementText}>💫 Revenez plus tard pour découvrir de nouveaux profils intéressants !</Text>
			</View>

			{/* Bouton actualiser */}
			<TouchableOpacity onPress={props.onRefresh} style={styles.refreshButton}>
				<Text style={styles.refreshButtonText}>🔄 Actualiser</Text>
			</TouchableOpacity>
		</View>
	);
}

// Définir la couleur de brillance au début du fichier (avant la fonction StyleSheet.create)
const SUPERLIKE_GLOW_COLOR = "#75c7feff";

// Fonction helper pour convertir hex en rgba
const hexToRgba = (hexColor, alphaValue) => {
	const redColor = parseInt(hexColor.slice(1, 3), 16);
	const greenColor = parseInt(hexColor.slice(3, 5), 16);
	const blueColor = parseInt(hexColor.slice(5, 7), 16);
	return `rgba(${redColor}, ${greenColor}, ${blueColor}, ${alphaValue})`;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		height: "100%",
		backgroundColor: "#F5EBE6",
		flexDirection: "column",
	},

	cardCcontainer: {
		width: "100%",
		height: "100%",
		backgroundColor: "#F5EBE6",
	},
	innerCard: {
		height: "85%",
		width: "90%",
		marginTop: "-5%",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
		backgroundColor: "white",
		backfaceVisibility: "hidden",
		boxShadow: "0 2px 3px #896761",
	},
	card: {
		borderRadius: 20,
		overflow: "hidden",
		width: "100%",
		height: "100%",
	},
	cardSuperliked: {
		shadowColor: SUPERLIKE_GLOW_COLOR,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.9,
		shadowRadius: 15,
		elevation: 20,
		borderWidth: 1,
		borderColor: hexToRgba(SUPERLIKE_GLOW_COLOR, 0.6),
		// Effet de triple ombre pour plus de brillance
		boxShadow: `0 0 15px ${hexToRgba(SUPERLIKE_GLOW_COLOR, 0.8)}, 0 0 25px ${hexToRgba(SUPERLIKE_GLOW_COLOR, 0.4)}, 0 0 35px ${hexToRgba(SUPERLIKE_GLOW_COLOR, 0.2)}`,
	},
	buttons: {
		position: "absolute",
		left: screenWidth / 7,
		right: screenWidth / 20,
		height: "20%",
		bottom: "-1%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		alignContent: "center",
		elevation: 5,
		zIndex: 10,
	},
	noProfilesContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5EBE6",
		paddingHorizontal: 40,
	},
	iconContainer: {
		backgroundColor: "#DFC9B4",
		borderRadius: 40,
		width: 80,
		height: 80,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 30,
		shadowColor: "#896761",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 5,
	},
	heartIcon: {
		fontSize: 40,
	},
	noProfilesTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#965A51",
		textAlign: "center",
		marginBottom: 15,
	},
	noProfilesSubtitle: {
		fontSize: 18,
		color: "#965A51",
		textAlign: "center",
		marginBottom: 30,
		lineHeight: 24,
	},
	encouragementBox: {
		backgroundColor: "#DFC9B4",
		borderRadius: 20,
		padding: 20,
		marginBottom: 40,
		shadowColor: "#896761",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 3,
	},
	encouragementText: {
		color: "#965A51",
		textAlign: "center",
		fontSize: 16,
		lineHeight: 22,
		fontWeight: "500",
	},
	refreshButton: {
		backgroundColor: "#965A51",
		borderRadius: 25,
		paddingVertical: 15,
		paddingHorizontal: 40,
		shadowColor: "#896761",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 5,
	},
	refreshButtonText: {
		color: "#F5EBE6",
		fontWeight: "bold",
		fontSize: 18,
	},
});
