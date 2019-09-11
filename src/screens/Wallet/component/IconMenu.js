import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import colors from "../../../theme/Colors";
export default class IconMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  Press = () => {
    const { PressItem, data } = this.props;
    PressItem(data);
  };
  render() {
    const { data } = this.props;
    const { title, img, clicked } = data;
    return (
      <TouchableOpacity onPress={this.Press}>
        <View
          style={{
            width: 70,
            height: 70,
            marginBottom: clicked ? 10 : 0,
            paddingTop: 10,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            backgroundColor: colors.white,
            shadowOffset: { height: 2, width: 2 },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.2,
            elevation: 3
          }}
        >
          <Image
            source={img}
            style={{
              width: 32,
              height: 32,
              marginBottom: 5,
              flex: 1,
              resizeMode: "cover"
            }}
          />
          <Text style={Styles.caption}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const Styles = StyleSheet.create({
  caption: {
    fontFamily: "Gothic A1",
    fontWeight: "600",
    fontSize: 10,
    color: "black",
    textAlign: "center"
  },
  subCaption: {
    fontFamily: "Gothic A1",
    fontWeight: "500",
    fontSize: 15,
    color: "black",
    textAlign: "center"
  },
  content: {
    fontFamily: "Gothic A1",
    fontSize: 15,
    fontWeight: "100",
    color: colors.darkblue,
    textAlign: "center"
  }
});
