import { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import HeaderBeginning from "../components/HeaderBeginning";
import { addTempInfo } from "../reducers/user";

const { width, height } = Dimensions.get("window");

export default function ({ navigation }) {
	const [error, setError] = useState("");
	const [jeSuis, setJeSuis] = useState("");
	const [jeRecherche, setJeRecherche] = useState("");
	const [disabled, setDisabled] = useState(false);
	const dispatch = useDispatch();
	const sanitizeInputs = () => {
		setDisabled(true);
		if (jeSuis === "") {
			setError("Indiquez votre genre");
			setDisabled(false);
			return;
		}
		if (jeRecherche === "") {
			setError("Indiquez votre cible");
			setDisabled(false);
			return;
		}
		dispatch(addTempInfo({ gender: jeSuis, orientation: jeRecherche }));
		navigation.navigate("RelationScreen");
	};
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<HeaderBeginning />
				<Text style={styles.inputTitle}>Je suis</Text>
				<View style={styles.multipleContainer}>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: jeSuis === "Homme" ? "#BC8D85" : "#FFF5F0" }]} onPress={() => setJeSuis("Homme")}>
						<Text style={[styles.boutonChoixMultipleText, { color: jeSuis === "Homme" ? "#F5EBE6" : "#965A51" }]}>Homme</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: jeSuis === "Femme" ? "#BC8D85" : "#FFF5F0" }]} onPress={() => setJeSuis("Femme")}>
						<Text style={[styles.boutonChoixMultipleText, { color: jeSuis === "Femme" ? "#F5EBE6" : "#965A51" }]}>Femme</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: jeSuis === "Non binaire" ? "#BC8D85" : "#FFF5F0" }]} onPress={() => setJeSuis("Non binaire")}>
						<Text style={[styles.boutonChoixMultipleText, { color: jeSuis === "Non binaire" ? "#F5EBE6" : "#965A51" }]}>Non binaire</Text>
					</TouchableOpacity>
				</View>
				<Text style={styles.inputTitle}>Je recherche</Text>
				<View style={styles.multipleContainer}>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: jeRecherche === "Homme" ? "#BC8D85" : "#FFF5F0" }]} onPress={() => setJeRecherche("Homme")}>
						<Text style={[styles.boutonChoixMultipleText, { color: jeRecherche === "Homme" ? "#F5EBE6" : "#965A51" }]}>Homme</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: jeRecherche === "Femme" ? "#BC8D85" : "#FFF5F0" }]} onPress={() => setJeRecherche("Femme")}>
						<Text style={[styles.boutonChoixMultipleText, { color: jeRecherche === "Femme" ? "#F5EBE6" : "#965A51" }]}>Femme</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.boutonChoixMultiple, { backgroundColor: jeRecherche === "Tout" ? "#BC8D85" : "#FFF5F0" }]} onPress={() => setJeRecherche("Tout")}>
						<Text style={[styles.boutonChoixMultipleText, { color: jeRecherche === "Tout" ? "#F5EBE6" : "#965A51" }]}>Tout</Text>
					</TouchableOpacity>
				</View>
                <View style={styles.bottom}>
                    <Text style={styles.error}>{error}</Text>
                    <TouchableOpacity style={styles.bouton} onPress={() => sanitizeInputs()} disabled={disabled}>
                        <Text style={styles.boutonText}>Continuer</Text>
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
        position: 'relative',
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
    marginTop: 30
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
    textAlign: 'center',
		color: "red",
	},
	boutonChoixMultiple: {
		width: width * 0.25,
		height: width * 0.25,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		boxShadow: "0 2px 3px #896761",
        marginVertical: 30
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
  bottom: {
      position: 'absolute',
      top: height * 0.7
  }
});
