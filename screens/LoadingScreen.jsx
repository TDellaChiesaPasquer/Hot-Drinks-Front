import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { addInfos } from "../reducers/user";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function ({ navigation }) {
  const [loaded, error] = useFonts({
    airTravelers: require("../assets/air_travelers/Air Travelers Personal Use.otf"),
  });

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    (async () => {
      if (!user.token) {
        navigation.navigate("SignUpNav", { screen: "SignUp" });
        return;
      }
      const response = await fetch(
        process.env.EXPO_PUBLIC_IP + "/users/infos",
        {
          headers: {
            authorization: user.token,
          },
        }
      );
      const data = await response.json();
      if (!data.result) {
        navigation.navigate("SignUpNav", { screen: "SignUp" });
        return;
      }
      const newUser = data.user;
      if (!newUser.birthdate) {
        navigation.navigate("SignUpNav", { screen: "DateScreen" });
        return;
      }
      if (newUser.photoList.length === 0) {
        navigation.navigate("SignUpNav", { screen: "PhotoScreen" });
        return;
      }
      if (!newUser.latitude) {
        navigation.navigate("SignUpNav", { screen: "MapScreen" });
        return;
      }
      dispatch(addInfos(newUser));
      navigation.navigate("MainTabNav", { screen: "SwipeNav" });
    })();
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>Hot drinks</Text>
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
});
