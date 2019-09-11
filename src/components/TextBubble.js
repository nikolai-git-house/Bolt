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

export default class TextBubble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { message } = this.props;

    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
          marginBottom: 20
        }}
      >
        <View style={Styles.avatar}>
          <Image
            source={require("../assets/onboarding/concierge3.png")}
            style={{
              width: "100%",
              height: "100%",
              flex: 1,
              resizeMode: "contain"
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            textAlign: "left",
            backgroundColor: colors.white,
            padding: 15,
            borderRadius: 14,
            shadowOffset: { height: 1, width: 1 },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.2,
            elevation: 3
          }}
        >
          <Text
            style={{ fontFamily: "Gothic A1", fontSize: 17, color: "#555" }}
          >
            {message}
          </Text>
        </View>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  concierge: {
    fontSize: 20,
    fontFamily: "Gothic A1",
    fontWeight: "600",
    marginBottom: 10
  },
  name: {
    fontSize: 25,
    fontWeight: "600",
    color: colors.hotpink,
    fontFamily: "Gothic A1",
    marginBottom: 10
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    marginTop: -5
  }
});
