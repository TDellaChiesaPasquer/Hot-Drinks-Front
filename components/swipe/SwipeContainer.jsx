import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import SwipeButton from "./SwipeButton";

export default function SwipeContainer(props) {
	const [informationListJSX, setInformationListJSX] = useState([]);
	const [hashtagsListJSX, setHashtagsListJSX] = useState([]);

	const placeholderImage = "../../assets/IllustrationPorfileBase.jpg";

	// if (!props.profile) return;

	const userInfos = useSelector((state) => state.user.value);
	const profile = props.profile;
	let profileID = 0;
	let photoList = [];
	try {
		// console.log(profile);
		profileID = profile.idProfile;
		// console.log(profileID);
		photoList = profile.profile;
	} catch (error) {}

	if (!photoList || photoList < 1) {
		const imagePath = placeholderImage;
	} else {
		imagePath = photoList[0];
	}
	function capitalize(str) {
		return str.length > 1 ? str[0].toUpperCase() + str.slice(1) : str;
	}

	useEffect(() => {
		const hashtagsList = ["violon", "randonnée", "chat"];
		const informationList = ["Emma", "25", "Paris"];

		let tmpHashtagsListJSX = [];
		let tmpInformationListJSX = [];
		for (let index = 0; index < informationList.length - 1; index++) {
			tmpHashtagsListJSX.push(
				<Text key={index + 10} style={styles.userInformation}>
					{informationList[index]}
					{", "}
				</Text>
			);
		}
		tmpHashtagsListJSX.push(
			<Text key={informationList.length - 1 + 10} style={styles.userInformation}>
				{informationList[informationList.length - 1]}
			</Text>
		);
		for (let index = 0; index < hashtagsList.length; index++) {
			tmpHashtagsListJSX.push(
				<Text key={index} style={styles.hashtag}>
					#{capitalize(hashtagsList[index])}{" "}
				</Text>
			);
		}
		setHashtagsListJSX(tmpHashtagsListJSX);
		setInformationListJSX(tmpInformationListJSX);
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.swipeContainer}>
				<Image source={require(placeholderImage)} style={styles.image} resizeMode="cover" />

				<View style={styles.textContainer}>
					<View style={styles.userInformationsContainer}>{informationListJSX}</View>
					<View style={styles.userHashTags}>{hashtagsListJSX}</View>

					<View style={styles.choiceButtonList}>
						<SwipeButton style={styles.choiceButton} type="Dislike" profileID={profileID} />
						<SwipeButton style={styles.choiceButton} type="Superlike" profileID={profileID} />
						<SwipeButton style={styles.choiceButton} type="Like" profileID={profileID} />
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },

	/* l’image couvre toute la carte */
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 20,
	},

	/* textes superposés sur l’image, au-dessus des boutons */
	textContainer: {
		position: "absolute",
		left: 20,
		right: 20,
		bottom: 120, // place les textes au-dessus de la rangée de boutons
	},

	userInformationsContainer: {
		flexDirection: "colomn",
		flexWrap: "wrap",
		marginBottom: 4
	},
	userInformation: {
		color: "#000", // noir (comme demandé)
		fontWeight: "600",
		fontSize: 18,
	},

	/* hashtags */
	userHashTags: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
	hashtag: { color: "#000", fontSize: 16 }, // noir

	/* barre de boutons collée en bas de la card, sur l’image */
	choiceButtonList: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: -100,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
});
