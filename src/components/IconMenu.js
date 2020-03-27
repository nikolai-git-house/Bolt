import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../theme/Colors';
export default class IconMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  Press = () => {
    const {PressItem, data, isTitleHidden} = this.props;
    PressItem(data);
  };
  render() {
    const {data, isTitleHidden} = this.props;
    const {title, img} = data;

    return (
      <TouchableOpacity onPress={this.Press}>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: colors.white,
            shadowOffset: {height: 2, width: 2},
            shadowColor: colors.darkblue,
            shadowOpacity: 0.2,
            elevation: 3,
          }}>
          <Image
            source={img}
            style={{
              width: isTitleHidden ? 70 : 46,
              height: isTitleHidden ? 70 : 46,
              marginBottom: isTitleHidden ? 0 : 10,
              flex: 1,
              resizeMode: 'cover',
            }}
          />
          {!isTitleHidden && <Text style={Styles.caption}>{title}</Text>}
        </View>
      </TouchableOpacity>
    );
  }
}
const Styles = StyleSheet.create({
  caption: {
    fontFamily: 'Gothic A1',
    fontWeight: '600',
    fontSize: 10,
    color: 'black',
    textAlign: 'center',
  },
  subCaption: {
    fontFamily: 'Gothic A1',
    fontWeight: '500',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  content: {
    fontFamily: 'Gothic A1',
    fontSize: 15,
    fontWeight: '100',
    color: colors.darkblue,
    textAlign: 'center',
  },
});
