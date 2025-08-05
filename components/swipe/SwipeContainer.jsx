import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import SwipeButton from "./SwipeButton";

export default function SwipeContainer(props) {
	const [informationListJSX, setInformationListJSX] = useState([]);
	const [hashtagsListJSX, setHashtagsListJSX] = useState([]);

	const placeholderImage = "../../assets/IllustrationPorfileBase.jpg";



	const userInfos = useSelector((state) => state.user.value);
	const profile = props.profile;
	// console.log(profile);
	const profileID = profile.idProfile;
	// console.log(profileID);
	const photoList = profile.profile;

	if (!photoList || photoList < 1) {
		const imagePath = placeholderImage;
	}
	else {
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
	if (!props.profile) return;
	return (
		<View style={styles.container}>
			<View style={styles.swipeContainer}>
				<Image source={require("../../assets/IllustrationPorfileBase.jpg")} style={styles.image} resizeMode="cover" />
				<Image source={require("../../assets/IllustrationPorfileBase.jpg")} style={styles.image} resizeMode="cover" />

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
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},
	swipeContainer: {
		flex: 1,
		alignItems: "center",
	},
	userInformationsContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-bettween",
		color: "black",
	},
	choiceButtonList: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	userInformation: {
		color: "black",
	},
	userHashTags: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		color: "black",
	},
	hashtag: {
		color: "black",
	},
	textContainer: {
		flex: 1,
		flexDirection: "colommn",
		alignItems: "center",
		justifyContent: "space-bettween",
	},
});
