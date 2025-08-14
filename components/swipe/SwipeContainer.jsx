import React, { useEffect, useState } from "react";
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";

import Swiper from "react-native-swiper";

import { capitalize } from "../../Utils/utils.js";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import ProfileInformationsScreen from "../../screens/ProfileInformationsScreen";

const PLACEHOLDER_SRC = require("../../assets/IllustrationPorfileBase.jpg");
const NB_PLACEHOLDERS = 10;

// Import des images PNG
const relationIcons = {
  allonge: require("../../assets/images/IconsRelations/allonge.png"),
  espresso: require("../../assets/images/IconsRelations/espresso.png"),
  hotChocolate: require("../../assets/images/IconsRelations/hotChocolate.png"),
  matcha: require("../../assets/images/IconsRelations/matcha.png"),
  ristretto: require("../../assets/images/IconsRelations/ristretto.png"),
  the: require("../../assets/images/IconsRelations/the.png"),
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function getPlaceholders(placeholderCount, placeholderSrc) {
  return Array(placeholderCount).fill(placeholderSrc);
}

function getAllPhotosFromProfile(profileObject, placeholderSrc) {
  let photosFromProfile = [];
  if (
    !profileObject ||
    !profileObject.photoList ||
    !profileObject.photoList.length
  ) {
    photosFromProfile.push(placeholderSrc);
    return photosFromProfile;
  }
  for (
    let photoIndex = 0;
    photoIndex < profileObject.photoList.length;
    photoIndex++
  ) {
    const photoPath = profileObject.photoList[photoIndex];
    if (
      photoPath &&
      typeof photoPath === "string" &&
      photoPath.trim().length > 0
    ) {
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
    for (
      let profileIndex = 0;
      profileIndex < profileList.length;
      profileIndex++
    ) {
      const photosFromCurrentProfile = getAllPhotosFromProfile(
        profileList[profileIndex],
        placeholderSrc
      );
      for (
        let photoIndex = 0;
        photoIndex < photosFromCurrentProfile.length;
        photoIndex++
      ) {
        imagesList.push(photosFromCurrentProfile[photoIndex]);
      }
    }
  }
  return imagesList.length
    ? imagesList
    : getPlaceholders(NB_PLACEHOLDERS, placeholderSrc);
}

// Objet contenant les données placeholders structurées comme les vraies données
const placeholderData = {
  username: "Emma",
  birthdate: new Date(
    new Date().setFullYear(new Date().getFullYear() - 25)
  ).toISOString(),
  distance: "15 km",
  photoList: Array(NB_PLACEHOLDERS)
    .fill("")
    .map(() => PLACEHOLDER_SRC),
  tastesList: [
    { category: "Musique", value: "violon", star: true },
    { category: "Sport", value: "randonnée", star: true },
    { category: "Animaux", value: "chat", star: true },
    { category: "Loisir", value: "cinéma", star: false },
  ],
  idProfile: null,
};

/**
 * Formate les données du profil pour l'affichage attendu pour le profile de swipe
 *
 * LOGIQUE DE DÉCISION MOCK DATA vs VRAIES DONNÉES :
 * - Si profileData est null/undefined → Utilise mock data générique (isPlaceholder = true)
 * - Si profileData === placeholderData (objet global) → Utilise mock data pré-définies (isPlaceholder = true)
 * - Si profileData a un _id → Vraies données du serveur (isPlaceholder = false)
 * - Sinon → Traite comme mock data mais avec les valeurs fournies (isPlaceholder = true par défaut)
 *
 * @param {Object} profileData - Données reçues : vraies données du backend OU mock data OU null/undefined
 * @param {Object} placeholderSrc - Source d'images de remplacement pour les mock data
 * @return {Object} Données formatées pour le profil swipe avec indicateur isPlaceholder
 */
function formatProfileData(profileData, placeholderSrc) {
  // === ÉTAPE 1: DÉCISION MOCK DATA - Vérification si on reçoit l'objet placeholder global ===
  // CAS 1: profileData === placeholderData (objet global défini) → Mock data pré-définies
  const isDefaultPlaceholder = profileData === placeholderData;

  // === ÉTAPE 2: Initialisation de la structure de données de retour ===
  // Toujours initialisé avec des valeurs par défaut (format mock data générique)
  const informationArray = ["Anonyme", "?", "Distance inconnue"];
  const formattedData = {
    informationList: informationArray,
    hashtagsList: [],
    images: getPlaceholders(NB_PLACEHOLDERS || 10, placeholderSrc),
    username: null,
    isPlaceholder: isDefaultPlaceholder, // true si c'est l'objet placeholder global
  };

  // === ÉTAPE 3: DÉCISION MOCK DATA - Gestion du cas données nulles/inexistantes ===
  // CAS 2: profileData est null/undefined → Retour immédiat avec mock data générique
  if (!profileData) {
    formattedData.isPlaceholder = true; // Forcer l'indicateur mock data
    return formattedData;
  }

  // === ÉTAPE 4: DÉCISION MOCK DATA - Détermination si vraies données du serveur ===
  // CAS 3: profileData a un _id → Vraies données du serveur
  // CAS 4: profileData sans _id → Mock data avec contenu personnalisé
  // Si pas d'_id, isPlaceholder reste à sa valeur initiale (true sauf si données du serveur)
  if (profileData._id) {
    formattedData.isPlaceholder = false; // Vraies données confirmées
  }

  // === ÉTAPE 5: Traitement du nom d'utilisateur ===
  // Fonctionne pour vraies données ET mock data avec username
  if (profileData.username) {
    informationArray[0] = profileData.username;
  }

  // === ÉTAPE 6: Calcul et formatage de l'âge ===
  // Initialisation de l'âge avec "?" par défaut
  informationArray[1] = "?";

  // Calcul de l'âge si la date de naissance est disponible
  if (profileData.birthdate) {
    try {
      // Création des objets Date pour le calcul
      const birthDate = new Date(profileData.birthdate);
      const today = new Date();

      // Validation simple de la date (pour éviter les dates futures ou trop anciennes)
      if (birthDate <= today && birthDate.getFullYear() > 1900) {
        // Calcul de l'âge de base (différence d'années)
        let age = today.getFullYear() - birthDate.getFullYear();

        // Ajustement si l'anniversaire n'a pas encore eu lieu cette année
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age = age - 1;
        }

        // Assignation de l'âge formaté seulement si c'est un nombre positif valide
        if (age >= 0) {
          informationArray[1] = age.toString() + " an" + (age > 1 ? "s" : "");
        }
      }
    } catch (error) {
      console.log("Erreur lors du calcul de l'âge:", error);
      // En cas d'erreur, l'âge reste "?"
    }
  }

  // === ÉTAPE 7: Traitement de la distance ===
  // Fonctionne pour vraies données ET mock data, avec validation anti-NaN
  if (profileData.distance && !profileData.distance.includes("NaN")) {
    informationArray[2] = profileData.distance;
  }

  // === ÉTAPE 8: Traitement des photos du profil ===
  // Remplace les images placeholder si des vraies photos sont disponibles
  if (profileData.photoList && profileData.photoList.length > 0) {
    formattedData.images = getAllPhotosFromProfile(profileData, placeholderSrc);
  }

  // === ÉTAPE 9: Extraction et formatage des hashtags (goûts favoris) ===
  // Fonctionne pour vraies données ET mock data avec tastesList
  if (profileData.tastesList && profileData.tastesList.length > 0) {
    // Filtrage des goûts marqués comme favoris (star === true)
    const filteredTastes = [];
    for (let i = 0; i < profileData.tastesList.length; i++) {
      if (profileData.tastesList[i].star === true) {
        filteredTastes.push(profileData.tastesList[i].value);
      }
    }
    formattedData.hashtagsList = filteredTastes;
  }

  // === ÉTAPE 10: Retour des données formatées ===
  // formattedData.isPlaceholder indique le type final de données utilisées
  return formattedData;
}

// Normalisation d'une chaîne de caractères pour faciliter la comparaison/mapping
function normalizeRelation(value) {
  return String(value || "") // Convertit la valeur en chaîne (vide si null/undefined)
    .normalize("NFD") // Sépare les caractères accentués en lettre + diacritique
    .replace(/[\u0300-\u036f]/g, "") // Supprime les signes diacritiques (accents, trémas, etc.)
    .toLowerCase() // Met tout en minuscules
    .trim(); // Supprime les espaces en début et fin
}

// Nouvelle fonction pour obtenir l'image PNG selon la relation
function getRelationIconSource(relationship) {
  const key = normalizeRelation(relationship);
  if (!key) return null;

  // Mapping des types de relation vers les fichiers PNG
  if (key === "chocolat chaud") return relationIcons.hotChocolate;
  if (key === "allonge") return relationIcons.allonge;
  if (key === "the") return relationIcons.the;
  if (key === "expresso") return relationIcons.espresso;
  if (key === "ristretto") return relationIcons.ristretto;
  if (key === "matcha") return relationIcons.matcha;
  return null;
}

export default function SwipeContainer(props) {
  const navigation = useNavigation();

  const profileData = props.profile || placeholderData;

  // Formater les données du profil
  const formattedData = formatProfileData(profileData, PLACEHOLDER_SRC);
  const imagesList = formattedData.images;
  const informationList = formattedData.informationList;
  const hashtagsList = formattedData.hashtagsList;
  const isPlaceholder = formattedData.isPlaceholder;

  // Déterminer la couleur du texte en fonction de isPlaceholder
  const textColor = isPlaceholder ? "black" : "white";

  // Obtenir la source de l'icône relation
  const relationIconSource = getRelationIconSource(profileData?.relationship);

  // Navigation vers la page d'infos avec passage des goûts
  function goToProfileInformations() {
    navigation.navigate("ProfileInformationsScreen", {
      profileData: profileData,
      firstImage: imagesList && imagesList.length > 0 ? imagesList[0] : null,
    });
  }

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.caroussel}
        loop={true}
        showsButtons
        nextButton={<Text style={styles.arrow}>›</Text>}
        prevButton={<Text style={styles.arrow}>‹</Text>}
        activeDotColor="white"
        scrollEnabled={false}
      >
        {imagesList.map(function (imageSource, imageIndex) {
          return (
            <Image
              key={imageIndex}
              source={imageSource}
              style={styles.image}
              contentFit="cover"
            />
          );
        })}
      </Swiper>

      <View style={styles.overlay}>
        <View style={styles.infos}>
          {informationList.map(function (infoText, infoIndex) {
            // Styles conditionnels selon le type d'information
            let infoStyle;
            let displayText = infoText;

            if (infoIndex === 0) {
              // Username - plus grand
              infoStyle = [
                styles.info,
                {
                  color: "#F5EBE6",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: "-8",
                },
              ];
            } else if (infoIndex === 1) {
              // Âge - plus petit
              infoStyle = [styles.info, { color: "#F5EBE6", fontSize: 17 }];
            } else if (infoIndex === 2) {
              // Distance - entre parenthèses
              infoStyle = [
                styles.info,
                { color: "#F5EBE6", fontSize: 16, marginLeft: 15 },
              ];
              displayText = ` (${infoText})`;
            }

            return (
              <Text key={infoIndex} style={infoStyle}>
                {displayText}
                {/* Virgule seulement après le username (index 0) */}
                {infoIndex === 0 ? ", " : ""}
              </Text>
            );
          })}
        </View>

        <View style={styles.hashtags}>
          {hashtagsList
            .map(function (hashtag, hashtagIndex) {
              return (
                <Text
                  key={hashtagIndex}
                  style={[styles.hashtag, { color: "#F5EBE6" }]}
                >
                  #{capitalize(hashtag)}{" "}
                </Text>
              );
            })
            .slice(0, 3)}
        </View>
      </View>

      {relationIconSource && (
        <View style={styles.relationIconContainer} pointerEvents="box-none">
          <Image
            source={relationIconSource}
            style={[
              styles.icon,
              profileData?.relationship === "Matcha" && styles.matcha,
            ]}
            contentFit="contain"
          />
        </View>
      )}

      {/* Bouton flèche vers le haut (en bas à droite) */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          onPress={goToProfileInformations}
          style={styles.fabButton}
          activeOpacity={0.8}
        >
          <FontAwesome name="arrow-up" size={20} color="#f7779bff" />
        </TouchableOpacity>
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
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 50,
    zIndex: 50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  arrow: {
    color: "#FFF5F0",
    fontSize: 100,
  },
  overlay: {
    position: "absolute",
    height: "25%",
    width: "70%",
    // left: screenWidth / 10,
    left: 15,
    // right: 150,
    bottom: screenHeight / 6.5,
  },

  infos: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    bottom: -screenHeight / 6,
  },
  hashtags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    bottom: -screenHeight / 6,
    gap: 4,
  },

  hashtag: {
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: "rgba(150, 90, 81, 0.4)",
    borderRadius: 10,
    padding: 5,
  },

  relationIconContainer: {
    position: "absolute",
    right: 11,
    bottom: 60,
    zIndex: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F0",
    boxShadow: "0 2px 3px #896761",
    height: 73,
    width: 73,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: "#91a7daff",
  },
  icon: {
    width: "70%",
    height: "70%",
    marginBottom: 8,
    zIndex: 70,
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    left: -6,
    bottom: 100,
    backgroundColor: "#FFF5F0",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 3px #896761",
    shadowOpacity: 0.15,
    // shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  matcha: {
    height: 35,
    marginTop: 9,
  },
});
