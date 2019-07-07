import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import colors from "../theme/Colors";
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
    const { title, img } = data;

    return (
      <TouchableOpacity onPress={this.Press}>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            backgroundColor: colors.white,
            shadowOffset: { height: 2, width: 2 },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.2
          }}
        >
          <Image
            source={img}
            style={{
              width: 50,
              height: 50,
              marginBottom: 10,
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
    fontFamily: "Graphik",
    fontWeight: "600",
    fontSize: 10,
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