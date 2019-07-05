import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  Animated
} from "react-native";
import FadeInView from "react-native-fade-in-view";
import { connect } from "react-redux";
import colors from "../../theme/Colors";
import { Metrics } from "../../theme";
import {
  saveOnboarding,
  saveUID,
  savePet,
  saveBike,
  saveHealth,
  saveHome
} from "../../Redux/actions/index";
import { isSession } from "../../utils/functions";

class LogoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeIn: new Animated.Value(0),
      fadeOut: new Animated.Value(1)
    };
  }
  fadeIn() {
    this.state.fadeIn.setValue(0);
    Animated.timing(this.state.fadeIn, {
      toValue: 1,
      duration: 2000
    }).start(() => this.fadeOut());
  }
  fadeOut() {
    this.state.fadeIn.setValue(1);
    Animated.timing(this.state.fadeIn, {
      toValue: 0,
      duration: 2000
    }).start(() => this.Start());
  }
  Start = () => {
    isSession()
      .then(res => {
        console.log("LogoScreen res", res);
        if (res) {
          console.log("Result is true");
          this.props.dispatch(saveOnboarding(res));
          this.props.dispatch(saveUID(res.uid));
          this.props.dispatch(savePet(JSON.parse(res.pet)));
          this.props.dispatch(saveBike(JSON.parse(res.bike)));
          this.props.dispatch(saveHealth(JSON.parse(res.health)));
          this.props.dispatch(saveHome(JSON.parse(res.home)));
          this.props.navigation.navigate("Main");
        } else this.props.navigation.navigate("Landing");
      })
      .catch(err => {
        console.log("Error", err);
        this.props.navigation.navigate("Landing");
      });
  };
  componentWillMount() {
    this.fadeIn();
  }
  render() {
    return (
      <View
        style={{
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          backgroundColor: colors.yellow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Animated.View style={{ opacity: this.state.fadeIn }}>
          <View>
            <Image
              source={require("../../assets/logo.png")}
              style={{ width: 170, height: 60 }}
              resizeMode={"contain"}
            />
          </View>
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
    basic: state.basic,
    uid: state.uid,
    pet: state.pet
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoScreen);
