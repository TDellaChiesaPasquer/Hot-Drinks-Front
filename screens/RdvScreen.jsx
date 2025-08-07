import { SafeAreaView } from "react-native-safe-area-context";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { addPlace } from "../reducers/map";


export default function App({ navigation }) {

https://us1.locationiq.com/v1/reverse?key=Your_API_Access_Token&lat=51.50344025&lon=-0.12770820958562096&format=json&

  return (
    <>
     <SafeAreaView style={styles.container}>
          <HeaderBeginning />
          </SafeAreaView>
    </>
  );
}