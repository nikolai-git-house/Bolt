import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import colors from "../theme/Colors";
import IconMenu from "../components/IconMenu";
import { sliderWidth, itemWidth } from "../theme/Styles";
const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 0;
const personal_img = require("../assets/profile_header/personal.png");
const home_img = require("../assets/profile_header/home.png");
const groups_img = require("../assets/profile_header/groups.png");
const health_img = require("../assets/profile_header/health.png");
const pets_img = require("../assets/profile_header/pets.png");
const bike_img = require("../assets/profile_header/bike.png");
const renting_img = require("../assets/profile_header/renting.png");
const subscriptions_img = require("../assets/profile_header/subscription.png");
let packages = [
  { title: "Personal", img: personal_img, index: 0 },
  { title: "Home", img: home_img, index: 1 },
  { title: "Groups", img: groups_img, index: 2 },
  { title: "Pets", img: pets_img, index: 3 },
  { title: "Renting", img: renting_img, index: 4 },
  { title: "Subscriptions", img: subscriptions_img, index: 5 }
];
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM
    };
    console.log("props", props);
  }
  _renderItem = ({ item, index }) => {
    return <IconMenu data={item} key={index} PressItem={this.Press} />;
  };
  Press = data => {
    const { onTap } = this.props;
    console.log("index", data.index);
    this._slider1Ref.snapToItem(data.index);
    onTap(data.title);
  };

  render() {
    const { activeSlide } = this.state;
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: 100,
          position: "absolute",
          top: 90,
          left: 0
        }}
      >
        <Carousel
          layout={"default"}
          removeClippedSubviews={false}
          loop={true}
          inactiveSlideOpacity={1}
          ref={c => (this._slider1Ref = c)}
          data={packages}
          renderItem={this._renderItem}
          onSnapToItem={index => this.setState({ activeSlide: index })}
          sliderWidth={sliderWidth}
          itemWidth={80}
          firstItem={SLIDER_1_FIRST_ITEM}
        />
      </View>
    );
  }
}
