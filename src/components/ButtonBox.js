import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import colors from "../theme/Colors";

export default class ButtonBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.placeholder
    };
  }
  render() {
    const { label } = this.props;
    const { imgsrc } = this.props;
    const { onChange } = this.props;
    const { placeholder } = this.props;
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 25
        }}
      >
        <Text
          style={{
            width: 280,
            marginBottom: 10,
            textAlign: "center"
          }}
        >
          {label}
        </Text>
        <View
          style={{
            width: 280,
            height: 40,
            display: "flex",
            flexDirection: "row",

            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.cardborder,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              borderWidth: 1,
              borderColor: colors.cardborder,
              backgroundColor: colors.darkblue,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image style={{ width: 30, height: 30 }} source={imgsrc} />
          </View>
          <TouchableOpacity
            style={{
              width: 280,
              height: 40,
              marginLeft: -40,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ fontSize: 20, color: colors.grey }}>
              {this.state.text}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
