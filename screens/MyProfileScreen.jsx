import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import DropDownComponent from "../components/DropDownComponent";

export default function myProfile({ navigation }) {
  //   const [answerSelected, setAnswerSelected] = useState([]);
  const [tastesList, setTastesList] = useState([{}]);

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

  const dropDownQuestion = questions.map((data, i) => {
    return (
      <DropDownComponent
        key={i}
        question={data.question}
        options={data.options}
      />
    );
  });

  const addTastesToList = (tastes) => {
    setTastesList([...tastesList, tastes]);
  };

  // const handleSave = async () => {
  //   try {
  //     const response = await fetch(
  //       process.env.EXPO_PUBLIC_IP +
  //         "/users/addTastes/" + tastesList.length,
  //         {
  //           method: "POST",
  //           headers: { headers: authorization: user.token,},
  //           body: JSON.stringify({
  //             userId: "ID_UTILISATEUR",
  //             answers: .....
  //           }),
  //         }
  //     );
  //     const data = await response.json();
  //     if (response) {
  //       Alert.alert("Modifications enregistrées avec succès!");
  //     } else {
  //       Alert.alert("Erreur", data.error || "Erreur serveur");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Erreur", "Impossible de sauvegarder les modifications");
  //   }
  // };

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
        <ScrollView style={styles.scrollView}>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </Text>
          {dropDownQuestion}
          {/* <DropDownComponent></DropDownComponent> */}
          {/* <Button title="Enregistrer" onPress={handleSave} /> */}
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

  scrollView: {
    backgroundColor: "#F5EBE6",
    height: "100%",
    width: "100%",
  },
});
