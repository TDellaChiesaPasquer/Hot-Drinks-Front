import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useState } from "react";
import { useSelector } from "react-redux";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

// Anciens imports avec require() - commentés car ne fonctionnent pas avec expo-image pour SVG
// const boat = require("../assets/images/boat.png");

// imports SVG comme composants React
import BoatIcon from "../assets/images/boat.png"; // Gardé en require car c'est un PNG
import ChocolatChaudIcon from "../assets/images/relationImages/chocolat-chaud.svg";
import AllongeIcon from "../assets/images/relationImages/allonge.svg";
import TheIcon from "../assets/images/relationImages/the.svg";
import EspressoIcon from "../assets/images/relationImages/espresso.svg";
import RistrettoIcon from "../assets/images/relationImages/ristretto.svg";
import MatchaIcon from "../assets/images/relationImages/matcha.svg";

export default function PreferencesScreen({ navigation }) {
  const ageValues = Array.from(Array(48), (x, index) => index + 18);
  const user = useSelector((state) => state.user.value);
  const defaultAgeRange =
    user.user && user.user.ageRange
      ? [
          Number(user.user.ageRange.slice(0, 2)),
          Number(user.user.ageRange.slice(3, 5)),
        ]
      : [20, 30];
  const [ageRange, setAgeRange] = useState(defaultAgeRange);
  const ageRangeString =
    ageRange[1] === 65 ? ageRange.join("-") + "+" : ageRange.join("-");
  const distanceValues = [
    5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 65, 80, 100, 125, 150, 200, 250,
    300, 400, 500, 600,
  ];
  const defaultDistance = [
    user.user && user.user.distance ? Number(user.user.distance) : 20,
  ];
  const [distance, setDistance] = useState(defaultDistance);
  const distanceString =
    (distance[0] === 600 ? "500+" : String(distance[0])) + " km";
  const defaultJeSuis = (user.user && user.user.gender) || "";
  const [jeSuis, setJeSuis] = useState(defaultJeSuis);
  const defaultJeRecherche = (user.user && user.user.orientation) || "";
  const [jeRecherche, setJeRecherche] = useState(defaultJeRecherche);
  const defaultRelation = (user.user && user.user.relationship) || "";
  const [relation, setRelation] = useState(defaultRelation);
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log(isModalVisible);
  const modalModificationCheck = (
    <Modal
      style={styles.modal}
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Modifications enregistrées!</Text>
        </View>
      </View>
    </Modal>
  );

  const handleModal = (bool) => {
    console.log(bool);
    setIsModalVisible(() => bool);
  };

  const sendInfos = async () => {
    const response = await fetch(
      process.env.EXPO_PUBLIC_IP + "/users/algoInfos",
      {
        method: "PUT",
        headers: {
          authorization: user.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          distance: distance[0],
          ageRange: ageRange.join("-"),
          gender: jeSuis,
          orientation: jeRecherche,
          relationship: relation,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    handleModal(true);
    setTimeout(handleModal, 1500, false);
  };
  return (
    <View style={styles.container}>
      {modalModificationCheck}
      <ScrollView contentContainerStyle={styles.scrollInterior}>
        <Text style={styles.title}>Mes préférences</Text>
        <View style={styles.selectorContainer}>
          <View style={styles.questionDoubleText}>
            <Text style={styles.questionText}>Tranche d'âge : </Text>
            <Text style={styles.questionText}>{ageRangeString}</Text>
          </View>
          <MultiSlider
            values={defaultAgeRange}
            onValuesChange={(e) => setAgeRange(e)}
            optionsArray={ageValues}
            sliderLength={width * 0.9 * 0.8}
            markerStyle={styles.marker}
            unselectedStyle={styles.unselected}
            selectedStyle={styles.selected}
            trackStyle={styles.track}
            markerOffsetY={2}
            containerStyle={styles.rangeContainer}
          />
        </View>
        <View style={styles.selectorContainer}>
          <View style={styles.questionDoubleText}>
            <Text style={styles.questionText}>Distance maximale : </Text>
            <Text style={styles.questionText}>{distanceString}</Text>
          </View>
          <MultiSlider
            values={defaultDistance}
            optionsArray={distanceValues}
            onValuesChange={(e) => setDistance(e)}
            sliderLength={width * 0.9 * 0.8}
            markerStyle={styles.marker}
            unselectedStyle={styles.unselected}
            selectedStyle={styles.selected}
            trackStyle={styles.track}
            markerOffsetY={2}
            containerStyle={styles.rangeContainer}
          />
        </View>
        <Text style={styles.inputTitle}>Je suis</Text>
        <View style={styles.multipleContainer}>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultiple,
              { backgroundColor: jeSuis === "Homme" ? "#BC8D85" : "#FFF5F0" },
            ]}
            onPress={() => setJeSuis("Homme")}
          >
            <Text
              style={[
                styles.boutonChoixMultipleText,
                { color: jeSuis === "Homme" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Homme
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultiple,
              { backgroundColor: jeSuis === "Femme" ? "#BC8D85" : "#FFF5F0" },
            ]}
            onPress={() => setJeSuis("Femme")}
          >
            <Text
              style={[
                styles.boutonChoixMultipleText,
                { color: jeSuis === "Femme" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Femme
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultiple,
              {
                backgroundColor:
                  jeSuis === "Non binaire" ? "#BC8D85" : "#FFF5F0",
              },
            ]}
            onPress={() => setJeSuis("Non binaire")}
          >
            <Text
              style={[
                styles.boutonChoixMultipleText,
                { color: jeSuis === "Non binaire" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Non binaire
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.inputTitle}>Je recherche</Text>
        <View style={styles.multipleContainer}>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultiple,
              {
                backgroundColor:
                  jeRecherche === "Homme" ? "#BC8D85" : "#FFF5F0",
              },
            ]}
            onPress={() => setJeRecherche("Homme")}
          >
            <Text
              style={[
                styles.boutonChoixMultipleText,
                { color: jeRecherche === "Homme" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Homme
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultiple,
              {
                backgroundColor:
                  jeRecherche === "Femme" ? "#BC8D85" : "#FFF5F0",
              },
            ]}
            onPress={() => setJeRecherche("Femme")}
          >
            <Text
              style={[
                styles.boutonChoixMultipleText,
                { color: jeRecherche === "Femme" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Femme
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultiple,
              {
                backgroundColor: jeRecherche === "Tout" ? "#BC8D85" : "#FFF5F0",
              },
            ]}
            onPress={() => setJeRecherche("Tout")}
          >
            <Text
              style={[
                styles.boutonChoixMultipleText,
                { color: jeRecherche === "Tout" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Tout
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.inputTitle}>Que recherches-tu ?</Text>
        <View style={styles.multipleContainer}>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultipleBoat,
              {
                backgroundColor:
                  relation === "Chocolat chaud" ? "#8A3535" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Chocolat chaud")}
          >
            <ChocolatChaudIcon
              width={0.18 * width}
              height={0.18 * width}
              style={styles.svgIcon}
            />
            <Text
              style={[
                styles.boutonChoixMultipleTextBoat,
                {
                  color: relation === "Chocolat chaud" ? "#F5EBE6" : "#965A51",
                },
              ]}
            >
              Chocolat chaud
            </Text>
            <Text
              style={[
                styles.boutonChoixMultipleTextLegend,
                {
                  color: relation === "Chocolat chaud" ? "#F5EBE6" : "#965A51",
                },
              ]}
            >
              Pour la vie
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultipleBoat,
              {
                backgroundColor: relation === "Allongé" ? "#6A3931" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Allongé")}
          >
            <AllongeIcon
              width={0.18 * width}
              height={0.18 * width}
              style={styles.svgIcon}
            />
            <Text
              style={[
                styles.boutonChoixMultipleTextBoat,
                { color: relation === "Allongé" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Allongé
            </Text>
            <Text
              style={[
                styles.boutonChoixMultipleTextLegend,
                { color: relation === "Allongé" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Relation sérieuse
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultipleBoat,
              { backgroundColor: relation === "Thé" ? "#E69B5C" : "#FFF5F0" },
            ]}
            onPress={() => setRelation("Thé")}
          >
            <TheIcon
              width={0.18 * width}
              height={0.18 * width}
              style={styles.svgIcon}
            />
            <Text
              style={[
                styles.boutonChoixMultipleTextBoat,
                { color: relation === "Thé" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Thé
            </Text>
            <Text
              style={[
                styles.boutonChoixMultipleTextLegend,
                { color: relation === "Thé" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Plus si affinités
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.multipleContainer}>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultipleBoat,
              {
                backgroundColor:
                  relation === "Expresso" ? "#632912" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Expresso")}
          >
            <EspressoIcon
              width={0.18 * width}
              height={0.18 * width}
              style={styles.svgIcon}
            />
            <Text
              style={[
                styles.boutonChoixMultipleTextBoat,
                { color: relation === "Expresso" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Expresso
            </Text>
            <Text
              style={[
                styles.boutonChoixMultipleTextLegend,
                { color: relation === "Expresso" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Sans prise de tête
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultipleBoat,
              {
                backgroundColor:
                  relation === "Ristretto" ? "#3D190B" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Ristretto")}
          >
            <RistrettoIcon
              width={0.18 * width}
              height={0.18 * width}
              style={styles.svgIcon}
            />
            <Text
              style={[
                styles.boutonChoixMultipleTextBoat,
                { color: relation === "Ristretto" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Ristretto
            </Text>
            <Text
              style={[
                styles.boutonChoixMultipleTextLegend,
                { color: relation === "Ristretto" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Un shot de plaisir
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultipleBoat,
              {
                backgroundColor: relation === "Matcha" ? "#C4E1B8" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Matcha")}
          >
            <MatchaIcon
              width={0.18 * width}
              height={0.18 * width}
              style={styles.svgIcon}
            />
            <Text
              style={[
                styles.boutonChoixMultipleTextBoat,
                { color: relation === "Matcha" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Matcha
            </Text>
            <Text
              style={[
                styles.boutonChoixMultipleTextLegend,
                { color: relation === "Matcha" ? "#F5EBE6" : "#965A51" },
              ]}
            >
              Relation amicale
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.bouton} onPress={() => sendInfos()}>
          <Text style={styles.boutonText}>Valider</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollInterior: {
    width: width,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  selectorContainer: {
    height: 80,
    width: "90%",
    backgroundColor: "#BC8D85",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 3px #896761",
    marginVertical: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontWeight: "900",
    },
  },

  questionDoubleText: {
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  questionText: {
    color: "#FFF5F0",
    fontWeight: "bold",
  },
  marker: {
    backgroundColor: "#F5EBE6",
    borderWidth: 0,
    boxShadow: "0 2px 3px #896761",
  },
  unselected: {
    backgroundColor: "#F5EBE6",
  },
  selected: {
    backgroundColor: "#FFA500",
  },
  track: {
    height: 5,
  },
  rangeContainer: {
    marginBottom: -15,
  },
  boutonChoixMultiple: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 3px #896761",
    marginVertical: 10,
  },
  boutonChoixMultipleText: {
    fontWeight: "bold",
    width: "80%",
    textAlign: "center",
    lineHeight: 30,
  },
  multipleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
  },
  title: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  inputTitle: {
    color: "#965A51",
    fontWeight: "bold",
    marginVertical: 10,
  },
  image: {
    objectFit: "cover",
    width: 0.18 * width,
    height: 0.18 * width,
    marginVertical: 8,
  },
  boutonChoixMultipleTextLegend: {
    fontSize: 8,
  },
  boutonChoixMultipleTextBoat: {
    fontWeight: "bold",
    width: "90%",
    textAlign: "center",
    fontSize: 10,
  },
  boutonChoixMultipleBoat: {
    width: width * 0.25,
    height: width * 0.3,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    boxShadow: "0 2px 3px #896761",
    marginVertical: 10,
  },
  bouton: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    width: width * 0.7,
    backgroundColor: "#965a51c0",
    margin: 10,
  },
  boutonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
  },
});
