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
  Modal
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Dialog, { DialogContent } from "react-native-popup-dialog";
import { DialogComponent, SlideAnimation } from "react-native-dialog-component";
import ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import { Metrics } from "../../../theme";
import { register } from "../../../functions/Auth";
import ImgToBase64 from "react-native-image-base64";
import { saveOnboarding } from "../../../Redux/actions/index";
import Firebase from "../../../firebasehelper";
import {
  isSession,
  isEmailValidate,
  isPasswordValidate,
  isJsonOk
} from "../../../utils/functions";
import Popup from "../../../components/Popup";
let profile = {};
const ok_img = require("../../../assets/success.png");
const cross_img = require("../../../assets/error.png");
const home_img = require("../../../assets/popup/home.png");
const balloon_img = require("../../../assets/popup/balloon.png");
const error_img = require("../../../assets/popup/error.png");
class PersonalProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      fullname: "",
      dob: "",
      phonenumber: "",
      job: "photographer",
      ImageSource: require("../../../assets/avatar.png"),
      statusImage: cross_img,
      email_statusImg: cross_img,
      password_statusImg: cross_img,
      updating: "false",
      account_creating: "false",
      editable: true,
      isloggedIn: false,
      modalVisible: false,
      successVisible: false,
      errorVisible: false,
      error_msg: "",
      basic: {
        firstname: "",
        lastname: "",
        dob: "",
        phonenumber: ""
      }
    };
    this.toggleProfile = this.toggleProfile.bind(this);
    this.toggleError = this.toggleError.bind(this);
  }
  toggleProfile(visible) {
    this.setState({ modalVisible: visible });
    this.refs.email_Input.focus();
  }
  toggleSuccess(visible) {
    this.setState({ successVisible: visible });
  }
  toggleError(visible) {
    this.setState({ errorVisible: visible });
  }
  load = () => {
    let _this = this;
    isSession().then(res => {
      if (res) {
        const { email, password, ImageSource } = _this.props.basic;
        console.log(email, password, ImageSource);
        _this.setState({
          email: email,
          key: password,
          ImageSource: require("../../../assets/avatar.png"),
          editable: false,
          updating: false,
          statusImage: ok_img,
          isloggedIn: true,
          email_statusImg: ok_img,
          password_statusImg: ok_img
        });
        console.log("isSession", _this.state);
      } else
        setTimeout(() => {
          this.toggleProfile(true);
        }, 1500);
    });
  };
  componentDidMount() {
    let _this = this;
    console.log("props", this.props);
    let basic = this.props.basic;
    if (!basic) {
      basic = {
        firstname: "test",
        lastname: "test",
        dob: "08/12/1994",
        phonenumber: "+971553818380"
      };
    } else {
      this.setState({ isloggedIn: true });
      const fullname =
        basic.firstname === "" ? "" : basic.firstname + " " + basic.lastname;
      this.setState({ fullname, fullname });
      if (fullname !== "") this.setState({ name_statusImg: ok_img });
      this.setState({ dob: basic.dob });
      if (basic.dob !== "") this.setState({ dob_statusImg: ok_img });
      this.setState({ phonenumber: basic.phonenumber });
      if (basic.email !== "") this.setState({ email_statusImg: ok_img });
      if (basic.password !== "") this.setState({ password_statusImg: ok_img });
      this.setState(basic);
    }
  }
  selectPhotoTapped() {
    let thisElement = this;
    const options = {
      mediaType: "photo", // 'photo' or 'video'
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection

      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: "images",
        cameraRoll: true,
        waitUntilSaved: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let imgData = {
          image:
            Platform.OS === "android"
              ? response.uri
              : response.uri.replace("file://", ""),
          filePath: response.path,
          fileName: response.fileName
        };
      }
      let source = { uri: "data:image/jpeg;base64," + response.data };
      console.log("imgSource", source);
      //let source = { uri: response.uri };
      thisElement.setState({
        ImageSource: source
      });
    });
  }
  Save = async () => {
    const { email, password, ImageSource } = this.state;
    let { basic } = this.props;
    basic.email = email;
    basic.password = key;
    basic.avatar = ImageSource;
    console.log("profile", basic);
    const username = basic.firstname + " " + basic.lastname;
    profile = {
      DOB: basic.dob,
      email: basic.email,
      password: basic.password,
      phone: basic.phone,
      username: username
    };
    if (isEmailValidate(email) && isPasswordValidate(key)) {
      this.setState({ account_creating: "true" });
      register(basic)
        .then(res => {
          console.log("result", res);
          this.setState({ account_creating: "false" });
          if (isJsonOk(res)) {
            const result = JSON.parse(res);
            const { userId, memberId } = result;
            console.log("memberId", memberId);
            profile.memberId = memberId;
            Firebase.writeUserdata(userId, profile);
            console.log("registration Successfully!");
            this.setState({ statusImage: ok_img });

            this.onSuccess(basic);
          } else {
            this.setState({ error_msg: res });
            this.toggleError(true);
          }
        })
        .catch(err => {
          console.log("error", err);
          return;
        });
    }
  };
  onSuccess = profile => {
    this.setState({
      isloggedIn: true,
      editable: false,
      updating: false
    });
    this.toggleSuccess(true);
    this.LogOut();
    //this.props.dispatch(saveOnboarding(profile));
    //AsyncStorage.setItem("profile", JSON.stringify(profile));
  };
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let tabBarLabel = "Profile";
    let tabBarIcon = () => (
      <Image
        source={require("../../../assets/concierge.png")}
        style={{ width: 30, height: 30 }}
      />
    );
    return { tabBarLabel, tabBarIcon };
  };
  navigateTo = page => {
    this.props.navigation.navigate(page);
  };
  EditName = txt => {
    if (txt != "") this.setState({ name_statusImg: ok_img });
    else this.setState({ name_statusImg: cross_img });
    this.setState({ fullname: txt });
  };
  EditEmail = txt => {
    if (isEmailValidate(txt)) this.setState({ email_statusImg: ok_img });
    else this.setState({ email_statusImg: cross_img });
    this.setState({ email: txt });
    this.setState({ updating: "true" });
  };
  EditDOB = dob => {
    if (dob != "") this.setState({ dob_statusImg: ok_img });
    else this.setState({ dob_statusImg: cross_img });
    this.setState({ dob: dob });
  };
  EditPassword = txt => {
    if (isPasswordValidate(txt)) this.setState({ password_statusImg: ok_img });
    else this.setState({ password_statusImg: cross_img });
    this.setState({ password: txt });
    this.setState({ updating: "true" });
  };
  EditJob = txt => {
    this.setState({ job: txt });
    this.setState({ updating: "true" });
  };
  startProfileTest = () => {
    isSession().then(res => {
      if (res) this.navigateTo("ProfileTest");
      else {
        Alert.alert(
          "Alert",
          "You are not ready to test profile. Please create account first",
          [{ text: "OK", onPress: () => this.refs.email_Input.focus() }],
          { cancelable: false }
        );
      }
    });
  };
  LogOut = () => {
    AsyncStorage.removeItem("profile");
    AsyncStorage.removeItem("user_id");
    console.log("LogOut,AsyncStorage", AsyncStorage.getItem("profile"));
    this.setState({ editable: true, isloggedIn: false });
    setTimeout(() => {
      this.props.navigation.navigate("Landing");
    }, 1000);
  };
  render() {
    const {
      fullname,
      dob,
      phonenumber,
      email,
      password,
      job,
      statusImage,
      updating,
      account_creating,
      editable,
      isloggedIn,
      dob_statusImg,
      name_statusImg,
      email_statusImg,
      password_statusImg,
      error_msg
    } = this.state;
    let basic = this.props.basic;
    return (
      <KeyboardAwareScrollView
        style={{ width: Metrics.screenWidth, height: Metrics.screenHeight }}
      >
        <View
          style={{
            width: "100%",
            height: Metrics.screenHeight,
            alignItems: "center",
            backgroundColor: colors.lightgrey
          }}
        >
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
          >
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
              <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onPress={() => this.toggleProfile(false)}
              >
                <View style={{ flex: 1 }} />
              </TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Image source={home_img} style={{ width: 80, height: 80 }} />
                <Text style={{ textAlign: "center" }}>
                  We need to collect some more information from you to create
                  your secure account.
                </Text>
                <Text style={{ fontWeight: "700" }}>
                  You'll have full access to perks.
                </Text>
                <TouchableHighlight
                  onPress={() => {
                    this.toggleProfile(false);
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
                  <Text style={styles.text}>Complete</Text>
                </TouchableHighlight>
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
                <Image source={balloon_img} style={{ width: 80, height: 80 }} />
                <Text style={{ fontWeight: "700" }}>Congratulations.</Text>
                <Text style={{ textAlign: "center" }}>
                  Your profile is now complete. Access your concierge & full
                  perks.
                </Text>
                <TouchableHighlight
                  onPress={() => {
                    this.toggleSuccess(false);
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
                  <Text style={styles.text}>Explore Bolt</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
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
                    borderColor: colors.grey,
                    borderWidth: 1
                  }}
                >
                  <Text style={styles.text}>OK</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          {account_creating == "true" && (
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
          <Image
            source={require("../../../assets/top_bar.png")}
            style={{ width: Metrics.screenWidth, height: 160 }}
          />

          <View
            style={{
              width: "90%",
              height: 100,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: -70,
              marginBottom: 20
            }}
          >
            <TouchableOpacity style={styles.buttonClk}>
              <Image source={require("../../../assets/personal_icon.png")} />
              <Text style={{ fontSize: 12 }}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.navigateTo("Home")}
            >
              <Image source={require("../../../assets/home_icon.png")} />
              <Text style={{ fontSize: 12 }}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.navigateTo("Membership")}
            >
              <Image source={require("../../../assets/membership_icon.png")} />
              <Text style={{ fontSize: 12 }}>Membership</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "90%",
              height: 200,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.lightgrey,
              marginBottom: 50,
              paddingLeft: 20
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                <ImageBackground
                  style={styles.imageContainer}
                  source={this.state.ImageSource}
                />
              </TouchableOpacity>
              {isloggedIn && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => this.LogOut()}
                >
                  <Text>LogOut</Text>
                </TouchableOpacity>
              )}
              {updating == "true" && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => this.Save()}
                >
                  <Text>Activate</Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-start",
                paddingLeft: 20
              }}
            >
              <View style={styles.Section}>
                <TextInput
                  style={styles.Name}
                  placeholder="FirstName LastName"
                  editable={editable}
                  onChangeText={txt => this.EditName(txt)}
                  value={fullname}
                />
                <Image
                  source={name_statusImg}
                  style={{ width: 18, height: 18, marginLeft: "auto" }}
                />
              </View>
              <View style={styles.Section}>
                <Image
                  source={require("../../../assets/gift.png")}
                  style={{ width: 18, height: 18, marginRight: 10 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  editable={editable}
                  onChangeText={txt => this.EditDOB(txt)}
                  value={dob}
                />
                <Image
                  source={dob_statusImg}
                  style={{ width: 18, height: 18, marginLeft: "auto" }}
                />
              </View>
              <View style={styles.Section}>
                <Image
                  source={require("../../../assets/phone.png")}
                  style={{ width: 18, height: 18, marginRight: 10 }}
                />
                <Text>{phonenumber}</Text>
                <Image
                  source={ok_img}
                  style={{ width: 18, height: 18, marginLeft: "auto" }}
                />
              </View>
              <View style={styles.Section}>
                <Image
                  source={require("../../../assets/message.png")}
                  style={{ width: 18, height: 18, marginRight: 10 }}
                />
                <TextInput
                  style={styles.input}
                  ref="email_Input"
                  placeholder="Your email address"
                  editable={editable}
                  onChangeText={txt => this.EditEmail(txt)}
                  value={email}
                />
                <Image
                  source={email_statusImg}
                  style={{ width: 18, height: 18, marginLeft: "auto" }}
                />
              </View>
              <View style={styles.Section}>
                <Image
                  source={require("../../../assets/key.png")}
                  style={{ width: 18, height: 18, marginRight: 10 }}
                />
                <TextInput
                  style={styles.input}
                  editable={editable}
                  placeholder="Your password"
                  onChangeText={txt => this.EditPassword(txt)}
                  value={password}
                />
                <Image
                  source={password_statusImg}
                  style={{ width: 18, height: 18, marginLeft: "auto" }}
                />
              </View>
              <View style={styles.Section}>
                <Image
                  source={require("../../../assets/resume.png")}
                  style={{ width: 18, height: 18, marginRight: 10 }}
                />
                <TextInput
                  style={styles.input}
                  editable={editable}
                  onChangeText={txt => this.EditJob(txt)}
                  value={job}
                />
                <Image
                  source={ok_img}
                  style={{ width: 18, height: 18, marginLeft: "auto" }}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              width: "90%",
              height: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              backgroundColor: colors.white
            }}
          >
            <Text style={styles.Title}> Take a profile test</Text>
            <TouchableOpacity
              style={styles.CallAction}
              onPress={this.startProfileTest}
            >
              <Text style={{ color: colors.darkblue, fontSize: 15 }}>
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  Title: { fontSize: 20, fontFamily: "Quicksand" },
  CallAction: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.yellow
  },
  containerbusiness: {
    paddingLeft: 15,
    paddingRight: 35,
    flexDirection: "row",
    paddingTop: 17,
    paddingBottom: 10
  },
  containergroup: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 20,
    flexDirection: "row"
  },
  containerappsettings: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 25,
    flexDirection: "row"
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
  textFieldContainer: {
    flex: 1,
    //paddingLeft:10
    alignContent: "center",
    justifyContent: "center"
  },
  imageContainer: {
    width: 100,
    height: 100,
    overflow: "hidden",
    marginBottom: 10
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 30,
    borderRadius: 20,
    marginBottom: 5,
    backgroundColor: colors.yellow
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 33, 39, 0.7)",
    borderRadius: 50,
    overflow: "hidden"
  },
  Section: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    width: 200
  },
  Name: {
    fontSize: 20,
    color: colors.darkblue
  },
  Icon: {
    padding: 10
  },
  input: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 14,
    backgroundColor: "transparent"
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
  activeTabTextStyle: {
    color: "#fff"
  }
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalProfile);
