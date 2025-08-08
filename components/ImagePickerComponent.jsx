import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
const { width, height } = Dimensions.get("window");
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function ImagePickerScreen(props) {
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
      props.addUriToList(uri);
      setPhoto(uri);
    } else {
      alert("Tu dois sélectionner au moins une image pour valider ton profil.");
    }
  };
  // Hello \o/
  const handleDelete = () => {
    setPhoto("");
  };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.addPhotoButton}>
      {photo ? (<>
          <Image source={photo} style={styles.addedPhoto} />
          <TouchableOpacity
            onPress={() => handleDelete()}
            style={styles.deletePhotoDiv}
          >
            <FontAwesome6 name="xmark" size={24} style={styles.deleteCross} />
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.textButton}>+</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "f1ebe6",
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
    alignItems: 'center',
    justifyContent: 'center'
  },

  textButton: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "light",
  },

  addedPhoto: {
    backgroundColor: "transparent",
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },

  deletePhotoDiv: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 26,
    height: 26,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
  },

  deleteCross: {
    fontSize: 24,
    color: "#965A51",
    // backgroundColor: "#F5EBE6",
    padding: 1,
  },
});
