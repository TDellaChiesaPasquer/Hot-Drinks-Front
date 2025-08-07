import { View, Text, StyleSheet, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AntDesign from '@expo/vector-icons/AntDesign';
import { updateConv } from "../reducers/user";

const {width, height} = Dimensions.get('window');

export default function ({navigation, route}) {
  const user = useSelector(state => state.user.value);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const [sendDisabled, setSendDisabled] = useState(false);
  const conversation =  user.user.conversationList.find(x => String(x._id) === String(route.params._id));
  const messageList = conversation.messageList;
  useEffect(() => {
    (async () => {
      await fetch(process.env.EXPO_PUBLIC_IP + '/conversation/' + conversation._id, {
        method: 'PUT',
        headers: {
          authorization: user.token
        }
      });
    })();
  }, [messageList]);
  const scrollViewRef = useRef();
  const otherUserNumber = route.params.otherUserNumber;
  const otherUser = otherUserNumber === 2 ? route.params.user2 : route.params.user1;
  const currentDate = dayjs();
  const lastOwnSeenMessageIndex = messageList.findLastIndex(x => x.creator !== otherUserNumber && x.seen === true);
  console.log(messageList);
  const messagesHTML = messageList.map((message, index) => {
    let date;
    const messageDate = dayjs(message.date);
    if (index === 0 || (messageDate.valueOf() - (new Date(messageList[index - 1].date)).valueOf() >= 5 * 60 * 1000)) {
      if (currentDate.format('DD/MM/YYYY') === messageDate.format('DD/MM/YYYY')) {
        date = messageDate.format('HH:mm');
      } else {
        date = `le ${messageDate.format('DD/MM/YYYY')} à ${messageDate.format('HH:mm')}`;
      }
    }
    return <View key={message.date} style={[styles.messageDiv, {alignItems: otherUserNumber === message.creator ? 'flex-start' : 'flex-end'}]}>
      {date && <Text style={styles.messageDate}>{date}</Text>}
      <View style={[styles.messageContentContainer, {backgroundColor: otherUserNumber === message.creator ? '#BC8D85' : '#965A51'}]}>
        <Text style={styles.messageContent}>{message.content}</Text>
      </View>
      {index === lastOwnSeenMessageIndex && <Text style={styles.vu}>Vu</Text>}
    </View>
  })
  const sendMessage = async () => {
    setSendDisabled(true);
    if (newMessage === '') {
      setSendDisabled(false);
      return;
    }
    const newMessageContent = newMessage;
    setNewMessage('');
    const response = await fetch(process.env.EXPO_PUBLIC_IP + '/conversation/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: user.token
      },
      body: JSON.stringify({
        content: newMessageContent,
        conversationId: route.params._id
      })
    });
    const data = await response.json();
  }
  return <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
    <View style={styles.conversationHeader}>
      <AntDesign name="left" size={24} color='#965A51' style={styles.goBack} onPress={() => navigation.navigate('MessagerieScreen')}/>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={otherUser.photoList.length === 0 ? '' : otherUser.photoList[0]}/>
      </View>
      <Text style={styles.username}>{otherUser.username}</Text>
    </View>
    <ScrollView 
      contentContainerStyle={styles.messageList}
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({animated: true})}
    >
      {messagesHTML}
      <View style={styles.conversationBottomPlaceholder}></View>
    </ScrollView>
    <View style={styles.conversationBottomRelative}>
      <View style={styles.conversationBottom}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder={'Ecrire un message...'}
            placeholderTextColor={'#965A51'}
            value={newMessage}
            onChangeText={value => setNewMessage(value)}
            maxLength={200}
            multiline={true}
            textAlignVertical={'vertical'}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()} disabled={sendDisabled}>
            <Text style={styles.buttonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EBE6',
    alignItems: 'center',
    position: 'relative'
  },
  messageDate: {
    width: width * 0.9,
    textAlign: 'center',
    color: '#965A51',
    fontSize: 10
  },
  messageDiv: {
    width: width * 0.9,
    marginVertical: 2
  },
  messageContentContainer: {
    maxWidth: width * 0.6,
    padding: 10,
    borderRadius: 20,
  },
  messageList: {
    alignItems: 'center',
    width: width * 0.9,
    justifyContent: 'flex-start'
  },
  messageContent: {
    color: '#FFF5F0'
  },
  avatar: {
    width: 60,
    height: 60,
    objectFit: 'cover',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: '100%',
    backgroundColor: '#965A51',
    overflow: 'hidden'
  },
  conversationHeader: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    flexDirection: 'row'
  },
  username: {
    color: '#965A51',
    fontWeight: 'bold',
    marginLeft: 5
  },
  input: {
    fontWeight: 'bold',
    color: '#965A51',
    fontSize: 12,
    paddingVertical: 16,
    width: width * 0.6
  },
  conversationBottom: {
    maxHeight: 115,
    padding: 10,
    position: 'absolute',
    bottom: 0
  },
  inputContainer: {
    borderRadius: 24,
    paddingLeft: 12,
    boxShadow: '0 2px 3px #896761',
    width: width * 0.9,
    backgroundColor: '#FFF5F0',
    overflow: 'hidden',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sendButton: {
    height: 36,
    width: width * 0.2,
    backgroundColor: '#965A51',
		borderRadius: 20,
		boxShadow: "0 2px 3px #896761",
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginRight: 5
  },
  buttonText: {
		fontWeight: "bold",
		fontSize: 18,
		color: "#F5EBE6",
	},
  conversationBottomPlaceholder: {
    width: '100%',
    alignItems: 'center',
    height: 60
  },
  conversationBottomRelative: {
    position: 'relative',
    alignItems: 'center',
    width: width
  },
  goBack: {
    marginHorizontal: 10
  },
  vu: {
    color: '#965A51',
    fontSize: 10
  }
})