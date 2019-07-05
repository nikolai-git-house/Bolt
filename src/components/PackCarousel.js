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
let all_packages = [];
Firebase.getPackagesData(function(res) {
  for (var i in res) all_packages.push(res[i]);
});
export default class PackCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM,
      packages: []
    };
  }
  _renderItem({ item, index }) {
    return <PackCard data={item} key={index} />;
  }
  componentDidMount() {
    console.log("renter_owner", this.props.renter_owner);
    const renter_owner = this.props.renter_owner;
    let packages = [];
    for (var i in all_packages) {
      if (all_packages[i].for === 0 || all_packages[i].for === renter_owner) {
        const order = parseInt(all_packages[i].order);
        packages[order] = all_packages[i];
        //packages.push(all_packages[i]);
      }
    }
    this.setState({ packages: packages });
  }
  get pagination() {
    const { activeSlide, packages } = this.state;
    const { getActive } = this.props;
    if (packages) {
      const isgroup = packages[activeSlide].isgroup;
      const price = packages[activeSlide].price;
      const imgName = packages[activeSlide].img_name;
      const pkgName = packages[activeSlide].caption;
      getActive(isgroup, price, imgName, pkgName);
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
    const { activeSlide, packages, coming_flag } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {packages.length > 0 && this.pagination}
        <Carousel
          ref={c => (this._slider1Ref = c)}
          removeClippedSubviews={false}
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
