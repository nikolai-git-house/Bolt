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
        <View>
          <Image
            source={require("../assets/concierge3.png")}
            style={{ width: 40, height: 42, marginRight: 5 }}
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
            shadowOpacity: 0.2
          }}
        >
          <Text style={{ fontFamily: "Graphik", fontSize: 17, color: "#555" }}>
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
    fontFamily: "Graphik",
    fontWeight: "600",
    marginBottom: 10
  },
  name: {
    fontSize: 25,
    fontWeight: "600",
    color: colors.hotpink,
    fontFamily: "Graphik",
    marginBottom: 10
  }
});
