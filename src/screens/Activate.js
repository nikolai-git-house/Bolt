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
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import colors from '../theme/Colors';
import Logo from '../components/Logo';
import {getToken, logIn} from '../apis/Auth';
import {hexToString, clearString, getUserId} from '../utils/functions';
import {saveOnboarding, saveCurrentUserId, saveToken} from '../Redux/actions';

import {
  grant_type,
  client_id,
  client_secret,
  username,
  password,
  response_type,
  redirect_uri,
  scope,
  display,
} from '../utils/Constants';
import Firebase from '../firebasehelper';
const patchPostMessageFunction = function() {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace(
      'hasOwnProperty',
      'postMessage',
    );
  };

  window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';
class Activate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login_screen: false,
      html_content: '',
      user_session: {},
      token: '',
      user_id: '',
    };
  }
  signIn = () => {
    logIn(response_type, client_id, redirect_uri, scope, display).then(res => {
      console.log('result', res);
      this.setState({login_screen: true});
      this.setState({html_content: res._bodyInit});
    });
  };
  joinMember = () => {
    this.props.navigation.navigate('IntroOne');
  };
  onEventHandler = event => {
    //const obj = JSON.parse(data);
    console.log('event triggered', event.nativeEvent);
    const url = event.nativeEvent.url;
    const obj = url.split('#');
    const req_array = obj[1].split('&');
    let reformattedArray = {};
    req_array.map(item => {
      let property = item.split('=');
      let key = property[0];
      let value = property[1];
      value = clearString(value);
      if (key == '#access_token') key = 'access_token';
      reformattedArray[key] = value;
    });
    //session created! Login Success!
    this.setState({user_session: reformattedArray});
    console.log('request_array', reformattedArray);
    const {access_token, id} = reformattedArray;
    let user_id = getUserId(id);
    console.log('user_id', user_id);
    this.props.dispatch(saveToken(access_token));
    this.props.dispatch(saveCurrentUserId(user_id));
    let self = this;
    Firebase.getUserData(user_id, function(res) {
      console.log('res', res);
      let name = res.username.split(' ');
      const basic = {
        firstname: name[0],
        lastname: name[1],
        email: res.email,
        password: res.password,
        postcode: '',
        number: '',
        street: '',
        city: '',
        phone: res.phone,
        dob: res.DOB,
        avatar: '',
        user_id: user_id,
      };
      self.props.dispatch(saveOnboarding(basic));

      AsyncStorage.setItem('profile', JSON.stringify(basic));
      setTimeout(() => {
        self.props.navigation.navigate('Main');
        self.setState({login_screen: false});
        self.setState({html_content: ''});
      }, 1000);
    });
  };

  render() {
    const {login_screen, html_content} = this.state;
    return (
      <View style={{flex: 1}}>
        {login_screen === true && !!html_content && (
          <WebView
            injectedJavaScript={patchPostMessageJsCode}
            originWhitelist={['*']}
            source={{html: html_content}}
            onMessage={this.onEventHandler}
          />
        )}
        {login_screen === false && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingTop: 50,
              backgroundColor: colors.lightgrey,
            }}>
            <Logo />
            <View style={Styles.JoinProfileContainer}>
              <Text style={[Styles.Title, {color: colors.darkblue}]}>
                Join Ecosystem
              </Text>
              <Image
                source={require('../assets/Landing/join_bolt.png')}
                style={{width: 80, height: 80}}
              />
              <Text style={[Styles.SubTitle, {color: colors.darkblue}]}>
                Insider access, perks savings & subscriptions. Earn tokens to
                spend on all walks of life. Own your life & data with your
                blockchain iD. Live your best life with the help of community.
              </Text>
              <TouchableOpacity
                onPress={this.joinMember}
                style={[Styles.CallAction, {backgroundColor: colors.yellow}]}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.darkblue,
                    fontWeight: '500',
                  }}>
                  Join Now
                </Text>
              </TouchableOpacity>
            </View>
            <View style={Styles.SignInContainer}>
              <Text style={[Styles.Title, {color: colors.darkblue}]}>
                Already a member
              </Text>
              <Image
                source={require('../assets/Landing/already_member.png')}
                style={{width: 80, height: 80}}
              />
              <Text style={[Styles.SubTitle, {color: colors.darkblue}]}>
                Those who have joined the club.
              </Text>
              <TouchableOpacity
                onPress={this.signIn}
                style={[Styles.CallAction, {backgroundColor: colors.grey}]}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.darkblue,
                    fontWeight: '500',
                  }}>
                  Sign me in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  SignInContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: '45%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: colors.darkblue,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
  },
  JoinProfileContainer: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    height: '55%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: colors.darkblue,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
  },
  Title: {fontSize: 30, fontFamily: 'Gothic A1', fontWeight: '200'},
  SubTitle: {fontSize: 15, fontFamily: 'Gothic A1', textAlign: 'center'},
  CallAction: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
  },
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Activate);
