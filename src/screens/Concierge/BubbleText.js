import React, {Component} from 'react';
import {View, Image, Text, Animated, Easing, StyleSheet} from 'react-native';
import Sound from 'react-native-sound';
import styled from 'styled-components';
import colors from '../../theme/Colors';
import * as Animatable from 'react-native-animatable';
// const Bubble = styled.View`
//   box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.2);
//   padding: 10px;
//   border-radius: 10px;
//   background-color: #fff;
// `;
var bamboo = new Sound('bamboo.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
bamboo.setVolume(0.5);

const getImage = type => {
  switch (type) {
    case 'agency':
      return require('../../assets/livechat/agency_logo.png');
    case 'landlord':
      return require('../../assets/livechat/landlord_logo.png');
    case 'contractor':
      return require('../../assets/livechat/contractor_logo.png');
    default:
      return require('../../assets/livechat/agency_logo.png');
  }
};
const getStyle = type => {
  switch (type) {
    case 'user':
      return '#f8f8f8';
    case 'agency':
      return '#fdffd0';
    case 'landlord':
      return '#daffda';
    case 'contractor':
      return '#ffeaf9';
    default:
      return '#f8f8f8';
  }
};
const getName = message => {
  console.log('message', message);
  switch (message.type) {
    case 'agency':
      return 'Ecosystem Concierge';
    case 'landlord':
      return `${message.name} your landlord`;
    case 'contractor':
      return `${message.name} your handyman`;
    default:
      return 'Ecosystem Concierge';
  }
};
class BubbleText extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.loadinganimatedValue = new Animated.Value(0);
    this.state = {
      agency_typing: props.agency_typing,
      landlord_typing: props.landlord_typing,
      contractor_typing: props.contractor_typing,
    };
  }

  componentDidMount() {
    const {typing, message} = this.props;
    this.setState({typing: typing});
    if (message.message && message.type === 'agency') bamboo.play();
  }
  render() {
    let {agency_typing, landlord_typing, contractor_typing} = this.state;
    const {message, avatar_url} = this.props;
    const animatedStyle = {transform: [{scale: this.animatedValue}]};
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
          marginTop: 8,
          marginBottom: 8,
        }}>
        {(message.type === 'agency' ||
          message.type === 'landlord' ||
          message.type === 'contractor') && (
          <View style={styles.avatar}>
            <Image
              source={getImage(message.type)}
              style={{
                width: '100%',
                height: '100%',
                flex: 1,
                resizeMode: 'contain',
              }}
            />
          </View>
        )}
        {agency_typing && message.type === 'agency' && (
          <Animatable.View
            animation="fadeInLeft"
            duration={400}
            style={{flexDirection: 'row'}}>
            <Image
              source={require('../../assets/typing.gif')}
              style={{
                width: 63,
                height: 50,
              }}
            />
          </Animatable.View>
        )}
        {landlord_typing && message.type === 'landlord' && (
          <Animatable.View
            animation="fadeInLeft"
            duration={400}
            style={{flexDirection: 'row'}}>
            <Image
              source={require('../../assets/typing.gif')}
              style={{
                width: 63,
                height: 50,
              }}
            />
          </Animatable.View>
        )}
        {contractor_typing && message.type === 'contractor' && (
          <Animatable.View
            animation="fadeInLeft"
            duration={400}
            style={{flexDirection: 'row'}}>
            <Image
              source={require('../../assets/typing.gif')}
              style={{
                width: 63,
                height: 50,
              }}
            />
          </Animatable.View>
        )}
        {((!agency_typing && !landlord_typing && !contractor_typing) ||
          message.type === 'user') && (
          <View
            style={{
              width: 'auto',
              maxWidth: '80%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <View
              style={[
                message.type === 'user' ? styles.userbubble : styles.bubble,
                {backgroundColor: getStyle(message.type)},
              ]}>
              <Text
                style={
                  message.type === 'user'
                    ? styles.userbubble_text
                    : styles.bubble_text
                }>
                {message.message}
              </Text>
            </View>
            {message.type !== 'user' && (
              <View
                style={{
                  marginLeft: 'auto',
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: '#555',
                    fontSize: 10,
                    marginBottom: 0,
                  }}>
                  {getName(message)}
                </Text>
              </View>
            )}
          </View>
        )}
        {message.type === 'user' && (
          <View style={styles.avatar}>
            {!avatar_url && (
              <Image
                source={require('../../assets/avatar.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  resizeMode: 'contain',
                }}
              />
            )}
            {avatar_url && (
              <Image source={{uri: avatar_url}} style={styles.avatar} />
            )}
          </View>
        )}
      </View>
    );
  }
}
export default BubbleText;
const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
  },
  bubble_text: {
    fontFamily: 'Gothic A1',
    fontWeight: '300',
    lineHeight: 20,
    color: '#555',
    fontSize: 16,
    marginBottom: 0,
  },
  userbubble: {
    alignSelf: 'flex-start',
    padding: 10,
    marginRight: 0,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
  },
  userbubble_text: {
    fontFamily: 'Gothic A1',
    fontWeight: '300',
    lineHeight: 20,
    color: colors.darkblue,
    fontSize: 17,
    marginBottom: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
  },
});
