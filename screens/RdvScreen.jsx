import {
  StyleSheet,
  Modal,
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import HeaderBeginning from "../components/HeaderBeginning";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useCallback } from "react";
import { addPlace } from "../reducers/map";

export default function RdvScreen({ navigation }) {
  console.log("hello");

  const dispatch = useDispatch();
  const places = useSelector((state) => state.map.value);

  // const [latitude, setLatitude] = useState("");
  // const [longitude, setLongitude] = useState("");
  const [rdvPlace, setRdvPlace] = useState("");
  const [givenPositionRdv, setGivenPositionRdv] = useState(null);

  console.log(givenPositionRdv, "LQQQQQQQQ");

  const addRdv = async (coord) => {
    console.log("deded", process.env.EXPO_PUBLIC_TOKEN);

    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${process.env.EXPO_PUBLIC_TOKEN}&lat=${coord.latitude}&lon=${coord.longitude}&format=json&`
    );
    const data = await response.json();
    //console.log(data);
    const coordinateRdv = {
      latitude: data.lat,
      longitude: data.lon,
      address: data.address.government,
      city: data.address.city,
      country: data.address.country,
    };
    console.log("ici");
    //dispatch(coordinateRdv);
    setGivenPositionRdv({
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
    });
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
        onLongPress={(action) => addRdv(action.nativeEvent.coordinate)}
        // disabled={disabled}
      >
        {givenPositionRdv && (
          <Marker
            coordinate={{
              latitude: givenPositionRdv.latitude,
              longitude: givenPositionRdv.longitude,
            }}
            pinColor="#78010bff"
          />
        )}
      </MapView>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => addRdvByTouch()}
        // disabled={disabled}
      >
        <Text style={styles.boutonText}>VALIDER</Text>
      </TouchableOpacity> */}
      {/* <View style={{ backgroundColor: "red", flex: 1 }}></View> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFC9B4",
    // margin: 30,
  },
  map: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 3px #896761",
    borderRadius: 15,
  },
});
