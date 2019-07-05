import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import colors from "../theme/Colors";

export default class Bubble extends React.Component {
  render() {
    return (
      <Image
        source={require("../assets/top_bar.png")}
        style={Styles.imgContainer}
      />
    );
  }
}
const Styles = StyleSheet.create({
  imgContainer: {
    width: "100%",
    position: "absolute",
    height: 160,
    position: "absolute",
    top: 0,
    left: 0
  }
});
