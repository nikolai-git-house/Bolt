import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import colors from '../theme/Colors';
import IconMenu from '../components/IconMenu';
import {sliderWidth, itemWidth} from '../theme/Styles';
const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;
const personal_img = require('../assets/profile_header/personal.png');
const groups_img = require('../assets/profile_header/groups.png');
const pets_img = require('../assets/profile_header/pets.png');
const subscriptions_img = require('../assets/profile_header/subscription.png');
const timeline_img = require('../assets/profile_header/timeline.png');
let packages = [
  {title: 'Personal', img: personal_img, index: 0},
  // { title: "Groups", img: groups_img, index: 1 },
  // { title: "Pets", img: pets_img, index: 1 },
  // { title: "Subscriptions", img: subscriptions_img, index: 1 },
  {title: 'Timeline', img: timeline_img, index: 2},
];
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM,
    };
    console.log('props', props);
  }
  componentWillReceiveProps(nextProps) {
    const {screen} = nextProps;
    console.log('nextProps', nextProps);
    if (screen === 'Home')
      setTimeout(() => this._slider1Ref.snapToItem(1), 100);
  }
  componentDidMount() {}
  _renderItem = ({item, index}) => {
    return <IconMenu data={item} key={index} PressItem={this.Press} />;
  };
  Press = data => {
    const {onTap} = this.props;
    console.log('index', data.index);
    //this._slider1Ref.snapToItem(data.index);
    onTap(data.title);
  };

  render() {
    const {activeSlide} = this.state;
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          height: 100,
          position: 'absolute',
          top: 70,
          //top: 80,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* <Carousel
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
        /> */}
        <FlatList
          contentContainerStyle={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
          }}
          data={packages}
          renderItem={this._renderItem}
          horizontal={true}
        />
      </View>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    screen: state.screen,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
