import { useState, useCallback } from "react";
import {
  Button,
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ImagePickerComponent from "../components/ImagePickerComponent";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import HeaderBeginning from "../components/HeaderBeginning";

const { width, height } = Dimensions.get("window");

export default function ImagePickerScreen({ navigation }) {
  const [photoUriList, setPhotoUriList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const user = useSelector((state) => state.user.value);
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

  const addUriToList = (uri) => {
    const orderedPhotos = [...photoUriList.filter((uri) => uri !== null)];
    setPhotoUriList([...orderedPhotos, uri]);
  };

  const removeUriToList = (index) => {
    setPhotoUriList(photoUriList.filter((e, i) => i !== index));
  };

  const replaceUriInList = (index, uri) => {
    setPhotoUriList(photoUriList.map((e, i) => i === index ? uri : e));
  }

  const addedPhoto = [];
  for (let i = 0; i < 3; i++) {
    addedPhoto.push(
      <View key={i} style={styles.containerLine}>
        <ImagePickerComponent addUriToList={addUriToList} removeUriToList={removeUriToList} replaceUriInList={replaceUriInList} source={photoUriList[3 * i] || ''} index={3 * i}/>
        <ImagePickerComponent addUriToList={addUriToList} removeUriToList={removeUriToList} replaceUriInList={replaceUriInList} source={photoUriList[3 * i + 1] || ''} index={3 * i + 1}/>
        <ImagePickerComponent addUriToList={addUriToList} removeUriToList={removeUriToList} replaceUriInList={replaceUriInList} source={photoUriList[3 * i + 2] || ''} index={3 * i + 2}/>
      </View>
    );
  }

  const handleSubmitPhotos = async () => {
    setDisabled(true);
    const formData = new FormData();
    // console.log("click", photo);
    console.log(photoUriList);
    if (photoUriList.length === 0) {
      setDisabled(false);
      return;
    }
    console.log("test");
    for (let i = 0; i < photoUriList.length; i++) {
      formData.append("photoFromFront" + i, {
        uri: photoUriList[i],
        name: "photo.jpg",
        type: "image/jpeg",
      });
    }
    console.log("testa");

    const response = await fetch(
      process.env.EXPO_PUBLIC_IP + "/users/addPhoto/" + photoUriList.length,
      {
        method: "POST",
        headers: {
          authorization: user.token,
        },
        body: formData,
      }
    );
    console.log("testb");
    const data = await response.json();
    console.log(data);
    if (data.result) {
      navigation.navigate("MapScreen");
      setDisabled(false);
      return;
    }
    setDisabled(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <HeaderBeginning />
        <Text style={styles.inputTitle}>Ajoute au moins une photo</Text>
        <View>
          <View style={styles.containerPhoto}>{addedPhoto}</View>
        </View>
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={[styles.validationButton, disabled && styles.boutonDisabled]}
            onPress={() => handleSubmitPhotos()}
            disabled={disabled}
          >
            <Text style={styles.textValidateButton}>Valider</Text>
            {disabled && (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                style={styles.loader}
              />
            )}
          </TouchableOpacity>
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

  containerPhoto: {
    width: width * 0.85,
    height: width * 0.85,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
  },
  containerLine: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  inputTitle: {
    color: "#965A51",
    fontWeight: "bold",
    marginTop: 100,
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
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
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
  boutonDisabled: {
    backgroundColor: "#8b6762c0",
    boxShadow: "0 1px 2px #976f68c0",
  },
  loader: {
    position: "absolute",
    left: 10,
  },
});
