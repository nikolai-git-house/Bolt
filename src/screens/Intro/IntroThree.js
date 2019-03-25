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
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";
import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import { Metrics } from "../../theme";
import Circle from "../../components/Circle";
import TextBubble from "../../components/TextBubble";

export default class IntroOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onSwipeLeft = gestureState => {
    console.log("swipe left");
    this.props.navigation.navigate("IntroFour");
  };

  onSwipeRight = gestureState => {
    console.log("swipe right");

    this.props.navigation.goBack();
  };
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
      <GestureRecognizer
        onSwipeLeft={state => this.onSwipeLeft(state)}
        onSwipeRight={state => this.onSwipeRight(state)}
        config={config}
      >
        <View style={styles.maincontainer}>
          <Logo />
          <Image
            source={require("../../assets/onboarding/set3.png")}
            style={{ width: 250, height: 100, marginTop: 20 }}
          />
          <View style={styles.subcontainer}>
            <View
              style={{
                flex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center"
              }}
            >
              <TextBubble message="Unlock amazing packages..." />
              <TextBubble message="Save hundreds of pounds each month on life changing offers,terms, cover & VIP treatment" />
            </View>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                width: "70%"
              }}
            >
              <Circle color={colors.white} />
              <Circle color={colors.white} />
              <Circle color={colors.yellow} />
              <Circle color={colors.white} />
            </View>
          </View>
          <Image
            source={require("../../assets/onboarding/rocket.gif")}
            style={{ width: "100%", height: 200 }}
          />
        </View>
      </GestureRecognizer>
    );
  }
}
const styles = StyleSheet.create({
  caption: {
    width: 280,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowOffset: { height: 5, width: 5 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  subcaption: {
    fontSize: 15,
    textAlign: "center"
  },
  containter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40
  },
  maincontainer: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: colors.lightgrey
  },
  subcontainer: {
    width: "75%",
    height: Metrics.screenHeight - 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});
