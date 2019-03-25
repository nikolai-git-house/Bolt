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
import { saveOnboarding, saveCurrentUserId } from "../../Redux/actions/index";
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
    isSession().then(res => {
      console.log("res", res);
      if (res) {
        let basic = JSON.parse(res);
        console.log("basic", basic);
        const user_id = basic.user_id;
        this.props.dispatch(saveOnboarding(basic));
        this.props.dispatch(saveCurrentUserId(user_id));
        this.props.navigation.navigate("Main");
      } else this.props.navigation.navigate("Landing");
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
              style={{ width: 150, height: 60 }}
            />
          </View>
        </Animated.View>
        {/* <FadeInView
          duration={3000}
          style={{ alignItems: "center" }}
          onFadeComplete={() => alert("Ready")}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: 150, height: 60 }}
          />
        </FadeInView> */}
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
    user_id: state.user_id
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoScreen);
