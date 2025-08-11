import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import { setAnswer, toggleStar, setAllTastes } from "../reducers/user";
import DropDownComponent from "../components/DropDownComponent";
import Swiper from "react-native-swiper";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");

export default function MyProfile({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);
  const dataPhoto = useSelector((state) => state.user.value);
  const dataTaste = dataPhoto.user.tastesList;
  const tastesById = {};
  for (const tastElement of dataTaste) {
    tastesById[tastElement.category] = {
      label: tastElement.label,
      value: tastElement.value,
      star: tastElement.star,
    };
  }

  //___________________________________________________________CAROUSSEL________________________________________________________________
  const photoList = dataPhoto.user.photoList;
  console.log(dataPhoto.user.photoList);

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
        { label: "Horreur", value: "Films d'orreur " },
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
          dispatch(
            setAnswer({ id: data.id, label: data.label, value: item.value })
          );
          //   setTastesList((prev) => {
          //     const copy = { ...prev };
          //     const starValue = copy[data.id] ? copy[data.id].star : false;

          //     copy[data.id] = {
          //       label: item.label,
          //       value: item.value,
          //       star: starValue,
          //     };
          //     return copy;
          //   });
        }}
        onToggleStar={(next) => {
          dispatch(toggleStar({ id: data.id, next }));
          //   setTastesList((prev) => {
          //     const copy = { ...prev };
          //     const labelValue = copy[data.id] ? copy[data.id].label : null;
          //     const valueValue = copy[data.id] ? copy[data.id].value : null;

          //     copy[data.id] = {
          //       label: labelValue,
          //       value: valueValue,
          //       star: next,
          //     };
          //     return copy;
          //   });
        }}
      />
    );
  });

  //_____________________________________________________HASHTAGS_____________________________________________

  //   let starredTags = [];
  //   for (let id in tastesList) {
  //     const item = tastesList[id];
  //     if (item && item.value && item.star) {
  //       starredTags.push({ id: id, value: item.value });
  //     }
  //   }

  const starredTags = [];
  for (const key in tastesById) {
    const t = tastesById[key];
    if (t && t.star === true && t.value) {
      starredTags.push(t.value);
    }
  }
  // .filter((e) => e && e.star && e.value)
  // .map((e) => e.value);

  //___________________________________________________________SAUVEGARDE TASTES________________________________________
  const saveAllTastes = async () => {
    try {
      const tastesToSave = [];
      for (let id in tastesById) {
        const taste = tastesById[id];
        // const v = tastesList[category];
        if (taste && taste.value) {
          tastesToSave.push({
            category: id,
            label: taste.label,
            value: taste.value,
            star: Boolean(taste.star),
          });
        }
      }
      console.log("tastesToSave=", tastesToSave);
      console.log("tastesToSave.lenght=", tastesToSave.length);
      if (tastesToSave.length === 0) return;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/users/addAllTastes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({
            tastesList: tastesToSave,
          }),
        }
      );
      const data = await response.json();
      if (data.result && data.tastesList) {
        const obj = {};

        for (let i = 0; i < data.tastesList.length; i++) {
          const elem = data.tasteList[i] || {};
          const category = elem.category || null;

          if (!category) continue;

          obj[category] = {
            label: elem.label || null,
            value: elem.value || null,
            star: elem.star ? true : false,
          };
        }
        // for (let elem of data.tastesList) {
        //   obj[elem.category] = {
        //     label: elem.label,
        //     value: elem.value,
        //     star: Boolean(elem.star),
        //   };
        // }
        dispatch(setAllTastes(obj));
        console.log("Réponses enregistrées avec succès!");
      } else {
        console.log("Erreur lors de l'enregistrement: ", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
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
              console.log(url);
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
            {starredTags.map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
          {/* <Image
        source={require("../assets/images/boat.png")}
        style={styles.imageTest}
      /> */}
          {dropDownQuestion}

          <TouchableOpacity
            style={styles.validationButton}
            onPress={() => saveAllTastes()}
          >
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
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    width: "100%",
  },

  // imageTest: {
  //   height: 100,
  //   width: 100,
  // },

  scrollView: {
    backgroundColor: "#F5EBE6",
    height: "100%",
    width: "100%",
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
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    width: "70%",
    backgroundColor: "#965a51c0",
    marginVertical: 10,
    marginTop: 100,
    alignSelf: "center",
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
    marginBottom: 12,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    // alignSelf: "flex-start",
    justifyContent: "space-evenly",
    // backgroundColor: "rgba(150, 90, 81, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginRight: 8,
    marginBottom: 2,
    // position: "absolute",
    alignContent: "space-between ",
    gap: "5",
  },

  tagText: {
    color: "white",
    fontWeight: "bold",
  },
});
