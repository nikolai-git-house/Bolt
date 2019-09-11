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
import styles from "react-native-phone-input/lib/styles";
import { Metrics } from "../theme";
const pet_img = require("../assets/packages/pets.png");
const heart_img = require("../assets/packages/heart.png");
const send_img = require("../assets/packages/send.png");
const isIPhoneX = Metrics.screenHeight >= 812 ? true : false;
export default class PackCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { data } = this.props;
    const {
      active,
      img_name,
      caption,
      subcaption_1,
      subcaption_2,
      contents,
      footer_1,
      footer_2
    } = data;
    let url = "";
    switch (img_name) {
      case "Happy Cycling Pack.png":
        url = require("../assets/Explore/packages/bike.jpg");
        break;
      case "Health & Fitness Pack.png":
        url = require("../assets/Explore/packages/health.jpg");
        break;
      case "Membership Pack.png":
        url = require("../assets/Explore/packages/membership.jpg");
        break;
      case "Pet Friendly Renting Pack.png":
        url = require("../assets/Explore/packages/pet.jpg");
        break;
      case "Serviced Home Pack.png":
        url = require("../assets/Explore/packages/home.jpg");
        break;
      case "Silver Renter Pack.png":
        url = require("../assets/Explore/packages/silver.jpg");
        break;
      case "Gold Renter Pack.png":
        url = require("../assets/Explore/packages/gold.jpg");
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
          padding: 10,
          backgroundColor: colors.white,
          shadowOffset: { height: 2, width: 2 },
          shadowColor: colors.darkblue,
          shadowOpacity: 0.2,
          elevation: 3
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            source={url}
            style={{
              width: 280,
              height: 100,
              marginBottom: 10
            }}
          />
          <Text style={Styles.caption}>{caption}</Text>
        </View>
        <Text style={Styles.subCaption}>
          {subcaption_1 + "\n" + subcaption_2}
        </Text>
        <View
          style={{
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center"
          }}
        >
          {contents.map((item, index) => {
            return (
              <Text style={Styles.content} key={index}>
                -{item}
              </Text>
            );
          })}
        </View>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around"
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.darkblue,
              width: "40%",
              padding: 5
            }}
          >
            <Text style={{ fontWeight: "500", fontSize: 14 }}>
              {footer_1} cost
            </Text>
            <Text>per month</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.darkblue,
              width: "40%",
              padding: 5
            }}
          >
            <Text style={{ fontWeight: "500", fontSize: 14 }}>
              Save {footer_2}+
            </Text>
            <Text>per month</Text>
          </View>
        </View>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  caption: {
    fontFamily: "Helvetica",
    fontWeight: "600",
    fontSize: isIPhoneX ? 20 : 17,
    color: "black",
    textAlign: "center"
  },
  subCaption: {
    fontFamily: "Gothic A1",
    fontWeight: "500",
    fontSize: isIPhoneX ? 15 : 13,
    color: "black",
    width: "100%",
    textAlign: "center"
  },
  content: {
    fontFamily: "Gothic A1",
    fontSize: isIPhoneX ? 14 : 12,
    fontWeight: "300",
    color: "black",
    margin: 2
  }
});
