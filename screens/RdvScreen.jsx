import {
  StyleSheet,
  Modal,
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useCallback } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import dayjs from "dayjs";
const {width, height} = Dimensions.get('window');

export default function RdvScreen({ navigation, route }) {
  const user = useSelector(state => state.user.value);
  const rdv = user.user ? user.user.rdvList.find(
        (x) => String(x._id) === String(route.params._id)
      )
    : null;
  if (!rdv) {
    return null;
  }
  const isCreator = String(user.user._id) === String(rdv.creator._id);
  const otherUser = isCreator ? rdv.receiver : rdv.creator;
  const rdvDate = dayjs(rdv.date);
  let statusBloc;
  if (rdv.status === 'demande') {
    if (isCreator) {
      statusBloc = <Text>En attente d'une réponse</Text>
    } else {
      statusBloc = <>
        <Text>Veuillez répondre à la demande :</Text>
        
      </>
    }
  } else if (rdv.status === 'confirmé') {
    statusBloc = <Text>Confirmé</Text>
  } else if (rdv.status === 'annulé') {
    statusBloc = <Text>Annulé</Text>
  } else {
    statusBloc = <Text>Refusé</Text>
  }
  return <View style={styles.container}>
    <View style={styles.conversationHeader}>
        <View style={styles.headerLeft}>
          <AntDesign
            name="left"
            size={24}
            color="#965A51"
            style={styles.goBack}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                rdv
                  ? otherUser.photoList.length === 0
                    ? ""
                    : otherUser.photoList[0]
                  : null
              }
            />
          </View>
          <Text style={styles.username}>
            {rdv ? otherUser.username : null}
          </Text>
        </View>
      </View>
      <Text>Rendez-vous</Text>
      <Text>
        {["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][rdvDate.get("day")]}{" "}{rdvDate.format("DD/MM/YYYY")} à {rdvDate.format("HH:mm")}
      </Text>
      <Text>{rdv.address}</Text>
      <MapView
        initialRegion={{
          latitude: rdv.latitude,
          longitude: rdv.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
        style={styles.map}
      >
        <Marker
          coordinate={{
            latitude: rdv.latitude,
            longitude: rdv.longitude
          }}
        />
      </MapView>
      {statusBloc}
  </View>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
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
  goBack: {
    marginHorizontal: 25,
  },
  map: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 20,
    boxShadow: "0 2px 3px #896761",
  }
});
