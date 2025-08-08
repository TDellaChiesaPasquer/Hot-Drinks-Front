import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

export default functionDropdownComponent = (props) => {
  const [value, setValue] = useState(null);
  const [isImportant, setIsImportant] = useState(false);

  const handleImportanceClick = () => {
    setIsImportant(!isImportant);
  };

  let stars = (
    <Entypo
      style={styles.stars}
      name="star"
      size={20}
      color={isImportant ? "#f1c40f" : "black"}
      onPress={() => handleImportanceClick()}
    />
  );

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        placeholder={props.question}
        iconStyle={styles.iconStyle}
        data={props.options}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={value}
        onChange={(item) => {
          setValue(item.value);
        }}
      />
      {stars}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    // flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F5EBE6",
  },

  dropdown: {
    marginRight: 80,
    marginLeft: 15,
    marginBottom: 15,
    marginTop: 15,
    height: 30,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    padding: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  stars: {
    justifyContent: "flex-end",
    marginLeft: 380,
  },
});
