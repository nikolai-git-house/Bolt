import React, { Component } from "react";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import { Image } from "react-native";
import Concierge from "./src/screens/Concierge";
import Diary from "./src/screens/Diary";
import Explore from "./src/screens/Explore";
import Profile from "./src/screens/Profile";
import Wallet from "./src/screens/Wallet";
import PersonalProfile from "./src/screens/Profile/Personal";
import HomeProfile from "./src/screens/Profile/Home";
import GroupProfile from "./src/screens/Profile/Group";

const profile_img = require("./src/assets/profile.png");
const explore_img = require("./src/assets/explore.png");
const concierge_img = require("./src/assets/concierge.png");
const diary_img = require("./src/assets/diary.png");
const wallet_img = require("./src/assets/wallet.png");
let routeConfigs = {
  Concierge: {
    screen: Concierge,
    navigationOptions: ({ navigation }) => {
      let tabBarLabel = "Concierge";
      let tabBarIcon = () => (
        <Image source={concierge_img} style={{ width: 28, height: 36 }} />
      );
      let tabBarOnPress = () => {
        navigation.navigate("Concierge");
      };
      return { tabBarLabel, tabBarIcon, tabBarOnPress };
    }
  },
  Explore: {
    screen: Explore,
    navigationOptions: ({ navigation }) => {
      let tabBarLabel = "Explore";
      let tabBarIcon = () => (
        <Image source={explore_img} style={{ width: 28, height: 28 }} />
      );
      return { tabBarLabel, tabBarIcon };
    }
  },

  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      let tabBarLabel = "Profile";
      let tabBarIcon = () => (
        <Image source={profile_img} style={{ width: 28, height: 28 }} />
      );

      return { tabBarLabel, tabBarIcon };
    }
  }

  // Diary: {
  //   screen: Diary,
  //   navigationOptions: ({ navigation }) => {
  //     let tabBarLabel = "Diary";
  //     let tabBarIcon = () => (
  //       <Image source={diary_img} style={{ width: 26, height: 26 }} />
  //     );
  //     return { tabBarLabel, tabBarIcon };
  //   }
  // },
  // Wallet: {
  //   screen: Wallet,
  //   navigationOptions: ({ navigation }) => {
  //     let tabBarLabel = "Wallet";
  //     let tabBarIcon = () => (
  //       <Image source={wallet_img} style={{ width: 26, height: 26 }} />
  //     );
  //     return { tabBarLabel, tabBarIcon };
  //   }
  // }
};
let tabNavigatorConfig = {
  tabBarPosition: "bottom",
  animationEnabled: true,
  swipeEnabled: true,
  tabBarOptions: {
    showLabel: true,
    activeTintColor: "grey",
    style: { backgroundColor: "#f0eff5", height: 60 }
  },
  lazy: true
};
const AppContainer = createAppContainer(
  createBottomTabNavigator(routeConfigs, tabNavigatorConfig)
);

export default AppContainer;
