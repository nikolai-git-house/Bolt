import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ScrollView
} from "react-native";
import colors from "../../../theme/Colors";
import { Metrics } from "../../../theme/Metrics";

//let img = require("../../../assets/Bike/avatar.jpg");
const down_arrow_img = require("../../../assets/Explore/down-arrow.png");
export const SecondaryPackage = props => {
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
      <Image source={props.img} style={{ width: "50%", height: 70 }} />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: 150
        }}
      >
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text style={{ color: colors.darkblue }}>{props.title}</Text>
          <Text>{props.subTitle}</Text>
        </View>
        <TouchableOpacity
          style={{
            borderRadius: 20,
            borderWidth: 1,
            padding: 2,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            elevation: 3
          }}
          onPress={props.onPress}
        >
          <Image source={down_arrow_img} style={{ width: 15, height: 15 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SecondaryPackage;
