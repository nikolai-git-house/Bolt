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
import Firebase from "../firebasehelper";
import { sliderWidth, itemWidth } from "../theme/Styles";
import PackCard from "../components/PackCard";
const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 0;
let packages = [];
Firebase.getPackagesData(function(res) {
  for (var i in res) packages.push(res[i]);
  console.log("packages", packages);
});
export default class PackCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM
    };
  }
  _renderItem({ item, index }) {
    return <PackCard data={item} key={index} />;
  }

  get pagination() {
    const { activeSlide } = this.state;
    const { getActive } = this.props;
    if (packages) {
      const isgroup = packages[activeSlide].isgroup;
      const price = packages[activeSlide].price;
      getActive(isgroup, price);
    }
    return (
      <Pagination
        dotsLength={packages.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: "transparent", paddingVertical: 10 }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          borderWidth: 1,
          borderColor: colors.darkblue,
          backgroundColor: colors.yellow
        }}
        inactiveDotStyle={{
          backgroundColor: colors.grey,
          borderWidth: 1,
          borderColor: colors.darkblue
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  render() {
    const { activeSlide } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {this.pagination}
        <Carousel
          ref={c => (this._slider1Ref = c)}
          data={packages}
          renderItem={this._renderItem}
          onSnapToItem={index => this.setState({ activeSlide: index })}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          firstItem={SLIDER_1_FIRST_ITEM}
        />
      </View>
    );
  }
}
