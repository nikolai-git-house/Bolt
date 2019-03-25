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
  AsyncStorage,
  Platform,
  Button,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SegmentedControlTab from "react-native-segmented-control-tab";
import ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
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
      imagesArray: [
        require("../../../assets/avatar.png"),
        default_avatar,
        default_avatar,
        default_avatar
      ],
      homepack: "Activate",
      petpack: "Bolt-on"
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  selectPhotoTapped(id) {
    let thisElement = this;
    console.log(id);
  }
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
  onActivate_HomePack = () => {
    this.setState({ homepack: "Activated" });
  };
  onBolt_PetPack = () => {
    this.setState({ petpack: "Bolt-off" });
  };
  render() {
    const { basic } = this.props;
    const imgs = this.state.imagesArray;
    const {
      homepack,
      petpack,
      accomodation_statusImg,
      location_statusImg,
      bedroom_statusImg,
      price_statusImg
    } = this.state;
    return (
      <KeyboardAwareScrollView
        style={{ width: Metrics.screenWidth, height: Metrics.screenHeight }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            backgroundColor: colors.lightgrey
          }}
        >
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.navigateTo("Personal")}
            >
              <Image source={require("../../../assets/personal_icon.png")} />
              <Text style={{ fontSize: 12 }}>Personal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonClk}>
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
              width: "100%",
              height: 100,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {imgs.map(obj => {
              return (
                <TouchableOpacity
                  key={obj.key}
                  onPress={this.selectPhotoTapped("2")}
                >
                  <ImageBackground style={styles.imageContainer} source={obj} />
                </TouchableOpacity>
              );
            })}
          </View>
          <View
            style={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
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
                style={homepack == "Activate" ? styles.CtoA : styles.CtoA_Clk}
                onPress={this.onActivate_HomePack}
              >
                <Text style={{ fontSize: 14, color: colors.darkblue }}>
                  {homepack}
                </Text>
              </TouchableOpacity>
            </View>
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
          <View
            style={{
              width: "100%",
              height: 170,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            <View style={styles.Section}>
              <Image
                source={require("../../../assets/user.png")}
                style={{ width: 20, height: 20 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Accommodation Status"
                onChangeText={userString => {
                  this.setState({ userString });
                }}
              />
              <Image
                source={accomodation_statusImg}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </View>
            <View style={styles.Section}>
              <Image
                source={require("../../../assets/placeholder.png")}
                style={{ width: 20, height: 20 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Number, StreetName, City, PostCode"
                onChangeText={addressString => {
                  this.setState({ addressString });
                }}
              />
              <Image
                source={location_statusImg}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </View>
            <View style={styles.Section}>
              <Image
                source={require("../../../assets/bed.png")}
                style={{ width: 20, height: 20 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Bedrooms"
                onChangeText={phoneString => {
                  this.setState({ phoneString });
                }}
              />
              <Image
                source={bedroom_statusImg}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </View>
            <View style={styles.Section}>
              <Image
                source={require("../../../assets/house.png")}
                style={{ width: 20, height: 20 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                onChangeText={jobString => {
                  this.setState({ jobString });
                }}
              />
              <Image
                source={price_statusImg}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
            </View>
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
  Title: { fontSize: 35, fontFamily: "Andallan" },
  CtoA: {
    borderRadius: 20,
    borderRadius: 20,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 50,
    backgroundColor: "rgba(255, 255, 0,1)"
  },
  CtoA_Clk: {
    borderRadius: 20,
    borderRadius: 20,
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 50,
    backgroundColor: "rgba(255, 255, 0, 0.3)"
  },
  CallAction: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 10,
    backgroundColor: "#152439"
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
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
    borderBottomColor: "#f0eff5",
    borderBottomWidth: 1,
    fontSize: 18,
    backgroundColor: "#fff",
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
)(HomeProfile);
