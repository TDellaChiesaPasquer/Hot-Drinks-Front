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
  //   const [photo, setPhoto] = useState(null);

  //   const pickImage = async () => {
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ["images"],
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     //console.log(result);

  //     if (!result.canceled) {
  //       const uri = result.assets[0].uri;
  //       console.log("uri=", uri);
  //       //   const next = [...photo];
  //       //   next[index] = uri;
  //       setPhoto(uri);
  //     } else {
  //       alert("Tu dois sélectionner au moins une image pour valider ton profil.");
  //     }
  //   };

  const addedPhoto = [];
  for (let i = 0; i < 9; i++) {
    addedPhoto.push(<ImagePickerComponent key={i} />);
  }

  //   const removeImage = (index) => {
  //     if (!photo[index]) return;

  //     const renderItem = ({ index }) => (
  //       <TouchableOpacity
  //         style={styles.photoBox}
  //         onPress={() => pickImage(index)}
  //         onLongPress={() => removeImage(index)}
  //         disabled={loading}
  //       >
  //         {photo[index] ? (
  //           <Image source={{ uri: photo[index] }} style={styles.image} />
  //         ) : (
  //           <Ionicons name="add" size={32} color="#555" />
  //         )}
  //       </TouchableOpacity>
  //     );
  //   };

  //console.log("photo=", photo);

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
