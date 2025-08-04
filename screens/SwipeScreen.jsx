import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import SwipeButton from "../components/SwipeButton";

export default function SwipeScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<Image source={require("../assets/IllustrationPorfileBase.jpg")} style={styles.image} resizeMode="cover" />

			<View style={styles.userInformationsContainer}>
				<Text style={styles.username}>Username</Text>
				<Text style={styles.age}>Age</Text>
				<Text style={styles.ville}>Ville</Text>
			</View>

			<View style={styles.userHashTags}>
				<Text style={styles.username}>Username</Text>
				<Text style={styles.age}>Age</Text>
				<Text style={styles.ville}>Ville</Text>
			</View>

			<SwipeButton style={styles.information} type="Like" />
			<SwipeButton style={styles.information} type="Superlike" />
			<SwipeButton style={styles.information} type="Dislike" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	userInformationsContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-bettween",
		alignItems: "center",
	},
	information: {
		flex: 1,
	},
	userHashTags: {

	},
});
