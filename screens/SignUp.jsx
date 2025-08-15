import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useDispatch, useSelector } from "react-redux";
import { addInfos, addToken } from "../reducers/user";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

const { width, height } = Dimensions.get("window");

export default function ({ navigation }) {
  const [emailVisible, setEmailVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [validateDisabled, setValidateDisabled] = useState(false);
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

  const tryLogin = async () => {
    try {
      setValidateDisabled(true);
      if (
        email === "" ||
        !/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(email)
      ) {
        setError("Remplis un email valide");
        setValidateDisabled(false);
        return;
      }
      if (password.length < 8) {
        setError("Ton mot de passe doit faire au moins 8 caractères");
        setValidateDisabled(false);
        return;
      }
      if (password.length > 32) {
        setError("Ton mot de passe doit faire au plus 32 caractères");
        setValidateDisabled(false);
        return;
      }
      const response = await fetch(
        process.env.EXPO_PUBLIC_IP + "/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (!data.result) {
        setError(String(data.error));
        setValidateDisabled(false);
        return;
      }
      dispatch(addToken(data.token));
      if (data.message === "User is connected") {
        const response2 = await fetch(
          process.env.EXPO_PUBLIC_IP + "/users/infos",
          {
            headers: {
              authorization: data.token,
            },
          }
        );
        const data2 = await response2.json();
        setValidateDisabled(false);
        setEmailVisible(false);
        if (!data2.user.birthdate) {
          navigation.navigate("DateScreen");
          return;
        }
        if (data2.user.photoList.length === 0) {
          navigation.navigate("PhotoScreen");
          return;
        }
        if (!data2.user.latitude) {
          navigation.navigate("MapScreen");
          return;
        }
        dispatch(addInfos(data2.user));
        navigation.navigate("MainTabNav", { screen: "SwipeNav" });
        return;
      }
      setValidateDisabled(false);
      setEmailVisible(false);
      navigation.navigate("DateScreen");
      return;
    } catch (error) {
      setValidateDisabled(false);
    }
  };
  const modalEmail = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={emailVisible}
      onRequestClose={() => {
        setEmailVisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalEmail}>
          <Pressable
            style={styles.crossModalDiv}
            onPress={() => setEmailVisible(false)}
          >
            <FontAwesome6 name="xmark" size={24} style={styles.crossModal} />
          </Pressable>
          <Text style={styles.modalTitle}>Create account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#965A51"}
            type={"email"}
            value={email}
            onChangeText={(value) => setEmail(value)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#965A51"}
            type={"password"}
            secureTextEntry={true}
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity
            style={styles.bouton}
            disabled={validateDisabled}
            onPress={() => tryLogin()}
          >
            <Text style={styles.boutonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.gif")}
            style={styles.logo}
            autoplay
            accessibilityLabel="Logo"
          />
          <Text style={styles.hotDrinks}>Hot Drinks</Text>
        </View>
        {modalEmail}
        <TouchableOpacity
          style={styles.boutonGoogle}
          onPress={() => setEmailVisible(true)}
        >
          <Text style={styles.boutonText}>CONNEXION PAR EMAIL</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFC9B4",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue",
    width: "70vw",
    height: "250vh",
    marginBottom: 170,
    marginTop: -30,
  },
  hotDrinks: {
    fontSize: 45,
    fontFamily: "Air Travelers Personal Use",
    fontWeight: "bold",
    color: "#6A3931",
    paddingHorizontal: 20,
    marginTop: -85,
    marginRight: 20,
  },
  logo: {
    height: 320,
    width: 290,
    marginLeft: 20,
    // backgroundColor: "yellow",
  },
  bouton: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    width: width * 0.7,
    backgroundColor: "#965A51",
    margin: 10,
  },
  boutonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
  },
  boutonGoogle: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    width: width * 0.7,
    margin: 10,
    backgroundColor: "#91a7daff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalEmail: {
    backgroundColor: "#DFC9B4",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    position: "relative",
  },
  input: {
    backgroundColor: "#FFF5F0",
    height: 45,
    borderRadius: 50,
    boxShadow: "0 2px 3px #896761",
    paddingHorizontal: 12,
    fontWeight: "bold",
    color: "#965A51",
    fontSize: 12,
    width: width * 0.7,
    margin: 10,
  },
  modalTitle: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 16,
    margin: 10,
  },
  crossModal: {
    color: "#965A51",
  },
  crossModalDiv: {
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
  error: {
    color: "red",
    textAlign: "center",
  },
});
