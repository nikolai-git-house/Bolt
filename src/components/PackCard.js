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
const pet_img = require("../assets/packages/pets.png");
const heart_img = require("../assets/packages/heart.png");
const send_img = require("../assets/packages/send.png");
export default class PackCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props;
    const {
      img_name,
      caption,
      subcaption_1,
      subcaption_2,
      contents,
      footer_1,
      footer_2
    } = data;
    let url = require("../assets/packages/member.png");
    switch (img_name) {
      case "member.png":
        url = require("../assets/packages/member.png");
        break;
      case "home.png":
        url = require("../assets/packages/home.png");
        break;
      case "pets.png":
        url = require("../assets/packages/pets.png");
        break;
    }
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          textAlign: "center",
          padding: 20,
          backgroundColor: colors.yellow,
          shadowOffset: { height: 2, width: 2 },
          shadowColor: colors.darkblue,
          shadowOpacity: 0.2
        }}
      >
        <View
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <TouchableOpacity>
            <Image source={heart_img} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={send_img} style={{ width: 32, height: 32 }} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -40
          }}
        >
          <Image
            source={url}
            style={{ width: 80, height: 80, marginBottom: 10 }}
          />
          <Text style={Styles.caption}>{caption}</Text>
        </View>
        <Text style={Styles.subCaption}>
          {subcaption_1 + "\n" + subcaption_2}
        </Text>
        <View>
          {contents.map(item => {
            return (
              <Text style={Styles.content} key={item.key}>
                {item}
              </Text>
            );
          })}
        </View>
        <Text style={Styles.subCaption}>{footer_1 + "\n" + footer_2}</Text>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  caption: {
    fontFamily: "Graphik",
    fontWeight: "600",
    fontSize: 20,
    color: "black",
    textAlign: "center"
  },
  subCaption: {
    fontFamily: "Graphik",
    fontWeight: "500",
    fontSize: 15,
    color: "black",
    textAlign: "center"
  },
  content: {
    fontFamily: "Graphik",
    fontSize: 15,
    fontWeight: "100",
    color: colors.darkblue,
    textAlign: "center"
  }
});
