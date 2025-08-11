import {
  StyleSheet,
  Modal,
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView from "react-native-maps";
import { Dimensions } from "react-native";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect } from "react";
import { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderBeginning from "../components/HeaderBeginning";
import { SafeAreaView } from "react-native-safe-area-context";
import { addInfos } from "../reducers/user";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

export default function App({ navigation }) {
	const [myLocation, setMyLocation] = useState({});
	const [disabled, setDisabled] = useState(false);
	const [permission, setPermission] = useState(false);
	const [error, setError] = useState(false);
	const myLocationRef = useRef(myLocation);
	const [givenPosition, setGivenPosition] = useState(null);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				return true;
			};
			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

			return () => subscription.remove();
		}, [])
	);

useEffect(() => {
	checkLocationAndShowMap();
}, []);

const checkLocationAndShowMap = async () => {
	console.log("map charged");

	// Étape 1 : Demander la permission d'utiliser la localisation
	const permission = await Location.requestForegroundPermissionsAsync();

	if (permission.status !== "granted") {
		console.log("Permission refusée");
		setPermission(true); // Montrer la carte pour sélection manuelle
		return;
	}

	console.log("Permission accordée");

	// Étape 2 : Vérifier si la localisation est activée sur le téléphone
	const locationEnabled = await Location.hasServicesEnabledAsync();

	if (!locationEnabled) {
		console.log("Localisation désactivée");
		setError("Veuillez activer la localisation dans les paramètres");
		setPermission(true); // Montrer la carte pour sélection manuelle
		return;
	}

	console.log("Localisation activée");

	// Étape 3 : Essayer d'obtenir la position actuelle
	try {
		const location = await Location.getCurrentPositionAsync({
			accuracy: Location.Accuracy.Balanced,
		});

		console.log("Position trouvée", location);

		// Sauvegarder la position
		const userPosition = {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
		};

		setMyLocation(userPosition);
		myLocationRef.current = userPosition;
		setPermission(true); // Montrer la carte
		getGeolocalisation(); // Envoyer au serveur
	} catch (error) {
		console.log("Erreur pour obtenir la position:", error);
		setError("Impossible d'obtenir votre position. Choisissez sur la carte.");
		setPermission(true); // Montrer la carte pour sélection manuelle
	}
};

	// ____________________________________FETCH GEOLOC_______________________________
	const getGeolocalisation = async () => {
		setDisabled(true);
		console.log(myLocation);
		if (!myLocationRef.current.latitude) {
			setError("Ajouter une position !");
			setDisabled(false);
			return;
		}
		const response = await fetch(process.env.EXPO_PUBLIC_IP + "/users/location", {
			method: "PUT",
			headers: {
				authorization: user.token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				latitude: myLocationRef.current.latitude,
				longitude: myLocationRef.current.longitude,
			}),
		});
		const data = await response.json();
		console.log(data);
		if (!data.result) {
			setError(false), setDisabled(false);
			return;
		}
		const response2 = await fetch(process.env.EXPO_PUBLIC_IP + "/users/infos", {
			headers: {
				authorization: user.token,
			},
		});
		const data2 = await response2.json();
		dispatch(addInfos(data2.user));
		setDisabled(false), navigation.navigate("MainTabNav");
	};
	// ____________________________________RAJOUTER UNE VILLE AU TOUCHÉ_______________________________
	const addCityByTouch = async (touch_coordinates) => {
		setGivenPosition(touch_coordinates);
		const newCity = {
			longitude: touch_coordinates.longitude,
			latitude: touch_coordinates.latitude,
		};
		setMyLocation(newCity);
		myLocationRef.current = newCity;
	};

  return (
    //---------------------------------LOCALISATION INITIALE------------------------------------
    <SafeAreaView style={styles.container}>
      <HeaderBeginning />
      <Text style={styles.textStyle}>AJOUTE TA POSITION</Text>
      {permission && (
        <MapView
          zoomEnabled={true}
          // scrollEnabled={true}
          // showsScale={true}
          initialRegion={{
            latitude: 48.88,
            longitude: 2.3,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0222,
          }}
          style={styles.map}
          onLongPress={(event) => addCityByTouch(event.nativeEvent.coordinate)}
          disabled={disabled}
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
        style={[styles.button, disabled && styles.boutonDisabled]}
        onPress={() => getGeolocalisation()}
        disabled={disabled}
      >
        <Text style={styles.boutonText}>VALIDER</Text>
        {disabled && <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />}
      </TouchableOpacity>
    </SafeAreaView>
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
    justifyContent: "center",
    color: "#896761",
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#ffffff39",
    marginHorizontal: 20,
    marginTop: 20,
    // boxShadow: "0 2px 3px #499a76c0",
    paddingTop: 7,
  },
  map: {
    // width: '75%',
    height: "70%",
    marginHorizontal: 20,
    marginTop: 5,
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
    marginHorizontal: 70,
    marginTop: 50,
  },
  boutonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
  },
  boutonDisabled: {
		backgroundColor: "#8b6762c0",
		boxShadow: "0 1px 2px #976f68c0",
	},
  loader: {
		position: "absolute",
		left: 10,
	},
});
