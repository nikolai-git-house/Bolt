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
import Address from './Address';
import Credit from './Credit';
import Employed from './Employed';
import SelfEmployed from './SelfEmployed';
import Final from './Final';

const StackNavigator = createAppContainer(
  createStackNavigator(
    {
      Address: Address,
      Final: Final,
      SelfEmployed: SelfEmployed,
      Employed: Employed,
      Credit: Credit,
    },
    {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      },
    },
  ),
);

export default class Part2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <StackNavigator />;
  }
}
