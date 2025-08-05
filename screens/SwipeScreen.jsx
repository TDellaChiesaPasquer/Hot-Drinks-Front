import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

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
				ref={swiperRef}
				cards={cards}
				renderCard={renderCard}
				stackSize={3}
				backgroundColor="transparent"
				verticalSwipe={false}
				onSwipedLeft={() => {}}
				onSwipedRight={() => {}}
				onSwipedTop={() => {}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	card: {
		width: width * 0.9,
		flex: 1,
		alignSelf: "center",
		justifyContent: "center",
	},
});
