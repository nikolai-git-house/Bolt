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
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import colors from '../../theme/Colors';
import Logo from '../../components/Logo';
import TopImage from '../../components/TopImage';
import {Metrics} from '../../theme';
import Circle from '../../components/Circle';
import TextBubble from '../../components/TextBubble';

export default class IntroOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSwipeRight = gestureState => {
    console.log('swipe right');

    this.props.navigation.goBack();
  };
  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    return (
      <GestureRecognizer
        onSwipeRight={state => this.onSwipeRight(state)}
        config={config}>
        <View style={styles.maincontainer}>
          <TopImage />
          <Logo />
          <Image
            source={require('../../assets/onboarding/set4.png')}
            style={{width: 250, height: 100, marginTop: 20}}
          />
          <View style={styles.subcontainer}>
            <View
              style={{
                flex: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
              <TextBubble message="City living by subscription!" />
              <TextBubble message="Ecosystem all of your life costs into one simple subscription & split with friends for ease..." />
            </View>
            <TouchableOpacity
              style={{
                width: 150,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.yellow,
                borderRadius: 20,
                shadowColor: 'black',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.2,
                elevation: 3,
              }}
              onPress={() => this.props.navigation.navigate('Onboard')}>
              <Text style={{color: colors.darkblue, fontSize: 15}}>
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/onboarding/rocket.gif')}
            style={{width: '100%', height: 200}}
          />
        </View>
      </GestureRecognizer>
    );
  }
}
const styles = StyleSheet.create({
  caption: {
    width: 280,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowOffset: {height: 5, width: 5},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subcaption: {
    fontSize: 15,
    textAlign: 'center',
  },
  containter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  maincontainer: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 90,
    backgroundColor: colors.lightgrey,
  },
  subcontainer: {
    width: '75%',
    height: Metrics.screenHeight - 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
});
