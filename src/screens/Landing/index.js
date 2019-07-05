import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../theme/Colors";
import Metrics from "../../theme/Metrics";
import Logo from "../../components/Logo";
import { getToken } from "../../apis/Auth";
import {
  grant_type,
  client_id,
  client_secret,
  username,
  password
} from "../../utils/Constants";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: "false"
    };
  }
  signIn = () => {
    this.props.navigation.navigate("SignIn");
  };
  joinMember = () => {
    this.props.navigation.navigate("IntroOne");
  };
  render() {
    return (
      <KeyboardAwareScrollView
        style={{ width: Metrics.screenWidth, height: Metrics.screenHeight }}
      >
        <View
          style={{
            width: "100%",
            height: Metrics.screenHeight,
            alignItems: "center",
            backgroundColor: colors.lightgrey
          }}
        >
          <Logo />
          <View
            style={{
              position: "absolute",
              top: 90,
              left: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: colors.lightgrey
            }}
          >
            <View style={Styles.JoinProfileContainer}>
              <Text style={[Styles.Title, { color: colors.darkblue }]}>
                Join Bolt
              </Text>
              <Image
                source={require("../../assets/Landing/join_bolt.png")}
                style={{ width: 60, height: 60 }}
              />
              <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
                Take a profile test (6 mins){"\n"} Insider perks, savings &
                packages
                {"\n"} Access the best properties
              </Text>
              <TouchableOpacity
                onPress={this.joinMember}
                style={[Styles.CallAction, { backgroundColor: colors.yellow }]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.darkblue,
                    fontWeight: "500"
                  }}
                >
                  Join Now
                </Text>
              </TouchableOpacity>
            </View>
            <View style={Styles.SignInContainer}>
              <Text style={[Styles.Title, { color: colors.darkblue }]}>
                Already a member
              </Text>
              <Image
                source={require("../../assets/Landing/already_member.png")}
                style={{ width: 60, height: 60 }}
              />
              <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
                Those who have joined the club.
              </Text>
              <TouchableOpacity
                onPress={this.signIn}
                style={[Styles.CallAction, { backgroundColor: colors.grey }]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.darkblue,
                    fontWeight: "500"
                  }}
                >
                  Sign me in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
const Styles = StyleSheet.create({
  SignInContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 250,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    color: colors.darkblue,
    padding: 10,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder
  },
  JoinProfileContainer: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    height: 250,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    color: colors.darkblue,
    padding: 10,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder
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
)(Landing);
