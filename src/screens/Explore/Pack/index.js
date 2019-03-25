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
class Pack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isgroup: 0,
      price: 0,
      errorVisible: false,
      confirmVisible: false
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    const { isgroup, price } = navigation.state.params;
    this.setState({ isgroup: isgroup, price: price });
  }
  Split = () => {
    const { isgroup } = this.state;
    if (!isgroup) this.toggleError(true);
  };
  Pay = () => {
    const { user_id } = this.props;
    const { price } = this.state;
    this.toggleConfirm(true);
    console.log("user_id", user_id);
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  toggleError(visible) {
    this.setState({ errorVisible: visible });
  }
  toggleConfirm(visible) {
    this.setState({ confirmVisible: visible });
  }
  render() {
    const { isgroup, price } = this.state;
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
        <View style={Styles.SplitContainer}>
          <Image
            source={require("../../../assets/Explore/pack/pizza.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
            Pay between your friends.{"\n"} Each guest is able to pay over time
            or in full via their app.
          </Text>
          <TouchableOpacity
            style={[Styles.CallAction, { backgroundColor: colors.yellow }]}
            onPress={this.Split}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.darkblue,
                fontWeight: "500"
              }}
            >
              Split It
            </Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.PayContainer}>
          <Image
            source={require("../../../assets/Explore/pack/mug.png")}
            style={{ width: 40, height: 40 }}
          />
          <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
            £{price} a month bolted-on
            {"\n"}
            Pick up the full booking.{"\n"}
            You'll pay over time or in full,managing our entire booking.{"\n"}
          </Text>
          <TouchableOpacity
            style={[Styles.CallAction, { backgroundColor: colors.grey }]}
            onPress={this.Pay}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.darkblue,
                fontWeight: "500"
              }}
            >
              Pay It
            </Text>
          </TouchableOpacity>
        </View>
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
              <Text style={{ fontWeight: "700" }}>Error</Text>
              <Text style={{ textAlign: "center" }}>
                The package is not available to split between your group. Please
                select "Pay It"
              </Text>
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
                <Text style={Styles.text}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.confirmVisible}
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
              <Text style={{ fontWeight: "700" }}>Error</Text>
              <Text style={{ textAlign: "center" }}>
                The package is not available to split between your group. Please
                select "Pay It"
              </Text>
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
                <Text style={Styles.text}>OK</Text>
              </TouchableHighlight>
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
)(Pack);
