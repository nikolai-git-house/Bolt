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

export default class InputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
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
            backgroundColor: colors.white,
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "center",
            shadowOffset: { height: 1, width: 1 },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.2
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
          <TextInput
            style={{
              width: 240,
              height: 40,
              paddingLeft: 20,

              fontSize: 17,
              borderRadius: 14,
              backgroundColor: colors.white
            }}
            onChangeText={text => {
              this.setState({ text: text });
              onChange(text);
            }}
            value={this.state.text}
            placeholder={placeholder}
          />
        </View>
      </View>
    );
  }
}
