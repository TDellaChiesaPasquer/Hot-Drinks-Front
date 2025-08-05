import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Swiper from "react-native-deck-swiper";
import SwipeContainer from "../components/swipe/SwipeContainer";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export default function SwipeScreen({ navigation }) {
	const swiperRef = useRef(null);
	const [cards, setCards] = useState([]);
	const [swiperKey, setSwiperKey] = useState(0);

	const userInfos = useSelector((state) => state.user.value);

	const numberOfCards = 10;

	useEffect(() => {
		loadCards();
	}, []);

	function loadCards() {
		setCards([...Array(numberOfCards).keys()]);
		setSwiperKey((prevKey) => prevKey + 1); // Force Swiper to remount
	}

	function handleChoice(action) {
		if (!swiperRef.current) return;
		if (action === "Like") swiperRef.current.swipeRight();
		if (action === "Dislike") swiperRef.current.swipeLeft();
		if (action === "Superlike") swiperRef.current.swipeTop();
	}

	// Fonction métier (copiée de votre bouton)
	async function swipeFetch(cardIndex, action) {
		const idProfile = cards[cardIndex];
		try {
			const response = await fetch(process.env.EXPO_PUBLIC_IP + "/profils/swipe", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization:
						"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQ0MDUxMjIsImV4cCI6NTM1NDQwNTEyMn0.EGriV0lC1HLV2RBlNsOM-Qf293a6yQTafNBPIHedOQU",
					// authorization: userInfos.token,
				},
				body: JSON.stringify({
					action: action,
					userId: idProfile,
				}),
			});
			const data = await response.json();
			// console.log(data);
		} catch (error) {
			console.error("Erreur réseau :", error);
		}
	}

	const renderCard = (index) => (
		<View style={styles.card}>
			<SwipeContainer onChoice={handleChoice} />
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<Swiper
				key={swiperKey}
				ref={swiperRef}
				cards={cards}
				renderCard={renderCard}
				stackSize={2}
				showSecondCard={true}
				infinite={false}
				onSwipedAll={loadCards}
				backgroundColor="transparent"
				onSwipedLeft={(i) => swipeFetch(i, "Dislike")}
				onSwipedRight={(i) => swipeFetch(i, "Like")}
				onSwipedTop={(i) => swipeFetch(i, "Superlike")}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},
	card: {
		flex: 1,
		width: width * 0.9,
		height: height,
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
