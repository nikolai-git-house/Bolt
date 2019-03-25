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
import SegmentedControlTab from "react-native-segmented-control-tab";
import ImagePicker from "react-native-image-picker";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import { Metrics } from "../../../theme";
export default class Membership extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 2,
      localUri: null
    };
  }
  componentWillMount() {
    this.setState({ selectedIndex: 2 });
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
  render() {
    return (
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.navigateTo("Home")}
          >
            <Image source={require("../../../assets/home_icon.png")} />
            <Text style={{ fontSize: 12 }}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonClk}>
            <Image source={require("../../../assets/membership_icon.png")} />
            <Text style={{ fontSize: 12 }}>Membership</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "90%",
            alignItems: "center",
            justifyContent: "space-around"
          }}
        >
          <View style={styles.BasicContainer}>
            <Text
              style={{
                color: colors.darkblue,
                fontSize: 20,
                textAlign: "center"
              }}
            >
              Basic Membership
            </Text>

            <Text
              style={{
                color: colors.darkblue,
                fontSize: 12,
                textAlign: "center",
                fontWeight: "100"
              }}
            >
              Basic members access {"\n"}Access member packages{"\n"}Basic
              subscription{"\n"}Standard discounts
            </Text>
            <TouchableOpacity
              onPress={this._onPress}
              style={[styles.CallAction, { backgroundColor: colors.darkblue }]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.yellow,
                  fontWeight: "100"
                }}
              >
                Active member status
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.PremiumContainer}>
            <Text style={styles.Title}>Premium Member</Text>
            <Text
              style={{
                color: colors.darkblue,
                fontSize: 12,
                textAlign: "center"
              }}
            >
              Access your wallet & diary {"\n"} Bolt cash back card {"\n"}{" "}
              Insider discounts & events {"\n"} Free credit score
            </Text>
            <TouchableOpacity
              onPress={this._onPress}
              style={[styles.CallAction, { backgroundColor: colors.yellow }]}
            >
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: colors.darkblue,
                  fontWeight: "700"
                }}
              >
                Coming soon
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  Title: { fontSize: 25, fontFamily: "Caveat" },
  CallAction: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 5
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
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderBottomColor: "#f0eff5",
    borderBottomWidth: 1,
    fontSize: 18,
    backgroundColor: "#fff",
    color: "#424242"
  },
  tabStyle: {
    backgroundColor: "#f0eff5"
  },
  activeTabTextStyle: {
    color: "#fff"
  },
  BasicContainer: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    borderColor: colors.yellow,
    borderWidth: 0.5,
    height: "40%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    color: colors.white,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10
  },
  PremiumContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: "40%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    color: colors.darkblue,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: -50,
    borderWidth: 0.5,
    borderColor: colors.cardborder
  }
});
