import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

import Swiper from "react-native-deck-swiper";
import SwipeContainer from "../components/swipe/SwipeContainer";

export default function SwipeScreen({ navigation }) {
	const swiperRef = useRef(null);
	const [cards, setCards] = useState([]);

	const numberOfCards = 10;

	useEffect(() => {
		setCards([...Array(numberOfCards).keys()]);
	}, []);

	// Fonction appelée depuis les boutons
	function handleChoice(action) {
		if (!swiperRef.current) return;
		if (action === "Like") swiperRef.current.swipeRight();
		if (action === "Dislike") swiperRef.current.swipeLeft();
		if (action === "Superlike") swiperRef.current.swipeTop();
	}

	const renderCard = (index) => (
		<View style={styles.card}>
			<SwipeContainer onChoice={handleChoice} />
		</View>
	);

	return (
		<View style={styles.container}>
			<Swiper
				// ref={swiperRef}
				cards={cards}
				renderCard={renderCard}
				backgroundColor="transparent"
				onSwipedLeft={() => {}}
				onSwipedRight={() => {}}
				onSwipedTop={() => {}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},

	card: {
		/* dimensions et centrage */
		flex: 1,
		width: width * 0.9,
		height: height,
		alignSelf: "center",

		/* apparence conforme à la maquette */
		backgroundColor: "#FFF5F0", // crème
		borderRadius: 24,
		overflow: "hidden",

		/* ombre douce */
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		elevation: 4, // Android
	},
});
