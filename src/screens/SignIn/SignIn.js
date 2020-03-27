import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../theme/Colors';
import Logo from '../../components/Logo';
import TopImage from '../../components/TopImage';
import Firebase from '../../firebasehelper';
import PhoneInput from 'react-native-phone-input';
import Metrics from '../../theme/Metrics';
import {doSMS} from '../../functions/Auth';
import {clearZero} from '../../utils/functions';
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: 'false',
      phone: '+44',
    };
  }
  createPincode = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  GoBack = () => {
    this.props.navigation.goBack();
  };
  EditPhoneNumber = number => {
    this.setState({phone: number});
  };
  SignIn = () => {
    const {phone} = this.state;
    let pin = this.createPincode();
    pin = pin.toString();
    console.log('pin', pin);
    let phonenumber = clearZero(phone);
    console.log('phonenumber', phonenumber);
    let response = doSMS(phone, pin);
    console.log('response', response);
    this.navigateTo('PhoneCode', {phone: phonenumber, pin: pin});
  };
  render() {
    const {phone} = this.state;
    return (
      <View
        style={{
          width: '100%',
          height: Metrics.screenHeight,
          alignItems: 'center',
          backgroundColor: colors.lightgrey,
        }}>
        <TopImage />
        <Logo />
        <PhoneInput
          style={{
            marginTop: 180,
            width: 300,
            height: 50,
            borderBottomColor: colors.darkblue,
            borderBottomWidth: 1,
          }}
          ref="phone"
          initialCountry="gb"
          textStyle={{
            fontSize: 25,
            fontFamily: 'Gothic A1',
            height: 30,
          }}
          onChangePhoneNumber={this.EditPhoneNumber}
          value={phone}
        />
        <TouchableOpacity style={styles.CalltoAction} onPress={this.SignIn}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: 'Gothic A1',
              fontWeight: '400',
              marginBottom: 0,
            }}>
            Sign In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'transparent',
            marginTop: 50,
          }}
          onPress={this.GoBack}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: 'Gothic A1',
              fontWeight: '400',
              color: colors.blue,
            }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  CalltoAction: {
    backgroundColor: colors.yellow,
    padding: 20,
    marginTop: 50,
    borderRadius: 20,
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
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
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
