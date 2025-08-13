import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

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
    console.log("hello");
    if (!Marker && !date) {
      return;
    }
    console.log(route.params.conversationId);
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
    console.log("ici");
    const data = await response.json();
    console.log(data);
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.text} onPress={showDate}>
          {`${("0" + date.getDate()).slice(-2)}/${(
            "0" + Number(date.getMonth() + 1)
          ).slice(-2)}/${date.getFullYear()}`}
        </Text>
        <Text style={styles.text} onPress={showTime}>
          {`${("0" + date.getHours()).slice(-2)}:${(
            "0" + date.getMinutes()
          ).slice(-2)}`}
        </Text>
        {visible && (
          <DateTimePicker value={date} mode={mode} onChange={dateChange} />
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addRdv();
        }}
        // disabled={disabled}
      >
        <Text style={styles.boutonText}>VALIDER</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EBE6",
    alignItems: "center",
  },
  containerRadius: {
    height: "65%",
    width: "80%",
    backgroundcolor: "red",
    borderRadius: 25,
  },
  map: {
    // height: "65%",
    // width: "80%",
    // marginHorizontal: 20,
    // marginTop: 5,
    // alignItems: "center",
    // justifyContent: "center",
    // boxShadow: "0 2px 3px #896761",
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
    marginTop: 30,
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
    justifyContent: "space-around",
    // backgroundColor: "#fc5400ff",
    padding: 3,
    marginTop: 20,
    width: "80%",
    height: "11%",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    borderColor: "#965a51c0",
    boxShadow: "0 2px 3px #896761",
    color: "#965a51c0",
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
  },
});
