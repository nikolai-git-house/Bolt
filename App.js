/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { Provider } from "react-redux";
import store from "./src/Redux";

import LogoScreen from "./src/screens/LogoScreen";
import AppContainer from "./route";
import Landing from "./src/screens/Landing";
import Onboarding from "./src/screens/ChatBot/Onboarding";
import IntroOne from "./src/screens/Intro/IntroOne";
import IntroTwo from "./src/screens/Intro/IntroTwo";
import IntroThree from "./src/screens/Intro/IntroThree";
import IntroFour from "./src/screens/Intro/IntroFour";
import Onboard from "./src/screens/Intro/Onboard";
import ProfileTest from "./src/screens/ChatBot/ProfileTest";
import ProfileSuccess from "./src/screens/ChatBot/ProfileSuccess";
import Part2 from "./src/screens/ChatBot/Part2";
import Concierge from "./src/screens/Concierge";
import Explore from "./src/screens/Explore";
import colors from "./src/theme/Colors";
import SignIn from "./src/screens/SignIn/SignIn";
import PhoneCode from "./src/screens/SignIn/PhoneCode";
const StackNavigator = createAppContainer(
  createStackNavigator(
    {
      Logo: LogoScreen,
      Explore: Explore,
      SignIn: SignIn,
      PhoneCode: PhoneCode,
      ProfileSuccess: ProfileSuccess,
      Main: AppContainer,
      Part2: Part2,
      ProfileTest: ProfileTest,
      Landing: Landing,
      Onboard: Onboard,
      IntroOne: IntroOne,
      Onboarding: Onboarding,
      IntroFour: IntroFour,
      IntroThree: IntroThree,
      IntroTwo: IntroTwo,
      Part2: Part2
    },
    {
      headerMode: "none",
      navigationOptions: {
        headerVisible: false
      }
    }
  )
);

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    );
  }
}

// export default StackNavigator;

const Styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
