import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

export default function ({navigation}) {
    const user = useSelector(state => state.user.value);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            if (!user.token) {
                navigation.navigate('SignInNav', {path: 'SignIn'});
                return;
            }
            const response = await fetch(process.env.EXPO_PUBLIC_IP + '/users/infos',{
                headers: {
                    authorization: user.token
                }
            });
            const data = await response.json();
            if (!data.result) {
                navigation.navigate('SignInNav', {path: 'SignIn'});
                return;
            }
            const newUser = data.user;
            dispatch
            if (!newUser.birthdate) {
                navigation.navigate('SignInNav', {path: 'DateScreen'});
                return;
            }
            dispatch(addInfos(newUser));
            navigation.navigate('SwipeScreen');
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