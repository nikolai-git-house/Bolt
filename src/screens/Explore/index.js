import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Landing from './Landing';
import Landing_Toggle from './Landing_Toggle';
import Main from './Main';
import Pack from './Pack';
import DirectDebit from './DirectDebitSetup';
import PaymentSetup from './PaymentSetup';
export default createStackNavigator(
  {
    LandExplore: {
      screen: Landing,
    },
    Toggle: {
      screen: Landing_Toggle,
    },
    MainList: {
      screen: Main,
    },
    Pack: {
      screen: Pack,
    },
    // PaymentSetup: {
    //   screen: PaymentSetup,
    // },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

// export default StackNavigator;
