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
export default class Circle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { color } = this.props;
    return (
      <View
        style={{
          height: 20,
          width: 20,
          backgroundColor: color,
          borderColor: colors.darkblue,
          borderWidth: 1,
          borderRadius: 20
        }}
      />
    );
  }
}
