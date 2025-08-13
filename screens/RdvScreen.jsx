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
const { width, height } = Dimensions.get("window");

export default function RdvScreen({ navigation, route }) {
  const [statusDemande, setStatusDemande] = useState("");
  const [statusCancel, setStatusCancel] = useState("");
  const user = useSelector((state) => state.user.value);
  const rdv = user.user
    ? user.user.rdvList.find((x) => String(x._id) === String(route.params._id))
    : null;
  if (!rdv) {
    return null;
  }
  const isCreator = String(user.user._id) === String(rdv.creator._id);
  const otherUser = isCreator ? rdv.receiver : rdv.creator;
  const rdvDate = dayjs(rdv.date);
  let statusBloc;

  const acceptDemande = async () => {
    setStatusDemande("confirm");
    const response = await fetch(process.env.EXPO_PUBLIC_IP + "/rdv/response", {
      method: "PUT",
      headers: {
        authorization: user.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rdvId: rdv._id,
        status: "confirm",
      }),
    });
    const data = await response.json();
    if (!data.result) {
      setStatusDemande("");
    }
  };

  const refuseDemande = async () => {
    setStatusDemande("refused");
    const response = await fetch(process.env.EXPO_PUBLIC_IP + "/rdv/response", {
      method: "PUT",
      headers: {
        authorization: user.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rdvId: rdv._id,
        status: "refused",
      }),
    });
    const data = await response.json();
    if (!data.result) {
      setStatusDemande("");
    }
  };

  const cancelRdv = async () => {
    setStatusCancel("cancel");
    const response = await fetch(process.env.EXPO_PUBLIC_IP + "/rdv/cancel", {
      method: "PUT",
      headers: {
        authorization: user.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rdvId: rdv._id,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (!data.result) {
      setStatusCancel("");
    }
  };

  if (rdv.status === "demande") {
    if (isCreator) {
      statusBloc = (
        <Text style={styles.statusText}>En attente d'une réponse</Text>
      );
    } else {
      statusBloc = (
        <>
          <Text style={styles.statusText}>
            Veuillez répondre à la demande :
          </Text>
          <View style={styles.demandeContainer}>
            <TouchableOpacity
              style={styles.demandeButton}
              disabled={Boolean(statusDemande)}
              onPress={() => acceptDemande()}
            >
              <Text style={styles.demandeButtonText}>Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.demandeButton}
              disabled={Boolean(statusDemande)}
              onPress={() => refuseDemande()}
            >
              <Text style={styles.demandeButtonText}>Refuser</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
  } else if (rdv.status === "confirm") {
    statusBloc = (
      <>
        <Text style={styles.statusText}>Confirmé</Text>
        <TouchableOpacity
          style={styles.demandeButton}
          disabled={Boolean(statusCancel)}
          onPress={() => cancelRdv()}
        >
          <Text style={styles.demandeButtonText}>Annuler</Text>
        </TouchableOpacity>
      </>
    );
  } else if (rdv.status === "cancel") {
    statusBloc = <Text style={styles.statusText}>Annulé</Text>;
  } else {
    statusBloc = <Text style={styles.statusText}>Refusé</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.conversationHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonLeft}>
            <AntDesign name="left" size={24} color="#965A51"/>
          </TouchableOpacity>
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
						<TouchableOpacity
							style={styles.avatarContainer}
							onPress={() => {
								// Navigation vers ProfileInformationsScreen avec les données du profil sans la distance
								if (rdv && otherUser) {
									const profileData = { ...otherUser };
									// S'assurer que la distance n'est pas incluse
									navigation.navigate("ProfileInformationsScreen", {
										profileData: profileData,
										firstImage: otherUser.photoList.length === 0 ? null : otherUser.photoList[0],
									});
								}
							}}
						>
							<Image style={styles.avatar} source={rdv ? (otherUser.photoList.length === 0 ? "" : otherUser.photoList[0]) : null} />
						</TouchableOpacity>
					</View>
					<Text style={styles.username}>{rdv ? otherUser.username : null}</Text>
				</View>
			</View>
			<Text>Rendez-vous</Text>
			<Text>
				{["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][rdvDate.get("day")]} {rdvDate.format("DD/MM/YYYY")} à {rdvDate.format("HH:mm")}
			</Text>
			<Text>{rdv.address}</Text>
			<MapView
				initialRegion={{
					latitude: rdv.latitude,
					longitude: rdv.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05,
				}}
				style={styles.map}
			>
				<Marker
					coordinate={{
						latitude: rdv.latitude,
						longitude: rdv.longitude,
					}}
				/>
			</MapView>
			{statusBloc}
		</View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    alignItems: "center",
    justifyContent: "flex-start",
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
  containerRadius: {
    height: "70%",
    width: "90%",
    backgroundColor: "red",
    borderRadius: 30,
    overflow: "hidden",
    boxShadow: "0 2px 3px #896761",
  },
  map: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 20,
    boxShadow: "0 2px 3px #896761",
  },
  statusText: {
    color: "#965A51",
    fontWeight: "bold",
  },
  demandeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
  },
  demandeButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    width: width * 0.3,
    backgroundColor: "#965A51",
  },
  demandeButtonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
  },
  buttonLeft: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
