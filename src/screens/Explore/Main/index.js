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
  Modal,
  Animated,
  WebView
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import { Metrics } from "../../../theme";
import PackCarousel from "../../../components/PackCarousel";
import { sliderWidth, itemWidth } from "../../../theme/Styles";
const pet_img = require("../../../assets/packages/pets.png");
const lightning_img = require("../../../assets/packages/lightning.png");
const group_img = require("../../../assets/packages/group.png");
const close_image = require("../../../assets/Explore/close-button.png");
const carousel_height = Metrics.screenHeight - 210;
console.log(Metrics.screenHeight, carousel_height);

let isgroup = 0;
let price = 0;
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bolt_height: new Animated.Value(0),
      isgroup: 0,
      price: 0
    };
  }
  Bolt = () => {
    const { bolt_height } = this.state;
    console.log("bolt_height", bolt_height);
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
  BoltOn = () => {
    console.log("BoltOn");
    console.log("price", price);
    console.log("isgroup", isgroup);
    this.navigateTo("Pack", { price: price, isgroup: isgroup });
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  getCurrentSlider = (var1, var2) => {
    isgroup = var1;
    price = var2;
  };
  render() {
    const { bolt_height } = this.state;
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
            getActive={(isgroup, price) =>
              this.getCurrentSlider(isgroup, price)
            }
          />
        </View>
        <TouchableOpacity
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
            width: itemWidth,
            height: 45,
            borderRadius: 25,
            backgroundColor: colors.yellow,
            shadowOffset: { height: 1, width: 1 },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.1
          }}
          onPress={this.BoltOn}
        >
          <Image source={lightning_img} style={{ width: 25, height: 35 }} />
          <Text>Bolt on this pack</Text>
          <Image source={group_img} style={{ width: 30, height: 25 }} />
        </TouchableOpacity>
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
          <WebView
            originWhitelist={["*"]}
            source={{ uri: "https://chat-concierge.firebaseapp.com" }}
            injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1, maximum-scale=1'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); document.getElementsByTagName('style')[0].innerHTML = " body{ background-color:white} ";`}
            scalesPageToFit={false}
            onLoadEnd={this._onLoadEnd}
          />
        </Animated.View>
      </View>
    );
  }
}
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
)(Main);
