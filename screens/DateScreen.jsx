import { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Pressable, ActivityIndicator, Keyboard, TouchableWithoutFeedback, BackHandler } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import HeaderBeginning from "../components/HeaderBeginning";
import { addTempInfo } from "../reducers/user";
import dayjs from "dayjs";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function ({ navigation }) {
	const [day, setDay] = useState("");
	const [month, setMonth] = useState("");
	const [year, setYear] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [disabled, setDisabled] = useState(false);
	const dispatch = useDispatch();
	const monthRef = useRef(null);
	const yearRef = useRef(null);

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				return true;
			};
			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

			return () => subscription.remove();
		}, [])
	);

	const handleDayChange = (value) => {
		setDay(value);
		if (value.length === 2) {
			monthRef.current?.focus();
		}
	};

	const handleMonthChange = (value) => {
		setMonth(value);
		if (value.length === 2) {
			yearRef.current?.focus();
		}
	};

	const handleYearChange = (value) => {
		setYear(value);
	};

	const sanitizeInputs = () => {
		setDisabled(true);
		if (Number(year) < 1900 || Number(year) > 2100 || Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31) {
			setError("Date non valide");
			setDisabled(false);
			return;
		}
		const date = dayjs(`${year}-${month}-${day}`);
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
		dispatch(addTempInfo({ date: date.format("YYYY-MM-DD"), username }));
		navigation.navigate("GenderScreen");
	};

	return (
		<SafeAreaProvider>
			{/* Tap hors des champs => ferme le clavier */}
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
							keyboardType="numeric"
							value={day}
							onChangeText={handleDayChange}
							maxLength={2}
						/>
						<TextInput
							ref={monthRef}
							style={styles.inputDate}
							placeholder="MM"
							placeholderTextColor={"#965A51"}
							textContentType="birthdateMonth"
							keyboardType="numeric"
							value={month}
							onChangeText={handleMonthChange}
							maxLength={2}
						/>
						<TextInput
							ref={yearRef}
							style={styles.inputDate}
							placeholder="AAAA"
							placeholderTextColor={"#965A51"}
							textContentType="birthdateYear"
							keyboardType="numeric"
							value={year}
							onChangeText={handleYearChange}
							maxLength={4}
						/>
					</View>
					<Text style={styles.inputTitle}>Username</Text>
					<Text style={styles.inputSub}>(Visible sur le profil)</Text>
					<TextInput style={styles.input} placeholder={"Username"} placeholderTextColor={"#965A51"} value={username} onChangeText={(value) => setUsername(value)} maxLength={40} />
					<View style={styles.bottom}>
						<Text style={styles.error}>{error}</Text>
						<TouchableOpacity
							style={[styles.bouton, disabled && styles.boutonDisabled]}
							onPress={() => {
								Keyboard.dismiss(); // ferme le clavier avant la validation
								sanitizeInputs();
							}}
							disabled={disabled}
						>
							<Text style={styles.boutonText}>Continuer</Text>
							{disabled && <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />}
						</TouchableOpacity>
					</View>
				</SafeAreaView>
			</TouchableWithoutFeedback>
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
		marginTop: 30,
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
		marginTop: 40,
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
		marginTop: 20,
	},
	error: {
		color: "red",
		textAlign: "center",
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
