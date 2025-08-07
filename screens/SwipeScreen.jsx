import React, { useRef, useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Swiper from "react-native-deck-swiper";
import SwipeContainer from "../components/swipe/SwipeContainer";
import PagerView from "react-native-pager-view";
import SwipeButton from "../components/swipe/SwipeButton";
import SwipeProfileInformations from "../components/swipe/SwipeProfileInformations";

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
    Audrey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQ0MDUxMjIsImV4cCI6NTM1NDQwNTEyMn0.EGriV0lC1HLV2RBlNsOM-Qf293a6yQTafNBPIHedOQU",
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
				// if (response) console.log("response : ");
				// if (response) console.log(response);
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

  function renderCardForIndex(cardIndexInList) {
    const profile = profileList[cardIndexInList];
    return (
      <View style={styles.card}>
        <SwipeContainer profile={profile} onChoice={handleUserChoice} />
      </View>
    );
  }

	return (
		<View style={styles.container}>
			<View style={styles.cardCcontainer}>
				<Swiper
					cardStyle={styles.innerCard}
					key={swiperComponentKey}
					ref={swiperReference}
					cards={cardList}
					renderCard={renderCardForIndex}
					stackSize={5}
					showSecondCard={true}
					infinite={false}
					onSwipedAll={fetchProfilesFromAPI}
					backgroundColor="transparent"
					onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, "Dislike")}
					onSwipedRight={(cardIndex) => handleSwipe(cardIndex, "Like")}
					verticalSwipe={false}
				/>
				{/* <SwipeProfileInformations style={styles.swipeProfileInformations} /> */}
			</View>
			<View style={styles.buttons}>
				{["Dislike", "Superlike", "Like"].map(function (buttonType) {
					return <SwipeButton key={buttonType} type={buttonType} onChoice={handleUserChoice} />;
				})}
			</View>
		</View>
	);
}

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
		elevation: 4,
		borderRadius: 20,
		shadowColor: "#896761",
		backgroundColor: "white",
		backfaceVisibility: "hidden",
	},
	card: {
		borderRadius: 20,
		overflow: "hidden",
		width: "100%",
		height: "100%",
	},
	buttons: {
		position: "absolute",
		left: screenWidth / 7,
		right: screenWidth / 20,
		height: "20%",
		bottom: "2%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		alignContent: "center",
		elevation: 5,
	},
	// swipeProfileInformations: {
	// 	flex: 1,
	// 	bottom: 0,
	// 	zIndex: 12,
	// },
});
