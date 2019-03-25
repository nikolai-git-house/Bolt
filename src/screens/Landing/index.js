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
import colors from "../../theme/Colors";
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
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: 50,
          backgroundColor: colors.lightgrey
        }}
      >
        <Logo />
        <View style={Styles.JoinProfileContainer}>
          <Text style={[Styles.Title, { color: colors.darkblue }]}>
            Join Bolt
          </Text>
          <Image
            source={require("../../assets/Landing/join_bolt.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
            Take a profile test (6 mins){"\n"} Insider perks, savings & packages
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
            style={{ width: 80, height: 80 }}
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
    );
  }
}
const Styles = StyleSheet.create({
  SignInContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: "45%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    color: colors.darkblue,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder
  },
  JoinProfileContainer: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    height: "45%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    color: colors.darkblue,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
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
