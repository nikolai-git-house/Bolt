import React, { Component } from "react";
import { View, TextInput, Image, StyleSheet, Text } from "react-native";
const ok_img = require("../assets/success.png");
const cross_img = require("../assets/error.png");
class StickItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { value, checked, img } = this.props;
    return (
      <View style={styles.Section}>
        <Image source={img} style={{ width: 20, height: 20 }} />
        <Text style={styles.input}>{value}</Text>
        {checked && <Image source={ok_img} style={{ width: 20, height: 20 }} />}
        {!checked && (
          <Image source={cross_img} style={{ width: 20, height: 20 }} />
        )}
      </View>
    );
  }
}
export default StickItem;
const styles = StyleSheet.create({
  Section: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 4
  },
  input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    width: "100%",
    fontSize: 18,
    backgroundColor: "transparent",
    color: "#424242"
  }
});
