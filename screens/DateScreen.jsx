import { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import HeaderBeginning from "../components/headerBeginning";
import { addTempInfo } from "../reducers/user";

const { width, height } = Dimensions.get("window");

export default function ({ navigation }) {
	const [day, setDay] = useState("");
	const [month, setMonth] = useState("");
	const [year, setYear] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [disabled, setDisabled] = useState(false);
	const dispatch = useDispatch();

	const sanitizeInputs = () => {
		setDisabled(true);
		const date = new Date(`${year}-${month}-${day}`);
		if (isNaN(date.valueOf())) {
			setError("Date non valide");
			setDisabled(false);
			return;
		}
		const currentDate = new Date();
		if (currentDate.valueOf() - date.valueOf() < 18 * 365 * 24 * 60 * 60 * 1000) {
			setError("Vous devez avoir 18 ans ou plus");
			setDisabled(false);
			return;
		}
		if (username === "") {
			setError("Remplissez un username");
			setDisabled(false);
			return;
		}
		if (username.length > 40) {
			setError("Votre username ne peut pas faire plus de 40 caractères");
			setDisabled(false);
			return;
		}
		dispatch(addTempInfo({ date: date.valueOf(), username }));
		navigation.navigate("GenderScreen");
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<HeaderBeginning />
				<Text style={styles.inputTitle}>Date de naissance</Text>
				<Text style={styles.inputSub}>(Âge minimum de 18 ans)</Text>
				<View style={styles.dateContainer}>
					<TextInput
						style={styles.inputDate}
						placeholder="JJ"
						placeholderTextColor={"#965A51"}
						textContentType="birthdateDay"
						value={day}
						onChangeText={(value) => setDay(value)}
						maxLength={2}
					/>
					<TextInput
						style={styles.inputDate}
						placeholder="MM"
						placeholderTextColor={"#965A51"}
						textContentType="birthdateMonth"
						value={month}
						onChangeText={(value) => setMonth(value)}
						maxLength={2}
					/>
					<TextInput
						style={styles.inputDate}
						placeholder="AAAA"
						placeholderTextColor={"#965A51"}
						textContentType="birthdateYear"
						value={year}
						onChangeText={(value) => setYear(value)}
						maxLength={4}
					/>
				</View>
				<Text style={styles.inputTitle}>Username</Text>
				<Text style={styles.inputSub}>(Visible sur le profil)</Text>
				<TextInput style={styles.input} placeholder={"Username"} placeholderTextColor={"#965A51"} value={username} onChangeText={(value) => setUsername(value)} maxLength={40} />
				<Text style={styles.error}>{error}</Text>
				<TouchableOpacity style={styles.bouton} onPress={() => sanitizeInputs()} disabled={disabled}>
					<Text style={styles.boutonText}>Continuer</Text>
				</TouchableOpacity>
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
	},
});
