import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Button,
  Keyboard,
  Dimensions,
  TextInput,
  findNodeHandle,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  TouchableHighlight,
  AsyncStorage,
  WebView
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-picker";
import colors from "../../../theme/Colors";
import CheckDiv from "../../../components/CheckDiv";
import Twocheckbox from "../../../components/Twocheckbox";
import Firebase from "../../../firebasehelper";
import { savePet } from "../../../Redux/actions/index";
import Metrics from "../../../theme/Metrics";

const ok_img = require("../../../assets/success.png");
const error_img = require("../../../assets/popup/error.png");
class PetsProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: require("../../../assets/Pets/avatar.jpeg"),
      petpack: "Bolt-on",
      petprofile: {
        pet_profile_checked: [false, false, false, false]
      },
      saving: false,
      errorVisible: false,
      error_msg: "",
      editable: false,
      button_txt: "Edit Profile Information",
      webview: true
    };
  }
  componentDidMount() {
    const { pet } = this.props;
    console.log("pet", pet);
    if (pet && Object.keys(pet).length !== 0) {
      this.setState({ petprofile: pet });
      this.setState({ webview: false });
      let keyboardScrollView = this.refs.KeyboardAwareScrollView;
      if (keyboardScrollView) keyboardScrollView.update();
    } else {
      this.setState({ webview: true });
    }
  }
  onLoadFinished = () => {
    if (this.webview) {
      console.log("posted message");
      this.webview.postMessage("pet_botMessages");
    }
  };
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
  toggleEdit = () => {
    const { editable } = this.state;
    if (editable) {
      this.setState({ button_txt: "Edit Profile Information" });
    } else {
      this.setState({ button_txt: "Save Profile Information" });
    }
    this.setState({ editable: !editable });
  };
  save = () => {
    const { uid } = this.props;
    let { petprofile, editable } = this.state;
    if (editable) {
      this.setState({ saving: true });
      petprofile["uid"] = uid;
      Firebase.isActive(uid).then(res => {
        if (res) {
          Firebase.pet_signup(petprofile)
            .then(res => {
              this.props.dispatch(savePet(petprofile));
              AsyncStorage.setItem("petprofile", JSON.stringify(petprofile));
              console.log("saving", "false");
              this.setState({ saving: false });
              this.toggleEdit();
            })
            .catch(err => {
              alert(err);
            });
        } else {
          this.setState({ saving: false });
          this.setState({
            error_msg:
              "You are not active member. Please activate your profile."
          });
          this.toggleError();
        }
      });
    } else {
      this.toggleEdit();
    }
  };
  toggleError = visible => {
    this.setState({ errorVisible: visible });
  };
  onBolt_PetPack = () => {
    this.setState({ petpack: "Bolt-off" });
  };
  onCheck = index => {
    let { petprofile } = this.state;
    let temp = petprofile.pet_profile_checked;
    const value = petprofile.pet_profile_checked[index];
    temp[index] = !value;
    petprofile.pet_profile_checked = temp;
    this.setState({ petprofile: petprofile });
  };
  EditInput = (property, value) => {
    let { petprofile } = this.state;
    petprofile[property] = value;
    this.setState({ petprofile: petprofile });
  };
  checkFirst = property => {
    let { petprofile } = this.state;
    console.log("checkFirst petprofile", petprofile);
    if (property === "sex") {
      petprofile["sex"] = "Female";
    } else {
      petprofile[property] = "Yes";
    }
    this.setState({ petprofile: petprofile });
  };
  checkSecond = property => {
    let { petprofile } = this.state;
    console.log("checkSecond petprofile", petprofile);
    if (property === "sex") {
      petprofile["sex"] = "Male";
    } else {
      petprofile[property] = "No";
    }
    this.setState({ petprofile: petprofile });
  };
  onEventHandler = data => {
    const { petprofile } = this.state;
    const { uid } = this.props;
    let temp = petprofile;
    const obj = JSON.parse(data);
    const key = Object.keys(obj)[0];
    console.log("key", key);
    console.log("value", obj[key]);
    temp[key] = obj[key];
    this.setState({ petprofile: temp });

    console.log(obj);
    if (obj.onboardingFinished) {
      temp["uid"] = uid;
      this.setState({ petprofile: temp });
      Firebase.pet_signup(temp)
        .then(res => {
          this.props.dispatch(savePet(temp));
          AsyncStorage.setItem("petprofile", JSON.stringify(temp));
        })
        .catch(err => {
          alert(err);
        });
      setTimeout(() => this.setState({ webview: false }), 1000);
      console.log("petprofile", petprofile);
    } else this.setState(obj);
  };
  render() {
    const {
      ImageSource,
      petpack,
      petprofile,
      saving,
      error_msg,
      editable,
      button_txt,
      webview
    } = this.state;
    console.log("petprofile", petprofile);
    return (
      <View style={styles.maincontainer}>
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
          <KeyboardAwareScrollView
            style={{ width: "100%", height: "100%" }}
            ref="KeyboardAwareScrollView"
            extraScrollHeight={100}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                backgroundColor: colors.white,
                paddingBottom: 50
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
                My Pet Profile
              </Text>
              <View style={[styles.Row, { marginBottom: 20 }]}>
                <TouchableOpacity
                  onPress={this.selectPhotoTapped.bind(this)}
                  style={styles.avatar}
                >
                  <ImageBackground
                    style={styles.imageContainer}
                    source={ImageSource}
                  />
                </TouchableOpacity>
                <View style={styles.PetsContainer}>
                  <View style={styles.Row}>
                    <TextInput
                      style={styles.Title}
                      placeholder="Name"
                      onChangeText={txt => this.EditInput("petname", txt)}
                      value={petprofile.pet_name}
                      editable={editable}
                    />
                    {!editable && petprofile.pet_name && (
                      <Image
                        source={ok_img}
                        style={{ width: 18, height: 18, marginLeft: "auto" }}
                      />
                    )}
                  </View>
                  <View style={styles.Row}>
                    <View style={styles.Column}>
                      <Text style={styles.subTitle}>SPECIES</Text>
                      <View style={styles.checkedItem}>
                        <TextInput
                          style={{ backgroundColor: "transparent" }}
                          placeholder="SPECIES"
                          onChangeText={txt => this.EditInput("species", txt)}
                          value={petprofile.species}
                          editable={editable}
                        />
                        {!editable && petprofile.species && (
                          <Image
                            source={ok_img}
                            style={{
                              width: 18,
                              height: 18,
                              marginLeft: "auto"
                            }}
                          />
                        )}
                      </View>
                    </View>
                    <View style={styles.Column}>
                      <Text style={styles.subTitle}>GENDER</Text>
                      <View style={styles.checkedItem}>
                        <Text>{petprofile.pet_gender}</Text>
                        {!editable && petprofile.pet_gender && (
                          <Image
                            source={ok_img}
                            style={{
                              width: 18,
                              height: 18,
                              marginLeft: "auto"
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                  <View style={styles.Row}>
                    <View style={styles.Column}>
                      <Text style={styles.subTitle}>AGE</Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        {editable && (
                          <TextInput
                            style={{
                              borderBottomColor: colors.darkblue,
                              borderBottomWidth: 1,
                              width: 19
                            }}
                            keyboardType="numeric"
                            onChangeText={txt => this.EditInput("years", txt)}
                            value={petprofile.years}
                            editable={editable}
                          />
                        )}
                        {editable && <Text>years</Text>}
                        {editable && (
                          <TextInput
                            style={{
                              borderBottomColor: colors.darkblue,
                              borderBottomWidth: 1,
                              width: 19,
                              marginLeft: 5
                            }}
                            keyboardType="numeric"
                            onChangeText={txt => this.EditInput("months", txt)}
                            value={petprofile.months}
                            editable={editable}
                          />
                        )}
                        {editable && <Text>months</Text>}
                        {!editable && (
                          <View style={styles.checkedItem}>
                            <Text>{petprofile.pet_age}</Text>
                            <Image
                              source={ok_img}
                              style={{
                                width: 18,
                                height: 18,
                                marginLeft: "auto"
                              }}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "90%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  marginTop: 20,
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
                      source={require("../../../assets/pet.png")}
                    />
                    <Text style={{ fontSize: 16 }}>Pet Pack</Text>
                  </View>
                  <TouchableOpacity
                    style={petpack == "Bolt-on" ? styles.CtoA : styles.CtoA_Clk}
                    onPress={this.onBolt_PetPack}
                  >
                    <Text style={{ fontSize: 14, color: colors.darkblue }}>
                      Bolt-on
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.Title}>Tell us about your pet</Text>

              {editable && <Text style={styles.Title}>Gender</Text>}
              {editable && (
                <Twocheckbox
                  title1="Female"
                  title2="Male"
                  value={petprofile.sex}
                  onCheckFirst={() => this.checkFirst("sex")}
                  onCheckSecond={() => this.checkSecond("sex")}
                />
              )}
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>FAVOURITE FOOD TREAT</Text>
                <View
                  style={[
                    styles.checkedItem,
                    {
                      justifyContent: "space-between",
                      width: "100%"
                    }
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput("fav_food", txt)}
                    value={petprofile.pet_favourite_food}
                    editable={editable}
                  />
                  {!editable && petprofile.pet_favourite_food && (
                    <Image
                      source={ok_img}
                      style={{ width: 18, height: 18, marginLeft: "auto" }}
                    />
                  )}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>SPECIAL FOOD REQUIREMENT</Text>
                <View
                  style={[
                    styles.checkedItem,
                    {
                      justifyContent: "space-between",
                      width: "100%"
                    }
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput("special_food", txt)}
                    value={petprofile.pet_special_food}
                    editable={editable}
                  />
                  {!editable && petprofile.pet_special_food && (
                    <Image
                      source={ok_img}
                      style={{ width: 18, height: 18, marginLeft: "auto" }}
                    />
                  )}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>FAVOURITE TOY</Text>

                <View
                  style={[
                    styles.checkedItem,
                    {
                      justifyContent: "space-between",
                      width: "100%"
                    }
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput("toy", txt)}
                    value={petprofile.pet_toy}
                    editable={editable}
                  />
                  {!editable && petprofile.pet_toy && (
                    <Image
                      source={ok_img}
                      style={{ width: 18, height: 18, marginLeft: "auto" }}
                    />
                  )}
                </View>
              </View>

              {/* <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>IF YES, PILL OR INJECTION?</Text>
                <View style={[styles.checkedItem, { width: "100%" }]}>
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput("pill", txt)}
                    value={petprofile.pill}
                    editable={editable}
                  />
                  {!editable && petprofile.pill && (
                    <Image
                      source={ok_img}
                      style={{ width: 18, height: 18, marginLeft: "auto" }}
                    />
                  )}
                </View>
              </View> */}
              <Text style={styles.Title}>Emergency Contact</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>CONTACT FULL NAME</Text>
                <View
                  style={[
                    styles.checkedItem,
                    {
                      justifyContent: "space-between",
                      width: "100%"
                    }
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput("contact_name", txt)}
                    value={petprofile.vet_name}
                    editable={editable}
                  />
                  {!editable && petprofile.vet_name && (
                    <Image
                      source={ok_img}
                      style={{ width: 18, height: 18, marginLeft: "auto" }}
                    />
                  )}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.subTitle}>CONTACT NUMBER</Text>
                <View
                  style={[
                    styles.checkedItem,
                    {
                      justifyContent: "space-between",
                      width: "100%"
                    }
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    onChangeText={txt => this.EditInput("contact_number", txt)}
                    value={petprofile.phone}
                    editable={editable}
                  />
                  {!editable && petprofile.phone && (
                    <Image
                      source={ok_img}
                      style={{ width: 18, height: 18, marginLeft: "auto" }}
                    />
                  )}
                </View>
              </View>

              {!saving && (
                <TouchableOpacity style={styles.CallAction} onPress={this.save}>
                  <Text style={{ color: colors.yellow, fontSize: 15 }}>
                    {button_txt}
                  </Text>
                </TouchableOpacity>
              )}
              {saving && (
                <ActivityIndicator size="large" color={colors.darkblue} />
              )}
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
                <View style={styles.modal}>
                  <Image source={error_img} style={{ width: 80, height: 80 }} />
                  <Text style={{ fontWeight: "700" }}>Error</Text>
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
          </KeyboardAwareScrollView>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Title: {
    fontSize: 20,
    fontFamily: "Quicksand",
    color: colors.darkblue,
    fontWeight: "700",
    textAlign: "center"
  },
  subTitle: { fontSize: 15, color: colors.darkblue },
  CallAction: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.darkblue
  },
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
    shadowOpacity: 0.2,
    elevation: 3
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
  Row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },

  Column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10
  },
  checkedItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  },
  PetsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    backgroundColor: colors.white
  },
  inputGroup: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  input: {
    height: 20,
    fontSize: 18,
    borderWidth: 0,
    paddingLeft: 5,
    paddingRight: 5
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    overflow: "hidden",
    marginBottom: 10,
    marginRight: 30
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
    pet: state.pet
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PetsProfile);
