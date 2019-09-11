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

export default class TopImage extends React.Component {
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
    height: 100,
    position: "absolute",
    top: 0,
    left: 0
  }
});
