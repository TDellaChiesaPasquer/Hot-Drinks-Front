import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Button,
} from "react-native";

export default function ({ navigation }) {
  //   const handleGoToPreferenceButton = () => {
  //     navigation.navigate("TopTabNavigator");
  //   };

  return (
    <View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("MyProfileNav")} />
        <TouchableOpacity onPress={() => navigation.navigate("MainTabNav")} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mon Profil</Text>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "black",
    backgroundColor: "green",
  },

  scrollContainer: {
    flex: 1,
  },

  scrollView: {
    backgroundColor: "#F5EBE6",
  },
  //   titleContainer: {
  //     backgroundColor: "yellow",
});
