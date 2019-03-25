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
      <View style={Styles.logoContainer}>
        <Image
          style={{ width: 75, height: 30 }}
          source={require("../assets/logo.png")}
        />
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  logoContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});
