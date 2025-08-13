import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HeaderBeginning from "../components/HeaderBeginning";
export default function CompleteInfosScreen({ navigation }) {
  const handleCompleteInfos = () => {
    navigation.navigate("MainTabNav", { screen: "MyProfileNav" });
  };

  const handleNotNow = () => {
    navigation.navigate("MainTabNav", { screen: "SwipeNav" });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <HeaderBeginning />
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.textTitle}>
              Souhaites-tu compléter ton profil maintenant?
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCompleteInfos()}
            >
              <Text style={styles.textButton}>C'est parti!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNotNow()}
            >
              <Text style={styles.textButton}>Plus tard</Text>
            </TouchableOpacity>
          </View>
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
  textContainer: {
    marginTop: 160,
    // backgroundColor: "yellow",
    justifyContent: "center",
    width: "80%",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  textTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#965A51",
  },

  buttonContainer: {
    justifyContent: "center",
    flexDirection: "row",
    height: "10%",
    alignItems: "center",
    gap: 20,
    width: "100%",
    height: "30%",
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginRight: 20,
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    width: "35%",
    backgroundColor: "#965a51c0",
    margin: 10,
  },

  textButton: {
    color: "#F5EBE6",
    fontWeight: "bold",
  },
});
