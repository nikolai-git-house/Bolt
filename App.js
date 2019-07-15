/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  AppState,
  AsyncStorage,
  Alert
} from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { Provider } from "react-redux";
import firebase from "react-native-firebase";
import store from "./src/Redux";

import LogoScreen from "./src/screens/LogoScreen";
import AppContainer from "./route";
import Landing from "./src/screens/Landing";
import IntroOne from "./src/screens/Intro/IntroOne";
import IntroTwo from "./src/screens/Intro/IntroTwo";
import IntroThree from "./src/screens/Intro/IntroThree";
import IntroFour from "./src/screens/Intro/IntroFour";
import Onboard from "./src/screens/Intro/Onboard";
import ProfileTest from "./src/screens/ChatBot/ProfileTest";
import ProfileSuccess from "./src/screens/ChatBot/ProfileSuccess";
import Part2 from "./src/screens/ChatBot/Part2";
import Concierge from "./src/screens/Concierge";
import Explore from "./src/screens/Explore";
import colors from "./src/theme/Colors";
import SignIn from "./src/screens/SignIn/SignIn";
import PhoneCode from "./src/screens/SignIn/PhoneCode";
const StackNavigator = createAppContainer(
  createStackNavigator(
    {
      Logo: LogoScreen,
      Concierge: Concierge,
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
      Part2: Part2
    },
    {
      headerMode: "none",
      navigationOptions: {
        headerVisible: false
      }
    }
  )
);

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    this.notificationListener();
    this.notificationOpenedListener();
  }
  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const { title, body } = notification;
        this.showAlert(title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }
  handleAppStateChange = nextAppState => {
    if (nextAppState === "inactive") {
      console.log("the app is closed");
    }
  };
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }
  render() {
    return (
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    );
  }
}

// export default StackNavigator;

const Styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
