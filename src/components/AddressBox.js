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

export default class AddressBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      A1: "",
      A2: "",
      A3: "",
      A4: ""
    };
  }
  render() {
    const { label } = this.props;
    const { onChangeA1, onChangeA2, onChangeA3, onChangeA4 } = this.props;
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
            display: "flex",

            flexDirection: "column",
            paddingLeft: "5%",
            paddingRight: "5%",
            paddingTop: 20,
            paddingBottom: 30,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.cardborder,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <TextInput
            style={{
              width: "100%",
              fontSize: 15,
              borderBottomColor: colors.grey,
              borderBottomWidth: 1,
              marginBottom: 10
            }}
            onChangeText={text => {
              this.setState({ A1: text });
              onChangeA1(text);
            }}
            value={this.state.A1}
            placeholder={placeholder}
          />
          <TextInput
            style={{
              width: "100%",
              fontSize: 15,
              borderBottomColor: colors.grey,
              borderBottomWidth: 1,
              marginBottom: 10
            }}
            onChangeText={text => {
              this.setState({ A2: text });
              onChangeA2(text);
            }}
            value={this.state.A2}
            placeholder={placeholder}
          />
          <TextInput
            style={{
              width: "100%",
              fontSize: 15,
              borderBottomColor: colors.grey,
              borderBottomWidth: 1,
              marginBottom: 10
            }}
            onChangeText={text => {
              this.setState({ A3: text });
              onChangeA3(text);
            }}
            value={this.state.A3}
            placeholder={placeholder}
          />
          <TextInput
            style={{
              width: "100%",
              fontSize: 15,
              borderBottomColor: colors.grey,
              borderBottomWidth: 1,
              marginBottom: 10
            }}
            onChangeText={text => {
              this.setState({ A4: text });
              onChangeA4(text);
            }}
            value={this.state.A4}
            placeholder={placeholder}
          />
        </View>
      </View>
    );
  }
}
