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
		const informationList = ["Username", "Age", "Ville"];

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
						<SwipeButton style={styles.choiceButton} type="Like" profileID={profileID} />
						<SwipeButton style={styles.choiceButton} type="Superlike" profileID={profileID} />
						<SwipeButton style={styles.choiceButton} type="Dislike" profileID={profileID} />
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	/* fond brun derrière l’image */
	container: {
		flex: 1,
	},

	/* image : 60 % de la hauteur, coins arrondis en haut */
	image: {
		width: "100%",
		height: "60%",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},

	/* zone inférieure crème */
	textContainer: {
		flex: 1,
		backgroundColor: "#FFF5F0",
		paddingHorizontal: 20,
		paddingTop: 16,
	},

	/* « Emma, 25, Paris » */
	userInformationsContainer: { flexDirection: "row", flexWrap: "wrap" },
	userInformation: { color: "#000", fontWeight: "600" },

	/* hashtags */
	userHashTags: { flexDirection: "row", flexWrap: "wrap", marginTop: 2 },
	hashtag: { color: "#000" },

	/* barre de boutons */
	choiceButtonList: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 12,
	},
});
