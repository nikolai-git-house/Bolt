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

import Main from "./Main";
import Pack from "./Pack";
import Purchase from "./Purchase";

export default createStackNavigator(
  {
    Main: {
      screen: Main
    },
    Pack: {
      screen: Pack
    },
    Purchase: {
      screen: Purchase
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

// export default StackNavigator;
