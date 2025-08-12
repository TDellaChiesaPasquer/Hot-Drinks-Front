import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, TouchableOpacity, Button } from "react-native";

import React, { useEffect, useState } from "react";
// import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import { setAnswer, toggleStar, setAllTastes } from "../reducers/user";
import DropDownComponent from "../components/DropDownComponent";
import Swiper from "react-native-swiper";
import { Image } from "expo-image";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import ImagePickerComponent from "../components/ImagePickerComponent";

const { width, height } = Dimensions.get("window");

export default function MyProfile({ navigation }) {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);
  const dataPhoto = useSelector((state) => state.user.value);
  const dataTaste = (dataPhoto.user && dataPhoto.user.tastesList) || [];
  const tastesById = {};
  for (const tastElement of dataTaste) {
    tastesById[tastElement.category] = {
      label: tastElement.label,
      value: tastElement.value,
      star: tastElement.star,
    };
  }
  console.log(tastesById)

	//___________________________________________________________CAROUSSEL_____________________________________________________________
  
	const photoList = (dataPhoto.user && dataPhoto.user.photoList) || [];

	//__________________________________________________________QUESTIONS DATA_________________________________________________________

  const questions = [
    {
      id: "music",
      question: "Quel est ton genre de musique préféré ?",
      options: [
        { label: "Pop", value: "Pop" },
        { label: "Rock", value: "Rock" },
        { label: "Jazz", value: "Jazz" },
        { label: "Rap", value: "Rap" },
        { label: "Classique", value: "Classique" },
        { label: "Latino", value: "Latino" },
      ],
    },
    {
      id: "sorties",
      question: "Tu préfères les soirées...",
      options: [
        { label: "Calmes", value: "soirées calmes" },
        { label: "Festives", value: "Soirées festives" },
        { label: "Entre amis", value: "Soirées entre amis" },
        { label: "En famille", value: "Soirées en famille" },
      ],
    },
    {
      id: "films",
      question: "Quel genre de films préfères-tu ?",
      options: [
        { label: "Comédie", value: "Comédies" },
        { label: "Horreur", value: "Films d'horreur " },
        { label: "Dystopique", value: "Films dystopiques" },
        { label: "Historique", value: "Films historiques" },
        { label: "Psychologique", value: "Films psychologiques" },
      ],
    },
    {
      id: "animaux",
      question: "As tu des animaux de compagnie ?",
      options: [
        { label: "Oui", value: "Ami(e) des animaux" },
        { label: "Non", value: "Pas d'animaux" },
        { label: "Non, mais j'aimerai en avoir", value: "Veut des animaux" },
      ],
    },
    {
      id: "matin",
      question: "Es-tu plutôt...",
      options: [
        { label: "Matinal·e", value: "Matinal·e" },
        { label: "Couche-tard", value: "Couche-tard" },
        { label: "Les deux", value: "Les deux" },
      ],
    },
    {
      id: "sport",
      question: "Ta pratique sportive?",
      options: [
        { label: "Accro au sport", value: "Accro au sport" },
        { label: "Souvent", value: "Sportif régulier" },
        { label: "Parfois", value: "Sportif du dimanche" },
        { label: "Jamais", value: "Pas sportif" },
      ],
    },
    {
      id: "vacances",
      question: "Vacances idéales ?",
      options: [
        { label: "Hotel all inclusive", value: "Hotel all inclusive" },
        { label: "Voyage organisé", value: "Voyage organisé" },
        { label: "Camping", value: "Camping" },
        { label: "Road Trip", value: "Road Trip" },
      ],
    },
    {
      id: "lecture",
      question: "Lis-tu régulièrement ?",
      options: [
        { label: "Oui", value: "Lecture" },
        { label: "Non", value: "Pas de lecture" },
        { label: "Parfois", value: "Lecteur amateur" },
      ],
    },
    {
      id: "cuisine",
      question: "Tes préférences alimentaires ?",
      options: [
        { label: "Vegan", value: "Vegan" },
        { label: "Végétarien(ne)", value: "Végétarien(ne)" },
        { label: "Flexi", value: "Flexi" },
        { label: "Omnivore", value: "Omnivore" },
        { label: "Carnivore", value: "Carnivore" },
      ],
    },
  ];
  //__________________________________________________________DROP DOWN QUESTIONS____________________________________________________
  const dropDownQuestion = questions.map((data, i) => {
    const currentFromStore = tastesById[data.id];
    let current = { label: null, value: null, star: false };
    if (currentFromStore) {
      current = {
        label: currentFromStore.label,
        value: currentFromStore.value,
        star: Boolean(currentFromStore.star),
      };
    }

		return (
			<DropDownComponent
				key={i}
				questionId={data.id}
				question={data.question}
				options={data.options}
				value={current.value}
				star={current.star}
				onChange={(item) => {
					dispatch(setAnswer({ id: data.id, label: data.label, value: item.value }));
				}}
				onToggleStar={(next) => {
					dispatch(toggleStar({ id: data.id, next }));
				}}
			/>
		);
	});

	//_____________________________________________________HASHTAGS_____________________________________________

  const starredTags = [];
  for (const key in tastesById) {
    const t = tastesById[key];
    console.log(t)
    if (t && t.star === true && t.value) {
      console.log(t)
      starredTags.push(t.value);
    }
  }
  console.log(starredTags)
  //___________________________________________________________SAUVEGARDE TASTES________________________________________
  const saveAllTastes = async () => {
    const tastesList = dataTaste;
    await fetch(process.env.EXPO_PUBLIC_IP + "/users/addAllTastes", {
      method: "POST",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tastesList }),
    });
    alert("Les modifications ont bien été enregistrées.");
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("MyProfileNav")} />
        <TouchableOpacity onPress={() => navigation.navigate("MainTabNav")} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mon Profil</Text>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 160 }}
        >
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.modifyIcon}
              onPress={() => {
                navigation.navigate("SignUpNav", {
                  screen: "PhotoScreen",
                  params: { photoList },
                });
              }}
            >
              <FontAwesome5 name="pen" size={15} color="white" />
            </TouchableOpacity>
          </View>
          <Swiper
            style={styles.caroussel}
            loop={true}
            showsButtons
            nextButton={<Text style={styles.arrow}>›</Text>}
            prevButton={<Text style={styles.arrow}>‹</Text>}
            activeDotColor="white"
            scrollEnabled={false}
          >
            {photoList.map(function (url, i) {
              return (
                <Image
                  key={i}
                  source={url}
                  style={styles.image}
                  contentFit="cover"
                />
              );
            })}
          </Swiper>
          <View style={styles.tagContainer}>
            <View style={styles.tagContainerAbsolute}>
              {starredTags.map((tag, idx) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

					{dropDownQuestion}

					<TouchableOpacity style={styles.validationButton} onPress={() => saveAllTastes()}>
						<Text style={styles.textValidateButton}>Valider</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		color: "#965a51c0",
		backgroundColor: "#F5EBE6",
		justifyContent: "center",
		textAlign: "center",
		fontWeight: "bold",
		marginTop: 15,
	},

	scrollContainer: {
		flex: 1,
		backgroundColor: "#F5EBE6",
		width: "100%",
	},

	scrollView: {
		backgroundColor: "#F5EBE6",
		height: "100%",
		width: "100%",
	},

	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: "100%",
		backgroundColor: "#965A51",
		overflow: "hidden",
		justifyContent: "flex-end",
		// backgroundColor: "blue",
		alignItems: "flex-end",
		// paddingRight: 10,
		position: "absolute",
		zIndex: 1,
		top: 35,
		right: 13,
		// boxShadow: "0 2px 3px #BC8D85",
	},

	modifyIcon: {
		justifyContent: "flex-end",
		// backgroundColor: "blue",
		alignItems: "flex-end",
		paddingRight: 20,
		position: "absolute",
		zIndex: 999,
		top: 13,
		right: -7,
	},

	caroussel: {
		height: height * 0.6,
		backgroundColor: "lightblue",
		marginVertical: 16,
	},

	image: {
		height: "100%",
		width: "100%",
	},

	arrow: {
		color: "white",
		fontSize: 100,
	},

	validationButton: {
		marginVertical: 10,
		marginTop: 100,
		alignSelf: "center",

		alignItems: "center",
		justifyContent: "center",
		height: 36,
		borderRadius: 15,
		boxShadow: "0 2px 3px #896761",
		width: width * 0.7,
		backgroundColor: "#965A51",
		margin: 10,
	},

	textValidateButton: {
		textAlign: "center",
		alignItems: "center",
		justifyContent: "center",
		fontWeight: "bold",
		fontSize: 18,
		color: "#F5EBE6",
	},

  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 6,
    position: 'relative'
  },

  tagContainerAbsolute: {
    position: 'absolute',
    bottom: 30,
    zIndex: 999,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: width * 0.9,
    gap: 5
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    // alignSelf: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(150, 90, 81, 0.4)",
    borderRadius: 10,
    padding: 5,
    // position: "absolute",
    alignContent: "space-between ",
  },

  tagText: {
    color: "white",
    fontWeight: "bold",
  },
});
