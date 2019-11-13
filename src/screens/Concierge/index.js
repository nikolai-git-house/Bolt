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
import LiveChat from "./LiveChat";
import TravelBooking from "./Travelbooking";
export default createStackNavigator(
  {
    Main: {
      screen: Main
    },
    TravelBooking: {
      screen: TravelBooking
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
