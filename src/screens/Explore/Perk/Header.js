import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "../../../theme/Styles";
import IconMenu from "../../../components/IconMenu";
const SLIDER_1_FIRST_ITEM = 0;
const beauty_wellbeing = require("../../../assets/Explore/perk/beauty_wellbeing.png");
const entertainment = require("../../../assets/Explore/perk/entertainment.png");
const fashion = require("../../../assets/Explore/perk/fashion.png");
const food_drink = require("../../../assets/Explore/perk/food_drink.png");
const home = require("../../../assets/Explore/perk/home.png");
const tech = require("../../../assets/Explore/perk/tech.png");
const top_10 = require("../../../assets/Explore/perk/top_10.png");
let packages = [
  { title: "Top 10", img: top_10, index: 0 },
  { title: "Beauty & Wellbeing", img: beauty_wellbeing, index: 1 },
  { title: "Entertainment", img: entertainment, index: 2 },
  { title: "Fashion", img: fashion, index: 3 },
  { title: "Food and Drink", img: food_drink, index: 4 },
  { title: "Home", img: home, index: 5 },
  { title: "Tech", img: tech, index: 6 }
];
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM
    };
    console.log("props", props);
  }
  componentWillReceiveProps(nextProps) {
    const { screen } = nextProps;
    console.log("nextProps", nextProps);
    if (screen === "Top 10")
      setTimeout(() => this._slider1Ref.snapToItem(1), 100);
  }
  componentDidMount() {}
  _renderItem = ({ item, index }) => {
    return (
      <IconMenu
        data={item}
        key={index}
        PressItem={this.Press}
        isTitleHidden={true}
      />
    );
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
          zIndex: 200,
          flex: 1,
          width: "100%",
          height: 100,
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
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
          firstItem={activeSlide}
        />
        {/* <FlatList
          contentContainerStyle={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%"
          }}
          data={packages}
          renderItem={this._renderItem}
          horizontal={true}
        /> */}
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
    screen: state.screen
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
