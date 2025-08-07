import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import DateScreen from "./screens/DateScreen";
import GenderScreen from "./screens/GenderScreen";
import RelationScreen from "./screens/RelationScreen";
import SwipeScreen from "./screens/SwipeScreen";
import SignUp from "./screens/SignUp";
import LoadingScreen from "./screens/LoadingScreen";
import MessagerieScreen from "./screens/MessagerieScreen";
import ConversationScreen from "./screens/ConversationScreen";
import HeaderMain from "./components/HeaderMain";
import PhotoScreen from "./screens/PhotoScreen";
import MapScreen from "./screens/MapScreen";

import user from "./reducers/user";
import map from "./reducers/map";

const store = configureStore({
  reducer: { user, map },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const SignUpNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="DateScreen" component={DateScreen} />
      <Stack.Screen name="GenderScreen" component={GenderScreen} />
      <Stack.Screen name="RelationScreen" component={RelationScreen} />
      <Stack.Screen name="PhotoScreen" component={PhotoScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
};

const MainTabNav = () => {
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
              icon = (
                <MaterialCommunityIcons
                  name="message-outline"
                  size={30}
                  color={color}
                />
              );
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
        <Tab.Screen name="SwipeScreen" component={SwipeScreen} />
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

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false, gestureEnabled: false }}
          >
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
