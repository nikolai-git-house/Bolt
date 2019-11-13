import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import colors from "../../../theme/Colors";
import Metrics from "../../../theme/Metrics";
import { getStringfromSeconds } from "../../../utils/functions";
class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible
    };
  }
  render() {
    const { img, ticket, toggleTicket } = this.props;
    return (
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: Metrics.screenWidth,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            height: 60,
            backgroundColor: colors.white,
            borderRadius: 5,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            elevation: 3
          }}
          onPress={toggleTicket}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <Image style={styles.imageContainer} source={img} />
            <Text style={{ fontSize: 16 }}>{title}</Text>
          </View>
          <Text style={{ fontSize: 14 }}>{getStringfromSeconds(time)}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    width: 50,
    height: 50,
    overflow: "hidden"
  },
  button: {
    width: 100,
    height: 35,
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 2,
    marginBottom: 2
  }
});
export default Note;
