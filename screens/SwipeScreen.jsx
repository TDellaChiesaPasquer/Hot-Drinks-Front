import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

import SwipeContainer from "../components/swipe/SwipeContainer";

export default function SwipeScreen({ navigation }) {
	const [swipeProfilList, setSwipeProfilList] = useState([]);

	useEffect(() => {
		const tmpProfileTab = [];

		for (let index = 0; index < 10; index++) {
			tmpProfileTab.push(
				<View key={index} style={styles.slides}>
					<SwipeContainer />
				</View>
			);
		}
		setSwipeProfilList(tmpProfileTab);
	}, []);

	return (
		<View style={styles.container}>
			<Swiper style={styles.swiperWrapper} showsButtons={true}>
				{swipeProfilList}
			</Swiper>
			{/* <SwipeContainer /> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	swiperWrapper: {
		flex: 1,
	},
	slides: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
