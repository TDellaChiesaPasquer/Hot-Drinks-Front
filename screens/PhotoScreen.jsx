import { useState } from "react";
import {
  Button,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ImagePickerComponent from "../components/ImagePickerComponent";

const { width, height } = Dimensions.get("window");

export default function ImagePickerScreen({ navigation }) {


  const addedPhoto = [];
  for (let i = 0; i < 9; i++) {
    addedPhoto.push(<ImagePickerComponent key={i} />);
  }



// const handleSubmitPhotos = async () => {
// if (photo.length === 0) {
//     return;
// }
//   const response = await fetch(process.env.EXPO_PUBLIC_IP+"/users/addPhoto"),{
//        method: 'POST',
//        body: formData,

//   }
//     const data = await response.json()

//     console.log(data)


}











//   if (city.length === 0) {
//       return;
//     }

//     // 1st request: get geographic data from API
//     fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
//       .then((response) => response.json())
//       .then((data) => {
//         // Nothing is done if no city is found by API
//         if (data.features.length === 0) {
//           return;
//         }

//         const firstCity = data.features[0];
//         const newPlace = {
//           name: firstCity.properties.city,
//           latitude: firstCity.geometry.coordinates[1],
//           longitude: firstCity.geometry.coordinates[0],
//         };

//         // 2nd request : send new place to backend to register it in database
//         fetch(`${BACKEND_ADDRESS}/places`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             nickname: user.nickname,
//             name: newPlace.name,
//             latitude: newPlace.latitude,
//             longitude: newPlace.longitude,
//           }),
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             // Dispatch in Redux store if the new place have been registered in database
//             if (data.result) {
//               dispatch(addPlace(newPlace));
//               setCity("");
//             }
//           });
//       });
  };







 
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>Ajoute au moins une photo</Text>
          <View>
            <View style={styles.containerPhoto}>
              {addedPhoto}
              {/* {photo && <Image source={{ uri: photo }} style={styles.image} />} */}
            </View>
          </View>
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.prevButton}
              onPress={() => navigation.navigate("RelationScreen")}
            >
              <Text style={styles.prevTextButton}>{"<"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.validationButton}
              onPress={() => navigation.navigate("SwipeScreen")}
            >
              <Text style={styles.textValidateButton}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFC9B4",
    alignItems: "center",
  },
  //   image: {
  //     width: 200,
  //     height: 200,
  //   },

  containerPhoto: {
    width: width,
    height: width,
    // height: "55%",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 40,
    // backgroundColor: "red",
  },

  addPhotoButton: {
    backgroundColor: "white",
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 25,
  },

  textButton: {
    textAlign: "center",
    paddingTop: 35,
    fontSize: 30,
    fontWeight: "light",
  },

  addedPhoto: {
    backgroundColor: "transparent",
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },

  title: {
    height: "5%",
    fontSize: 20,
    marginTop: 100,
    textAlign: "center",
  },
  bottomButtons: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 80,
  },
  validationButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    width: width * 0.7,
    backgroundColor: "#965a51c0",
    margin: 10,
  },

  textValidateButton: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 9,
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
    paddingBottom: 15,
  },

  prevButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    width: width * 0.1,
    backgroundColor: "#965a51c0",
    margin: 10,
  },

  prevTextButton: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 9,
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
    paddingBottom: 15,
  },
});
