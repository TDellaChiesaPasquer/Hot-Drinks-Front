import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

import { useSelector } from "react-redux";

import Swiper from "react-native-swiper";
import PropTypes from "prop-types";

import SwipeButton from "./SwipeButton";

const PLACEHOLDER_SRC = require("../../assets/IllustrationPorfileBase.jpg");
const NB_PLACEHOLDERS = 10;

export default function SwipeContainer({ profile, onChoice }) {
	const { token } = useSelector((state) => state.user.value);

	/* ---------- Helpers ---------- */

	// Utilisation de useMemo :
	// En général, useMemo sert à mémoriser une valeur calculée pour éviter de la recalculer à chaque rendu inutilement.
	// Ici, il permet de créer le tableau placeholders une seule fois et de ne pas le recréer à chaque rendu, même si le composant se ré-affiche.
	const placeholders = useMemo(() => Array(NB_PLACEHOLDERS).fill(PLACEHOLDER_SRC), []);

	const pickFirstPhoto = (p) => (p?.photoList?.[0]?.trim() ? { uri: p.photoList[0].trim() } : PLACEHOLDER_SRC);

	/* ---------- Images ---------- */
	const [images, setImages] = useState(placeholders);

	const fetchImages = useCallback(async () => {
		try {
			const res = await fetch(`${process.env.EXPO_PUBLIC_IP}/profils/profil`, {
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
			});
			const { profilList } = await res.json();
			const imgs = Array.isArray(profilList) ? profilList.map(pickFirstPhoto) : placeholders;
			setImages(imgs.length ? imgs : placeholders);
		} catch (err) {
			console.error("fetch /profils/profil:", err);
			setImages(placeholders);
		}
	}, [token, placeholders]);

	useEffect(() => {
		fetchImages();
	}, [fetchImages]);

	/* ---------- Textes à afficher ---------- */
	const informationList = ["Emma", "25", "Paris"];
	const hashtagsList = ["violon", "randonnée", "chat"];

	const capitalize = (s) => (s?.length > 1 ? s[0].toUpperCase() + s.slice(1) : s);

	/* ---------- Rendu ---------- */
	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Swiper loop={false} showsButtons>
					{images.map((src, i) => (
						<Image key={i} source={src} style={styles.image} contentFit="cover" />
					))}
				</Swiper>

				<View style={styles.overlay}>
					<View style={styles.infos}>
						{informationList.map((txt, i) => (
							<Text key={i} style={styles.info}>
								{txt}
								{i < informationList.length - 1 && ", "}
							</Text>
						))}
					</View>

					<View style={styles.hashtags}>
						{hashtagsList.map((tag, i) => (
							<Text key={i} style={styles.hashtag}>
								#{capitalize(tag)}{" "}
							</Text>
						))}
					</View>

					<View style={styles.buttons}>
						{["Dislike", "Superlike", "Like"].map((type) => (
							<SwipeButton key={type} type={type} profileID={profile?.idProfile} onSwipe={onChoice} />
						))}
					</View>
				</View>
			</View>
		</View>
	);
}

/* ---------- Prop-Types ---------- */
SwipeContainer.propTypes = {
	profile: PropTypes.shape({
		idProfile: PropTypes.number,
		profile: PropTypes.array,
	}),
	onChoice: PropTypes.func.isRequired,
};

/* ---------- Styles ---------- */
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
		left: 0,
		right: 0,
		bottom: -100,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
});
