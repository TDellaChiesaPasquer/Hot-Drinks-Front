import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useDispatch } from "react-redux";
import { setAnswer, toggleStar } from "../reducers/user";

export default functionDropdownComponent = (props) => {
  const [value, setValue] = useState(null);
  const [isImportant, setIsImportant] = useState(props.star && false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (props.value !== undefined && props.value !== null) {
      setValue(props.value);
    } else {
      setValue(null);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.star !== undefined && props.star !== null) {
      setIsImportant(props.star);
    } else {
      setIsImportant(false);
    }
  }, [props.star]);

  const handleImportanceClick = () => {
    const next = !isImportant;
    setIsImportant(next);
    dispatch(toggleStar({ category: props.questionId, star: next }));
  };
  //_____________________________________ affiche la question au dessus du dropdown quand reponse selectionnée
  const renderLabel = () => {
    if (value) {
      return <Text style={styles.label}>{props.question}</Text>;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.row}>
        <View style={styles.dropdownCol}>
          {renderLabel()}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            placeholder={value ? "" : props.question}
            iconStyle={styles.iconStyle}
            data={props.options}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={value}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={(item) => {
              setValue(item.value);
              dispatch(
                setAnswer({
                  category: props.questionId,
                  label: props.question,
                  value: item.value,
                })
              );
              setIsOpen(false);
            }}
            renderRightIcon={() => (
              <Entypo
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color="#F5EBE6"
              />
            )}
            containerStyle={styles.menuContainer}
            itemContainerStyle={styles.itemContainer}
            itemTextStyle={styles.itemText}
            activeColor="#EFD0CC"
            showsVerticalScrollIndicator={false}
            dropdownPosition="auto"
          />
        </View>
        <TouchableOpacity
          onPress={() => handleImportanceClick()}
          style={styles.starColoumn}
          disabled={!value}
        >
          <Entypo
            // style={styles.stars}
            name="star"
            size={20}
            color={isImportant ? "#FFA500" : "black"}
            // onPress={() => handleImportanceClick()}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginHorizontal: 16,
    marginTop: 22,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  dropdownCol: {
    flex: 1,
  },

  dropdown: {
    height: 48,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#965a51c0",
    backgroundColor: "#965a51c0",
    paddingHorizontal: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#F5EBE6",
    fontWeight: 600,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#F5EBE6",
    fontWeight: 600,
  },

  inputSearchStyle: {
    height: 40,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  starColoumn: {
    width: 44,
    height: 48,
    marginLeft: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  //______________________________________STYLE DU MENU DEROULANT
  menuContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C9AFA7",
    backgroundColor: "#F7ECE6",
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  itemContainer: {
    // paddingVertical: 5,
    paddingHorizontal: 10,
  },

  itemText: {
    color: "#6A3B36",
    fontSize: 15,
  },

  //_____________________________STYLE QUESTION QUAND REPONSE SELECTIONNEE
  label: {
    position: "absolute",
    top: -5,
    left: 14,
    paddingHorizontal: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    color: "#6A3B36",
    backgroundColor: "#EFD9CC",
    zIndex: 1,
  },
});
