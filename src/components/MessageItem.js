import React, { Component } from "react";
import { View, Image, Text, Animated, Easing, StyleSheet } from "react-native";
import Sound from "react-native-sound";
import styled from "styled-components";
import colors from "../theme/Colors";
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

class MessageItem extends React.Component {
  constructor(props) {
    console.log("MessageItem");
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.loadinganimatedValue = new Animated.Value(0);
    this.state = {
      flag: 0,
      avatar_url: props.avatar_url
    };
  }

  componentDidMount() {
    const { message } = this.props;
    this.handleloadingAnimation();
    setTimeout(
      () => {
        this.setState({ flag: 1 });
        this.handleAnimation();
        bamboo.play();
      },
      message.type === "user" ? 0 : 1000
    );
  }
  handleAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 250
    }).start();
  };
  handleloadingAnimation = () => {
    Animated.timing(this.loadinganimatedValue, {
      toValue: 1,
      duration: 250
    }).start();
  };
  render() {
    let { fadeAnim, flag, avatar_url } = this.state;
    const { message } = this.props;
    const animatedStyle = { transform: [{ scale: this.animatedValue }] };
    const animation = {
      transform: [{ translateX: 10 * this.loadinganimatedValue }]
    };
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
        {message.type === "bot" && (
          <View style={styles.avatar}>
            <Image
              source={require("../assets/onboarding/concierge3.png")}
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                resizeMode: "contain"
              }}
            />
          </View>
        )}
        {flag === 0 && message.type === "bot" && (
          <Animatable.View
            animation="fadeInLeft"
            duration={400}
            style={{ flexDirection: "row" }}
          >
            <Image
              source={require("../assets/typing.gif")}
              style={{
                width: 63,
                height: 50
              }}
            />
          </Animatable.View>
        )}
        {(flag === 1 || message.type === "user") && (
          <Animated.View
            style={[
              animatedStyle,
              message.type === "user" ? styles.userbubble : styles.bubble
            ]}
          >
            <Text
              style={
                message.type === "user"
                  ? styles.userbubble_text
                  : styles.bubble_text
              }
            >
              {message.text}
            </Text>
          </Animated.View>
        )}
        {message.type === "user" && (
          <View style={styles.avatar}>
            {!avatar_url && (
              <Image
                source={require("../assets/avatar.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 1,
                  resizeMode: "contain"
                }}
              />
            )}
            {avatar_url && (
              <Image source={{ uri: avatar_url }} style={styles.avatar} />
            )}
          </View>
        )}
      </View>
    );
  }
}
export default MessageItem;
const styles = StyleSheet.create({
  bubble: {
    alignSelf: "flex-start",
    maxWidth: "80%",
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
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
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 0
  },
  userbubble: {
    alignSelf: "flex-start",
    maxWidth: "80%",
    padding: 10,
    marginRight: 0,
    borderRadius: 10,
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
    fontSize: 17,
    marginLeft: 5,
    marginBottom: 0
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 3,
    marginRight: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  }
});
