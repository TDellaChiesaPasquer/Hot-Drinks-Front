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
import { Dimensions } from "react-native";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderBeginning from "../components/HeaderBeginning";
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { addPlace } from "../reducers/map";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App({navigation}) {
  const [myLocation, setMyLocation] = useState({});
  // const [modalVisible, setModalVisible] = useState(false);
  const [permission, setPermission] = useState(false);
  const [city, setCity] = useState("");
  const dispatch = useDispatch();

  const [givenPosition, setGivenPosition] = useState(null);

  const locations = useSelector((state) => state.map.value.places);
  console.log(locations);

  useEffect(() => {
    (async () => {
      console.log("map charged");

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        console.log("permission granted");

        const location = await Location.getCurrentPositionAsync({});
        console.log("location retrieved");

        console.log(location);
        const { latitude, longitude } = location.coords;
        setMyLocation({
          latitude,
          longitude,
        });
        navigation.navigate("SwipeScreen");
      } else {
        setPermission(true);
      }
    })();
  }, []);

  // ____________________________________RAJOUTER UNE VILLE AU TOUCHÉ_______________________________
  const addCityByTouch = async (touch_coordinates) => {
    console.log(touch_coordinates);

    setGivenPosition(touch_coordinates);
    const newCity = {
      longitude: touch_coordinates.longitude,
      latitude: touch_coordinates.latitude,
    };
    console.log(newCity);

    dispatch(addPlace(newCity));
    setCity(city);
  };

  return (
    //---------------------------------LOCALISATION INITIALE------------------------------------
    <View style={styles.container}>
      <SafeAreaView>
        <HeaderBeginning />
      </SafeAreaView>
      <Text style={styles.textStyle}>AJOUTE TA POSITION</Text>
      {permission && (
        <MapView
          zoomEnabled={true}
          // scrollEnabled={true}
          // showsScale={true}
          initialRegion={{
            latitude: myLocation.latitude || 48.88,
            longitude: myLocation.longitude || 2.3,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0222,
          }}
          style={styles.map}
          onLongPress={(event) => addCityByTouch(event.nativeEvent.coordinate)}
        >
          {givenPosition && (
            <Marker
              coordinate={{
                latitude: givenPosition.latitude,
                longitude: givenPosition.longitude,
              }}
              pinColor="#78010bff"
            />
          )}
        </MapView>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SwipeScreen")}
      >
        <Text style={styles.boutonText}>VALIDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFC9B4",
    // margin: 30,
  },
  textStyle: {
    height: 35,
    // width: ,
    alignItems: "center",
    justifyContent: 'center',
    color: "#3e7a5ec0",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#81c0a4c0",
    marginHorizontal: 30,
    boxShadow: "0 2px 3px #499a76c0",
    paddingTop: 7,
    borderRadius: 10,
  },
  map: {
    // width: '75%',
    height: "60%",
    marginHorizontal: 30,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 3px #896761",
    borderRadius: 15,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    // width: width * 0.7,
    backgroundColor: "#965a51c0",
    margin: 70,
  },
  boutonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
  },
});
