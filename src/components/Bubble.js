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
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { message } = this.props;
    const { messageType } = this.props;
    const { name } = this.props;
    const { time } = this.props;
    const text =
      messageType == "robot" ? "Concierge\n" + message : name + "\n" + message;
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
          marginBottom: 40
        }}
      >
        {messageType === "man" && (
          <View style={{ justifyContent: "flex-end" }}>
            <Image
              source={require("../assets/avatar.png")}
              style={{ width: 40, height: 40 }}
            />
          </View>
        )}
        <View
          style={{
            flex: 8,
            display: "flex",
            flexDirection: "row",
            textAlign: "left",
            backgroundColor: colors.white,
            padding: 15,
            borderRadius: 14,
            shadowOffset: { height: 1, width: 1 },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.2,
            elevation: 3,
            marginRight: 5
          }}
        >
          <View style={{ flex: 6 }}>
            {messageType === "man" && <Text style={Styles.name}>{name}</Text>}
            <Text style={{ fontFamily: "Graphik" }}>{message}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={{ fontFamily: "Graphik" }}>{time}</Text>
          </View>
        </View>
        {messageType === "robot" && (
          <View style={{ justifyContent: "flex-end" }}>
            <Image
              source={require("../assets/concierge.png")}
              style={{ width: 40, height: 42 }}
            />
          </View>
        )}
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
