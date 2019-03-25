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
import { Metrics } from "../../../../theme";
import { address_status, country_names } from "../../../../utils/Constants.js";
export default class Credit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  ScrollTo = offset => {
    console.log("offset", offset);
    this.refs.scrollView.scrollTo(offset);
  };
  onChangePassport = text => {};
  onChangeFront = text => {};
  onChangeBack = text => {};
  onChangeNationality = text => {};
  onChangeOrigin = text => {};
  onChangeInsurance = text => {};
  onChangeCredit = text => {};
  onChangeCCJ = text => {};
  onChangeIVA = text => {};
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
            <Caption content="Please upload a copy of your identification or take a photo." />
            <InputBox
              label="Passports only."
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="http://"
              onChange={text => this.onChangePassport(text)}
            />
            <Caption content="Also, non EU citizens please could you upload a copy of your visa. Both front and back." />
            <InputBox
              label="Front"
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="http://"
              onChange={text => this.onChangeFront(text)}
            />
            <InputBox
              label="Back"
              imgsrc={require("../../../../assets/upload.png")}
              placeholder="http://"
              onChange={text => this.onChangeBack(text)}
            />
            <ListBox
              onClick={() => {
                setTimeout(() => {
                  this.refs.scrollView.scrollTo(100);
                }, 100);
              }}
              data={country_names}
              label="Nationality"
              imgsrc={require("../../../../assets/placeholder.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChangeNationality(text)}
            />
            <ListBox
              onClick={() => {
                setTimeout(() => {
                  this.refs.scrollView.scrollTo(100);
                }, 100);
              }}
              data={country_names}
              label="Country of Origin"
              imgsrc={require("../../../../assets/placeholder.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChangeOrigin(text)}
            />
            <InputBox
              label="National insurance number"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChangeInsurance(text)}
            />
            <InputBox
              label="Do you have any pending/historic adverse credit?"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChangeCredit(text)}
            />
            <InputBox
              label="Do you have any CCJ's or Court Decrees?"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChangeCCJ(text)}
            />
            <InputBox
              label="Do you have eever been declared bankrupt or any IVA's etc?"
              imgsrc={require("../../../../assets/mail.png")}
              placeholder="E.g. xxxx"
              onChange={text => this.onChangeIVA(text)}
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
                onPress={() => this.props.navigation.navigate("Employed")}
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
