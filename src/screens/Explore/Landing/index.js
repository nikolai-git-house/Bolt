import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  StyleSheet,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import PrimaryPackage from "./PrimaryPackage";
import SecondaryPackage from "./SecondaryPackage";

const bike_img = require("../../../assets/Explore/landing/Bike.jpg");
const pet_img = require("../../../assets/Explore/landing/Pet.jpg");
const token_img = require("../../../assets/Explore/landing/Monthly.jpg");
const health_img = require("../../../assets/Explore/landing/Health.jpg");
const wallet_img = require("../../../assets/Explore/landing/Wallet.jpg");
class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };

  render() {
    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.lightgrey
        }}
      >
        <View
          style={{
            width: "100%",
            height: 80,
            display: "flex",
            alignItems: "center",
            paddingTop: 50
          }}
        >
          <Logo />
        </View>
        <ScrollView style={{ width: "100%", height: "90%" }}>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <PrimaryPackage
              style="bolt"
              title="Bolt on Packages"
              onPress={() => this.navigateTo("Main")}
            />
            <PrimaryPackage style="redeem" title="Redeem Perks" />
            <PrimaryPackage style="social" title="Member Socials" />
            <SecondaryPackage
              title="Most Popular"
              subTitle="Member Pack"
              img={health_img}
            />
            <SecondaryPackage
              title="Featured Pack"
              subTitle="Free Bike Hire"
              img={bike_img}
            />
            <SecondaryPackage
              title="Featured Pack"
              subTitle="Pet Package"
              img={pet_img}
            />
            <SecondaryPackage
              title="Monthly earnings"
              subTitle="15 Tokens"
              img={token_img}
            />
            <SecondaryPackage
              title="Wallet Balance"
              subTitle="Top Up"
              img={wallet_img}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: "10%",
    top: "20%",
    width: "80%",
    height: "35%",
    justifyContent: "space-around",
    alignItems: "center",
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 10
  }
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    basic: state.basic
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
