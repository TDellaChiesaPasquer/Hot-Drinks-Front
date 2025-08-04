import { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput, Pressable} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useDispatch, useSelector } from 'react-redux';
import { addToken } from '../reducers/user';

const {width, height} = Dimensions.get('window');

export default function({navigation}) {
    const [emailVisible, setEmailVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validateDisabled, setValidateDisabled] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.value);

    const tryLogin = async () => {
        try {
            setValidateDisabled(true);
            if (email === '' || password === '') {
                setValidateDisabled(false);
                return;
            }
            const response = await fetch(process.env.EXPO_PUBLIC_IP + '/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            console.log(data)
            if (!data.result) {
                setValidateDisabled(false);
                return;
            }
            dispatch(addToken(data.token));
            console.log('test2')
            setValidateDisabled(false);
            setEmailVisible(false);
            navigation.navigate('test')
            return;
        } catch(error) {
            setValidateDisabled(false);
        }
    }
    const modalEmail = <Modal
        animationType='slide'
        transparent={true}
        visible={emailVisible}
        onRequestClose={() => {
            setEmailVisible(false);
        }}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalEmail}>
                <Pressable style={styles.crossModalDiv} onPress={() => setEmailVisible(false)}>
                    <FontAwesome6 name="xmark" size={24} style={styles.crossModal} />
                </Pressable>
                <Text style={styles.modalTitle}>Create account</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor={'#965A51'}
                    type={'email'}
                    value={email}
                    onChangeText={(value) => setEmail(value)}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor={'#965A51'}
                    type={'password'}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                />
                <TouchableOpacity style={styles.bouton} disabled={validateDisabled} onPress={() => tryLogin()}>
                    <Text style={styles.boutonText}>Connect</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
    return <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            {modalEmail}
            <TouchableOpacity
                style={styles.boutonGoogle}
                onPress={() => setEmailVisible(true)}
            >
                <Text style={styles.boutonText}>CONNECTION PAR EMAIL</Text>
            </TouchableOpacity>
        </SafeAreaView>
    </SafeAreaProvider>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFC9B4',
        alignItems: 'center'
    },
    bouton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 36,
        borderRadius: 15,
        boxShadow: '0 2px 3px #896761',
        width: width * 0.7,
        backgroundColor: '#965A51',
        margin: 10
    },
    boutonText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#F5EBE6'
    },
    boutonGoogle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 36,
        borderRadius: 15,
        boxShadow: '0 2px 3px #896761',
        width: width * 0.7,
        margin: 10,
        backgroundColor: '#DE4F24'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalEmail: {
        backgroundColor: '#DFC9B4',
        alignItems: 'center',
        padding : 10,
        borderRadius: 20,
        position: 'relative'
    },
    input: {
        backgroundColor: '#FFF5F0',
        height: 45,
        borderRadius: 50,
        boxShadow: '0 2px 3px #896761',
        paddingHorizontal: 12,
        fontWeight: 'bold',
        color: '#965A51',
        fontSize: 12,
        width: width * 0.7,
        margin: 10
    },
    modalTitle: {
        color: '#965A51',
        fontWeight: 'bold',
        fontSize: 16,
        margin: 10
    },
    crossModal: {
        color: '#965A51',
    },
    crossModalDiv: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 26,
        height: 26,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%'
    }
})