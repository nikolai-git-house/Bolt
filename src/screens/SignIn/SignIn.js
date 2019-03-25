import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import Firebase from "../../firebasehelper";
import PhoneInput from "react-native-phone-input";
import { doSMS } from "../../functions/Auth";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: "false",
      phone: ""
    };
  }
  createPincode = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  EditPhoneNumber = number => {
    this.setState({ phone: number });
  };
  SignIn = () => {
    const { phone } = this.state;
    let pin = this.createPincode();
    pin = pin.toString();
    let response = doSMS(phone, pin);
    console.log("response", response);
    this.navigateTo("PhoneCode", { phone: phone, pin: pin });
  };
  render() {
    const { phone } = this.state;
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 50,
          backgroundColor: colors.white
        }}
      >
        <Logo />
        <PhoneInput
          style={{
            marginTop: 180,
            width: 300,
            height: 50,
            borderBottomColor: colors.darkblue,
            borderBottomWidth: 1
          }}
          ref="phone"
          initialCountry="gb"
          textStyle={{ fontSize: 25, fontFamily: "Quicksand" }}
          onChangePhoneNumber={this.EditPhoneNumber}
          value={phone}
        />
        <TouchableOpacity
          style={{
            backgroundColor: colors.yellow,
            padding: 20,
            marginTop: 50,
            borderRadius: 20
          }}
          onPress={this.SignIn}
        >
          <Text
            style={{ fontSize: 25, fontFamily: "Quicksand", fontWeight: "400" }}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 14,
    backgroundColor: "transparent"
  },
  Title: { fontSize: 30, fontFamily: "Quicksand", fontWeight: "200" },
  SubTitle: { fontSize: 15, fontFamily: "Quicksand", textAlign: "center" },
  CallAction: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder
  }
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
