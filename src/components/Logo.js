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
import colors from '../theme/Colors';

export default class Bubble extends React.Component {
  render() {
    return (
      <Image
        style={Styles.logoContainer}
        resizeMode={'contain'}
        source={require('../assets/logo.png')}
      />
    );
  }
}
const Styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    width: 85,
    height: 35,
    top: 40,
    alignItems: 'center',
  },
});
