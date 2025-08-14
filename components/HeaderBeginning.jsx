import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function () {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>Hot Drinks</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: width,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Air-Travelers",
    fontSize: 30,
    fontWeight: "bold",
    color: "#6A3931",
  },
});
