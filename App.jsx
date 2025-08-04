import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import DateScreen from "./screens/DateScreen";
import GenderScreen from "./screens/GenderScreen";
import RelationScreen from "./screens/RelationScreen";
import SwipeScreen from "./screens/SwipeScreen";
import SignIn from "./screens/SignIn";

import user from "./reducers/user";

const store = configureStore({
	reducer: { user },
});

const Stack = createNativeStackNavigator();

const SignInNav = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="SignIn" component={SignIn} />
			<Stack.Screen name="DateScreen" component={DateScreen} />
			<Stack.Screen name="GenderScreen" component={GenderScreen} />
			<Stack.Screen name="RelationScreen" component={RelationScreen} />
		</Stack.Navigator>
	);
};

export default function App() {
	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					{/* <Stack.Screen name="SignInNav" component={SignInNav} />
					<Stack.Screen name="SignInNav" component={SignInNav} /> */}
					<Stack.Screen name="SwipeScreen" component={SwipeScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
