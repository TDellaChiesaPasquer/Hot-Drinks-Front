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
const addRvd = async () => {
const response = await (fetch `https://us1.locationiq.com/v1/reverse?key=${Your_API_Access_Token}&lat={data.latitude}&lon=-{data.longitude}&format=json&`)
  const data = await response.json();
  console.log(data)
  const coordinate = {
    latitude: data.lat,
    longitude: data.lon,
    address: data.address.government,
    city: data.address.city,
    country: data.address.country,
  }
}
return (
    <>
      {/* <SafeAreaView style={styles.container}>
        <HeaderBeginning />
      </SafeAreaView> */}
    </>
  );
}
