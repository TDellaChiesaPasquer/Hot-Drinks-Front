import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Modal } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCoffee,
  faUser,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Provider, useDispatch, useSelector } from "react-redux";

import DateScreen from "./screens/DateScreen";
import GenderScreen from "./screens/GenderScreen";
import RelationScreen from "./screens/RelationScreen";
import SignUp from "./screens/SignUp";
import LoadingScreen from "./screens/LoadingScreen";
import MessagerieScreen from "./screens/MessagerieScreen";
import ConversationScreen from "./screens/ConversationScreen";
import HeaderMain from "./components/HeaderMain";
import PhotoScreen from "./screens/PhotoScreen";
import MapScreen from "./screens/MapScreen";
import CompleteInfosScreen from "./screens/CompleteInfosScreen";
import AddRdvScreen from "./screens/AddRdvScreen";
import ListRdvScreen from "./screens/ListRdvScreen";
import RdvScreen from "./screens/RdvScreen";

// Swipe
import SwipeScreen from "./screens/SwipeScreen";
import ProfileInformationsScreen from "./screens/ProfileInformationsScreen";

import MyProfileScreen from "./screens/MyProfileScreen";
import PreferencesScreen from "./screens/PreferencesScreen";
import SettingsScreen from "./screens/SettingsScreen";

import user, { deleteConv, updateConv, updateRdv } from "./reducers/user";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const pusher = new Pusher("ee5eeae5d340ff371be3", {
  cluster: "eu",
});

const reducers = combineReducers({ user });
const persistConfig = { key: "faceup", storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

// Initialiser la bibliothèque FontAwesome avec les icônes nécessaires
library.add(faCoffee, faUser, faCalendar);

const Stack = createNativeStackNavigator();
const StackSwipe = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const SignUpNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="DateScreen" component={DateScreen} />
      <Stack.Screen name="GenderScreen" component={GenderScreen} />
      <Stack.Screen name="RelationScreen" component={RelationScreen} />
      <Stack.Screen name="PhotoScreen" component={PhotoScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen
        name="CompleteInfosScreen"
        component={CompleteInfosScreen}
      />
    </Stack.Navigator>
  );
};

const receiveNewMessage = async (event, token, dispatch) => {
  const response = await fetch(
    process.env.EXPO_PUBLIC_IP + "/conversation/" + event.conversationId,
    {
      headers: {
        authorization: token,
      },
    }
  );
  const data = await response.json();
  if (!data.result) {
    return;
  }
  dispatch(updateConv(data.conversation));
};

const receiveBlock = async (event, dispatch) => {
  dispatch(deleteConv(event.conversationId));
};

const receiveMatch = async (event, token, dispatch) => {
  receiveNewMessage(event, token, dispatch);
};

const receiveNewRdv = async (event, token, dispatch) => {
  const response = await fetch(
    process.env.EXPO_PUBLIC_IP + "/rdv/reload/" + event.rdvId,
    {
      headers: {
        authorization: token,
      },
    }
  );
  const data = await response.json();
  if (!data.result) {
    return;
  }
  dispatch(updateRdv(data.rdv));
};

const MainTabNav = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  let userId;
  let token;
  let messagerieNotif;
  let rdvNotif;
  if (user.user) {
    userId = user.user._id;
    token = user.token;
    messagerieNotif = user.user.conversationList.some((conv) => {
      const lastMessage = conv.messageList.findLast(
        (x) => String(conv[`user${x.creator}`]._id) !== String(userId)
      );
      return lastMessage && !lastMessage.seen;
    });
    rdvNotif = user.user.rdvList.find(
      (x) =>
        String(userId) === String(x.receiver._id) &&
        new Date(x.date).valueOf() > new Date().valueOf() &&
        x.status === "demande"
    );
  }
  useEffect(() => {
    if (userId) {
      const channel = pusher.subscribe(userId);
      channel.bind("newMessage", (e) => receiveNewMessage(e, token, dispatch));
      channel.bind("block", (e) => receiveBlock(e, dispatch));
      channel.bind("match", (e) => {
        handleModal(true);
        setTimeout(handleModal, 1000, false);
        receiveMatch(e, token, dispatch);
      });
      channel.bind("newRdv", (e) => receiveNewRdv(e, token, dispatch));
      channel.bind("rdv", (e) => receiveNewRdv(e, token, dispatch));

      return () => {
        channel.unbind("newMessage");
        channel.unbind("block");
        channel.unbind("match");
        channel.unbind("newRdv");
        channel.unbind("rdv");
      };
    }
  }, [userId]);

  const modalModificationCheck = (
    <Modal
      style={styles.modal}
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Tu as un nouveau match!</Text>
        </View>
      </View>
    </Modal>
  );

  const handleModal = (bool) => {
    setIsModalVisible(() => bool);
  };

  return (
    <SafeAreaView style={styles.tabBarNavContainer} edges={["top"]}>
      {modalModificationCheck}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          header: ({ route }) => {
            return <HeaderMain route={route} />;
          },
          tabBarIcon: ({ color }) => {
            let icon;
            if (route.name === "MessagerieNav") {
              icon = (
                <MaterialCommunityIcons
                  name="message"
                  size={30}
                  color={color}
                />
              );
            } else if (route.name === "MyProfileNav") {
              icon = <FontAwesomeIcon icon={faUser} size={30} color={color} />;
            } else if (route.name === "SwipeNav") {
              icon = (
                <FontAwesomeIcon icon={faCoffee} size={30} color={color} />
              );
            } else {
              icon = (
                <FontAwesomeIcon icon={faCalendar} size={28} color={color} />
              );
            }
            return icon;
          },
          tabBarActiveTintColor: "#965A51",
          tabBarInactiveTintColor: "#BC8D85",
          tabBarActiveTintColor: "#965A51",
          tabBarInactiveTintColor: "#BC8D85",
          tabBarShowLabel: false,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarStyle: styles.tabBarMain,
          tabBarBadgeStyle: { backgroundColor: "#f7779bff" },
        })}
      >
        <Tab.Screen name="MyProfileNav" component={MyProfileNav} />
        <Tab.Screen name="SwipeNav" component={SwipeNav} />
        <Tab.Screen
          name="MessagerieNav"
          component={MessagerieNav}
          options={messagerieNotif && { tabBarBadge: "" }}
        />
        <Tab.Screen
          name="RdvNav"
          component={RdvNav}
          options={rdvNotif && { tabBarBadge: "" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const SwipeNav = () => {
  return (
    <StackSwipe.Navigator screenOptions={{ headerShown: false }}>
      <StackSwipe.Screen name="SwipeScreen" component={SwipeScreen} />
      <StackSwipe.Screen
        name="ProfileInformationsScreen"
        component={ProfileInformationsScreen}
      />
    </StackSwipe.Navigator>
  );
};

const MessagerieNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagerieScreen" component={MessagerieScreen} />
      <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
      <Stack.Screen name="AddRdvScreen" component={AddRdvScreen} />
      <Stack.Screen name="RdvScreen" component={RdvScreen} />
      <Stack.Screen
        name="ProfileInformationsScreen"
        component={ProfileInformationsScreen}
      />
    </Stack.Navigator>
  );
};

const MyProfileNav = () => {
  return (
    <TopTab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          let icon;

          if (route.name === "Mon profil") {
            icon = <Feather name="user" size={24} color={color} />;
          } else if (route.name === "Préférences") {
            icon = <FontAwesome name="heart-o" size={24} color={color} />;
          } else if (route.name === "Réglages") {
            icon = <MaterialIcons name="settings" size={24} color={color} />;
          }

          return icon;
        },

        tabBarActiveTintColor: "#965A51",
        tabBarInactiveTintColor: "#CAB4B0",
        tabBarStyle: { backgroundColor: "#965A51" },
        tabBarIndicatorStyle: styles.tabBarIndicator,
        headerShown: false,
        swipeEnabled: false,
      })}
    >
      <TopTab.Screen name="Mon profil" component={MyProfileScreen} />
      <TopTab.Screen name="Préférences" component={PreferencesScreen} />
      <TopTab.Screen name="Réglages" component={SettingsScreen} />
    </TopTab.Navigator>
  );
};

const RdvNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListRdvScreen" component={ListRdvScreen} />
      <Stack.Screen name="RdvScreen" component={RdvScreen} />
      <StackSwipe.Screen
        name="ProfileInformationsScreen"
        component={ProfileInformationsScreen}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false, gestureEnabled: false }}
            >
              <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
              <Stack.Screen name="SignUpNav" component={SignUpNav} />
              <Stack.Screen name="MainTabNav" component={MainTabNav} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#F5EBE6",
    borderTopWidth: 0,
  },
  tabBarNavContainer: {
    flex: 1,
    backgroundColor: "#F5EBE6",
  },
  tabBarIcon: {
    fontSize: 30,
  },
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#F5EBE6",
    borderTopWidth: 0,
  },
  tabBarNavContainer: {
    flex: 1,
    backgroundColor: "#F5EBE6",
  },
  tabBarIcon: {
    fontSize: 30,
  },
  tabBarIndicator: {
    backgroundColor: "#CAB4B0",
    height: "90%",
    marginBottom: "5%",
    borderRadius: 5,
    width: "30%",
    marginLeft: "1.66%",
  },
  tabBarMain: {
    backgroundColor: "#F5EBE6",
    boxShadow: "0 -1px 2px #965a51c0",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    margin: 20,
    backgroundColor: "#fd80c9ff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    borderColor: "#FF4D80",
    // boxShadow: "0px 0px 12px 12px #f8a3bbff",
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "900",
  },
});
