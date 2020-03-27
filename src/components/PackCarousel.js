import React, {Component} from 'react';
import {
  Platform,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Fragment,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import colors from '../theme/Colors';
import Firebase from '../firebasehelper';
import {sliderWidth, itemWidth} from '../theme/Styles';
import PackCard from '../components/PackCard';
const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;
let all_packages = [];

export default class PackCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM,
      packages: [],
      pkgloading: false,
    };
  }
  _renderItem({item, index}) {
    return <PackCard data={item} key={index} />;
  }
  componentWillReceiveProps(nextProps) {
    const {fromOption_packageRequired} = nextProps;
    console.log('fromOption_packageRequired', fromOption_packageRequired);
    this.setState({fromOption_packageRequired});
    const {packages} = this.state;
    if (packages) {
      packages.forEach((item, index) => {
        if (fromOption_packageRequired)
          if (item.caption === fromOption_packageRequired[0])
            this.setState({activeSlide: index});
      });
    }
  }
  async componentDidMount() {
    const {renter_owner, onLoad, fromBoltOn} = this.props;
    this.setState({pkgloading: true});
    let res = await Firebase.getBoltPackages();
    onLoad();
    this.setState({pkgloading: false});
    for (var i in res) {
      const {visibility} = res[i];
      if (visibility) all_packages.push(res[i]);
    }
    console.log('all_packages', all_packages);
    let packages = [];
    for (var i in all_packages) {
      if (all_packages[i].for === 0 || all_packages[i].for === renter_owner) {
        const order = parseInt(all_packages[i].order);
        if (fromBoltOn) {
          if (all_packages[i].caption !== 'Membership Pack')
            packages[order] = all_packages[i];
        } else {
          packages[order] = all_packages[i];
        }
      }
    }
    let array = [];
    packages.forEach(item => {
      if (item) {
        array.push(item);
      }
    });
    console.log('packages', array);
    // let temp = [];
    // let pos = 0;
    // packages.forEach((item, index) => {
    //   if (fromOption_packageRequired)
    //     if (item.caption === fromOption_packageRequired[0]) pos = index;
    //   temp.push(item);
    // });
    this.setState({packages: array});
    // setTimeout(() => {
    //   this.setState({activeSlide: pos});
    // }, 100);
  }
  get pagination() {
    const {activeSlide, packages} = this.state;
    const {getActive} = this.props;
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
        containerStyle={{backgroundColor: 'transparent', paddingVertical: 10}}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          borderWidth: 1,
          borderColor: colors.darkblue,
          backgroundColor: colors.yellow,
        }}
        inactiveDotStyle={{
          backgroundColor: colors.grey,
          borderWidth: 1,
          borderColor: colors.darkblue,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  render() {
    const {activeSlide, packages, pkgloading} = this.state;
    return (
      <View style={{flex: 1}}>
        {pkgloading && (
          <ActivityIndicator size="large" color={colors.darkblue} />
        )}
        {!pkgloading && packages.length > 0 && this.pagination}
        {!pkgloading && (
          <Carousel
            ref={c => (this._slider1Ref = c)}
            removeClippedSubviews={false}
            data={packages}
            renderItem={this._renderItem}
            onSnapToItem={index => this.setState({activeSlide: index})}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            firstItem={activeSlide}
          />
        )}
      </View>
    );
  }
}
