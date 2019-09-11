import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  WebView,
  Alert
} from "react-native";
import { connect } from "react-redux";
import Sound from "react-native-sound";
import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";

import { Metrics } from "../../theme";
import {
  saveOnboarding,
  saveUID,
  savePet,
  saveBike,
  saveHealth,
  saveHome
} from "../../Redux/actions/index";
import Firebase from "../../firebasehelper";
const back_img = require("../../assets/back.png");
var bamboo = new Sound("bamboo.mp3", Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log("failed to load the sound", error);
    return;
  }
});
bamboo.setVolume(0.5);
class Onboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstname: "",
      lastname: "",
      phone: "",
      DOB: "",
      renter_owner: ""
    };
  }
  onLoadFinished = () => {
    if (this.webview) {
      console.log("posted message");
      this.webview.postMessage("onboarding_botMessages");
    }
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { username, phone, DOB } = this.state;
    console.log("username", username);
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: colors.white
        }}
      >
        <TopImage />
        <Logo />
        <View
          style={{
            display: "flex",
            alignItems: "flex-start",
            position: "absolute",
            top: 40,
            left: 10,
            zIndex: 1000
          }}
        >
          <TouchableOpacity onPress={this.goBack}>
            <Image source={back_img} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.maincontainer}>
          <WebView
            ref={r => (this.webview = r)}
            originWhitelist={["*"]}
            source={
              Platform.OS === "ios"
                ? { uri: "./external/onboarding/index.html" }
                : { uri: "file:///android_asset/onboarding/index.html" }
            }
            onMessage={event => this.onEventHandler(event.nativeEvent.data)}
            startInLoadingState
            domStorageEnabled={true}
            javaScriptEnabled
            onLoad={this.onLoadFinished}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
            useWebKit={true}
          />
        </View>
      </View>
    );
  }
  onEventHandler = data => {
    const { username, phone, DOB, renter_owner } = this.state;
    bamboo.play();
    console.log("data", data);
    if (data != "bamboo") {
      const obj = JSON.parse(data);
      console.log(obj);
      if (obj.onboardingFinished) {
        const name_array = username.split(" ");
        const firstname = name_array[0];
        const lastname = name_array[1];

        const basicInfo = {
          firstname: firstname,
          lastname: lastname,
          phonenumber: phone,
          dob: DOB,
          renter_owner: renter_owner,
          groupId: "",
          tokens: 5
        };
        Firebase.signup(basicInfo)
          .then(res => {
            console.log("uid", res.id);
            this.props.dispatch(saveOnboarding(basicInfo));
            this.props.dispatch(saveUID(res.id));
            AsyncStorage.setItem("profile", JSON.stringify(basicInfo));
            AsyncStorage.setItem("uid", res.id);
            setTimeout(() => this.props.navigation.navigate("Main"), 100);
          })
          .catch(err => {
            console.log("Error", err);
          });
      } else if (obj.already_registered) {
        console.log("phone", phone);
        Firebase.getProfile(phone).then(res => {
          console.log("uid", res.id);
          this.props.dispatch(saveOnboarding(res.data()));
          this.props.dispatch(saveUID(res.id));
          AsyncStorage.setItem("profile", JSON.stringify(res.data()));
          AsyncStorage.setItem("uid", res.id);
          let getPet = Firebase.getPetDatafromUID(res.id);
          let getBike = Firebase.getBikeDatafromUID(res.id);
          let getHealth = Firebase.getHealthDatafromUID(res.id);
          let getHome = Firebase.getHomeDatafromUID(res.id);
          Promise.all([getPet, getBike, getHealth, getHome])
            .then(res => {
              if (res) {
                console.log("promise all", res);
                console.log("pet", res[0]);
                console.log("bike", res[1]);
                console.log("health", res[2]);
                console.log("home", res[3]);
                if (res[0]) {
                  console.log("dispatch savePet");
                  this.props.dispatch(savePet(res[0]));
                  AsyncStorage.setItem("petprofile", JSON.stringify(res[0]));
                }
                if (res[1]) {
                  console.log("dispatch saveBike");
                  this.props.dispatch(saveBike(res[1]));
                  AsyncStorage.setItem("bikeprofile", JSON.stringify(res[1]));
                }
                if (res[2]) {
                  console.log("dispatch saveHealth");
                  this.props.dispatch(saveHealth(res[2]));
                  AsyncStorage.setItem("healthprofile", JSON.stringify(res[2]));
                }
                if (res[3]) {
                  console.log("dispatch saveHome");
                  this.props.dispatch(saveHome(res[3]));
                  AsyncStorage.setItem("homeprofile", JSON.stringify(res[3]));
                }
                setTimeout(() => this.props.navigation.navigate("Main"), 100);
              } else
                setTimeout(() => this.props.navigation.navigate("Main"), 100);
            })
            .catch(err => {
              Alert.alert("Error", err);
            });
        });
      } else this.setState(obj);
    }
  };
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 20,
    color: colors.darkblue,
    fontWeight: "700",
    marginBottom: 20
  },
  subcaption: {
    fontSize: 15,
    textAlign: "center"
  },
  containter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    paddingTop: 20,
    marginTop: 100,
    backgroundColor: colors.white
  },
  subcontainer: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between"
  }
});
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
)(Onboard);
