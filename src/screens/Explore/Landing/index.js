import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../theme/Colors';
import Logo from '../../../components/Logo';
import TopImage from '../../../components/TopImage';
import PrimaryPackage from './PrimaryPackage';
import SecondaryPackage from './SecondaryPackage';

const bike_img = require('../../../assets/Explore/landing/Bike.jpg');
const pet_img = require('../../../assets/Explore/landing/Pet.jpg');
const token_img = require('../../../assets/Explore/landing/Monthly.jpg');
const health_img = require('../../../assets/Explore/landing/Health.jpg');
const wallet_img = require('../../../assets/Explore/landing/Wallet.jpg');
class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMember: false,
    };
  }
  componentDidMount() {
    const basic = this.props.basic;
    let result = false;
    if (basic.active) {
      this.setState({isMember: true});
    } else this.setState({isMember: false});
  }
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  render() {
    const {isMember} = this.state;
    return (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.lightgrey,
        }}>
        <View
          style={{
            width: '100%',
            height: 100,
            display: 'flex',
            alignItems: 'center',
            paddingTop: 50,
          }}>
          <TopImage />
          <Logo />
        </View>
        <ScrollView style={{width: '100%', height: '90%'}}>
          <View style={{display: 'flex', flexDirection: 'column'}}>
            {!isMember && (
              <PrimaryPackage
                style="membership"
                title="Join as a member"
                onPress={() => this.navigateTo('Toggle', {page: 'membership'})}
              />
            )}
            {/* <PrimaryPackage
              style="perks"
              title="Explore Your Perks"
              // onPress={() => this.navigateTo('Toggle', {page: 'perks'})}
            /> */}
            {/* <PrimaryPackage
              style="shop"
              title="Browse The Store"
              onPress={() => this.navigateTo('Toggle', {page: 'shop'})}
            /> */}
            {/* <SecondaryPackage
              title="Most Popular"
              subTitle="Membership"
              img={health_img}
              onPress={() => this.navigateTo('Toggle')}
            /> */}
            <SecondaryPackage
              title="Top perk"
              subTitle="Free Bike Hire"
              img={bike_img}
            />
            <SecondaryPackage
              title="Top Bolt-On"
              subTitle="Health Concierge"
              img={token_img}
            />
            <SecondaryPackage
              title="Monthly earnings"
              subTitle="15 tokens"
              img={wallet_img}
              onPress={() => this.navigateTo('Wallet')}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: '10%',
    top: '20%',
    width: '80%',
    height: '35%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 10,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    basic: state.basic,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Landing);
