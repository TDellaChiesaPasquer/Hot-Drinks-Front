import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";

import SwipeButton from "./SwipeButton";

export default function SwipeContainer(props) {
	const [informationListJSX, setInformationListJSX] = useState([]);
	const [hashtagsListJSX, setHashtagsListJSX] = useState([]);

	let placeholderImage = "../../assets/IllustrationPorfileBase.jpg";
	autreImage = "https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg"; // test

	function placeholder(nombre) {
		return Array(nombre).fill(require(placeholderImage));
	}

	function fillImages(profilList, placeholderAsset) {
		if (!Array.isArray(profilList)) return placeholder(3);
		const imgs = profilList.map((p) => {
			const url = p.photoList && p.photoList.length > 0 ? p.photoList[0].trim() : null;
			if (url) console.log("Image URL from DB :", url);
			return url ? { uri: url } : placeholderAsset;
		});

		return imgs.length > 0 ? imgs : placeholder(3);
	}

	const placeholderAsset = require(placeholderImage);
	const [images, setImages] = useState(placeholder(3));

	useEffect(() => {
		const fetchImages = async () => {
			try {
				console.log("avant le fetch");
				const response = await fetch(process.env.EXPO_PUBLIC_IP + "/profils/profil", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						authorization:
							"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQ0MDUxMjIsImV4cCI6NTM1NDQwNTEyMn0.EGriV0lC1HLV2RBlNsOM-Qf293a6yQTafNBPIHedOQU",
						// authorization: userInfos.token,
					},
				});
				console.log("après le fetch");
				const data = await response.json();
				// console.log("data : "+data)
				setImages(fillImages(data.profilList, placeholderAsset));
			} catch (error) {
				console.log("Erreur fetch profiles : " + error);
				setImages(placeholder(3));
			}
		};
		fetchImages();
	}, []);

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
				<Swiper style={styles.carousel} showsButtons={true} loop={false} autoplay={false} showsPagination={true}>
					{images.map((src, idx) => (
						// <Image key={idx} source={src} style={styles.image} contentFit="cover" transition={300} />
						<Image key={idx} source={autreImage} style={styles.image} contentFit="cover" transition={300} />
					))}
				</Swiper>

				<View style={styles.textContainer}>
					<View style={styles.userInformationsContainer}>{informationListJSX}</View>
					<View style={styles.userHashTags}>{hashtagsListJSX}</View>

					<View style={styles.choiceButtonList}>
						{["Dislike", "Superlike", "Like"].map((type) => (
							<SwipeButton key={type} style={styles.choiceButton} type={type} profileID={profileID} onSwipe={props.onChoice} />
						))}
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },

	swipeContainer: {
		flex: 1,
		borderRadius: 20,
		overflow: "hidden",
	},

	carousel: {
		flex: 1,
	},

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
		marginBottom: 4,
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
