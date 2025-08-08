import React, { useEffect, useState } from "react";
import { StatusBar, View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";

// import Carousel from "react-native-snap-carousel";
import Swiper from "react-native-swiper";

import { capitalize } from "../../Utils/utils.js";

const PLACEHOLDER_SRC = require("../../assets/IllustrationPorfileBase.jpg");
const NB_PLACEHOLDERS = 10;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function getPlaceholders(placeholderCount, placeholderSrc) {
	return Array(placeholderCount).fill(placeholderSrc);
}

function getAllPhotosFromProfile(profileObject, placeholderSrc) {
	let photosFromProfile = [];
	if (!profileObject || !profileObject.photoList || !profileObject.photoList.length) {
		photosFromProfile.push(placeholderSrc);
		return photosFromProfile;
	}
	for (let photoIndex = 0; photoIndex < profileObject.photoList.length; photoIndex++) {
		const photoPath = profileObject.photoList[photoIndex];
		if (photoPath && typeof photoPath === "string" && photoPath.trim().length > 0) {
			photosFromProfile.push({ uri: photoPath.trim() });
		}
	}

	if (!photosFromProfile.length) {
		photosFromProfile.push(placeholderSrc);
	}
	return photosFromProfile;
}

function extractAllImagesFromProfiles(profileList, placeholderSrc) {
	let imagesList = [];
	if (!profileList || !profileList.length) {
		imagesList = getPlaceholders(NB_PLACEHOLDERS, placeholderSrc);
	} else {
		for (let profileIndex = 0; profileIndex < profileList.length; profileIndex++) {
			const photosFromCurrentProfile = getAllPhotosFromProfile(profileList[profileIndex], placeholderSrc);
			for (let photoIndex = 0; photoIndex < photosFromCurrentProfile.length; photoIndex++) {
				imagesList.push(photosFromCurrentProfile[photoIndex]);
			}
		}
	}
	return imagesList.length ? imagesList : getPlaceholders(NB_PLACEHOLDERS, placeholderSrc);
}

// Objet contenant les données placeholders structurées comme les vraies données
const placeholderData = {
	username: "Emma",
	birthdate: new Date(new Date().setFullYear(new Date().getFullYear() - 25)).toISOString(),
	distance: "15 km",
	photoList: Array(NB_PLACEHOLDERS)
		.fill("")
		.map(() => PLACEHOLDER_SRC),
	tastesList: [
		{ value: "violon", star: true },
		{ value: "randonnée", star: true },
		{ value: "chat", star: true },
		{ value: "cinéma", star: false }, // exemple d'un goût non étoilé qui ne sera pas affiché
	],
	idProfile: null,
};

/**
 * Formate les données du profil l'affichage attendu pour le profile de swipe
 * @param {Object} profileData - Vrai données reçues depuis le backend
 * @param {Object} placeholderSrc - Données fake en cas de non-réception (pour le test)
 * @return {Object} Données formatées pour le profil swipe
 */
function formatProfileData(profileData, placeholderSrc) {
	// Check if we're using placeholder data directly
	const isDefaultPlaceholder = profileData === placeholderData;

	const formattedData = {
		informationList: ["Anonyme", "?", "Distance inconnue"],
		hashtagsList: [],
		images: getPlaceholders(NB_PLACEHOLDERS || 10, placeholderSrc),
		username: null,
		isPlaceholder: isDefaultPlaceholder,
	};

	if (!profileData) {
		formattedData.isPlaceholder = true;
		return formattedData;
	}

	// Real data processing - if we have real data, we're not using placeholders
	if (profileData._id) {
		formattedData.isPlaceholder = false;
	}

	// Username
	if (profileData.username) {
		formattedData.informationList[0] = profileData.username;
	}

	// Age
	if (profileData.birthdate) {
		const birthDate = new Date(profileData.birthdate);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		formattedData.informationList[1] = age.toString();
	}

	// Distance
	if (profileData.distance && !profileData.distance.includes("NaN")) {
		formattedData.informationList[2] = profileData.distance;
	}

	// Photos
	if (profileData.photoList && profileData.photoList.length > 0) {
		formattedData.images = getAllPhotosFromProfile(profileData, placeholderSrc);
	}

	// Hashtags
	if (profileData.tastesList && profileData.tastesList.length > 0) {
		formattedData.hashtagsList = profileData.tastesList.filter((taste) => taste.star === true).map((taste) => taste.value);
	}

	return formattedData;
}

export default function SwipeContainer(props) {
	// console.log("SwipeContainer - props.profile : ");
	// console.log(props.profile);
	const profileData = props.profile || placeholderData;
	// console.log("SwipeContainer - profileData : ");
	// console.log(profileData);

	// Formater les données du profil
	const formattedData = formatProfileData(profileData, PLACEHOLDER_SRC);
	const imagesList = formattedData.images;
	const informationList = formattedData.informationList;
	const hashtagsList = formattedData.hashtagsList;
	const isPlaceholder = formattedData.isPlaceholder;

	// Déterminer la couleur du texte en fonction de isPlaceholder
	// For placeholder (default) content, use black text
	// For real profiles (with photos), use white text to be visible against photos
	const textColor = isPlaceholder ? "black" : "white";


	return (
		<View style={styles.container}>
			<Swiper loop={false} showsButtons>
				{imagesList.map(function (imageSource, imageIndex) {
					return <Image key={imageIndex} source={imageSource} style={styles.image} contentFit="cover" />;
				})}
			</Swiper>

			<View style={styles.overlay}>
				<View style={styles.infos}>
					{informationList.map(function (infoText, infoIndex) {
						return (
							<Text key={infoIndex} style={[styles.info, { color: textColor }]}>
								{infoText}
								{infoIndex < informationList.length - 1 ? ", " : ""}
							</Text>
						);
					})}
				</View>

				<View style={styles.hashtags}>
					{hashtagsList.map(function (hashtag, hashtagIndex) {
						return (
							<Text key={hashtagIndex} style={[styles.hashtag, { color: textColor }]}>
								#{capitalize(hashtag)}{" "}
							</Text>
						);
					})}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		borderRadius: 20,
		overflow: "hidden",
	},

	image: {
		width: "100%",
		height: "100%",
	},

	overlay: {
		position: "absolute",
		left: screenWidth / 10,
		right: screenWidth / 10,
		bottom: screenHeight / 6.5,
	},

	infos: {
		flexDirection: "row",
		flexWrap: "wrap",
		bottom: -screenHeight / 20,
	},

	info: {
		fontWeight: "600",
		fontSize: 18,
	},

	hashtags: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: 4,
		bottom: -screenHeight / 15,
	},

	hashtag: {
		fontSize: 16,
	},
});
