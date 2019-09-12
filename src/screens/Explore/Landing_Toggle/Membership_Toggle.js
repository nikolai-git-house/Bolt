import React, { Component } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import colors from "../../../theme/Colors";
import Metrics from "../../../theme/Metrics";
import Firebase from "../../../firebasehelper";
import { saveOnboarding } from "../../../Redux/actions";
import { createPlan, createSubscription } from "../../../apis/index";
const block1_img = require("../../../assets/Explore/landing_toggle/block1.png");
const block2_img = require("../../../assets/Explore/landing_toggle/block2.png");
const block3_img = require("../../../assets/Explore/landing_toggle/block3.png");
const membership_img = require("../../../assets/packages/Product_Icons/membership.png");
const confirm_img = require("../../../assets/popup/balloon.png");
const aspect1 = 2.11;
const aspect2 = 2.64;
const aspect3 = 2.21;

const width = Metrics.screenWidth - 20;
class Membership_Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmVisible: false,
      successVisible: false,
      pkgName: "Membership Pack",
      price: 9.99
    };
  }
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  createStripe = (price, pkgName) => {
    this.navigateTo("PaymentSetup", { price, pkgName });
  };
  createSubscription = (price, pkgName, uid) => {
    return new Promise((resolve, reject) => {
      Firebase.getUserDatafromUID(uid)
        .then(async res => {
          if (res.customer_id) {
            let amount = 100 * price;
            //create plan
            let plan_data = await createPlan(amount, pkgName);
            let plan_id = plan_data.data.id;
            //create subscription
            let subscription_data = await createSubscription(
              res.customer_id,
              plan_id
            );
            let subscription_id = subscription_data.data.id;
            resolve(subscription_id);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  onPayClicked = () => {
    const { uid } = this.props;
    const { price, pkgName } = this.state;
    this.setState({ imgUrl: membership_img });
    this.setState({
      confirm_msg: `Once you confirm, Bolt will create your monthly subscription,
    with payments taken on 1st of each month.\nYour concierge will assist you with anything help you need.\n`
    });
    this.setState({
      confirm_ttl:
        "You've chosen to take this package yourself and pay it yourself."
    });
    Firebase.isPaymentReady(uid).then(result => {
      if (result) {
        this.toggleConfirm(true);
      } else {
        this.createStripe(price, pkgName);
      }
    });
  };
  toggleSuccess(visible) {
    this.setState({ successVisible: visible });
  }
  confirmPay = () => {
    this.toggleConfirm(false);
    const { price, pkgName, confirming } = this.state;
    const { uid, basic } = this.props;
    this.setState({ confirming: true });
    this.createSubscription(price, pkgName, uid)
      .then(res => {
        console.log("Subscription is created!", res);
        let temp = [];
        Firebase.getUserDatafromUID(uid).then(res => {
          let profile = res;
          if (profile.packages) temp = profile.packages;
          temp.push({ caption: pkgName, price: price });
          profile.packages = temp;
          profile.active = true;
          Firebase.updateUserData(uid, profile).then(result => {
            console.log("profile is updated!");
            // let new_basic = basic;
            // new_basic["packages"] = temp;
            this.props.dispatch(saveOnboarding(profile));
            AsyncStorage.setItem("profile", JSON.stringify(profile));
            this.setState({ confirming: false });
            this.toggleSuccess(true);
          });
        });
      })
      .catch(err => {
        this.setState({ error_msg: err, confirming: false });
        console.log("Error", err);
      });
  };
  toggleConfirm(visible) {
    this.setState({ confirmVisible: visible });
  }
  viewSubscription = () => {
    this.toggleSuccess(false);
    this.navigateTo("Profile", { page: "Subscriptions" });
  };
  render() {
    const {
      confirming,
      confirmVisible,
      imgUrl,
      confirm_ttl,
      confirm_msg
    } = this.state;
    return (
      <ScrollView
        style={{
          flex: 1
        }}
        contentContainerStyle={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent"
        }}
      >
        <Text
          style={{
            fontFamily: "Gothic A1",
            fontSize: 22,
            fontWeight: "700",
            color: colors.darkblue
          }}
        >
          Boltbot runs life, home & health.
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "300",
            color: colors.darkblue,
            fontStyle: "italic",
            margin: 5
          }}
        >
          For those who deserve more for less.
        </Text>
        <Text
          style={{
            margin: 5,
            fontFamily: "Gothic A1",
            fontSize: 15,
            color: colors.darkblue
          }}
        >
          Bolt saves members time & money.
        </Text>
        <Text
          style={{
            margin: 5,
            fontFamily: "Gothic A1",
            fontSize: 15,
            color: colors.darkblue
          }}
        >
          £143 & 35 hours per month on av.
        </Text>

        <Image
          source={block1_img}
          style={{ width, height: width * aspect1, marginBottom: 50 }}
          resizeMode="contain"
        />
        <Image
          source={block2_img}
          style={{ width, height: width * aspect2, marginBottom: 50 }}
          resizeMode="contain"
        />
        <Image
          source={block3_img}
          style={{ width, height: width * aspect3, marginBottom: 50 }}
          resizeMode="contain"
        />
        {confirming && (
          <ActivityIndicator size="large" color={colors.darkblue} />
        )}
        {!confirming && (
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20 }]}
            onPress={this.onPayClicked}
          >
            <Text
              style={{ fontFamily: "Gothic A1", fontSize: 18, marginBottom: 0 }}
            >
              Subscribe as a member
            </Text>
          </TouchableOpacity>
        )}
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={confirmVisible}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => this.toggleConfirm(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Image
                source={imgUrl}
                style={{
                  width: 80,
                  height: 80
                }}
              />
              <Text
                style={{
                  fontWeight: "700",
                  marginBottom: 10,
                  fontSize: 15,
                  textAlign: "center"
                }}
              >
                {confirm_ttl}
              </Text>

              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                {confirm_msg}
              </Text>

              <TouchableOpacity
                onPress={this.confirmPay}
                style={{
                  backgroundColor: colors.yellow,
                  width: 130,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: colors.grey,
                  borderWidth: 1,
                  shadowColor: "black",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  elevation: 3
                }}
              >
                <Text style={styles.text}>Confirm purchase</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.successVisible}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => this.toggleSuccess(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Image source={confirm_img} style={{ width: 80, height: 80 }} />
              <Text
                style={{
                  fontWeight: "700",
                  marginBottom: 10,
                  textAlign: "center"
                }}
              >
                Congratulations {"\n"} you've subscribed
              </Text>
              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                Our concierge team will be in touch to say hi and setup your
                package.
              </Text>
              <Text style={{ textAlign: "center", fontSize: 10 }}>
                View your subscriptions profile for full info.
              </Text>
              <TouchableOpacity
                onPress={this.viewSubscription}
                style={{
                  marginTop: 20,
                  backgroundColor: colors.yellow,
                  width: 100,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: colors.grey,
                  borderWidth: 1,
                  shadowColor: "black",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  elevation: 3
                }}
              >
                <Text style={styles.text}>Get started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      // </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.yellow,
    borderRadius: 10,
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  modal: {
    position: "absolute",
    left: "10%",
    top: "20%",
    width: "80%",
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
    basic: state.basic,
    uid: state.uid
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Membership_Toggle);

// export default StackNavigator;
