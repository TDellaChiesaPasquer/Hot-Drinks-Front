import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function AddRdvScreen({ navigation, route }) {
  const token = useSelector((state) => state.user.value.token);
  const [choicePositionRdv, setChoicePositionRdv] = useState(null);
  const [date, setDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("");

  const showPicker = () => {
    setVisible(true);
  };

  const showDate = () => {
    setMode("date");
    showPicker();
  };

  const showTime = () => {
    setMode("time");
    showPicker();
  };

  const dateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setVisible(false);
    setDate(currentDate);
  };

  const getMarker = async (coordinates) => {
    setChoicePositionRdv(coordinates);
    const newRdv = {
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
    };
  };

  const addRdv = async () => {
    if (!Marker && !date) {
      return;
    }
    const response = await fetch(process.env.EXPO_PUBLIC_IP + "/rdv/ask", {
      method: "PUT",
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        longitude: choicePositionRdv.longitude,
        latitude: choicePositionRdv.latitude,
        conversationId: route.params.conversationId,
        date: dayjs(date).format("YYYY-MM-DDTHH:mm"),
      }),
    });
    const data = await response.json();
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.goLeftContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.buttonLeft}
        >
          <AntDesign
            name="left"
            size={24}
            color="#965A51"
            style={styles.goBack}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.containerRadius}>
        <MapView
          zoomEnabled={true}
          initialRegion={{
            latitude: 48.88,
            longitude: 2.3,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0222,
          }}
          style={styles.map}
          onLongPress={(action) => getMarker(action.nativeEvent.coordinate)}
          // disabled={disabled}
        >
          {choicePositionRdv && (
            <Marker coordinate={choicePositionRdv} pinColor="#78010bff" />
          )}
        </MapView>
      </View>
      {/* <MobileDateTimePicker /> */}
      <View style={styles.containerCalendar}>
        <Text style={styles.textRdv}> Rendez-vous le</Text>

        <Text style={styles.text} onPress={showDate}>
          {`${("0" + date.getDate()).slice(-2)}/${(
            "0" + Number(date.getMonth() + 1)
          ).slice(-2)}/${date.getFullYear()}`}
        </Text>
        <Text style={styles.textRdv}>à</Text>
        <Text style={styles.text} onPress={showTime}>
          {`${("0" + date.getHours()).slice(-2)}:${(
            "0" + date.getMinutes()
          ).slice(-2)}`}
        </Text>
      </View>
      {visible && (
        <DateTimePicker value={date} mode={mode} onChange={dateChange} />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addRdv();
        }}
        // disabled={disabled}
      >
        <Text style={styles.boutonText}>VALIDER</Text>
      </TouchableOpacity>
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
  containerRadius: {
    height: "70%",
    width: "90%",
    borderRadius: 30,
    overflow: "hidden",
    boxShadow: "0 2px 3px #896761",
  },
  map: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 15,
    boxShadow: "0 2px 3px #896761",
    // width: width * 0.7,
    backgroundColor: "#965a51c0",
    marginHorizontal: 70,
    marginTop: 40,
    width: "70%",
  },
  boutonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#F5EBE6",
  },
  containerCalendar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 3,
    marginTop: 20,
    width: "90%",
    height: "8%",
    // gap: 9,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    borderColor: "#965a51c0",
    backgroundColor: "#F5EBE6",
    boxShadow: "0 1px 2px #896761",
    color: "#965a51c0",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
  },
  textRdv: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#965a51c0",
  },
  goLeftContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "90%",
    height: 50,
  },
  buttonLeft: {
    height: 50,
    width: 50,
    marginLeft: (24 - 50) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
