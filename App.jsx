import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";

import SwipeScreen from "./screens/SwipeScreen.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		// <Provider>
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="SwipeScreen" component={SwipeScreen} />
			</Stack.Navigator>
		</NavigationContainer>
		// </Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
