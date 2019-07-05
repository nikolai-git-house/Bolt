import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  Modal,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import { Metrics } from "../../../theme";
import PackCarousel from "../../../components/PackCarousel";
import { sliderWidth, itemWidth } from "../../../theme/Styles";
import Firebase from "../../../firebasehelper";
const pet_img = require("../../../assets/packages/pets.png");
const lightning_img = require("../../../assets/packages/lightning.png");
const group_img = require("../../../assets/packages/group.png");
const close_image = require("../../../assets/Explore/close-button.png");
const error_img = require("../../../assets/popup/error.png");
const ballon_image = require("../../../assets/popup/balloon.png");
const carousel_height = Metrics.screenHeight - 210;
const axios = require("axios");

let isgroup = 0;
let price = 0;
let imgName = "";
let pkgName = "";
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bolt_height: new Animated.Value(0),
      isgroup: 0,
      price: 0,
      renter_owner: props.basic.renter_owner === "Renter" ? 1 : 2,
      error_Visible: false,
      error_payment_Visible: false,
      email_Visible: false,
      loadingdata: false,
      btn_able: false,
      error_msg: "",
      coming_flag: false
    };
  }
  componentDidMount() {
    const { packages } = this.props.basic;
    console.log("profile", this.props.basic.renter_owner);
    console.log("packages owned by user", packages);
  }
  componentWillReceiveProps(nextProps) {
    const { packages } = nextProps.basic;
    console.log("packages", packages);
  }
  toggleError(error, visible) {
    if (error === "error") this.setState({ error_Visible: visible });
    if (error === "payment") this.setState({ error_payment_Visible: visible });
    if (error === "email") this.setState({ email_Visible: visible });
  }
  Bolt = () => {
    const { bolt_height } = this.state;
    if (bolt_height._value == 0)
      Animated.timing(
        // Animate over time
        this.state.bolt_height, // The animated value to drive
        {
          toValue: 350, // Animate to opacity: 1 (opaque)
          duration: 200 // Make it take a while
        }
      ).start();
    else
      Animated.timing(
        // Animate over time
        this.state.bolt_height, // The animated value to drive
        {
          toValue: 0, // Animate to opacity: 1 (opaque)
          duration: 200 // Make it take a while
        }
      ).start();
  };
  SendMail = (from, pkgname, message, sender_name) => {
    axios
      .post(
        "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/sendEmail",
        {
          message: message,
          sender_name: sender_name,
          from: from,
          pkgname: pkgname
        }
      )
      .then(result => {
        if (result.status === 200) {
          alert("Mail Submited.");
        } else if (result.status === 500) {
        }
      });
    console.log("message", message);
  };
  BoltOn = () => {
    this.setState({ loadingdata: true });
    const { uid, basic } = this.props;
    const { coming_flag } = this.state;

    Firebase.isActive(uid).then(res => {
      if (res) {
        if (!coming_flag)
          Firebase.isPaymentReady(uid).then(async result => {
            if (result) {
              let isPackageGot = await Firebase.isPackageGot(uid, pkgName);
              console.log("isPackageGot", isPackageGot);
              this.setState({ loadingdata: false });
              if (!isPackageGot)
                this.navigateTo("Pack", {
                  price: price,
                  isgroup: isgroup,
                  imgName: imgName,
                  pkgName: pkgName
                });
              else {
                this.setState({
                  error_msg:
                    "You have already bought this package. You can't buy same package again."
                });
                this.toggleError("error", true);
              }
            } else this.toggleError("payment", true);
          });
        else {
          this.toggleError("email", true);
          this.setState({ loadingdata: false });
          let packageName = pkgName;
          let sender_email = basic.email;
          let receiver_email = "preregister@boltlabs.co.uk";
          this.SendMail(sender_email, packageName, "Hey", "TTT");
        }
      } else {
        this.setState({
          error_msg:
            "You are not active member. Please activate your profile to access purchase."
        });
        this.toggleError("error", true);
      }
    });
    //this.navigateTo("Pack", { price: price, isgroup: isgroup });
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  updateButton = pkgName => {
    if (
      pkgName === "Membership Pack" ||
      pkgName === "Health & Fitness Pack" ||
      pkgName === "Happy Cycling Pack"
    ) {
      this.setState({ coming_flag: true });
    } else this.setState({ coming_flag: false });
  };
  getCurrentSlider = (var1, var2, var3, var4) => {
    const { uid } = this.props;
    isgroup = var1;
    price = var2;
    imgName = var3;
    pkgName = var4;
    setTimeout(() => this.updateButton(pkgName), 500);
  };
  createDirectDebit = () => {
    this.toggleError("payment", false);
    this.navigateTo("DirectDebit");
  };
  render() {
    const {
      bolt_height,
      renter_owner,
      loadingdata,
      error_msg,
      coming_flag
    } = this.state;
    let height = 200;
    switch (Platform.OS) {
      case "ios":
        height = 300;
        break;
      case "android":
        height = 200;
        break;
    }
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
        <View
          style={{
            width: "100%",
            height: carousel_height,
            paddingBottom: 20
          }}
        >
          <PackCarousel
            getActive={async (isgroup, price, imgName, pkgName) => {
              this.getCurrentSlider(isgroup, price, imgName, pkgName);
            }}
            coming_flag={coming_flag}
            renter_owner={renter_owner}
          />
        </View>
        {loadingdata && (
          <ActivityIndicator size="large" color={colors.darkblue} />
        )}
        {!loadingdata && (
          <TouchableOpacity
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              width: itemWidth,
              height: 45,
              borderRadius: 15,
              backgroundColor: coming_flag ? "#FFE366" : colors.green,
              shadowOffset: { height: 1, width: 1 },
              shadowColor: colors.darkblue,
              shadowOpacity: 0.1
            }}
            onPress={this.BoltOn}
          >
            <Text style={{ fontSize: 20 }}>
              {coming_flag ? "Pre register" : "Subscribe"}
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: itemWidth,
            height: 40
          }}
        >
          <Text>Press concierge to chat about the package</Text>
        </View>
        <Animated.View
          style={{
            flex: 1,
            position: "absolute",
            left: 0,
            width: "100%",
            bottom: 0,
            display: "flex",
            height: bolt_height,
            backgroundColor: colors.white
          }}
        >
          <View
            style={{ width: "100%", display: "flex", alignItems: "flex-end" }}
          >
            <TouchableOpacity onPress={this.Bolt}>
              <Image source={close_image} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          </View>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.error_Visible}
            onRequestClose={() => {}}
          >
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.toggleError("error", false)}
              >
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
              <View style={styles.modal}>
                <Image source={error_img} style={{ width: 80, height: 80 }} />
                <Text style={{ fontWeight: "700" }}>Error</Text>
                <Text style={{ textAlign: "center" }}>{error_msg}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleError("error", false);
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
                  <Text style={styles.text}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.email_Visible}
            onRequestClose={() => {}}
          >
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.toggleError("email", false)}
              >
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
              <View style={styles.modal}>
                <Image
                  source={ballon_image}
                  style={{ width: 80, height: 80 }}
                />
                <Text style={{ fontWeight: "700" }}>Congratulations.</Text>
                <Text style={{ textAlign: "center" }}>
                  You'll be the first to know when this package is available.
                  We'll also credit you 10 tokens to redeem on your
                  subscription. Hang tight.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleError("email", false);
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
                  <Text style={styles.text}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.error_payment_Visible}
            onRequestClose={() => {}}
          >
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => this.toggleError("payment", false)}
              >
                <View style={{ flex: 1 }} />
              </TouchableOpacity>
              <View style={styles.modal}>
                <Image source={error_img} style={{ width: 80, height: 80 }} />
                <Text style={{ fontWeight: "700" }}>Error</Text>
                <Text style={{ textAlign: "center" }}>
                  You didn't create Go Cardless Direct Debit as payment setup.
                  Do you want to create it? It takes a few minute to finish all.
                </Text>
                <TouchableOpacity
                  onPress={this.createDirectDebit}
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
                  <Text style={styles.text}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Animated.View>
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
)(Main);
