import {
  StyleSheet,
  Modal,
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useCallback } from "react";
import { addPlace } from "../reducers/map";
import { Ionicons } from "@expo/vector-icons";

export default function ListRdvScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        key={data._id}
        style={styles.contactContainer}
        onPress={() =>
          navigation.navigate("RdvScreen", {
            otherUserNumber,
            ...data,
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
        <Text style={styles.contactName}>
          {name.length >= 15 ? name.slice(0, 12) + "..." : name}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    // margin: 30,
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
});
