import React, { useRef, useState, useEffect, useCallback } from "react";
import { ScrollView, View, StyleSheet, Dimensions, Text, Button } from "react-native";
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

export default function SwipeScreen(props) {
	const swiperReference = useRef(null);
	const [profileList, setProfileList] = useState([]);
	const [swiperComponentKey, setSwiperComponentKey] = useState(0);
  const dispatch = useDispatch();

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
    console.log('test')
		fetch(process.env.EXPO_PUBLIC_IP + "/profils/profil", {
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

		// console.log("userId : " + userId);
		// console.log("userAction : " + userAction);

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
				// console.log("sendSwipeToServer -data");
				// console.log(data);
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
			{profileList.length !== 0 ? <View style={styles.cardCcontainer}>
				<Swiper
					cardStyle={styles.innerCard}
					key={swiperComponentKey}
					ref={swiperReference}
					cards={profileList}
					renderCard={(card, index) => renderCardForIndex(card, index)}
          keyExtractor={(card) => card}
					onSwipedAll={() => setTimeout(fetchProfilesFromAPI, 500)}
					backgroundColor="transparent"
					onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, "Dislike")}
					onSwipedRight={(cardIndex) => handleSwipe(cardIndex, "Like")}
					onSwipedTop={(cardIndex) => handleSwipe(cardIndex, "SuperLike")}
					verticalSwipe={false}
				/>
			</View> : <Text>Aucun profil restant</Text>}
			<View style={styles.buttons}>
				{["Dislike", "Superlike", "Like"].map(function (buttonType) {
					return <SwipeButton key={buttonType} type={buttonType} onChoice={handleUserChoice} />;
				})}
			</View>
		</View>
	);
}

// Définir la couleur de brillance au début du fichier (avant la fonction StyleSheet.create)
const SUPERLIKE_GLOW_COLOR = "#75c7feff";

// Fonction helper pour convertir hex en rgba
const hexToRgba = (hexColor, alphaValue) => {
	// Extraction de la composante rouge : caractères 1-2 de la chaîne hex (ex: "75" dans "#75c7fe" = 117)
	const redColor = parseInt(hexColor.slice(1, 3), 16);

	// Extraction de la composante verte : caractères 3-4 de la chaîne hex (ex: "c7" dans "#75c7fe" = 199)
	const greenColor = parseInt(hexColor.slice(3, 5), 16);

	// Extraction de la composante bleue : caractères 5-6 de la chaîne hex (ex: "fe" dans "#75c7fe" = 254)
	const blueColor = parseInt(hexColor.slice(5, 7), 16);

	// Conversion des valeurs hexadécimales (base 16) en valeurs décimales (base 10)
	// parseInt(string, 16) convertit une chaîne hexadécimale en nombre décimal
	// Résultat pour "#75c7fe" : rouge=117, vert=199, bleu=254 (couleur bleu clair/cyan)

	// Construction de la chaîne rgba avec les composantes RGB (0-255) et alpha (0-1)
	// Ex: hexToRgba("#75c7fe", 0.8) → "rgba(117, 199, 254, 0.8)"
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
});
