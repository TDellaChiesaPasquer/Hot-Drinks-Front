import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { useState } from "react";

export default function App() {
	const [disabledTMP, setDisabledTMP] = useState(true);
	const [disabled, setDisabled] = useState(false);

	const onPressTest = async () => {
		console.log("test");
		setDisabled(true);
		setTimeout(() => setDisabled(false), 3000);
	};

	return (
		<View>
			<TouchableOpacity
				style={[styles.bouton, disabled && styles.boutonDisabled]}
				onPress={() => onPressTest()}
				disabled={disabled} // Ne désactive pas vraiment le bouton pour test
			>
				<View style={styles.boutonContent}>
					<Text style={styles.boutonText}>Valider</Text>
					{disabled && <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />}
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	bouton: {
		position: "relative",
		paddingHorizontal: 20,
		height: 36,
		borderRadius: 15,
		boxShadow: "0 2px 3px #877d7cff",
		width: 250, // Largeur fixe plutôt qu'en pourcentage
		backgroundColor: "#965a51c0",
		margin: 10,
		top: 300,
		left: 50,
	},
	boutonDisabled: {
		backgroundColor: "#8b6762c0",
		boxShadow: "0 1px 2px #976f68c0",
	},
	boutonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between", // Place les éléments aux extrémités
		width: "100%",
		height: "100%",
	},
	boutonText: {
		color: "#FFFFFF",
		fontWeight: "bold",
		flex: 1, // Prend l'espace disponible
		textAlign: "center", // Centre le texte
	},
	loader: {
		position: "absolute", // Position absolue
		right: 10, // Aligné à droite avec 10px de marge
	},
});
