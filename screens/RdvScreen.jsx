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
// import { addPlace } from "../reducers/user";
import { Ionicons } from "@expo/vector-icons";

export default function RdvScreen({ navigation }) {
  return <SafeAreaView style={styles.container}></SafeAreaView>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    // margin: 30,
  },
});
