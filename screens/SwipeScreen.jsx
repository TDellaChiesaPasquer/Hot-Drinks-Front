import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import SwipeButton from "../components/SwipeButton";

export default function SwipeScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<View style={styles.swipeContainer}>
				<Image source={require("../assets/IllustrationPorfileBase.jpg")} style={styles.image} resizeMode="cover" />

				<View style={styles.textContainer}>
					<View style={styles.userInformationsContainer}>
						<Text style={styles.userInformation}>Username</Text>
						<Text style={styles.userInformation}>Age</Text>
						<Text style={styles.userInformation}>Ville</Text>
					</View>

					<View style={styles.userHashTags}>
						<Text style={styles.hashtag}>#Violon</Text>
						<Text style={styles.hashtag}>#Randonnée</Text>
						<Text style={styles.hashtag}>#Chat</Text>
					</View>

					<View style={styles.choiceButtonList}>
						<SwipeButton style={styles.choiceButton} type="Like" />
						<SwipeButton style={styles.choiceButton} type="Superlike" />
						<SwipeButton style={styles.choiceButton} type="Dislike" />
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},
	swipeContainer: {
		flex: 1,
	},
	userInformationsContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-bettween",
		alignItems: "center",
	},
	choiceButtonList: {
		flex: 1,
		flexDirection: "row",
	},
	userInformation: {},
	userHashTags: {
		flex: 1,
		flexDirection: "row",
	},
	textContainer: {
		flex: 1,
		flexDirection: "colommn",
		alignItems: "center",
	},
});
