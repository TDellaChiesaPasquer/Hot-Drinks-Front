import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
const { width, height } = Dimensions.get("window");

export default function ({ navigation }) {
  const user = useSelector((state) => state.user.value);
  console.log(user);
  const conversationData = user.user
    ? user.user.conversationList
    : [
        {
          _id: "68920e9e64826a1e816580bc",
          user1: {
            _id: "68920d7c1f4fa86456fe1828",
            username: "Feu",
          },
          user2: {
            _id: "6891f9af66e94bf8db0c2074",
            username: "To",
          },
          messageList: [
            {
              creator: 2,
              date: "2025-08-05T14:02:16.310Z",
              content: "Test",
              _id: "68920ee8ec43067fa26301bc",
            },
          ],
          __v: 0,
        },
      ];
  const conversationHTML = conversationData.map((data) => {
    if (data.messageList.length === 0) {
      return null;
    }
    const otherUserNumber =
      String(data.user1._id) === String(user.user._id) ? 2 : 1;
    const otherUser = user.user
      ? otherUserNumber === 2
        ? data.user2
        : data.user1
      : data.user1;
    const name = otherUser.username;
    const lastMessage = data.messageList[data.messageList.length - 1];
    return (
      <TouchableOpacity
        key={otherUser._id}
        style={styles.conversationContainer}
        onPress={() =>
          navigation.navigate("ConversationScreen", {
            otherUserNumber,
            ...data,
          })
        }
      >
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={
              otherUser.photoList.length === 0 ? "" : otherUser.photoList[0]
            }
          />
        </View>
        <View style={styles.message}>
          <Text style={styles.username}>{name}</Text>
          <Text style={styles.messageInfo}>
            Dernier message, le {dayjs(lastMessage.date).format("DD/MM/YYYY")} à{" "}
            {dayjs(lastMessage.date).format("HH:mm")}
          </Text>
          <Text style={styles.messageContent}>
            {lastMessage.content.length > 30
              ? lastMessage.content.slice(0, 30) + "..."
              : lastMessage.content}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });
  const contactHTML = conversationData.map((data) => {
    const otherUserNumber =
      String(data.user1._id) === String(user.user._id) ? 2 : 1;
    const otherUser = user.user
      ? otherUserNumber === 2
        ? data.user2
        : data.user1
      : data.user1;
    const name = otherUser.username || "";
    return (
      <TouchableOpacity
        key={otherUser._id}
        style={styles.contactContainer}
        onPress={() =>
          navigation.navigate("ConversationScreen", {
            otherUserNumber,
            ...data,
          })
        }
      >
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={
              otherUser.photoList.length === 0 ? "" : otherUser.photoList[0]
            }
          />
        </View>
        <Text style={styles.contactName}>
          {name.length >= 15 ? name.slice(0, 12) + "..." : name}
        </Text>
      </TouchableOpacity>
    );
  });
  return (
    <View style={styles.container}>
      <View style={styles.scrollHeight}>
        <ScrollView
          style={styles.contactScroll}
          contentContainerStyle={styles.contactList}
          horizontal={true}
        >
          {contactHTML}
        </ScrollView>
      </View>
      <Text style={styles.title}>Messages</Text>
      <ScrollView contentContainerStyle={styles.conversationList}>
        {conversationHTML}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    alignItems: "center",
  },
  conversationContainer: {
    width: "100%",
    backgroundColor: "#BC8D85",
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 10,
    marginVertical: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    objectFit: "cover",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: "100%",
    backgroundColor: "#965A51",
    overflow: "hidden",
  },
  username: {
    color: "#FFF5F0",
    fontWeight: "bold",
    fontSize: 16,
  },
  messageInfo: {
    color: "#FFF5F0",
    fontWeight: "bold",
    fontSize: 12,
  },
  messageContent: {
    color: "#FFF5F0",
    fontWeight: "bold",
  },
  message: {
    marginLeft: 10,
    height: 60,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  contactContainer: {
    alignItems: "center",
  },
  contactName: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 10,
  },
  title: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10,
  },
  contactList: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: width * 0.05,
    gap: 10,
    height: 72,
  },
  contactScroll: {
    width: "100%",
  },
  scrollHeight: {
    width: width,
    height: 72,
  },
  conversationList: {
    width: width * 0.9,
    alignItems: "center",
  },
});
