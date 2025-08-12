import {
  StyleSheet,
  Modal,
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
const { width, height } = Dimensions.get("window");

export default function ListRdvScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const rdvList = (user.user && user.user.rdvList) || [];
  const rdvHTML = rdvList.map((rdv) => {
    const otherUser =
      String(rdv.creator._id) === String(user.user._id)
        ? rdv.receiver
        : rdv.creator;
    const rdvDate = dayjs(rdv.date);
    return (
      <TouchableOpacity
        key={rdv._id}
        style={styles.conversationContainer}
        onPress={() =>
          navigation.navigate("RdvScreen", {
            ...rdv,
          })
        }
      >
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={
              otherUser.photoList.length === 0 ? "" : otherUser.photoList[0]
            }
          />
        </View>
        <View style={styles.message}>
          <Text style={styles.username}>
            {otherUser.username.length > 25
              ? otherUser.username.slice(0, 22) + "..."
              : otherUser.username}
          </Text>
          <Text style={styles.date}>
            {rdv.address.length > 35
              ? rdv.address.slice(0, 32) + "..."
              : rdv.address}
          </Text>
          <Text style={styles.date}>
            {
              [
                "Dimanche",
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
              ][rdvDate.get("day")]
            }{" "}
            {rdvDate.format("DD/MM/YYYY")} à {rdvDate.format("HH:mm")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conversationList}>
        {rdvHTML}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    alignItems: "center",
  },
  contactContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    objectFit: "cover",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: "100%",
    backgroundColor: "#965A51",
    overflow: "hidden",
  },
  contactName: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 10,
  },
  conversationContainer: {
    width: "100%",
    backgroundColor: "#BC8D85",
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 10,
    marginVertical: 5,
    position: "relative",
  },
  message: {
    marginLeft: 10,
    height: 60,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  username: {
    color: "#FFF5F0",
    fontWeight: "bold",
    fontSize: 16,
  },
  conversationList: {
    width: width * 0.9,
    alignItems: "center",
  },
  date: {
    color: "#FFF5F0",
    fontWeight: "bold",
    fontSize: 12,
  },
});
