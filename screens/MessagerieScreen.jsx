import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

export default function ({navigation}) {
  const user = useSelector(state => state.user.value);
  const conversationData = user.user ? user.user.conversationList : [{
        "_id": "68920e9e64826a1e816580bc",
        "user1": {
          "_id": "68920d7c1f4fa86456fe1828",
          "username": "Feu"
        },
        "user2": {
          "_id": "6891f9af66e94bf8db0c2074",
          "username": "To"
        },
        "messageList": [
          {
            "creator": 2,
            "date": "2025-08-05T14:02:16.310Z",
            "content": "Test",
            "_id": "68920ee8ec43067fa26301bc"
          }
        ],
        "__v": 0
      }];
  const conversationHTML = conversationData.map(data => {
    if (data.messageList.length === 0) {
      return null;
    }
    const otherUser = user.user ? String(data.user1._id) === String(user.user._id) ? data.user2 : data.user1 : data.user1;
    const name = otherUser.username;
    const lastMessage = data.messageList[data.messageList.length - 1];
    return <View key={otherUser._id} style={styles.conversationContainer}>
      <Image style={styles.avatar}/>
      <View style={styles.message}>
        <Text style={styles.username}>{name}</Text>
        <Text style={styles.messageInfo}>Dernier message, le {dayjs(lastMessage.date).format('DD/MM/YYYY')} à {dayjs(lastMessage.date).format('HH:mm')}</Text>
        <Text style={styles.messageContent}>{lastMessage.content.length > 30 ? lastMessage.content.slice(0, 30) + '...' : lastMessage.content}</Text>
      </View>
    </View>
  })
  const contactHTML = conversationData.map(data => {
    const otherUser = user.user ? String(data.user1._id) === String(user.user._id) ? data.user2 : data.user1 : data.user1;
    const name = otherUser.username;
    return <View key={otherUser._id} style={styles.contactContainer}>
        <Image style={styles.avatar}/>
        <Text style={styles.contactName}>{name}</Text>
      </View>
  })
  return <View style={styles.container}>
    {contactHTML}
    <Text>Messages</Text>
    {conversationHTML}
  </View>
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
		backgroundColor: "#F5EBE6",
		alignItems: "center",
	},
  conversationContainer: {
    width: '90%',
    backgroundColor: '#BC8D85',
    height: 80,
    borderRadius: 36,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: '100%',
    objectFit: 'cover',
    backgroundColor: '#965A51'
  },
  username: {
    color: '#FFF5F0',
    fontWeight: 'bold',
    fontSize: 16
  },
  messageInfo: {
    color: '#FFF5F0',
    fontWeight: 'bold',
    fontSize: 12
  },
  messageContent: {
    color: '#FFF5F0',
    fontWeight: 'bold'
  },
  message: {
    marginLeft: 10,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  contactContainer: {
    alignItems: 'center'
  },
  contactName: {
    color: '#965A51',
    fontWeight: 'bold'
  }
})