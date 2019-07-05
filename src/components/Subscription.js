import React, { Component } from "react";
import { View, TextInput, Image, StyleSheet, Text } from "react-native";

class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: require("../assets/packages/Product_Icons/cycle.png")
    };
  }
  componentDidMount() {
    const { pkgName } = this.props;
    let url = "";
    switch (pkgName) {
      case "Happy Cycling Pack":
        url = require("../assets/packages/Product_Icons/cycle.png");
        break;
      case "Health & Fitness Pack":
        url = require("../assets/packages/Product_Icons/health.png");
        break;
      case "Membership Pack":
        url = require("../assets/packages/Product_Icons/membership.png");
        break;
      case "Pet Friendly Renting Pack":
        url = require("../assets/packages/Product_Icons/pet.png");
        break;
      case "Serviced Home Pack":
        url = require("../assets/packages/Product_Icons/home.png");
        break;
      case "Silver Renter Pack":
        url = require("../assets/packages/Product_Icons/renter.png");
        break;
      case "Gold Renter Pack":
        url = require("../assets/packages/Product_Icons/gold.png");
        break;
    }
    this.setState({ url: url });
  }
  render() {
    const { url } = this.state;
    const { price, pkgName, img } = this.props;
    return (
      <View style={styles.Section}>
        <Image source={url} style={{ width: 50, height: 50 }} />
        <Text style={styles.pkgTitle}>{pkgName}</Text>
        <View style={styles.price}>
          <Text style={styles.pkgPrice}>£{price}</Text>
          <Text>per month</Text>
        </View>
      </View>
    );
  }
}
export default Subscription;
const styles = StyleSheet.create({
  Section: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  price: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  pkgTitle: {
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    fontSize: 22,
    textAlign: "center",
    color: "#152439"
  },
  pkgPrice: {
    fontSize: 18,
    textAlign: "center",
    color: "#152439"
  }
});
