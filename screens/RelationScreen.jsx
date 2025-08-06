import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import HeaderBeginning from "../components/HeaderBeginning";
import { addTempInfo } from "../reducers/user";

const { width, height } = Dimensions.get("window");

const boat = require("../assets/images/boat.png");

export default function ({ navigation }) {
	const user = useSelector((state) => state.user.value);
	const [error, setError] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [relation, setRelation] = useState("");
	const dispatch = useDispatch();
	const sanitizeInputs = async () => {
		setDisabled(true);
		if (relation === "") {
			setError("Selectionnez un type de relation");
			setDisabled(false);
		}
		const response = await fetch(process.env.EXPO_PUBLIC_IP + "/users/userInfos", {
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
		});
		const data = await response.json();
		if (!data.result) {
			setError("Une erreur a eu lieu");
			setDisabled(false);
			return;
		}
        setDisabled(false);
        navigation.navigate('MainTabNav');
	};
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<HeaderBeginning />
				<Text style={styles.inputTitle}>Que recherches-tu ?</Text>
				<View style={styles.multipleContainer}>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: relation === "Chocolat chaud" ? "#8A3535" : "#FFF5F0" }]} onPress={() => setRelation("Chocolat chaud")}>
						<Image source={boat} style={styles.image} />
						<Text style={[styles.boutonChoixMultipleText, { color: relation === "Chocolat chaud" ? "#F5EBE6" : "#965A51" }]}>Chocolat chaud</Text>
						<Text style={[styles.boutonChoixMultipleTextLegend, { color: relation === "Chocolat chaud" ? "#F5EBE6" : "#965A51" }]}>Pour la vie</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: relation === "Allongé" ? "#6A3931" : "#FFF5F0" }]} onPress={() => setRelation("Allongé")}>
						<Image source={boat} style={styles.image} />
						<Text style={[styles.boutonChoixMultipleText, { color: relation === "Allongé" ? "#F5EBE6" : "#965A51" }]}>Allongé</Text>
						<Text style={[styles.boutonChoixMultipleTextLegend, { color: relation === "Allongé" ? "#F5EBE6" : "#965A51" }]}>Relation sérieuse</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: relation === "Thé" ? "#E69B5C" : "#FFF5F0" }]} onPress={() => setRelation("Thé")}>
						<Image source={boat} style={styles.image} />
						<Text style={[styles.boutonChoixMultipleText, { color: relation === "Thé" ? "#F5EBE6" : "#965A51" }]}>Thé</Text>
						<Text style={[styles.boutonChoixMultipleTextLegend, { color: relation === "Thé" ? "#F5EBE6" : "#965A51" }]}>Plus si affinités</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.multipleContainer}>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: relation === "Expresso" ? "#632912" : "#FFF5F0" }]} onPress={() => setRelation("Expresso")}>
						<Image source={boat} style={styles.image} />
						<Text style={[styles.boutonChoixMultipleText, { color: relation === "Expresso" ? "#F5EBE6" : "#965A51" }]}>Expresso</Text>
						<Text style={[styles.boutonChoixMultipleTextLegend, { color: relation === "Expresso" ? "#F5EBE6" : "#965A51" }]}>Sans prise de tête</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: relation === "Ristretto" ? "#3D190B" : "#FFF5F0" }]} onPress={() => setRelation("Ristretto")}>
						<Image source={boat} style={styles.image} />
						<Text style={[styles.boutonChoixMultipleText, { color: relation === "Ristretto" ? "#F5EBE6" : "#965A51" }]}>Ristretto</Text>
						<Text style={[styles.boutonChoixMultipleTextLegend, { color: relation === "Ristretto" ? "#F5EBE6" : "#965A51" }]}>Un shot de plaisir</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: relation === "Matcha" ? "#C4E1B8" : "#FFF5F0" }]} onPress={() => setRelation("Matcha")}>
						<Image source={boat} style={styles.image} />
						<Text style={[styles.boutonChoixMultipleText, { color: relation === "Matcha" ? "#F5EBE6" : "#965A51" }]}>Matcha</Text>
						<Text style={[styles.boutonChoixMultipleTextLegend, { color: relation === "Matcha" ? "#F5EBE6" : "#965A51" }]}>Relation amicale</Text>
					</TouchableOpacity>
				</View>
                <View style={styles.bottom}>
                    <Text style={styles.error}>{error}</Text>
                    <TouchableOpacity style={styles.bouton} onPress={() => sanitizeInputs()} disabled={disabled}>
                        <Text style={styles.boutonText}>Valider</Text>
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
    fontSize: 10,
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
    fontSize: 10,
  },
  multipleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignItems: "center",
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
  bottom: {
    position: "absolute",
    top: height * 0.7,
  },
});
