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
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import ImageResizer from "react-native-image-resizer";
import colors from "../../../theme/Colors";
import { Metrics } from "../../../theme";
import ImgToBase64 from "react-native-image-base64";
import { saveOnboarding, removeAll } from "../../../Redux/actions/index";
import Firebase from "../../../firebasehelper";
import {
  isSession,
  isEmailValidate,
  isPasswordValidate,
  isJsonOk
} from "../../../utils/functions";
const ok_img = require("../../../assets/success.png");
const cross_img = require("../../../assets/error.png");
const home_img = require("../../../assets/popup/home.png");
const balloon_img = require("../../../assets/popup/balloon.png");
const error_img = require("../../../assets/popup/error.png");
const profile_img = require("../../../assets/personal/profile.png");
const member_img = require("../../../assets/personal/member.png");
class PersonalProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      fullname: "",
      dob: "",
      phonenumber: "",
      activated: false,
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
  openExplore = () => {
    this.toggleSuccess(false);
    this.navigateTo("Explore");
  };
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
  componentWillReceiveProps(props) {
    let basic = props.basic;
    const { email, password } = basic;
    if (email && password) this.setState({ activated: true });
    //this.setState({ isloggedIn: true });
    this.setState({ email, password });
    if (email) this.setState({ email_statusImg: ok_img });
    if (password) this.setState({ password_statusImg: ok_img });
  }
  componentDidMount() {
    let _this = this;
    let basic = this.props.basic;
    if (!basic) {
      basic = {
        firstname: "test",
        lastname: "test",
        dob: "08/12/1994",
        phonenumber: "+971553818380",
        email: "test@gmail.com",
        password: "test"
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
      if (basic.email) {
        this.setState({ activated: true });
        this.setState({ email_statusImg: ok_img });
      }
      if (basic.password) this.setState({ password_statusImg: ok_img });
      if (basic.avatar_url) {
        const source = { uri: basic.avatar_url };
        this.setState({ ImageSource: source });
      }
      this.setState(basic);
    }
  }
  selectPhotoTapped() {
    let uid = this.props.uid;
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
      //let source = { uri: "data:image/jpeg;base64," + response.data };
      console.log("imgSource", source);
      let source = { uri: response.uri };

      thisElement.setState({
        ImageSource: source
      });
      this.uploadImage(response.uri, uid);
    });
  }
  uploadImage(uri, uid) {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    const tempWindowXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    return ImageResizer.createResizedImage(uri, 300, 300, "JPEG", 80).then(
      resizedImageUri => {
        console.log("resizedImageUri", resizedImageUri);
        const uploadUri =
          Platform.OS === "ios"
            ? resizedImageUri.uri.replace("file://", "")
            : resizedImageUri.uri;
        console.log("UploadUri", uploadUri);
        let mime = "image/jpg";
        let uploadBlob = null;
        const path = "avatars/";
        const imageRef = Firebase.storage()
          .ref(path)
          .child(`${uid}.jpg`);
        console.log("imageRef=", imageRef);
        return fs
          .readFile(uploadUri, "base64")
          .then(data => {
            return Blob.build(data, { type: `${mime};BASE64` });
          })
          .then(blob => {
            uploadBlob = blob;
            return imageRef.put(blob, { contentType: mime });
          })
          .then(() => {
            uploadBlob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            window.XMLHttpRequest = tempWindowXMLHttpRequest;
            Firebase.pushProfileImage(uid, url).then(res => {
              console.log("pushProfileImage", res);
            });
          });
      }
    );
  }
  Activate = () => {
    const { uid } = this.props;
    const { email, password } = this.state;
    Firebase.activate(uid, email, password)
      .then(res => {
        this.props.dispatch(saveOnboarding(res));
        AsyncStorage.setItem("profile", JSON.stringify(res));
        console.log("activate result", res);
        this.toggleSuccess(true);
      })
      .catch(err => {
        console.log("Error", err);
      });
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
  };
  EditJob = txt => {
    this.setState({ job: txt });
    this.setState({ updating: "true" });
  };
  startProfileTest = () => {
    this.navigateTo("ProfileTest");
  };
  LogOut = () => {
    this.props.dispatch(removeAll());
    AsyncStorage.removeItem("profile");
    AsyncStorage.removeItem("uid");
    AsyncStorage.removeItem("petprofile");
    AsyncStorage.removeItem("bikeprofile");
    AsyncStorage.removeItem("healthprofile");
    console.log("LogOut,AsyncStorage", AsyncStorage.getItem("profile"));
    this.setState({ editable: true, isloggedIn: false });
    setTimeout(() => {
      this.props.navigation.navigate("Landing");
    }, 1000);
  };
  render() {
    const {
      fullname,
      firstname,
      lastname,
      dob,
      phonenumber,
      email,
      password,
      activated,
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
    let avatar_url = basic.avatar_url;
    var image = (
      <ImageBackground
        style={styles.imageContainer}
        source={{ uri: avatar_url }}
      />
    );
    return (
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
            {firstname} {lastname}'s Personal Profile
          </Text>
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
                  onPress={this.openExplore}
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

          <View
            style={{
              width: "90%",
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.white,
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
              <TouchableOpacity
                onPress={this.selectPhotoTapped.bind(this)}
                style={styles.avatar}
              >
                <ImageBackground
                  style={styles.imageContainer}
                  source={this.state.ImageSource}
                />
              </TouchableOpacity>
              {isloggedIn && (
                <TouchableOpacity
                  style={styles.CallAction}
                  onPress={() => this.LogOut()}
                >
                  <Text>LogOut</Text>
                </TouchableOpacity>
              )}
              {email_statusImg === ok_img &&
                password_statusImg === ok_img &&
                !activated && (
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => this.Activate()}
                  >
                    <Text>Activate</Text>
                  </TouchableOpacity>
                )}
            </View>
            <View
              style={{
                width: "100%",
                flex: 1,
                alignItems: "flex-start",
                paddingLeft: 20
              }}
            >
              <View style={styles.Section}>
                <Image
                  source={
                    activated
                      ? require(`../../../assets/activated.png`)
                      : require(`../../../assets/nonactivated.png`)
                  }
                  style={{ width: 18, height: 18, marginRight: 10 }}
                />
                <Text>{activated ? "Active member" : "Non active member"}</Text>
              </View>
              <View style={styles.Section}>
                <Image
                  source={require("../../../assets/gift.png")}
                  style={{ width: 18, height: 18, marginRight: 10 }}
                />
                <Text style={styles.input}>{dob}</Text>
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
                <Text style={styles.input}>{email}</Text>
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
                <Text style={styles.input}>{password}</Text>
                <Image
                  source={password_statusImg}
                  style={{ width: 18, height: 18, marginLeft: "auto" }}
                />
              </View>
            </View>
          </View>
          {/* <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.CallAction}>
              <Text style={{ color: colors.darkblue, fontSize: 15 }}>
                Share ID
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.CallAction}>
              <Text style={{ color: colors.darkblue, fontSize: 15 }}>
                Edit ID
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.CallAction}>
              <Text style={{ color: colors.darkblue, fontSize: 15 }}>
                Save Entry
              </Text>
            </TouchableOpacity>
          </View> */}
          {/* <View style={styles.buttonContainer}>
            <Image source={profile_img} style={styles.img} />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center"
              }}
            >
              <Text style={styles.Title}> Basic Profile</Text>
              <Text style={{ fontSize: 14 }}>Use the basic features</Text>
            </View>

            <TouchableOpacity style={styles.CallAction}>
              <Text style={{ color: colors.darkblue, fontSize: 15 }}>
                Activate
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Image source={member_img} style={styles.img} />
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center"
              }}
            >
              <Text style={styles.Title}> Verified profile</Text>
              <Text style={{ fontSize: 14 }}>Verified ID for extra access</Text>
            </View>

            <TouchableOpacity style={styles.CallAction}>
              <Text style={{ color: colors.darkblue, fontSize: 15 }}>
                Take Test
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  Title: {
    fontSize: 18,
    fontFamily: "Quicksand",
    color: colors.darkblue,
    fontWeight: "700"
  },
  CallAction: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 30,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: colors.darkblue,
    borderWidth: 1,
    backgroundColor: colors.lightgrey,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  avatar: {
    marginTop: 20,
    shadowOffset: { height: 1, width: 1 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3
  },
  img: {
    width: 55,
    height: 55
  },
  buttonGroup: {
    width: "90%",
    height: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.white
  },
  buttonContainer: {
    width: "90%",
    height: 70,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    marginTop: 10
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
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    overflow: "hidden",
    marginBottom: 10
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 30,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: colors.darkblue,
    borderWidth: 1,
    backgroundColor: colors.lightgrey,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  Section: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    width: "100%"
  },
  Name: {
    fontSize: 20,
    color: colors.darkblue
  },
  input: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 14,
    backgroundColor: "transparent"
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
)(PersonalProfile);
