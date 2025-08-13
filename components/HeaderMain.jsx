import { View, Text, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

export default function ({ route }) {
  let icon;
  if (route.name === "MessagerieNav") {
    icon = (
      <MaterialCommunityIcons
        name="message-outline"
        size={30}
        color="#BC8D85"
      />
    );
  } else if (route.name === "MyProfileNav") {
    icon = <Feather name="user" size={30} color="#BC8D85" />;
  } else if (route.name === "SwipeScreen") {
    icon = <Feather name="coffee" size={30} color="#BC8D85" />;
  } else if (route.name === "SwipeNav") {
    icon = <Feather name="coffee" size={30} color="#BC8D85" />;
  } else {
    icon = <Feather name="calendar" size={28} color="#BC8D85" />;
  }
  return (
    <View style={styles.header}>
      {/* {icon} */}
      <Text style={styles.text}>Hot Drinks</Text>
      <View style={styles.icon}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#F5EBE6",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 10,
    boxShadow: "0 1px 2px #896761",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#6A3931",
  },
  icon: {
    width: 30,
    height: 30,
  },
});
