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

import Personal from "./Personal";
import Home from "./Home";
import Membership from "./Membership";
import ProfileTest from "../ChatBot/ProfileTest";
import ProfileSuccess from "../ChatBot/ProfileSuccess";
import Part2 from "../ChatBot/Part2";
export default createStackNavigator(
  {
    Personal: {
      screen: Personal
    },
    Home: {
      screen: Home
    },
    Membership: Membership,
    ProfileTest: ProfileTest,
    ProfileSuccess: ProfileSuccess,
    Part2: Part2
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

// export default StackNavigator;
