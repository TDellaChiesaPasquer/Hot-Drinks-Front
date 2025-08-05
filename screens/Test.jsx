import { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

export default function ({ navigation }) {
	const user = useSelector((state) => state.user.value);
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container}>
				<Text>{user.token}</Text>
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
		backgroundColor: "#965A51",
		margin: 10,
	},
	boutonText: {
		fontWeight: "bold",
		fontSize: 18,
		color: "#F5EBE6",
	},
	boutonGoogle: {
		alignItems: "center",
		justifyContent: "center",
		height: 36,
		borderRadius: 15,
		boxShadow: "0 2px 3px #896761",
		width: width * 0.7,
		margin: 10,
		backgroundColor: "#DE4F24",
	},
	modalContainer: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		alignItems: "center",
		justifyContent: "center",
	},
	modalEmail: {
		backgroundColor: "#DFC9B4",
		alignItems: "center",
		padding: 10,
		borderRadius: 20,
		position: "relative",
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
		width: width * 0.7,
		margin: 10,
	},
	modalTitle: {
		color: "#965A51",
		fontWeight: "bold",
		fontSize: 16,
		margin: 10,
	},
	crossModal: {
		color: "#965A51",
	},
	crossModalDiv: {
		position: "absolute",
		top: -10,
		right: -10,
		width: 26,
		height: 26,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "100%",
	},
});
