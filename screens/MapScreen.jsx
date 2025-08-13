import {
  StyleSheet,
  Modal,
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
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
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";

export default function App({ navigation }) {
  const [myLocation, setMyLocation] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [permission, setPermission] = useState(false);
  const [error, setError] = useState(false);
  const myLocationRef = useRef(myLocation);
  const [givenPosition, setGivenPosition] = useState(null);
  const [waitingForLocationService, setWaitingForLocationService] =
    useState(false);
  const locationCheckIntervalRef = useRef(null);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  function checkLocationServices() {
    // Étape 1 : Démarrage de la vérification périodique
    console.log("Vérification des services de localisation...");

    // Étape 2 : Vérification si les services de localisation sont maintenant activés
    Location.hasServicesEnabledAsync()
      .then(function (locationEnabled) {
        if (locationEnabled) {
          // Étape 3 : Les services sont activés, on peut continuer
          console.log("Services de localisation activés");

          // Étape 4 : Nettoyage de l'intervalle puisqu'on a détecté l'activation
          clearInterval(locationCheckIntervalRef.current);
          locationCheckIntervalRef.current = null;
          setWaitingForLocationService(false);

          // Étape 5 : Tentative de récupération de la position actuelle
          return Location.getCurrentPositionAsync({});
        }
        // Étape 6 : Les services sont toujours désactivés, on continue d'attendre
        return Promise.reject("Services de localisation toujours désactivés");
      })
      .then(function (location) {
        // Étape 7 : Position récupérée avec succès
        console.log("location retrieved");

        // Étape 8 : Stockage de la position
        const { latitude, longitude } = location.coords;
        setMyLocation({ latitude, longitude });
        myLocationRef.current = { latitude, longitude };

        // Étape 9 : Cacher la carte si elle était affichée
        setPermission(false);

        // Étape 10 : Envoi de la position au serveur
        getGeolocalisation();
      })
      .catch(function (error) {
        // Étape 11 : Gestion des erreurs
        if (error === "Services de localisation toujours désactivés") {
          // Étape 12 : Si les services sont toujours désactivés, on attend le prochain intervalle
          return;
        }

        // Étape 13 : Erreur lors de la récupération de la position
        console.log("Erreur localisation:", error);
        setError(
          "Impossible d'obtenir votre position. Choisissez sur la carte."
        );
        setPermission(true);
      });
  }

  useEffect(() => {
    (async () => {
      // Étape 0 : Log au montage du composant
      console.log("map charged");

      // Étape 1 : Demande de permission à l'utilisateur
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        console.log("permission granted");

        // Étape 2 : Vérifier si les services de localisation sont activés
        const locationEnabled = await Location.hasServicesEnabledAsync();

        if (!locationEnabled) {
          // Étape 3 : Log et affichage d'une alerte si localisation désactivée
          console.log("Géolocalisation désactivée");
          Alert.alert(
            "Localisation désactivée",
            "Nous avons besoin de la localisation. Souhaitez-vous l'activer ? Sinon, indiquez votre position manuellement.",
            [
              {
                text: "Réglages",
                onPress: function () {
                  try {
                    // Étape 4a : Activer le mode d'attente des services de localisation
                    setWaitingForLocationService(true);

                    // Étape 4b : Nettoyer l'ancien intervalle s'il existe
                    if (locationCheckIntervalRef.current) {
                      clearInterval(locationCheckIntervalRef.current);
                    }

                    // Étape 4c : Configurer un nouvel intervalle de vérification (toutes les 10 secondes)
                    locationCheckIntervalRef.current = setInterval(
                      checkLocationServices,
                      1000
                    );

                    // Étape 4d : Ouvrir les réglages selon la plateforme
                    if (Platform.OS === "android") {
                      startActivityAsync(
                        ActivityAction.LOCATION_SOURCE_SETTINGS
                      ).catch(console.log);
                    } else {
                      Linking.openURL("app-settings:").catch(console.log);
                    }
                  } catch (error) {
                    // Étape 5 : Log d'une erreur inattendue dans le bloc try
                    console.log(error);
                  }
                },
              },
              {
                text: "Saisir manuellement",
                onPress: function () {
                  // Étape 6 : L'utilisateur choisit de saisir manuellement
                  setPermission(true);
                },
              },
              {
                text: "Annuler",
                style: "cancel",
                // Étape 7 : Fermer la boîte de dialogue sans action
              },
            ]
          );

          // Étape 8 : Message d'erreur dans l'UI
          setError(
            "Veuillez activer la localisation dans les paramètres ou saisir votre position manuellement"
          );

          // Étape 9 : On arrête ici, pas de tentative de récupération de position
          return;
        }

        // Étape 10 : Essayer de récupérer la position actuelle
        try {
          const location = await Location.getCurrentPositionAsync({});
          console.log("location retrieved");

          // Étape 11 : Stockage de la position
          const { latitude, longitude } = location.coords;
          setMyLocation({ latitude, longitude });
          myLocationRef.current = { latitude, longitude };

          // Étape 12 : Cacher la carte si elle était affichée
          setPermission(false);

          // Étape 13 : Envoi de la position au serveur
          getGeolocalisation();
        } catch (error) {
          // Étape 14 : Gestion des erreurs de récupération
          console.log("Erreur localisation:", error);
          setError(
            "Impossible d'obtenir votre position. Choisissez sur la carte."
          );
          setPermission(true);
        }
      } else {
        // Étape 15 : Si pas de permission, affichage de la carte pour saisie manuelle
        setPermission(true);
      }

      // Étape 16 : Fonction de nettoyage exécutée lors du démontage du composant
      return function () {
        // Étape 17 : Arrêt de l'intervalle de vérification s'il est actif
        if (locationCheckIntervalRef.current) {
          clearInterval(locationCheckIntervalRef.current);
        }
      };
    })();
  }, []);

  // ____________________________________FETCH GEOLOC_______________________________
  const getGeolocalisation = async () => {
    setDisabled(true);
    console.log(myLocation);
    if (!myLocationRef.current.latitude) {
      setError("Ajouter une position !");
      setDisabled(false);
      return;
    }
    const response = await fetch(
      process.env.EXPO_PUBLIC_IP + "/users/location",
      {
        method: "PUT",
        headers: {
          authorization: user.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: myLocationRef.current.latitude,
          longitude: myLocationRef.current.longitude,
        }),
      }
    );
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
    setDisabled(false), navigation.navigate("CompleteInfosScreen");
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
        {disabled && (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
            style={styles.loader}
          />
        )}
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
