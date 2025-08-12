import {
  StyleSheet,
  Modal,
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useCallback } from "react";
import { addPlace } from "../reducers/user";
import { Ionicons } from "@expo/vector-icons";

export default function AddRdvScreen({ navigation }) {
  const dispatch = useDispatch();
  const places = useSelector((state) => state.user.value.places);
  const token = useSelector((state) => state.user.value.token);
  const [rdvPlace, setRdvPlace] = useState("");
  const [choicePositionRdv, setChoicePositionRdv] = useState(null);

  console.log(choicePositionRdv, "LQQQQQQQQ");

  const getMarker = async () => {
    return <Marker></Marker>;
  };

  const year = Date.getUtcFullYear();

  const month = Date.getMonth();
  if (month < 10) {
    return month + 1;
  }

  const day = Date.getDate();
  if (day < 10) {
    return day + 1;
  }

  const newDate = `${year} + "--" + ${month} + "--" + ${day}`;

  const addRdv = async (coord) => {
    console.log("hello");
    if (!marker && !newDate) {
    }
    const response = await fetch(process.env.EXPO_PUBLIC_IP + "/rdv/ask", {
      method: "PUT",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longitude: coord.longitude,
        latitude: coord.latitude,
      }),
    });
    console.log("ici");
    const data = await response.json();
    console.log(data, "ou es tu");
    setChoicePositionRdv({
      latitude: data.rdv.latitude,
      longitude: data.rdv.longitude,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        zoomEnabled={true}
        initialRegion={{
          latitude: 48.88,
          longitude: 2.3,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0222,
        }}
        style={styles.map}
        onLongPress={(action) => getMarker(action.nativeEvent.coordinate)}
        // disabled={disabled}
      >
        {choicePositionRdv && (
          <Marker
            coordinate={{
              latitude: choicePositionRdv.latitude,
              longitude: choicePositionRdv.longitude,
            }}
            pinColor="#78010bff"
          />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addRdv();
        }}
        // disabled={disabled}
      >
        <Text style={styles.boutonText}>VALIDER</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    alignItems: "center",
  },
  map: {
    height: "75%",
    width: "90%",
    marginHorizontal: 20,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 3px #896761",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    // width: width * 0.7,
    backgroundColor: "#965a51c0",
    marginHorizontal: 70,
    marginTop: 50,
  },
  boutonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
  },
});
