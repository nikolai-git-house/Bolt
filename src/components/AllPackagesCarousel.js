import React, { Component } from "react";
import {
  Platform,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Fragment
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import colors from "../theme/Colors";
import Firebase from "../firebasehelper";
import { sliderWidth, itemWidth } from "../theme/Styles";
import PackCard from "../components/PackCard";
const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 0;
let all_packages = [];

export default class AllPackagesCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM,
      packages: [],
      pkgloading: false
    };
  }
  _renderItem({ item, index }) {
    return <PackCard data={item} key={index} />;
  }
  componentWillReceiveProps(nextProps) {
    const { packages } = this.state;
  }
  async componentDidMount() {
    const { renter_owner, onLoad } = this.props;
    this.setState({ pkgloading: true });
    res_sub = await Firebase.getSubscribePackagesData();
    res_qb = await Firebase.getQBPackagesData();
    onLoad();
    this.setState({ pkgloading: false });
    console.log("res_sub", res_sub);
    console.log("res_qb", res_qb);
    for (var i in res_sub) all_packages.push(res_sub[i]);
    let packages = [];
    for (var i in all_packages) {
      if (all_packages[i].for === 0 || all_packages[i].for === renter_owner) {
        const order = parseInt(all_packages[i].order);
        packages[order] = all_packages[i];
      }
    }
    for (var i in res_qb) packages.push(res_qb[i]);
    console.log("all", packages);
    this.setState({ packages });
  }

  render() {
    const { activeSlide, packages, pkgloading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {pkgloading && (
          <ActivityIndicator size="large" color={colors.darkblue} />
        )}
        {!pkgloading && (
          <Carousel
            ref={c => (this._slider1Ref = c)}
            removeClippedSubviews={false}
            data={packages}
            renderItem={this._renderItem}
            onSnapToItem={index => this.setState({ activeSlide: index })}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            firstItem={activeSlide}
          />
        )}
      </View>
    );
  }
}
