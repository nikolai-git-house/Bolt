/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, AppState, AsyncStorage} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Provider} from 'react-redux';
// import OneSignal from 'react-native-onesignal';
import store from './src/Redux';
import LogoScreen from './src/screens/LogoScreen';
import AppContainer from './route';
import Landing from './src/screens/Landing';
import IntroOne from './src/screens/Intro/IntroOne';
import IntroTwo from './src/screens/Intro/IntroTwo';
import IntroThree from './src/screens/Intro/IntroThree';
import IntroFour from './src/screens/Intro/IntroFour';
import Onboard from './src/screens/Intro/Onboard';
import ProfileTest from './src/screens/ChatBot/ProfileTest';
import ProfileSuccess from './src/screens/ChatBot/ProfileSuccess';
import Part2 from './src/screens/ChatBot/Part2';
import Concierge from './src/screens/Concierge';
import LiveChat from './src/screens/Concierge/LiveChat';
import TravelBooking from './src/screens/Concierge/Travelbooking';
import Explore from './src/screens/Explore';
import colors from './src/theme/Colors';
import SignIn from './src/screens/SignIn/SignIn';
import PhoneCode from './src/screens/SignIn/PhoneCode';
import Firebase from './src/firebasehelper';

import './src/utils/fixtimerbug';
const StackNavigator = createAppContainer(
  createStackNavigator(
    {
      Logo: LogoScreen,
      Concierge: Concierge,
      LiveChat: LiveChat,
      Main: AppContainer,
      Onboard: Onboard,
      Explore: Explore,
      SignIn: SignIn,
      PhoneCode: PhoneCode,
      ProfileSuccess: ProfileSuccess,
      Part2: Part2,
      ProfileTest: ProfileTest,
      Landing: Landing,
      IntroOne: IntroOne,
      IntroFour: IntroFour,
      IntroThree: IntroThree,
      IntroTwo: IntroTwo,
    },
    {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      },
    },
  ),
);

export default class App extends Component {
  constructor(props) {
    super(props);
    // OneSignal.init('8beab5b1-a6ac-4560-aad6-fada11e503a9');

    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    // OneSignal.addEventListener('ids', this.onIds);
    // OneSignal.configure();
  }
  componentWillMount() {
    // OneSignal.removeEventListener('received', this.onReceived);
    // OneSignal.removeEventListener('opened', this.onOpened);
    // OneSignal.removeEventListener('ids', this.onIds);
  }
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  onReceived(notification) {
    console.log('Notification received: ', notification);
  }
  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = async nextAppState => {
    let uid = await AsyncStorage.getItem('uid');
    if (nextAppState === 'inactive') {
      console.log('the app is closed');
      if (uid) {
        Firebase.updateUserData(uid, {app_opened: false});
      }
    }
    if (nextAppState === 'active') {
      console.log('the app is resumed');
      if (uid) {
        Firebase.updateUserData(uid, {app_opened: true});
      }
    }
  };

  render() {
    return (
      <Provider store={store}>
        <StackNavigator screenProps={store} />
      </Provider>
    );
  }
}

// export default StackNavigator;

const Styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
