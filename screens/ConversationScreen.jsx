import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import { readConv } from "../reducers/user";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedKeyboard, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width, height } = Dimensions.get("window");

export default function ({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const keyboard = useAnimatedKeyboard();
  const keyboardStyleBottom = useAnimatedStyle(() => ({
    height: Math.max(0, keyboard.height.value - (49 + insets.bottom)) + 66
  }));
  const keyboardStyleScroll = useAnimatedStyle(() => ({
    height: keyboard.state.value === 1 ? 250 : 0
  }))
  const [newMessage, setNewMessage] = useState("");
  const [sendDisabled, setSendDisabled] = useState(false);
  const [modalBlockVisible, setModalBlockVisible] = useState(false);
  const [blockDisabled, setBlockDisabled] = useState(false);
  const conversation = user.user ? user.user.conversationList.find(
    (x) => String(x._id) === String(route.params._id)
  ) : null;
  const messageList = conversation?.messageList || [];
  const otherUserNumber = route.params?.otherUserNumber || 1;
  useEffect(() => {
    const lastMessage =
      messageList.length !== 0 ? messageList[messageList.length - 1] : null;
    if (
      lastMessage &&
      lastMessage.creator === otherUserNumber &&
      !lastMessage.seen
    ) {
      (async () => {
        await fetch(
          process.env.EXPO_PUBLIC_IP + "/conversation/" + conversation._id,
          {
            method: "PUT",
            headers: {
              authorization: user.token,
            },
          }
        );
      })();
      dispatch(readConv(conversation._id));
    }
  }, [messageList]);
  const scrollViewRef = useRef();
  const otherUser =
    otherUserNumber === 2 ? route.params.user2 : route.params.user1;
  const currentDate = dayjs();
  const lastOwnSeenMessageIndex = messageList.findLastIndex(
    (x) => x.creator !== otherUserNumber && x.seen === true
  );
  const messagesHTML = messageList.map((message, index) => {
    let date;
    const messageDate = dayjs(message.date);
    if (
      index === 0 ||
      messageDate.valueOf() - new Date(messageList[index - 1].date).valueOf() >=
        5 * 60 * 1000
    ) {
      if (
        currentDate.format("DD/MM/YYYY") === messageDate.format("DD/MM/YYYY")
      ) {
        date = messageDate.format("HH:mm");
      } else {
        date = `le ${messageDate.format("DD/MM/YYYY")} à ${messageDate.format(
          "HH:mm"
        )}`;
      }
    }
    return (
      <View
        key={message.date}
        style={[
          styles.messageDiv,
          {
            alignItems:
              otherUserNumber === message.creator ? "flex-start" : "flex-end",
          },
        ]}
      >
        {date && <Text style={styles.messageDate}>{date}</Text>}
        <View
          style={[
            styles.messageContentContainer,
            {
              backgroundColor:
                otherUserNumber === message.creator ? "#BC8D85" : "#965A51",
            },
          ]}
        >
          <Text style={styles.messageContent}>{message.content}</Text>
        </View>
        {index === lastOwnSeenMessageIndex && <Text style={styles.vu}>Vu</Text>}
      </View>
    );
  });
  const sendMessage = async () => {
    setSendDisabled(true);
    if (newMessage === "") {
      setSendDisabled(false);
      return;
    }
    const newMessageContent = newMessage;
    setNewMessage("");
    await fetch(process.env.EXPO_PUBLIC_IP + "/conversation/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: user.token,
      },
      body: JSON.stringify({
        content: newMessageContent,
        conversationId: route.params._id,
      }),
    });
    setSendDisabled(false);
  };
  const modalBlock = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalBlockVisible}
      onRequestClose={() => {
        setModalBlockVisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalBlock}>
          <Pressable
            style={styles.crossModalDiv}
            onPress={() => setModalBlockVisible(false)}
          >
            <FontAwesome6 name="xmark" size={24} style={styles.crossModal} />
          </Pressable>
          <Text style={styles.modalTitle}>Bloquer l'utilisateur</Text>
          <Text style={styles.modalText}>Cette action est irreversible.</Text>
          <TouchableOpacity
            style={styles.buttonModal}
            disabled={blockDisabled}
            onPress={() => blockUser()}
          >
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const blockUser = async () => {
    setBlockDisabled(true);
    const response = await fetch(
      process.env.EXPO_PUBLIC_IP + "/conversation/" + route.params._id,
      {
        method: "DELETE",
        headers: {
          authorization: user.token,
        },
      }
    );
    const data = await response.json();
    setBlockDisabled(false);
    setModalBlockVisible(false);
  };
  return (
    <View
      style={styles.container}
    >
      {modalBlock}
      <View style={styles.conversationHeader}>
        <View style={styles.headerLeft}>
          <AntDesign
            name="left"
            size={24}
            color="#965A51"
            style={styles.goBack}
            onPress={() => navigation.goBack()}
            disabled={modalBlockVisible}
          />
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                conversation
                  ? otherUser.photoList.length === 0
                    ? ""
                    : otherUser.photoList[0]
                  : null
              }
            />
          </View>
          <Text style={styles.username}>
            {conversation ? otherUser.username : null}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {conversation && (
            <MaterialIcons
              name="block"
              size={24}
              color="#965A51"
              style={styles.block}
              onPress={() => {
                setModalBlockVisible(true);
              }}
              disabled={modalBlockVisible}
            />
          )}
        </View>
      </View>
      <View style={styles.convKey}>
        {conversation ? (
          <ScrollView
            contentContainerStyle={styles.messageList}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            {messagesHTML}
            <Animated.View style={keyboardStyleScroll}></Animated.View>
          </ScrollView>
        ) : (
          <Text style={styles.textBlocked}>Vous avez été bloqué</Text>
        )}
      </View>
      <Animated.View style={[styles.conversationBottomRelative, keyboardStyleBottom]}>
        {conversation && (
          <View style={styles.conversationBottom}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={"Ecrire un message..."}
                placeholderTextColor={"#965A51"}
                value={newMessage}
                onChangeText={(value) => setNewMessage(value)}
                maxLength={200}
                multiline={true}
                textAlignVertical={"vertical"}
                onFocus={() => scrollViewRef.current.scrollToEnd({ animated: true })}
              />
              
            </View>
            <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => sendMessage()}
                disabled={sendDisabled || modalBlockVisible}
            >
              <Ionicons name="send" size={24} color="#F5EBE6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton} disabled={modalBlockVisible} onPress={() => {navigation.navigate('RdvScreen');}}>
              <Feather
                name="calendar"
                size={24}
                color="#F5EBE6"
              />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    alignItems: "center",
    position: "relative",
  },
  messageDate: {
    width: width * 0.9,
    textAlign: "center",
    color: "#965A51",
    fontSize: 10,
  },
  messageDiv: {
    width: width * 0.9,
    marginVertical: 2,
  },
  messageContentContainer: {
    maxWidth: width * 0.6,
    padding: 10,
    borderRadius: 20,
  },
  messageList: {
    alignItems: "center",
    width: width * 0.9,
    justifyContent: "flex-start",
  },
  messageContent: {
    color: "#FFF5F0",
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
  conversationHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row",
    paddingBottom: 10,
  },
  username: {
    color: "#965A51",
    fontWeight: "bold",
    marginLeft: 5,
  },
  input: {
    fontWeight: "bold",
    color: "#965A51",
    fontSize: 12,
    paddingVertical: 16,
    width: width * 0.6,
    flex: 1
  },
  conversationBottom: {
    maxHeight: 115,
    position: "absolute",
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: width * 0.9,
    paddingVertical: 10
  },
  inputContainer: {
    borderRadius: 24,
    paddingHorizontal: 12,
    boxShadow: "0 2px 3px #896761",
    width: width * 0.9 - 100,
    backgroundColor: "#FFF5F0",
    overflow: "hidden",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomButton: {
    height: 46,
    width: 46,
    backgroundColor: "#965A51",
    borderRadius: 40,
    boxShadow: "0 2px 3px #896761",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
  },
  conversationBottomPlaceholder: {
    width: "100%",
    alignItems: "center",
    height: 60,
  },
  conversationBottomRelative: {
    position: "relative",
    alignItems: "center",
    justifyContent: 'flex-start',
    width: width,
    height: 66,
  },
  goBack: {
    marginHorizontal: 10,
  },
  vu: {
    color: "#965A51",
    fontSize: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  block: {
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBlock: {
    backgroundColor: "#DFC9B4",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    position: "relative",
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
  buttonModal: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    width: width * 0.7,
    backgroundColor: "#965A51",
    margin: 10,
  },
  modalText: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 12,
  },
  textBlocked: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 16,
  },
  convKey: {
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    height: '100%'
  }
});
