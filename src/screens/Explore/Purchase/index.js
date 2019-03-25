import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  Image,
  ImageBackground,
  ToolbarAndroid,
  Platform,
  Button,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  TextInput,
  ActivityIndicator,
  AsyncStorage,
  Modal,
  Animated,
  WebView
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
const error_img = require("../../../assets/popup/error.png");
import { getCustomerList } from "../../../apis/GoCardless";
class Purchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0,
      user_id: "",
      errorVisible: false,
      customer_id: ""
    };
  }
  componentDidMount() {
    const { navigation, basic } = this.props;
    const { price, user_id } = navigation.state.params;
    this.setState({ user_id: user_id, price: price });
    const { email } = basic;
    let customer_id = "";
    getCustomerList().then(res => {
      const result = JSON.parse(res);

      result.customers.forEach(function(item) {
        if (email === item.email) {
          customer_id = item.id;
          return;
        }
      });
      this.setState({ customer_id: customer_id });
      if (!customer_id) {
        this.toggleError(true);
      } else console.log("You have");
      console.log("customers", JSON.parse(res));
    });
  }

  toggleError(visible) {
    this.setState({ errorVisible: visible });
  }
  render() {
    const { price, user_id, navigation } = this.props;
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

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.errorVisible}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => this.toggleError(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={Styles.modal}>
              <Image source={error_img} style={{ width: 80, height: 80 }} />
              <Text style={{ fontWeight: "700" }} />
              <Text style={{ textAlign: "center" }}>
                You have not setup Direct Debit for Bolt GoCardless. May I send
                you email to let you setup Direct Debit for Bolt GoCardless?
              </Text>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <TouchableHighlight
                  onPress={() => {
                    this.toggleError(false);
                  }}
                  style={{
                    backgroundColor: colors.yellow,
                    width: 100,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: colors.grey,
                    borderWidth: 1
                  }}
                >
                  <Text style={Styles.text}>Yes Please.</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    navigation.goBack();
                    this.toggleError(false);
                  }}
                  style={{
                    backgroundColor: colors.yellow,
                    width: 100,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: colors.grey,
                    borderWidth: 1
                  }}
                >
                  <Text style={Styles.text}>No I don't want.</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  PayContainer: {
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
  SplitContainer: {
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
    basic: state.basic,
    user_id: state.user_id
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Purchase);
