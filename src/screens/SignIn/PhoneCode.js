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
import CodeInput from "react-native-confirmation-code-input";
import { saveOnboarding } from "../../Redux/actions/index";
class PhoneCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };

  _onFinishCheckingCode = isValid => {
    this.setState({ isValid });
    const { phone } = this.props.navigation.state.params;
    if (isValid) {
      const basicInfo = {
        firstname: "",
        lastname: "",
        dob: "",
        phonenumber: phone,
        email: "",
        password: ""
      };
      Firebase.getProfile(phone)
        .then(res => {
          console.log("res", res);
          if (res) {
            this.props.dispatch(saveOnboarding(res));
          } else {
            this.props.dispatch(saveOnboarding(basicInfo));
          }
          setTimeout(() => this.props.navigation.navigate("Main"), 1000);
        })
        .catch(err => {
          console.error("Error", err);
        });

      //this.props.dispatch(saveOnboarding(basicInfo));
      //setTimeout(() => this.props.navigation.navigate("Main"), 1000);
    }
  };
  render() {
    const { phone, pin } = this.props.navigation.state.params;
    const { isValid } = this.state;
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
        <CodeInput
          ref="codeInputRef2"
          compareWithCode={pin}
          activeColor={colors.yellow}
          inactiveColor={colors.yellow}
          autoFocus={false}
          ignoreCase={true}
          codeLength={5}
          inputPosition="center"
          size={50}
          onFulfill={isValid => this._onFinishCheckingCode(isValid)}
          containerStyle={{ marginTop: 180, marginBottom: 100 }}
          codeInputStyle={{ borderWidth: 1.5, borderRadius: 10, fontSize: 20 }}
        />
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Text
            style={{
              fontFamily: "Quicksand",
              color: colors.blue,
              fontSize: 20
            }}
          >
            Not Received?
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
)(PhoneCode);
