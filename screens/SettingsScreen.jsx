import { TouchableOpacity, View, Text } from "react-native";
import { useDispatch } from "react-redux";
import { disconnect } from "../reducers/user";

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  return <View>
    <TouchableOpacity onPress={() => dispatch(disconnect(navigation))}>
      <Text>Deconnection</Text>
    </TouchableOpacity>
  </View>
}
