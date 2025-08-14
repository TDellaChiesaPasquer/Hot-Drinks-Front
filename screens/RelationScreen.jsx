import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "expo-image";
import HeaderBeginning from "../components/HeaderBeginning";
import { addTempInfo } from "../reducers/user";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

const { width, height } = Dimensions.get("window");

// Import des images PNG
const relationIcons = {
  boat: require("../assets/images/boat.png"),
  allonge: require("../assets/images/IconsRelations/allonge.png"),
  espresso: require("../assets/images/IconsRelations/espresso.png"),
  hotChocolate: require("../assets/images/IconsRelations/hotChocolate.png"),
  matcha: require("../assets/images/IconsRelations/matcha.png"),
  ristretto: require("../assets/images/IconsRelations/ristretto.png"),
  the: require("../assets/images/IconsRelations/the.png"),
};

export default function ({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [relation, setRelation] = useState("");
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const sanitizeInputs = async () => {
    setDisabled(true);
    if (relation === "") {
      setError("Selectionne un type de relation");
      setDisabled(false);
      return;
    }
    const response = await fetch(
      process.env.EXPO_PUBLIC_IP + "/users/userInfos",
      {
        method: "PUT",
        headers: {
          authorization: user.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthdate: user.tempInfos.date,
          username: user.tempInfos.username,
          gender: user.tempInfos.gender,
          orientation: user.tempInfos.orientation,
          relationship: relation,
        }),
      }
    );
    const data = await response.json();
    if (!data.result) {
      setError("Une erreur a eu lieu");
      setDisabled(false);
      return;
    }
    setDisabled(false);
    navigation.navigate("PhotoScreen");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <HeaderBeginning />
        <Text style={styles.inputTitle}>Que recherches-tu ?</Text>
        <View style={styles.multipleContainer}>
          <TouchableOpacity
            style={[
              styles.boutonChoixMultiple,
              {
                backgroundColor:
                  relation === "Chocolat chaud" ? "#8A3535" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Chocolat chaud")}
          >
            {/* Remplacer l'icône SVG par une image PNG dans un cercle */}
            <View style={styles.iconContainer}>
              <Image
                source={relationIcons.hotChocolate}
                style={styles.image}
                contentFit="contain"
              />
            </View>
            <Text
              style={[
                styles.boutonChoixMultipleText,
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
              styles.boutonChoixMultiple,
              {
                backgroundColor: relation === "Allongé" ? "#6A3931" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Allongé")}
          >
            <View style={styles.iconContainer}>
              <Image
                source={relationIcons.allonge}
                style={styles.image}
                contentFit="contain"
              />
            </View>
            <Text
              style={[
                styles.boutonChoixMultipleText,
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
              styles.boutonChoixMultiple,
              { backgroundColor: relation === "Thé" ? "#E69B5C" : "#FFF5F0" },
            ]}
            onPress={() => setRelation("Thé")}
          >
            <View style={styles.iconContainer}>
              <Image
                source={relationIcons.the}
                style={styles.image}
                contentFit="contain"
              />
            </View>
            <Text
              style={[
                styles.boutonChoixMultipleText,
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
              styles.boutonChoixMultiple,
              {
                backgroundColor:
                  relation === "Expresso" ? "#632912" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Expresso")}
          >
            <View style={styles.iconContainer}>
              <Image
                source={relationIcons.espresso}
                style={styles.image}
                contentFit="contain"
              />
            </View>
            <Text
              style={[
                styles.boutonChoixMultipleText,
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
              styles.boutonChoixMultiple,
              {
                backgroundColor:
                  relation === "Ristretto" ? "#3D190B" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Ristretto")}
          >
            <View style={styles.iconContainer}>
              <Image
                source={relationIcons.ristretto}
                style={styles.image}
                contentFit="contain"
              />
            </View>
            <Text
              style={[
                styles.boutonChoixMultipleText,
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
              styles.boutonChoixMultiple,
              {
                backgroundColor:
                  relation === "Matcha" ? "#9ece83ff" : "#FFF5F0",
              },
            ]}
            onPress={() => setRelation("Matcha")}
          >
            <View style={styles.iconContainer}>
              <Image
                source={relationIcons.matcha}
                style={styles.image}
                contentFit="contain"
              />
            </View>
            <Text
              style={[
                styles.boutonChoixMultipleText,
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

        <View style={styles.bottom}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity
            style={[styles.bouton, disabled && styles.boutonDisabled]}
            onPress={() => sanitizeInputs()}
            disabled={disabled}
          >
            <Text style={styles.boutonText}>Valider</Text>
            {disabled && (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                style={styles.loader}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFC9B4",
    alignItems: "center",
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
  input: {
    backgroundColor: "#FFF5F0",
    height: 45,
    borderRadius: 50,
    boxShadow: "0 2px 3px #896761",
    paddingHorizontal: 12,
    fontWeight: "bold",
    color: "#965A51",
    fontSize: 12,
    width: width * 0.9,
    margin: 10,
  },
  inputDate: {
    backgroundColor: "#FFF5F0",
    height: 45,
    borderRadius: 50,
    boxShadow: "0 2px 3px #896761",
    paddingHorizontal: 12,
    fontWeight: "bold",
    color: "#965A51",
    fontSize: 12,
    width: width * 0.2,
    marginVertical: 10,
    textAlign: "center",
  },
  inputTitle: {
    color: "#965A51",
    fontWeight: "bold",
    marginTop: 30,
  },
  inputSub: {
    color: "#BC8D85",
    fontSize: 1,
    fontStyle: "italic",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  boutonChoixMultiple: {
    width: width * 0.25,
    height: width * 0.3,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "flex-start",
    boxShadow: "0 2px 3px #896761",
    marginVertical: 30,
  },
  boutonChoixMultipleText: {
    fontWeight: "bold",
    width: "90%",
    textAlign: "center",
    fontSize: 11,
  },
  multipleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
  },
  iconContainer: {
    width: 0.18 * width,
    height: 0.18 * width,
    borderRadius: (0.18 * width) / 2,
    // backgroundColor: "#E8D5C4", // Marron clair
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    marginBottom: -0.5,
    overflow: "hidden",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  boutonChoixMultipleTextLegend: {
    fontSize: 10.5,
  },
  bottom: {
    position: "absolute",
    top: height * 0.7,
  },
  boutonDisabled: {
    backgroundColor: "#8b6762c0",
    boxShadow: "0 1px 2px #976f68c0",
  },
  loader: {
    position: "absolute",
    left: 10,
  },
});
