import {
  StyleSheet,
  Modal,
  TextInput,
  View,
  Pressable,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
const { width, height } = Dimensions.get("window");
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>Tes rendez-vous s'afficheront ici...</Text>
  </View>
);

export default function ListRdvScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const rdvList = [...((user.user && user.user.rdvList) || [])];
  rdvList.sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
  );
  const rdvHTML = rdvList.map((rdv) => {
    const otherUser =
      String(rdv.creator._id) === String(user.user._id)
        ? rdv.receiver
        : rdv.creator;
    const rdvDate = dayjs(rdv.date);
    const notif =
      rdv.status === "demande" &&
      String(rdv.creator._id) !== String(user.user._id);
    return (
      <TouchableOpacity
        key={rdv._id}
        style={styles.conversationContainer}
        onPress={() =>
          navigation.navigate("RdvScreen", {
            ...rdv,
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
          <Text style={styles.username}>
            {otherUser.username.length > 25
              ? otherUser.username.slice(0, 22) + "..."
              : otherUser.username}
          </Text>
          <Text style={styles.date}>
            {rdv.address.length > 35
              ? rdv.address.slice(0, 32) + "..."
              : rdv.address}
          </Text>
          <Text style={styles.date}>
            {
              [
                "Dimanche",
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
              ][rdvDate.get("day")]
            }{" "}
            {rdvDate.format("DD/MM/YYYY")} à {rdvDate.format("HH:mm")}
          </Text>
        </View>
        {notif && <View style={styles.notif}></View>}
        {rdv.status === "confirm" && (
          <AntDesign
            name="check"
            size={24}
            color="lightgreen"
            style={styles.iconStatus}
          />
        )}
        {(rdv.status === "cancel" || rdv.status === "refused") && (
          <Feather name="x" size={24} color="red" style={styles.iconStatus} />
        )}
      </TouchableOpacity>
    );
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rendez-vous</Text>
      {rdvList.length === 0 && <EmptyState />}
      <ScrollView contentContainerStyle={styles.conversationList}>
        {rdvHTML}
      </ScrollView>
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
  title: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10,
  },
  contactContainer: {
    alignItems: "center",
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
  contactName: {
    color: "#965A51",
    fontWeight: "bold",
    fontSize: 10,
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
    position: "relative",
  },
  message: {
    marginLeft: 10,
    height: 60,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  username: {
    color: "#FFF5F0",
    fontWeight: "bold",
    fontSize: 16,
  },
  conversationList: {
    width: width * 0.9,
    alignItems: "center",
  },
  date: {
    color: "#FFF5F0",
    fontWeight: "bold",
    fontSize: 12,
  },
  notif: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#FFF5F0",
    right: 25,
  },
  iconStatus: {
    position: "absolute",
    right: 25,
  },
  emptyState: {
    marginTop: "70%",
    width: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F0",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(188, 141, 133, 0.25)",
  },
  emptyText: {
    color: "#965A51",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 32,
  },
});
