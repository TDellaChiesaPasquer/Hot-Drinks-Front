import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Swiper from "react-native-deck-swiper";
import SwipeContainer from "../components/swipe/SwipeContainer";
import PagerView from "react-native-pager-view";
import SwipeButton from "../components/swipe/SwipeButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const maxNumberOfCards = 10;

export default function SwipeScreen(props) {
	const swiperReference = useRef(null);
	const [profileList, setProfileList] = useState([]);
	const [cardList, setCardList] = useState([]);
	const [swiperComponentKey, setSwiperComponentKey] = useState(0);

	const enTest = false;
	// const dbUtilisee = "Audrey";
	const dbUtilisee = "Cyrille";
	const db = {
		Audrey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQ0MDUxMjIsImV4cCI6NTM1NDQwNTEyMn0.EGriV0lC1HLV2RBlNsOM-Qf293a6yQTafNBPIHedOQU",
		Cyrille:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk0NzExNTA5NjdiOTE1OTgwZTRmOGMiLCJ0b2tlbk51bWJlciI6NiwiaWF0IjoxNzU0NTYwNTc0LCJleHAiOjUzNTQ1NjA1NzR9.HVQMNJzi_m6X0GuTW6DCbkEUVIzf0ZnZ_U0Zb0o1Aws",
	};
	const tokenTmp = db[dbUtilisee];

	let userToken = null;
	if (enTest) {
		userToken = tokenTmp;
	} else
		userToken = useSelector(function (state) {
			return state.user.value.token;
		});

	useEffect(function () {
		fetchProfilesFromAPI();
	}, []);

	function fetchProfilesFromAPI() {
		// console.log("début fetchProfilesFromAPI");
		fetch(process.env.EXPO_PUBLIC_IP + "/profils/profil", {
			headers: {
				"Content-Type": "application/json",
				authorization: userToken,
			},
		})
			.then(function (response) {
				if (response) console.log("response : ");
				if (response) console.log(response);
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

	function handleSwipe(cardIndex, action) {
		const profile = profileList[cardIndex];
		if (profile && profile._id) {
			sendSwipeToServer(profile._id, action);
		}
	}

	function sendSwipeToServer(userId, userAction) {
		const apiUrl = process.env.EXPO_PUBLIC_IP + "/profils/swipe";

		console.log("userId : " + userId);
		console.log("userAction : " + userAction);

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
		<SafeAreaProvider style={styles.pageCcontainer}>
			<SafeAreaView style={styles.container}>
				<Swiper
					cardStyle={styles.card}
					key={swiperComponentKey}
					ref={swiperReference}
					cards={cardList}
					renderCard={renderCardForIndex}
					stackSize={2}
					showSecondCard={true}
					infinite={false}
					onSwipedAll={fetchProfilesFromAPI}
					backgroundColor="transparent"
					onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, "Dislike")}
					onSwipedRight={(cardIndex) => handleSwipe(cardIndex, "Like")}
					onSwipedTop={(cardIndex) => handleSwipe(cardIndex, "Superlike")}
					verticalSwipe={false}
				/>
			</SafeAreaView>

			<View style={styles.buttons}>
				{["Dislike", "Superlike", "Like"].map(function (buttonType) {
					return <SwipeButton key={buttonType} type={buttonType} onChoice={props.onChoice} />;
				})}
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},
	pageContainer: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},
	card: {
		flex: 1,
		width: screenWidth * 0.9,
		height: screenHeight - screenHeight / 4,
		alignSelf: "center",
		backgroundColor: "#FFF5F0",
		borderRadius: 24,
		shadowColor: "#000",
		boxShadow: "0 2px 3px #896761",
		// shadowOpacity: 0.15,
		// shadowOffset: { width: 0, height: 2 },
		// shadowRadius: 6,
		// elevation: 4,
		// overflow: "hidden",
	},
	buttons: {
		position: "absolute",
		flex: 1,
		left: 50,
		right: 10,
		bottom: screenHeight - screenHeight * 0.77,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		alignContent: "center",
		zIndex: 10,
	},
});
