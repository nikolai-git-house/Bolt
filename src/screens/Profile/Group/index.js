import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  Modal,
  ActivityIndicator,
  WebView,
  ScrollView,
  Platform
} from "react-native";
import colors from "../../../theme/Colors";
import { connect } from "react-redux";
import { saveOnboarding } from "../../../Redux/actions/index";
import Firebase from "../../../firebasehelper";
import MemberItem from "../../../components/MemberItem";
import { sendInvitation } from "../../../functions/Auth";
import Metrics from "../../../theme/Metrics";
import { removeItemfromArray } from "../../../utils/functions";
const error_img = require("../../../assets/popup/error.png");
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const invite_img = require("../../../assets/popup/home.png");

class GroupProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localUri: null,
      data: [],
      errorVisible: false,
      inviteVisible: false,
      error_msg: "",
      phone: "",
      username: "",
      firebase_loading: false,
      webview: false
    };
  }
  componentDidMount() {
    const { uid } = this.props;
    this.setState({ firebase_loading: true });
    Firebase.findFriends(uid)
      .then(res => {
        let member_array = res;
        let friends = removeItemfromArray(member_array, uid);
        console.log("friends_array", friends);
        if (friends) {
          let promises = friends.map(item => {
            return Firebase.getUserDatafromUID(item).then(res => {
              const username = res.firstname + " " + res.lastname;
              return {
                username: username,
                img: require("../../../assets/Groups/semon.jpg")
              };
            });
          });
          Promise.all(promises).then(res => {
            console.log("friends", res);
            res.push({ username: "", img: "" });
            this.setState({ firebase_loading: false });
            this.setState({ data: res });
          });
        } else {
          this.setState({ firebase_loading: false });
          this.setState({ data: [{ username: "", img: "" }] });
          this.setState({ webview: true });
        }
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };
  onLoadFinished = () => {
    if (this.webview) {
      console.log("posted message");
      this.webview.postMessage("group_botMessages");
    }
  };
  onAdd = () => {
    const { uid } = this.props;
    this.setState({ firebase_loading: true });
    Firebase.isActive(uid)
      .then(res => {
        this.setState({ firebase_loading: false });
        if (res) {
          this.toggleInvite(true);
        } else {
          this.setState({
            error_msg:
              "You are not active member. Please activate your profile to add member."
          });
          this.toggleError();
        }
      })
      .catch(err => {
        this.setState({ error_msg: err });
        this.toggleError();
      });
  };
  addMember = phone => {
    const { basic } = this.props;
    const { username, data } = this.state;
    const groupId = basic.groupId;
    const inviter = basic.firstname + " " + basic.lastname;
    if (groupId) {
      Firebase.getProfile(phone).then(res => {
        if (res) {
          const friend_id = res.id;
          console.log("groupId", groupId);
          console.log("friend_id", friend_id);
          Firebase.addMember(groupId, friend_id).then(result => {
            console.log("result", result);
            let response = sendInvitation(phone, inviter);
            //add user to list of members.
            let temp = data;
            temp.splice(temp.length - 1, 0, {
              username: username,
              img: require("../../../assets/Groups/semon.jpg")
            });
            this.setState({ data: temp });
            this.toggleInvite(false);
          });
        }
      });
    } else {
      this.setState({
        error_msg:
          "You are not member of any group. You can't invite any people."
      });
      this.toggleError();
    }
  };
  onChangePhoneNumber = phone => {
    this.setState({ phone: phone });
  };
  onChangeUsername = username => {
    this.setState({ username: username });
  };
  toggleError = visible => {
    this.setState({ errorVisible: visible });
  };
  toggleInvite = visible => {
    this.setState({ inviteVisible: visible });
  };
  Invite = () => {
    const { basic } = this.props;
    const inviter = basic.firstname + " " + basic.lastname;
    const { phone, username, data } = this.state;
    if (username) this.addMember(phone);
  };
  onEventHandler = data => {
    const { uid, basic } = this.props;
    const { first_member_name, first_member_phone } = this.state;

    const obj = JSON.parse(data);
    const key = Object.keys(obj)[0];
    // console.log("key", key);
    // console.log("value", obj[key]);
    console.log(obj);
    if (obj.onboardingFinished) {
      this.addMember(first_member_phone);
      setTimeout(() => this.setState({ webview: false }), 2000);
    } else this.setState(obj);
  };
  render() {
    const data = this.state.data;
    const {
      error_msg,
      phone,
      username,
      firebase_loading,
      webview
    } = this.state;

    return (
      <View style={styles.maincontainer}>
        {firebase_loading && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              position: "absolute",
              right: 0,
              top: 0,
              backgroundColor: "transparent",
              width: "100%",
              height: Metrics.screenHeight,
              zIndex: 100
            }}
          >
            <ActivityIndicator size="large" color={colors.darkblue} />
          </View>
        )}
        {webview && (
          <WebView
            ref={r => (this.webview = r)}
            originWhitelist={["*"]}
            source={
              Platform.OS === "ios"
                ? { uri: "./external/onboarding/index.html" }
                : require("../../../webview/onboarding/index.html")
            }
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
          <View
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
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
                marginBottom: 50
              }}
            >
              My Housemates Group
            </Text>
            <ScrollView>
              {data.map((obj, index) => {
                return (
                  <MemberItem
                    key={index}
                    avatar={obj.img}
                    onAdd={this.onAdd}
                    username={obj.username}
                  />
                );
              })}
            </ScrollView>
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
                <View style={styles.modal}>
                  <Image source={error_img} style={{ width: 80, height: 80 }} />
                  <Text style={{ fontWeight: "700" }}>Error.</Text>
                  <Text style={{ textAlign: "center" }}>{error_msg}</Text>

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
                      shadowColor: "black",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.2,
                      elevation: 3
                    }}
                  >
                    <Text style={styles.text}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
            <Modal
              animationType={"fade"}
              transparent={true}
              visible={this.state.inviteVisible}
              onRequestClose={() => {}}
            >
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => this.toggleInvite(false)}
                >
                  <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <Text style={styles.Title}>Invitation</Text>
                  <Text style={{ textAlign: "center", marginBottom: 20 }}>
                    Please input your friend's name and phone number here.
                  </Text>
                  <TextInput
                    placeholder="+44"
                    onChangeText={txt => this.onChangePhoneNumber(txt)}
                    value={phone}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Firstname Lastname"
                    onChangeText={txt => this.onChangeUsername(txt)}
                    value={username}
                    style={styles.input}
                  />
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around"
                    }}
                  >
                    <TouchableHighlight
                      onPress={this.Invite}
                      style={{
                        backgroundColor: colors.yellow,
                        width: 100,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "black",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.2,
                        elevation: 3
                      }}
                    >
                      <Text style={styles.text}>OK</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => {
                        this.toggleInvite(false);
                      }}
                      style={{
                        backgroundColor: colors.yellow,
                        width: 100,
                        height: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "black",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.2,
                        elevation: 3
                      }}
                    >
                      <Text style={styles.text}>Cancel</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 5,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2 // Android,
  },
  buttonClk: {
    width: 100,
    height: 100,
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 5,
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 8, width: 8 }, // IOS
    shadowOpacity: 0.4, // IOS
    shadowRadius: 0.2, //IOS
    elevation: 2 // Android,
  },
  Title: {
    fontSize: 20,
    fontFamily: "Quicksand",
    color: colors.darkblue,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20
  },
  CallAction: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: 40,
    borderRadius: 5,
    backgroundColor: colors.darkblue
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
    padding: 20
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: "hidden"
  },
  Section: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  Icon: {
    padding: 10
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.darkblue,
    width: "100%",
    paddingLeft: 10,
    marginBottom: 20
  },
  tabStyle: {
    backgroundColor: "#f0eff5"
  },
  activeTabTextStyle: {
    color: "#fff"
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
    uid: state.uid,
    basic: state.basic
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupProfile);
