import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  ListView,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Keyboard
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import colors from "../../../../theme/Colors";
import Logo from "../../../../components/Logo";
import InputBox from "../../../../components/InputBox";
import AddressBox from "../../../../components/AddressBox";
import ListBox from "../../../../components/ListBox";
import Populated from "../../../../components/Populated";
import { Metrics } from "../../../../theme";
import { address_status } from "../../../../utils/Constants.js";
class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // keyboard: "invisible",
      // keyboard_Height: 0
    };
    // this._keyboardDidShow = this._keyboardDidShow.bind(this);
    // this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
  componentWillMount() {
    // this.keyboardDidShowListener = Keyboard.addListener(
    //   "keyboardDidShow",
    //   this._keyboardDidShow
    // );
    // this.keyboardDidHideListener = Keyboard.addListener(
    //   "keyboardDidHide",
    //   this._keyboardDidHide
    // );
  }

  componentWillUnmount() {
    // this.keyboardDidShowListener.remove();
    // this.keyboardDidHideListener.remove();
  }
  // _keyboardDidShow(e) {
  // this.setState({ keyboard: "visible" });
  // let keyboard_Height = e.endCoordinates.height;

  // console.log(keyboard_Height);
  // this.setState({ keyboard_Height });
  // let self = this;
  // setTimeout(() => {
  //   self.refs.scrollView.scrollToEnd();
  // }, 100);
  // }
  ScrollTo = offset => {
    console.log("offset", offset);
    this.refs.scrollView.scrollTo(offset);
  };
  onClickList = () => {
    console.log("click LIst!");
  };
  _keyboardDidHide() {
    this.setState({ keyboard: "invisible" });
  }
  onChangeName = text => {
    console.log("Name", text);
  };
  onChangeDate = text => {
    console.log("Date", text);
  };
  onChangePhoneNumber = text => {
    console.log("PhoneNumber", text);
  };
  onChangeEmail_Agent = text => {
    console.log("AgentEmail", text);
  };
  onChangePhoneNumber_Agent = text => {
    console.log("AgentPhonenumber", text);
  };
  onChangeYears = text => {
    console.log("Years", text);
  };
  onChangeLandlordYears = text => {
    console.log("landlord years", text);
  };
  onChangeA1 = (text, type) => {
    console.log(type, "line1", text);
  };
  onChangeA2 = (text, type) => {
    console.log(type, "line2", text);
  };
  onChangeA3 = (text, type) => {
    console.log(type, "line3", text);
  };
  onChangeA4 = (text, type) => {
    console.log(type, "line4", text);
  };
  onChangeStatus = text => {
    console.log("Status", text);
  };
  render() {
    let { basic } = this.props;
    if (!basic) {
      basic = {
        username: "Sophie Gu",
        dob: "08/12/1994",
        phone: "+44565454545"
      };
    }
    const username = basic.firstname + " " + basic.lastname;
    const dob = basic.dob;
    const number = basic.phone;
    // const { keyboard_Height } = this.state;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          backgroundColor: colors.lightgrey,
          paddingTop: 50
        }}
      >
        <Logo />
        <KeyboardAwareScrollView>
          <ScrollView
            ref="scrollView"
            style={{
              width: "100%",
              height: "90%",
              marginTop: 20
            }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Populated label="Full name" content={username} type="single" />
            <Populated
              label="Date of birth"
              imgsrc={require("../../../../assets/calendar.png")}
              content={dob}
              type="single"
            />
            <Populated
              label="Contact number"
              imgsrc={require("../../../../assets/mail.png")}
              content={number}
              type="single"
            />
            <Populated
              label="Your current address?"
              type="multi"
              a1="41"
              a2="High Street"
              a3="London"
              a4="E1 7EQ"
            />
            <InputBox
              label="How long have you lived there for?"
              imgsrc={require("../../../../assets/calendar.png")}
              placeholder="x years"
              onChange={text => this.onChangeYears(text)}
            />
            <AddressBox
              label="Current landlord or agent details including address?"
              placeholder="Address"
              onChangeA1={text => this.onChangeA1(text, "landlord")}
              onChangeA2={text => this.onChangeA2(text, "landlord")}
              onChangeA3={text => this.onChangeA3(text, "landlord")}
              onChangeA4={text => this.onChangeA4(text, "landlord")}
            />
            <InputBox
              label="Current landlord or agent email address?"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="E.g. xxxx@gmail.com"
              onChange={text => this.onChangeEmail_Agent(text)}
            />
            <InputBox
              label="Current landlord or agent phone number?"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="+44xxxxxxxxx"
              onChange={text => this.onChangePhoneNumber_Agent(text)}
            />
            <AddressBox
              label="We need the least 3 years of your addresses. Please provide previous landlord or agent details including address, email, number, full address and how many years?"
              placeholder="Address"
              onChangeA1={text => this.onChangeA1(text, "landlord")}
              onChangeA2={text => this.onChangeA2(text, "landlord")}
              onChangeA3={text => this.onChangeA3(text, "landlord")}
              onChangeA4={text => this.onChangeA4(text, "landlord")}
            />
            <ListBox
              onClick={() => {
                setTimeout(() => {
                  this.refs.scrollView.scrollTo(100);
                }, 100);
              }}
              data={address_status}
              label="Previous address status"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChangeStatus(text)}
            />
            <InputBox
              label="How long have you lived there for?"
              imgsrc={require("../../../../assets/calendar.png")}
              placeholder="x years"
              onChange={text => this.onChangeLandlordYears(text)}
            />
            <View
              style={{
                width: 280,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: colors.cardborder,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingBottom: 10
                }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  backgroundColor: colors.yellow,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingBottom: 10
                }}
                onPress={() => this.props.navigation.navigate("Credit")}
              >
                <Text>Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
        {/* /* {this.state.keyboard == "visible" && (
          <View
            style={{
              width: "100%",
              height: keyboard_Height,
              backgroundColor: colors.lightgrey
            }}
          />
        )} */}
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    basic: state.basic
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Address);
