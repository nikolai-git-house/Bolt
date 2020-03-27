import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Image} from 'react-native';
import Concierge from './src/screens/Concierge';
import Diary from './src/screens/Diary';
import Explore from './src/screens/Explore';
import Profile from './src/screens/Profile';
import Wallet from './src/screens/Wallet';
import MyHome from './src/screens/MyHome';
import colors from './src/theme/Colors';
import {resetConcierge} from './src/Redux/actions';
const profile_img = require('./src/assets/routing/profile.png');
const explore_img = require('./src/assets/routing/explore.png');
const concierge_img = require('./src/assets/routing/concierge.png');
const community_img = require('./src/assets/routing/community.png');
const home_img = require('./src/assets/routing/home.png');
const diary_img = require('./src/assets/diary.png');
const wallet_img = require('./src/assets/routing/wallet.png');
let routeConfigs = {
  Explore: {
    screen: Explore,
    navigationOptions: ({navigation}) => {
      let tabBarLabel = 'Explore';
      let tabBarIcon = () => (
        <Image source={explore_img} style={{width: 36, height: 36}} />
      );
      return {tabBarLabel, tabBarIcon};
    },
  },
  Wallet: {
    screen: Wallet,
    navigationOptions: ({navigation}) => {
      let tabBarLabel = 'Wallet';
      let tabBarIcon = () => (
        <Image source={wallet_img} style={{width: 36, height: 36}} />
      );
      return {tabBarLabel, tabBarIcon};
    },
  },
  Concierge: {
    screen: Concierge,
    navigationOptions: ({navigation, screenProps}) => {
      let tabBarLabel = 'Concierge';
      let tabBarIcon = () => (
        <Image source={concierge_img} style={{width: 28, height: 36}} />
      );
      let tabBarOnPress = () => {
        screenProps.dispatch(resetConcierge(true));
        navigation.navigate('Concierge');
      };
      return {tabBarLabel, tabBarIcon, tabBarOnPress};
    },
  },
  Home: {
    screen: MyHome,
    navigationOptions: ({navigation}) => {
      let tabBarLabel = 'My Home';
      let tabBarIcon = () => (
        <Image source={home_img} style={{width: 36, height: 36}} />
      );
      return {tabBarLabel, tabBarIcon};
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: ({navigation}) => {
      let tabBarLabel = 'My Profiles';
      let tabBarIcon = () => (
        <Image source={profile_img} style={{width: 36, height: 36}} />
      );
      return {tabBarLabel, tabBarIcon};
    },
  },

  // Diary: {
  //   screen: Diary,
  //   navigationOptions: ({ navigation }) => {
  //     let tabBarLabel = "Diary";
  //     let tabBarIcon = () => (
  //       <Image source={diary_img} style={{ width: 28, height: 28 }} />
  //     );
  //     return { tabBarLabel, tabBarIcon };
  //   }
  // }
};
let tabNavigatorConfig = {
  initialRouteName: 'Concierge',
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: true,
  tabBarOptions: {
    showLabel: true,
    activeTintColor: 'black',

    style: {
      backgroundColor: 'white',
      height: 60,
      borderTopColor: 'transparent',
      shadowOffset: {height: 1, width: 1},
      shadowColor: colors.darkblue,
      shadowOpacity: 0.2,
      elevation: 3,
    },
  },
  lazy: true,
};
const AppContainer = createAppContainer(
  createBottomTabNavigator(routeConfigs, tabNavigatorConfig),
);

export default AppContainer;
