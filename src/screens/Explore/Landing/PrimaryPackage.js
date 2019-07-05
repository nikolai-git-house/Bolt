import React, { Component } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import colors from "../../../theme/Colors";
let img = require("../../../assets/packages/home.png");
export const PrimaryPackage = props => {
  console.log("style", style);
  const style = props.style;
  switch (style) {
    case "bolt":
      img = require("../../../assets/packages/home.png");
      break;
    case "redeem":
      img = require("../../../assets/packages/vip.png");
      break;
    case "social":
      img = require("../../../assets/packages/social.png");
      break;
    default:
      img = require("../../../assets/packages/home.png");
  }
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: colors.white,
        padding: 5,
        margin: 5
      }}
    >
      <Image source={img} style={{ width: 60, height: 60 }} />
      <TouchableOpacity
        style={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.yellow,
          width: 150,
          height: 40,
          borderRadius: 20
        }}
        onPress={props.onPress}
      >
        <Text>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default PrimaryPackage;
