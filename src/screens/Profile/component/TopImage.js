import React, { Component } from "react";
import { StyleSheet, Image } from "react-native";
import colors from "../../../theme/Colors";

export default class TopImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { screen } = this.props;
    return (
      <Image
        source={
          screen === "Personal" || screen === "Pets"
            ? require("../../../assets/main/top_bar.png")
            : require("../../../assets/top_bar.png")
        }
        style={[
          Styles.imgContainer,
          { height: screen === "Personal" || screen === "Pets" ? 250 : 100 }
        ]}
      />
    );
  }
}
const Styles = StyleSheet.create({
  imgContainer: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0
  }
});
