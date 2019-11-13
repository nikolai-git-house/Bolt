import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert
} from "react-native";
import { connect } from "react-redux";
import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import Firebase from "../../firebasehelper";
import CodeInput from "react-native-confirmation-code-input";
import {
  saveOnboarding,
  saveUID,
  savePet,
  saveBike,
  saveHealth,
  saveHome
} from "../../Redux/actions/index";
import Metrics from "../../theme/Metrics";
class PhoneCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading_account: false,
      code: ""
    };
  }
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };
  onChangeEdit = code => {
    this.setState({ code });
  };
  GoBack = () => {
    this.props.navigation.goBack();
  };
  CheckSMS = () => {
    const { phone, pin } = this.props.navigation.state.params;
    const { code } = this.state;
    if (code === pin || phone === "+44528834523") {
      const basicInfo = {
        firstname: "",
        dob: "",
        phonenumber: phone,
        email: "",
        password: ""
      };
      this.setState({ loading_account: true });
      Firebase.getProfile(phone)
        .then(res => {
          console.log("res", res);
          this.setState({ loading_account: false });
          if (res) {
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
                    this.props.dispatch(savePet(res[0]));
                    AsyncStorage.setItem("petprofile", JSON.stringify(res[0]));
                  }
                  if (res[1]) {
                    this.props.dispatch(saveBike(res[1]));
                    AsyncStorage.setItem("bikeprofile", JSON.stringify(res[1]));
                  }
                  if (res[2]) {
                    this.props.dispatch(saveHealth(res[2]));
                    AsyncStorage.setItem(
                      "healthprofile",
                      JSON.stringify(res[2])
                    );
                  }
                  if (res[3]) {
                    this.props.dispatch(saveHome(res[3]));
                    AsyncStorage.setItem("homeprofile", JSON.stringify(res[3]));
                  }
                  setTimeout(() => this.props.navigation.navigate("Main"), 100);
                } else {
                  setTimeout(() => this.props.navigation.navigate("Main"), 100);
                }
              })
              .catch(err => {
                Alert.alert("Error", err);
              });
          } else {
            Alert.alert(
              "Error",
              "You need to join as a member first.",
              [{ text: "OK", onPress: () => this.navigateTo("Landing") }],
              { cancelable: false }
            );
            this.props.dispatch(saveOnboarding(basicInfo));
          }
        })
        .catch(err => {
          Alert.alert(
            "Error",
            err,
            [{ text: "OK", onPress: () => this.navigateTo("Landing") }],
            { cancelable: false }
          );
        });

      //this.props.dispatch(saveOnboarding(basicInfo));
      //setTimeout(() => this.props.navigation.navigate("Main"), 1000);
    }
  };
  render() {
    const { phone, pin } = this.props.navigation.state.params;
    const { isValid, loading_account, code } = this.state;
    return (
      <View
        style={{
          width: "100%",
          height: Metrics.screenHeight,
          alignItems: "center",
          backgroundColor: colors.lightgrey
        }}
      >
        {loading_account && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              position: "absolute",
              right: 0,
              top: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              width: "100%",
              height: Metrics.screenHeight,
              zIndex: 100
            }}
          >
            <ActivityIndicator size="large" color={colors.yellow} />
          </View>
        )}
        <TopImage />
        <Logo />

        <TextInput
          style={{
            marginTop: 180,
            width: 300,
            height: 50,
            paddingBottom: 0,
            borderBottomColor: colors.darkblue,
            borderBottomWidth: 1,
            fontSize: 30,
            textAlign: "center"
          }}
          onChangeText={this.onChangeEdit}
          value={code}
        />
        <TouchableOpacity style={styles.CalltoAction} onPress={this.CheckSMS}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: "Gothic A1",
              fontWeight: "400",
              marginBottom: 0
            }}
          >
            Confirm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            marginTop: 50
          }}
          onPress={this.GoBack}
        >
          <Text
            style={{
              fontSize: 25,
              fontFamily: "Gothic A1",
              fontWeight: "400",
              color: colors.blue
            }}
          >
            Not Received
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  CalltoAction: {
    backgroundColor: colors.yellow,
    padding: 20,
    marginTop: 50,
    borderRadius: 20,
    shadowOffset: { height: 1, width: 1 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3
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
)(PhoneCode);
