import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { addInfos } from "../reducers/user";

export default function ({navigation}) {
  const user = useSelector(state => state.user.value);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (!user.token) {
        navigation.navigate('SignUpNav', {path: 'SignUp'});
        return;
      }
      const response = await fetch(process.env.EXPO_PUBLIC_IP + '/users/infos',{
        headers: {
          authorization: user.token
        }
      });
      const data = await response.json();
      if (!data.result) {
        navigation.navigate('SignUpNav', {path: 'SignUp'});
        return;
      }
      const newUser = data.user;
      if (!newUser.birthdate) {
        navigation.navigate('SignUpNav', {path: 'DateScreen'});
        return;
      }
      if (newUser.photoList.length === 0) {
        navigation.navigate('SignUpNav', {path: 'PhotoScreen'});
        return;
      }
      if (!newUser.latitude) {
        navigation.navigate('SignUpNav', {path: 'MapScreen'});
        return;
      }
      dispatch(addInfos(newUser));
      navigation.navigate('MainTabNav');
    })();
  }, [])
  return <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text>Hot drinks</Text>
    </SafeAreaView>
  </SafeAreaProvider>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DFC9B4",
        alignItems: "center",
    },
});