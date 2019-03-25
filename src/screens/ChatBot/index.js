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
import { createAppContainer, createStackNavigator } from "react-navigation";

import Onboarding from "./Onboarding";
import InfoGuideHome from "./InfoGuideHome";

const StackNavigator = createAppContainer(
  createStackNavigator({
    Onboarding: Onboarding,
    InfoGuideHome: InfoGuideHome,
    Question1: Question1
  })
);

// export default StackNavigator;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let tabBarLabel = "Profile";
    let tabBarIcon = () => (
      <Image
        source={require("../../assets/profile.png")}
        style={{ width: 26, height: 26 }}
      />
    );
    return { tabBarLabel, tabBarIcon };
  };

  render() {
    return <StackNavigator />;
  }
}
