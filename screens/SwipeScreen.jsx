import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

import Swiper from "react-native-deck-swiper";
import SwipeContainer from "../components/swipe/SwipeContainer";

export default function SwipeScreen({ navigation }) {
	const [profiles, setProfiles] = useState([]);

	const tmp_token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQzODQ3MTEsImV4cCI6NTM1NDM4NDcxMX0.ax3pxoHKJBbLllHLm0NDYrDw7cMd9e5cRLyjbQDlUbg";
	async function fetchProfiles() {
		try {
			// const urlTmp = process.env.EXPO_PUBLIC_IP + "/profils/profil";
			const urlTmp = process.env.EXPO_PUBLIC_IP + "/profils/profil";
			console.log("urlTmp : " + urlTmp);
      console.log("testA")

			const response = await fetch(urlTmp, {
				headers: {
					"Content-Type": "application/json",
					// authorization: userInfos.token,
					authorization: tmp_token,
				},
			});

			console.log("fin fetch");
			const tmpProfiles = [];
			console.log("Test");
			const data = await response.json();
			console.log(data);
			const profilList = data.profilList;
			for (let i = 0; i < profilList.length; i++) {
				const photoList = profilList[i].photoList;
				const idProfile = profilList[i]._id;

				tmpProfiles.push({ photoList, idProfile });
			}
			console.log(profiles);
			if (!data.result) {
				return;
			}
			setProfiles(tmpProfiles);
		} catch (error) {
			console.error("Erreur réseau :", error);
		}
	}

	useEffect(() => {
		// Fetch initial des profils
		fetchProfiles();
	}, []);

	// Fonction appelée depuis les boutons
	function handleChoice(action) {}

	const renderCard = (profile, index) => {
		console.log(profile, index);
		return (
			<View style={styles.card}>
				<SwipeContainer onChoice={handleChoice} profile={profile} />
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Swiper cards={profiles} renderCard={renderCard} backgroundColor="transparent" verticalSwipe={false} onSwipedLeft={() => {}} onSwipedRight={() => {}} onSwipedTop={() => {}} />
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
