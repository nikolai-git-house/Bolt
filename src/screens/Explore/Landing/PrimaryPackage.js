import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import colors from '../../../theme/Colors';
let img = require('../../../assets/packages/home.png');
export const PrimaryPackage = props => {
  console.log('style', style);
  const style = props.style;
  switch (style) {
    case 'membership':
      img = require('../../../assets/Explore/member.png');
      break;
    case 'perks':
      img = require('../../../assets/Explore/perks.png');
      break;
    case 'shop':
      img = require('../../../assets/Explore/shop.png');
      break;
    default:
      img = require('../../../assets/Explore/member.png');
  }
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colors.white,
        padding: 5,
        margin: 5,
      }}>
      <Image source={img} style={{width: 50, height: 50}} />
      <TouchableOpacity
        style={{
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.brand,
          width: 170,
          height: 40,
          borderRadius: 10,
          padding: 10,
        }}
        onPress={props.onPress}>
        <Text>{props.title}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default PrimaryPackage;
