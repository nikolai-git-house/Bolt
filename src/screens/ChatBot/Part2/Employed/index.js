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
import colors from "../../../../theme/Colors";
import Logo from "../../../../components/Logo";
import ButtonBox from "../../../../components/ButtonBox";
import AddressBox from "../../../../components/AddressBox";
import ListBox from "../../../../components/ListBox";
import Caption from "../../../../components/Caption";
import InputBox from "../../../../components/InputBox";
import Populated from "../../../../components/Populated";
import { Metrics } from "../../../../theme";
import { address_status, country_names } from "../../../../utils/Constants.js";
export default class Employed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  ScrollTo = offset => {
    console.log("offset", offset);
    this.refs.scrollView.scrollTo(offset);
  };
  onChange = (text, type) => {};
  onChangeA1 = (text, type) => {};
  onChangeA2 = (text, type) => {};
  onChangeA3 = (text, type) => {};
  onChangeA4 = (text, type) => {};
  onChangePosition = position => {};
  render() {
    // const { keyboard_Height } = this.state;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 50
        }}
      >
        <Logo />
        <KeyboardAwareScrollView>
          <ScrollView
            ref="scrollView"
            style={{
              width: "100%",
              height: "95%",
              marginTop: 20
            }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <InputBox
              label="Name of company"
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="http://"
              onChange={text => this.onChange(text, "company_name")}
            />
            <AddressBox
              label="Company address"
              placeholder="Address"
              onChangeA1={text => this.onChangeA1(text, "company")}
              onChangeA2={text => this.onChangeA2(text, "company")}
              onChangeA3={text => this.onChangeA3(text, "company")}
              onChangeA4={text => this.onChangeA4(text, "company")}
            />
            <InputBox
              label="Position/ title"
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="http://"
              onChange={text => this.onChange(text, "position")}
            />
            <InputBox
              label="Payroll number"
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="http://"
              onChange={text => this.onChange(text, "payroll")}
            />
            <Populated
              label="Total annual income"
              content="£50,000"
              type="single"
            />
            <InputBox
              label="Start date"
              imgsrc={require("../../../../assets/calendar.png")}
              placeholder="DD/MM/YYYY"
              onChange={text => this.onChange(text, "date")}
            />
            <InputBox
              label="Name of work contact"
              onChange={text => this.onChange(text, "contact")}
            />
            <InputBox
              label="Email address of work contact"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChange(text, "email")}
            />
            <InputBox
              label="Phone number of work contact"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="+44xxxxxxxxx"
              onChange={text => this.onChange(text, "phonenumber")}
            />
            <InputBox
              label="Is your current position going to change in the near future yes/no"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="Yes"
              onChange={text => this.onChange(text, "confirm")}
            />
            <InputBox
              label="Please upload a copy of your bank statement or take a photo. Needs to be within the last 3 months."
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="http://"
              onChange={text => this.onChange(text, "bank_statement")}
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
                  padding: 20
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
                  padding: 20
                }}
                onPress={() => this.props.navigation.navigate("Final")}
              >
                <Text>Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
