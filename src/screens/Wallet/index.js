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

const backgroundColor = "#0067a7";

export default class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          width: "100%",
          height: Metrics.screenHeight,
          alignItems: "center",
          backgroundColor: colors.lightgrey
        }}
      >
        <Logo />
      </View>
    );
  }
}
