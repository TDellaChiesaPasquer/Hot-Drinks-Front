import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
const { width, height } = Dimensions.get("window");

export default function ImagePickerScreen() {
  const [photo, setPhoto] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log("uri=", uri);
      //   const next = [...photo];
      //   next[index] = uri;
      setPhoto(uri);
    } else {
      alert("Tu dois sélectionner au moins une image pour valider ton profil.");
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.addPhotoButton}>
      {photo ? (
        <Image source={photo} style={styles.addedPhoto} />
      ) : (
        <Text style={styles.textButton}>+</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFC9B4",
    alignItems: "center",
  },

  containerPhoto: {
    width: width,
    height: width,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 40,
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
});
