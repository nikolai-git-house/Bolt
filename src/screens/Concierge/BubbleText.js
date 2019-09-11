import React, { Component } from "react";
import { View, Image, Text, Animated, Easing, StyleSheet } from "react-native";
import Sound from "react-native-sound";
import styled from "styled-components";
import colors from "../../theme/Colors";
import * as Animatable from "react-native-animatable";
// const Bubble = styled.View`
//   box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.2);
//   padding: 10px;
//   border-radius: 10px;
//   background-color: #fff;
// `;
var bamboo = new Sound("bamboo.mp3", Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log("failed to load the sound", error);
    return;
  }
});
bamboo.setVolume(0.5);
class BubbleText extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.loadinganimatedValue = new Animated.Value(0);
    this.state = {
      typing: props.typing
    };
  }

  componentDidMount() {
    const { typing, message } = this.props;
    this.setState({ typing: typing });
    if (message.message && message.type === "agency") bamboo.play();
  }
  render() {
    let { typing } = this.state;
    const { message } = this.props;
    const animatedStyle = { transform: [{ scale: this.animatedValue }] };
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: message.type === "user" ? "flex-end" : "flex-start",
          marginTop: 8,
          marginBottom: 8
        }}
      >
        {message.type === "agency" && (
          <View style={styles.avatar}>
            <Image
              source={require("../../assets/onboarding/concierge3.png")}
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                resizeMode: "contain"
              }}
            />
          </View>
        )}
        {typing && message.type === "agency" && (
          <Animatable.View
            animation="fadeInLeft"
            duration={400}
            style={{ flexDirection: "row" }}
          >
            <Image
              source={require("../../assets/typing.gif")}
              style={{
                width: 63,
                height: 50
              }}
            />
          </Animatable.View>
        )}
        {(!typing || message.type === "user") && (
          <View
            style={message.type === "user" ? styles.userbubble : styles.bubble}
          >
            <Text
              style={
                message.type === "user"
                  ? styles.userbubble_text
                  : styles.bubble_text
              }
            >
              {message.message}
            </Text>
          </View>
        )}
        {message.type === "user" && (
          <View style={styles.avatar}>
            <Image
              source={require("../../assets/avatar.png")}
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                resizeMode: "contain"
              }}
            />
          </View>
        )}
      </View>
    );
  }
}
export default BubbleText;
const styles = StyleSheet.create({
  bubble: {
    alignSelf: "flex-start",
    maxWidth: "80%",
    padding: 16,
    marginRight: 10,
    borderRadius: 14,
    backgroundColor: "#fff",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  bubble_text: {
    fontFamily: "Gothic A1",
    fontWeight: "300",
    lineHeight: 20,
    color: "#555",
    fontSize: 16
  },
  userbubble: {
    alignSelf: "flex-start",
    maxWidth: "80%",
    padding: 16,
    marginRight: 0,
    borderRadius: 14,
    backgroundColor: colors.yellow,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  userbubble_text: {
    fontFamily: "Gothic A1",
    fontWeight: "300",
    lineHeight: 20,
    color: colors.darkblue,
    fontSize: 17
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  }
});
