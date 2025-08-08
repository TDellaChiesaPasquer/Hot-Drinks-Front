import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import DateScreen from "./screens/DateScreen";
import GenderScreen from "./screens/GenderScreen";
import RelationScreen from "./screens/RelationScreen";
import SignUp from "./screens/SignUp";
import LoadingScreen from "./screens/LoadingScreen";
import MessagerieScreen from "./screens/MessagerieScreen";
import ConversationScreen from "./screens/ConversationScreen";
import HeaderMain from "./components/HeaderMain";
import PhotoScreen from "./screens/PhotoScreen";
import MapScreen from "./screens/MapScreen";
import RdvScreen from "./screens/RdvScreen";

// Swipe
import SwipeScreen from "./screens/swipe/SwipeScreen";
import SwipeProfileInformationsScreen from "./screens/swipe/SwipeProfileInformationsScreen";

import MyProfileScreen from "./screens/MyProfileScreen";
import PreferencesScreen from "./screens/PreferencesScreen";
import SettingsScreen from "./screens/SettingsScreen";

import user, { updateConv } from "./reducers/user";
import map from "./reducers/map";
import Pusher from "pusher-js";
import { useEffect } from "react";

const pusher = new Pusher("ee5eeae5d340ff371be3", {
	cluster: "eu",
});

const store = configureStore({
	reducer: { user, map },
});

const Stack = createNativeStackNavigator();
const StackSwipe = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const SignUpNav = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Screen name="SignUp" component={SignUp} />
			<Stack.Screen name="DateScreen" component={DateScreen} />
			<Stack.Screen name="GenderScreen" component={GenderScreen} />
			<Stack.Screen name="RelationScreen" component={RelationScreen} />
			<Stack.Screen name="PhotoScreen" component={PhotoScreen} />
			<Stack.Screen name="MapScreen" component={MapScreen} />
			<Stack.Screen name="RdvScreen" component={RdvScreen} />
		</Stack.Navigator>
	);
};

const receiveNewMessage = async (event, token, dispatch) => {
	const response = await fetch(process.env.EXPO_PUBLIC_IP + "/conversation/" + event.conversationId, {
		headers: {
			authorization: token,
		},
	});
	const data = await response.json();
	if (!data.result) {
		return;
	}
	dispatch(updateConv(data.conversation));
};

const MainTabNav = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);
	const userId = user.user._id;
	useEffect(() => {
		const channel = pusher.subscribe(userId);
		channel.bind("newMessage", (e) => receiveNewMessage(e, token, dispatch));
		return () => {
			channel.unbind("newMessage");
		};
	}, [userId]);
	return (
		<SafeAreaView style={styles.tabBarNavContainer} edges={["top"]}>
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarStyle: styles.tabBar,
					header: ({ route }) => {
						return <HeaderMain route={route} />;
					},
					tabBarIcon: ({ color, size }) => {
						let icon;
						if (route.name === "MessagerieNav") {
							icon = <MaterialCommunityIcons name="message-outline" size={30} color={color} />;
						} else {
							icon = <Feather name="coffee" size={30} color={color} />;
						}
						return icon;
					},
					tabBarActiveTintColor: "#965A51",
					tabBarInactiveTintColor: "#BC8D85",
					tabBarShowLabel: false,
					tabBarIconStyle: styles.tabBarIcon,
				})}
			>
				<Tab.Screen name="MyProfileScreen" component={MyProfileNav} />
				<Tab.Screen name="SwipeNav" component={SwipeNav} />
				<Tab.Screen name="MessagerieNav" component={MessagerieNav} />
			</Tab.Navigator>
		</SafeAreaView>
	);
};

const MessagerieNav = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="MessagerieScreen" component={MessagerieScreen} />
			<Stack.Screen name="ConversationScreen" component={ConversationScreen} />
		</Stack.Navigator>
	);
};

const SwipeNav = () => {
	return (
		<StackSwipe.Navigator screenOptions={{ headerShown: false }}>
			<StackSwipe.Screen name="SwipeScreen" component={SwipeScreen} />
			<StackSwipe.Screen name="SwipeProfileInformationsScreen" component={SwipeProfileInformationsScreen} />
		</StackSwipe.Navigator>
	);
};

const MyProfileNav = () => {
	return (
		<TopTab.Navigator
			screenOptions={({ route }) => ({
				tabBarStyle: styles.tabBar,
				tabBarIcon: ({ color, size }) => {
					let icon;

					if (route.name === "MyProfile") {
						// iconName = "user";
						icon = <Feather name="user" size={24} color="black" />;
						// icon = <Feather name="user" size={30} color={color} />;
					} else if (route.name === "Preferences") {
						// iconName = "heart";
						icon = <FontAwesome name="heart-o" size={24} color="black" />;
					} else if (route.name === "Settings") {
						// iconName = "gear";
						icon = <MaterialIcons name="settings" size={24} color="black" />;
					}

					return icon;
				},

				tabBarActiveTintColor: "#965A51",
				tabBarInactiveTintColor: "#BC8D85",
				headerShown: false,
			})}
		>
			<TopTab.Screen name="MyProfileScreen" component={MyProfileScreen} />
			<TopTab.Screen name="PreferencesScreen" component={PreferencesScreen} />
			<TopTab.Screen name="SettingsScreen" component={SettingsScreen} />
		</TopTab.Navigator>
	);
};

export default function App() {
	return (
		<Provider store={store}>
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
						<Stack.Screen name="LoadingScreen" component={LoadingScreen} />
						<Stack.Screen name="SignUpNav" component={SignUpNav} />
						<Stack.Screen name="MainTabNav" component={MainTabNav} />
					</Stack.Navigator>
				</NavigationContainer>
			</SafeAreaProvider>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tabBar: {
		backgroundColor: "#F5EBE6",
		borderTopWidth: 0,
	},
	tabBarNavContainer: {
		flex: 1,
		backgroundColor: "#F5EBE6",
	},
	tabBarIcon: {
		fontSize: 30,
	},
	container: {
		flex: 1,
	},
	tabBar: {
		backgroundColor: "#F5EBE6",
		borderTopWidth: 0,
	},
	tabBarNavContainer: {
		flex: 1,
		backgroundColor: "#F5EBE6",
	},
	tabBarIcon: {
		fontSize: 30,
	},
});
