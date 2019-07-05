import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  ToolbarAndroid,
  AsyncStorage,
  Platform,
  TextInput,
  WebView
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Firebase from "../../../firebasehelper";
import { saveHome } from "../../../Redux/actions/index";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import StickItem from "../../../components/StickItem";
import { Metrics } from "../../../theme";
const default_avatar = require("../../../assets/plus.png");
const ok_img = require("../../../assets/success.png");
const error_img = require("../../../assets/error.png");
class HomeProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: require("../../../assets/avatar.png"),
      accomodation_statusImg: error_img,
      location_statusImg: error_img,
      bedroom_statusImg: error_img,
      price_statusImg: error_img,
      localUri: null,
      homepack: "Activate",
      petpack: "Bolt-on",
      homeprofile: {},
      webview: true
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
  componentDidMount() {
    const { home } = this.props;
    console.log("home", home);
    if (home && Object.keys(home).length !== 0) {
      console.log("home is not empty");
      this.setState({ homeprofile: home });
      this.setState({ webview: false });
      let keyboardScrollView = this.refs.KeyboardAwareScrollView;
      if (keyboardScrollView) keyboardScrollView.update();
    } else {
      console.log("home is empty");
      this.setState({ webview: true });
    }
  }
  selectPhotoTapped(id) {
    let thisElement = this;
    console.log(id);
  }
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };
  onActivate_HomePack = () => {
    this.setState({ homepack: "Activated" });
  };
  onBolt_PetPack = () => {
    this.setState({ petpack: "Bolt-off" });
  };
  onLoadFinished = () => {
    if (this.webview) {
      console.log("posted message");
      this.webview.postMessage("home_botMessages");
    }
  };
  onEventHandler = data => {
    const { homeprofile } = this.state;
    const { uid } = this.props;
    let temp = homeprofile;
    const obj = JSON.parse(data);
    const key = Object.keys(obj)[0];
    console.log("key", key);
    console.log("value", obj[key]);
    temp[key] = obj[key];
    this.setState({ homeprofile: temp });

    console.log(obj);
    if (obj.onboardingFinished) {
      temp["uid"] = uid;
      this.setState({ homeprofile: temp });
      Firebase.home_signup(temp)
        .then(res => {
          this.props.dispatch(saveHome(temp));
          AsyncStorage.setItem("homeprofile", JSON.stringify(temp));
        })
        .catch(err => {
          alert(err);
        });
      setTimeout(() => this.setState({ webview: false }), 1000);
    } else this.setState(obj);
    console.log("homeprofile", homeprofile);
  };
  render() {
    const { basic } = this.props;
    const imgs = this.state.imagesArray;
    const { homepack, webview, homeprofile } = this.state;
    return (
      <View style={styles.maincontainer}>
        {webview && (
          <WebView
            ref={r => (this.webview = r)}
            originWhitelist={["*"]}
            source={{ uri: "./external/onboarding/index.html" }}
            onMessage={event => this.onEventHandler(event.nativeEvent.data)}
            startInLoadingState
            javaScriptEnabled
            onLoad={this.onLoadFinished}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
          />
        )}
        {!webview && (
          <KeyboardAwareScrollView style={{ width: "100%", height: "100%" }}>
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                backgroundColor: colors.white
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Quicksand",
                  fontSize: 20,
                  fontWeight: "700",
                  marginBottom: 10
                }}
              >
                My Home Profile
              </Text>
              <View
                style={{
                  width: "90%",
                  height: 120,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderBottomColor: colors.grey,
                  borderBottomWidth: 1
                }}
              >
                <StickItem
                  value={basic.renter_owner}
                  checked={true}
                  img={require("../../../assets/home/user.png")}
                />
                <StickItem
                  value={homeprofile.address}
                  checked={true}
                  img={require("../../../assets/home/placeholder.png")}
                />
                <StickItem
                  value={homeprofile.bedrooms}
                  checked={true}
                  img={require("../../../assets/home/bed.png")}
                />
              </View>
              <View
                style={{
                  width: "90%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  backgroundColor: colors.white
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 50,
                    marginBottom: 5,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: 150
                    }}
                  >
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        marginTop: 5,
                        marginLeft: 10,
                        marginRight: 10
                      }}
                      source={require("../../../assets/home.png")}
                    />
                    <Text style={{ fontSize: 16 }}>Home Pack</Text>
                  </View>
                  <TouchableOpacity
                    style={
                      homepack == "Activate" ? styles.CtoA : styles.CtoA_Clk
                    }
                    onPress={this.onActivate_HomePack}
                  >
                    <Text style={{ fontSize: 14, color: colors.darkblue }}>
                      {homepack}
                    </Text>
                  </TouchableOpacity>
                </View>
                <StickItem
                  value="Ai Home chatbot"
                  checked={homepack === "Activated" ? true : false}
                  img={require("../../../assets/home/house.png")}
                />
                <StickItem
                  value="Google Home"
                  checked={homepack === "Activated" ? true : false}
                  img={require("../../../assets/home/house.png")}
                />
                <StickItem
                  value="Wifi"
                  checked={homepack === "Activated" ? true : false}
                  img={require("../../../assets/home/house.png")}
                />
                <StickItem
                  value="Netflix"
                  checked={homepack === "Activated" ? true : false}
                  img={require("../../../assets/home/house.png")}
                />
                <StickItem
                  value="Monthly cleaning"
                  checked={homepack === "Activated" ? true : false}
                  img={require("../../../assets/home/house.png")}
                />
                <StickItem
                  value="Gas, water, electric"
                  checked={homepack === "Activated" ? true : false}
                  img={require("../../../assets/home/house.png")}
                />
                <StickItem
                  value="Contents, damage & keys cover"
                  checked={homepack === "Activated" ? true : false}
                  img={require("../../../assets/home/house.png")}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Title: { fontSize: 35, fontFamily: "Andallan" },
  CtoA: {
    borderRadius: 20,
    borderRadius: 20,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 50,
    backgroundColor: colors.yellow,
    shadowOffset: { height: 1, width: 1 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2
  },
  CtoA_Clk: {
    borderRadius: 20,
    borderRadius: 20,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 50,
    backgroundColor: "rgba(255, 255, 0, 0.3)",
    shadowOffset: { height: 1, width: 1 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2
  },
  CallAction: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 10,
    backgroundColor: "#152439",
    shadowOffset: { height: 1, width: 1 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2
  },
  iconstyle: {
    color: "#9c9ebf"
  },
  textstyle: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    paddingBottom: 3,
    paddingLeft: 10
  },
  textFieldstyle: {
    fontFamily: "System",
    //fontWeight: "600",
    alignSelf: "stretch"
    //height: 44
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: "hidden"
  },
  toolbar: {
    backgroundColor: "#484b89",
    height: 55
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 33, 39, 0.7)",
    borderRadius: 50,
    overflow: "hidden"
  },
  Section: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  Icon: {
    padding: 10
  },
  input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    width: "100%",
    fontSize: 18,
    backgroundColor: "transparent",
    color: "#424242"
  },
  fab: {
    justifyContent: "center",
    alignContent: "center",
    ...Platform.select({
      ios: {
        backgroundColor: "#ecd9fc",
        height: 50,
        width: 70,
        borderRadius: 10
      },
      android: {
        backgroundColor: "#9513fe",
        height: 60,
        width: 60,
        borderRadius: 30
      }
    }),
    position: "absolute",
    bottom: 20,
    right: 20,
    elevation: 3,
    zIndex: 5,
    overflow: "hidden"
  },
  tabStyle: {
    backgroundColor: "#f0eff5"
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: colors.white
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
    uid: state.uid,
    home: state.home
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeProfile);
