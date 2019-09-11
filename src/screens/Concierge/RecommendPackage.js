import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Text
} from "react-native";
import colors from "../../theme/Colors";

class RecommendPackage extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0.01);
    this.state = {};
  }
  componentDidMount() {
    this.handleAnimation();
  }
  handleAnimation = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1
    }).start();
  };
  selectRecommend = option => {
    const { on_selectRecommend } = this.props;
    on_selectRecommend(option);
  };
  render() {
    const animatedStyle = { transform: [{ scale: this.animatedValue }] };
    return (
      <View style={styles.MainContainer}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity onPress={() => this.selectRecommend("explore")}>
            <View
              style={{
                width: 130,
                height: 40,
                margin: 15,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                backgroundColor: colors.white,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                elevation: 3
              }}
            >
              <Text>Explore Package</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity onPress={() => this.selectRecommend("other")}>
            <View
              style={{
                width: 100,
                height: 40,
                margin: 15,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                backgroundColor: colors.white,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.2,
                elevation: 3
              }}
            >
              <Text>Other help</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}
export default RecommendPackage;
const styles = StyleSheet.create({
  MainContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30
  },
  imageThumbnail: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "contain"
  },
  modal: {
    position: "absolute",
    top: "40%",
    width: "100%",
    height: "25%",
    justifyContent: "space-around",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10
  }
});
