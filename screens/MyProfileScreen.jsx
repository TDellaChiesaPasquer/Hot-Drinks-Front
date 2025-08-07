import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PreferencesScreen from "./screens/PreferencesScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const ProfileTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "MyProfile") {
            iconName = "user";
          } else if (route.name === "Preferences") {
            iconName = "heart";
          } else if (route.name === "Settings") {
            iconName = "gear";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#965A51",
        tabBarInactiveTintColor: "#BC8D85",
        headerShown: false,
      })}
    >
      <Tab.Screen name="MyProfile" component={MyProfileScreen} />
      <Tab.Screen name="Preferences" component={PreferencesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function ({ navigation }) {
  const handleGoToPreferenceButton = () => {
    addUser(nickname);
    navigation.navigate("TabNavigator");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="PreferencesScreen" component={PreferencesScreen} />
          <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
}
