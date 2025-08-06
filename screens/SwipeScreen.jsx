import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Swiper from "react-native-deck-swiper";
import SwipeContainer from "../components/swipe/SwipeContainer";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const maxNumberOfCards = 10;

export default function SwipeScreen(props) {
	const swiperReference = useRef(null);
	const [newProfiles, setNewProfiles] = useState(false);
	const [profileList, setProfileList] = useState([]);
	const [cardList, setCardList] = useState([]);
	const [swiperComponentKey, setSwiperComponentKey] = useState(0);

	const enTest = true;
	// const dbUtilisee = "Audrey";
	const dbUtilisee = "Cyrille";
	const db = [
		{
			Audrey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQ0MDUxMjIsImV4cCI6NTM1NDQwNTEyMn0.EGriV0lC1HLV2RBlNsOM-Qf293a6yQTafNBPIHedOQU",
		},
		{
			Cyrille: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkzNzg4Nzg5NmU2ODA4NTUzNjM3ZGEiLCJpYXQiOjE3NTQ0OTUxMTIsImV4cCI6NTM1NDQ5NTExMn0.WjDHi5_UCcni4rGG9uK3U8fFk-9EYwUDeVld1ladd3w",
		},
	];

	const userToken = useSelector(function (state) {
		if (enTest)
			return db[dbUtilisee];
		return state.user.value.token;
	});

	useEffect(function () {
		fetchProfilesFromAPI();
	}, []);

	function fetchProfilesFromAPI() {
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
				// console.log("fetchedProfiles : ");
				// console.log(fetchedProfiles);
				setProfileList(fetchedProfiles);
				setCardList(
					fetchedProfiles.map(function (_, index) {
						return index;
					})
				);
				setSwiperComponentKey(function (previousKey) {
					return previousKey + 1;
				});
			})
			.catch(function (error) {
				console.error("fetch /profils/profil:", error);
				setProfileList([]);
				setCardList([]);
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
			swiperReference.current.swipeTop();
		}
	}

	function sendSwipeToServer(cardIndexInList, userAction) {
		const profileIdToSend = profileList[cardIndexInList]?.idProfile || "";
		const apiUrl = process.env.EXPO_PUBLIC_IP + "/profils/swipe";

		// console.log("profileIdToSend : " + profileIdToSend);
		// console.log("userAction :" + userAction);

		const payload = {
			action: userAction,
			userId: profileIdToSend,
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
				// Rien pour le moment
			})
			.catch(function (error) {
				console.error("Erreur réseau lors du swipe :", error);
			});
	}

	function renderCardForIndex(cardIndexInList) {
		const profile = profileList[cardIndexInList];
		return (
			<View style={styles.card}>
				<SwipeContainer profile={profile} onChoice={handleUserChoice} />
			</View>
		);
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<Swiper
					key={swiperComponentKey}
					ref={swiperReference}
					cards={cardList}
					renderCard={renderCardForIndex}
					stackSize={2}
					showSecondCard={true}
					infinite={false}
					onSwipedAll={fetchProfilesFromAPI}
					backgroundColor="transparent"
					onSwipedLeft={function (cardIndex) {
						sendSwipeToServer(cardIndex, "Dislike");
					}}
					onSwipedRight={function (cardIndex) {
						sendSwipeToServer(cardIndex, "Like");
					}}
					onSwipedTop={function (cardIndex) {
						sendSwipeToServer(cardIndex, "Superlike");
					}}
					verticalSwipe={false}
					onSwipedAll={() => {
						console.log("New profiles");
						fetchProfilesFromAPI();
						setNewProfiles(!newProfiles);
					}}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},
	card: {
		flex: 1,
		width: screenWidth * 0.9,
		height: screenHeight,
		alignSelf: "center",
		backgroundColor: "#FFF5F0",
		borderRadius: 24,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		elevation: 4,
	},
});
