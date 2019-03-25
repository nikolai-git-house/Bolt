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

export default class Populated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }
  render() {
    const { label } = this.props;
    const { imgsrc } = this.props;
    const { content } = this.props;
    const { type } = this.props;
    const { a1, a2, a3, a4 } = this.props;
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
            width: 300,
            marginBottom: 10,
            textAlign: "center"
          }}
        >
          {label}
        </Text>
        {type == "single" && (
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
              justifyContent: "space-between",
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
            <TextInput
              style={{
                width: "100%",
                height: "100%",
                paddingLeft: 20,
                paddingRight: 20,
                fontSize: 17
              }}
              editable={false}
              value={content}
            />
          </View>
        )}
        {type == "multi" && (
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
              editable={false}
              value={a1}
            />
            <TextInput
              style={{
                width: "100%",
                fontSize: 15,
                borderBottomColor: colors.grey,
                borderBottomWidth: 1,
                marginBottom: 10
              }}
              editable={false}
              value={a2}
            />
            <TextInput
              style={{
                width: "100%",
                fontSize: 15,
                borderBottomColor: colors.grey,
                borderBottomWidth: 1,
                marginBottom: 10
              }}
              editable={false}
              value={a3}
            />
            <TextInput
              style={{
                width: "100%",
                fontSize: 15,
                borderBottomColor: colors.grey,
                borderBottomWidth: 1,
                marginBottom: 10
              }}
              editable={false}
              value={a4}
            />
          </View>
        )}
      </View>
    );
  }
}
