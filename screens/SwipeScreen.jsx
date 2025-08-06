import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import Swiper from "react-native-deck-swiper";
import SwipeContainer from "../components/swipe/SwipeContainer";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export default function SwipeScreen({ navigation }) {
	const swiperRef = useRef(null);
	const [cards, setCards] = useState([]);
	const [swiperKey, setSwiperKey] = useState(0);

	const userInfos = useSelector((state) => state.user.value);

	const numberOfCards = 10;

	useEffect(() => {
		loadCards();
	}, []);

	function loadCards() {
		setCards([...Array(numberOfCards).keys()]);
		setSwiperKey((prevKey) => prevKey + 1); // Force Swiper to remount
	}

	function handleChoice(action) {
		if (!swiperRef.current) return;
		if (action === "Like") swiperRef.current.swipeRight();
		if (action === "Dislike") swiperRef.current.swipeLeft();
		if (action === "Superlike") swiperRef.current.swipeTop();
	}

	async function swipeFetch(cardIndex, action) {
		const idProfile = String(cards[cardIndex]);
		try {
			const response = await fetch(process.env.EXPO_PUBLIC_IP + "/profils/swipe", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization:
						"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQ0MDUxMjIsImV4cCI6NTM1NDQwNTEyMn0.EGriV0lC1HLV2RBlNsOM-Qf293a6yQTafNBPIHedOQU",
					// authorization: userInfos.token,
				},
				body: JSON.stringify({
					action: action,
					userId: idProfile,
				}),
			});
			const data = await response.json();
			// console.log(data);
		} catch (error) {
			console.error("Erreur réseau :", error);
		}
	}

	const renderCard = (index) => (
		<View style={styles.card}>
			<SwipeContainer onChoice={handleChoice} />
		</View>
	);

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<Swiper
					key={swiperKey}
					ref={swiperRef}
					cards={cards}
					renderCard={renderCard}
					stackSize={2}
					showSecondCard={true}
					infinite={false}
					onSwipedAll={loadCards}
					backgroundColor="transparent"
					onSwipedLeft={(i) => swipeFetch(i, "Dislike")}
					onSwipedRight={(i) => swipeFetch(i, "Like")}
					onSwipedTop={(i) => swipeFetch(i, "Superlike")}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF5F0",
	},
	card: {
		flex: 1,
		width: width * 0.9,
		height: height,
		alignSelf: "center",
		backgroundColor: "#FFF5F0",
		borderRadius: 24,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 6,
		elevation: 4,
	},
});



// Ancien code avec le bon fetch

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { useSelector } from "react-redux";
// import { Image } from "expo-image";
// import Swiper from "react-native-swiper";

// import SwipeButton from "./SwipeButton";

// export default function SwipeContainer(props) {
// 	const [informationListJSX, setInformationListJSX] = useState([]);
// 	const [hashtagsListJSX, setHashtagsListJSX] = useState([]);

// 	let placeholderImage = "../../assets/IllustrationPorfileBase.jpg";
// 	autreImage = "https://fr.wikipedia.org/wiki/Chemin#/media/Fichier:Wildcat_Canyon_California.JPG"; // test

// 	function placeholder(nombre) {
// 		return Array(nombre).fill(require(placeholderImage));
// 	}

// 	function fillImages(profilList, placeholderAsset) {
// 		if (!Array.isArray(profilList)) return placeholder(3);
// 		const imgs = profilList.map((p) => {
// 			const url = p.photoList && p.photoList.length > 0 ? p.photoList[0].trim() : null;
// 			// if (url) console.log("Image URL from DB :", url);
// 			return url ? { uri: url } : placeholderAsset;
// 		});

// 		return imgs.length > 0 ? imgs : placeholder(3);
// 	}

// 	const placeholderAsset = require(placeholderImage);
// 	const [images, setImages] = useState(placeholder(3));

// 	useEffect(() => {
// 		const fetchImages = async () => {
// 			try {
// 				// console.log("avant le fetch");
// 				const response = await fetch(process.env.EXPO_PUBLIC_IP + "/profils/profil", {
// 					method: "GET",
// 					headers: {
// 						"Content-Type": "application/json",
// 						authorization:
// 							"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxYzkzNmEyMjFlNDYyZDE4ODcxY2UiLCJpYXQiOjE3NTQ0MDUxMjIsImV4cCI6NTM1NDQwNTEyMn0.EGriV0lC1HLV2RBlNsOM-Qf293a6yQTafNBPIHedOQU",
// 						// authorization: userInfos.token,
// 					},
// 				});
// 				// console.log("après le fetch");
// 				const data = await response.json();
// 				// console.log("data : "+data)
// 				setImages(fillImages(data.profilList, placeholderAsset));
// 			} catch (error) {
// 				console.log("Erreur fetch profiles : " + error);
// 				setImages(placeholder(3));
// 			}
// 		};
// 		fetchImages();
// 	}, []);

// 	const userInfos = useSelector((state) => state.user.value);
// 	const profile = props.profile;
// 	let profileID = 0;
// 	let photoList = [];
// 	try {
// 		// console.log(profile);
// 		profileID = profile.idProfile;
// 		// console.log(profileID);
// 		photoList = profile.profile;
// 	} catch (error) {}

// 	if (!photoList || photoList < 1) {
// 		const imagePath = placeholderImage;
// 	} else {
// 		imagePath = photoList[0];
// 	}
// 	function capitalize(str) {
// 		return str.length > 1 ? str[0].toUpperCase() + str.slice(1) : str;
// 	}

// 	useEffect(() => {
// 		const hashtagsList = ["violon", "randonnée", "chat"];
// 		const informationList = ["Emma", "25", "Paris"];

// 		let tmpHashtagsListJSX = [];
// 		let tmpInformationListJSX = [];
// 		for (let index = 0; index < informationList.length - 1; index++) {
// 			tmpHashtagsListJSX.push(
// 				<Text key={index + 10} style={styles.userInformation}>
// 					{informationList[index]}
// 					{", "}
// 				</Text>
// 			);
// 		}
// 		tmpHashtagsListJSX.push(
// 			<Text key={informationList.length - 1 + 10} style={styles.userInformation}>
// 				{informationList[informationList.length - 1]}
// 			</Text>
// 		);
// 		for (let index = 0; index < hashtagsList.length; index++) {
// 			tmpHashtagsListJSX.push(
// 				<Text key={index} style={styles.hashtag}>
// 					#{capitalize(hashtagsList[index])}{" "}
// 				</Text>
// 			);
// 		}
// 		setHashtagsListJSX(tmpHashtagsListJSX);
// 		setInformationListJSX(tmpInformationListJSX);
// 	}, []);

// 	return (
// 		<View style={styles.container}>
// 			<View style={styles.swipeContainer}>
// 				{/* <Image
// 					style={{ width: 300, height: 200 }}
// 					// style={styles.image}
// 					source="https://fr.wikipedia.org/wiki/Chemin#/media/Fichier:Wildcat_Canyon_California.JPG"
// 					contentFit="cover"
// 					transition={300}
// 					cachePolicy="memory-disk"
// 				/> */}
// 				<Swiper style={styles.carousel} showsButtons={true} loop={false} autoplay={false} showsPagination={true}>
// 					{images.map((src, idx) => (
// 						<Image key={idx} source={src} style={styles.image} contentFit="cover" transition={300} />
// 					))}
// 				</Swiper>

// 				<View style={styles.textContainer}>
// 					<View style={styles.userInformationsContainer}>{informationListJSX}</View>
// 					<View style={styles.userHashTags}>{hashtagsListJSX}</View>

// 					<View style={styles.choiceButtonList}>
// 						{["Dislike", "Superlike", "Like"].map((type) => (
// 							<SwipeButton key={type} style={styles.choiceButton} type={type} profileID={profileID} onSwipe={props.onChoice} cachePolicy="memory-disk" />
// 						))}
// 					</View>
// 				</View>
// 			</View>
// 		</View>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: { flex: 1 },

// 	swipeContainer: {
// 		flex: 1,
// 		borderRadius: 20,
// 		overflow: "hidden",
// 	},

// 	carousel: {
// 		flex: 1,
// 	},

// 	/* l’image couvre toute la carte */
// 	image: {
// 		width: "100%",
// 		height: "100%",
// 		borderRadius: 20,
// 	},

// 	/* textes superposés sur l’image, au-dessus des boutons */
// 	textContainer: {
// 		position: "absolute",
// 		left: 20,
// 		right: 20,
// 		bottom: 120, // place les textes au-dessus de la rangée de boutons
// 	},

// 	userInformationsContainer: {
// 		flexDirection: "colomn",
// 		flexWrap: "wrap",
// 		marginBottom: 4,
// 	},
// 	userInformation: {
// 		color: "#000", // noir (comme demandé)
// 		fontWeight: "600",
// 		fontSize: 18,
// 	},

// 	/* hashtags */
// 	userHashTags: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
// 	hashtag: { color: "#000", fontSize: 16 }, // noir

// 	/* barre de boutons collée en bas de la card, sur l’image */
// 	choiceButtonList: {
// 		position: "absolute",
// 		left: 0,
// 		right: 0,
// 		bottom: -100,
// 		flexDirection: "row",
// 		justifyContent: "space-around",
// 		alignItems: "center",
// 	},
// });