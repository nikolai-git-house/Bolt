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
export default class SelfEmployed extends React.Component {
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
              paddingTop: 20
            }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <InputBox
              label="Name of company"
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="E.g. xxxx"
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
              placeholder="E.g. xxxx"
              onChange={text => this.onChange(text, "position")}
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
              label="Name of accountant"
              onChange={text => this.onChange(text, "accountant")}
            />
            <InputBox
              label="Email address of accountant"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChange(text, "email")}
            />
            <InputBox
              label="Phone number of accountant"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="+44xxxxxxxxx"
              onChange={text => this.onChange(text, "phonenumber")}
            />
            <Caption content="Upload a self-assessment or tax return documents dated within the last two years. Or, an accountant signed audit of personal accounts Or, a reference from a professional accountant firm." />
            <InputBox
              label="Document"
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="http://"
              onChange={text => this.onChange(text, "document")}
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
