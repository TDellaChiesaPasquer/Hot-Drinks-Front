import React, { useEffect, useState } from "react";
import { StatusBar, ScrollView, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import Swiper from "react-native-swiper";

import SwipeButton from "./SwipeButton";
import { capitalize } from "../../Utils/utils.js"

const PLACEHOLDER_SRC = require("../../assets/IllustrationPorfileBase.jpg");
const NB_PLACEHOLDERS = 10;

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
  photoList: Array(NB_PLACEHOLDERS || 10).fill("").map(() => PLACEHOLDER_SRC),
  tastesList: [
    { value: "violon", star: true },
    { value: "randonnée", star: true },
    { value: "chat", star: true },
    { value: "cinéma", star: false } // exemple d'un goût non étoilé qui ne sera pas affiché
  ],
  idProfile: "placeholder_id"
};

/**
 * Formate les données du profil selon les règles spécifiées
 * @param {Object} profileData - Données brutes du profil
 * @param {Object} placeholderSrc - Source de l'image placeholder
 * @return {Object} Données formatées du profil
 */
function formatProfileData(profileData, placeholderSrc) {
  // Initialiser avec les données par défaut
  const formattedData = {
    informationList: ["Anonyme", "?", "Distance inconnue"],
    hashtagsList: [],
    images: getPlaceholders(NB_PLACEHOLDERS || 10, placeholderSrc),
    profileID: null
  };
  
  if (!profileData) return formattedData;
  
  // ID du profil pour les actions de swipe
  formattedData.profileID = profileData.idProfile || null;
  
  // Username - utiliser directement
  if (profileData.username) {
    formattedData.informationList[0] = profileData.username;
  }
  
  // Age - calculer à partir de birthdate
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
  
  // Distance - afficher directement sauf si contient NaN
  if (profileData.distance && !profileData.distance.includes("NaN")) {
    formattedData.informationList[2] = profileData.distance;
  }
  
  // Photos - utiliser la fonction existante pour récupérer les photos
  if (profileData.photoList && profileData.photoList.length > 0) {
    formattedData.images = getAllPhotosFromProfile(profileData, placeholderSrc);
  }
  
  // Hashtags - extraire les goûts avec star=true
  if (profileData.tastesList && profileData.tastesList.length > 0) {
    formattedData.hashtagsList = profileData.tastesList
      .filter(taste => taste.star === true)
      .map(taste => taste.value);
  }
  
  return formattedData;
}

export default function SwipeContainer(props) {
	const profileData = props.profile || placeholderData;
	console.log("SwipeContainer - profileData : ");
	console.log(profileData);
	const onChoiceCallback = props.onChoice;

	// Formater les données du profil
	const formattedData = formatProfileData(profileData, PLACEHOLDER_SRC);
	const imagesList = formattedData.images;
	const informationList = formattedData.informationList;
	const hashtagsList = formattedData.hashtagsList;

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Swiper loop={false} showsButtons>
					{imagesList.map(function (imageSource, imageIndex) {
						return <Image key={imageIndex} source={imageSource} style={styles.image} contentFit="cover" />;
					})}
				</Swiper>

				<View style={styles.overlay}>
					<View style={styles.infos}>
						{informationList.map(function (infoText, infoIndex) {
							return (
								<Text key={infoIndex} style={styles.info}>
									{infoText}
									{infoIndex < informationList.length - 1 ? ", " : ""}
								</Text>
							);
						})}
					</View>

					<View style={styles.hashtags}>
						{hashtagsList.map(function (hashtag, hashtagIndex) {
							return (
								<Text key={hashtagIndex} style={styles.hashtag}>
									#{capitalize(hashtag)}{" "}
								</Text>
							);
						})}
					</View>

					<View style={styles.buttons}>
						{["Dislike", "Superlike", "Like"].map(function (buttonType) {
							return <SwipeButton key={buttonType} type={buttonType} profileID={formattedData.profileID} onSwipe={onChoiceCallback} />;
						})}
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	card: { flex: 1, borderRadius: 20, overflow: "hidden" },
	image: { width: "100%", height: "100%" },
	overlay: { position: "absolute", left: 20, right: 20, bottom: 120 },
	infos: { flexDirection: "row", flexWrap: "wrap" },
	info: { color: "#000", fontWeight: "600", fontSize: 18 },
	hashtags: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
	hashtag: { color: "#000", fontSize: 16 },
	buttons: {
		position: "absolute",
		flex: 1,
		left: 19,
		right: 0,
		bottom: -100,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		alignContent: "center",
	},
});
