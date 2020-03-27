import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Logo from '../../../components/Logo';
import TopImage from '../../../components/TopImage';
import colors from '../../../theme/Colors';
import Switcher from './components/Switcher';
import Membership_Toggle from './Membership_Toggle';
import BoltOns_Toggle from './BoltOns_Toggle';
import Perk from '../Perk';
import Main from '../Main';
class Landing_Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'membership',
    };
  }
  onTap = screen => {
    console.log(screen);
    this.setState({screen: screen});
  };
  componentDidMount = () => {
    this.load();
    this.props.navigation.addListener('willFocus', this.load);
  };
  load = () => {
    const {navigation} = this.props;
    if (navigation.state.params) {
      console.log('navigation', navigation);
      const {page} = navigation.state.params;
      console.log('page', page);
      this.setState({screen: page});
    }
  };
  setScreen = screen => {
    const {uid} = this.props;
    switch (screen) {
      case 'membership':
        return <Membership_Toggle {...this.props} />;
      case 'perks':
        return <Perk {...this.props} />;
      case 'shop':
        return <BoltOns_Toggle {...this.props} />;
      default:
        return <Membership_Toggle {...this.props} />;
    }
  };
  choose = screen => {
    console.log('screen', screen);
    this.setState({screen});
  };
  render() {
    const {screen} = this.state;
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: colors.lightgrey,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            left: 10,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
          }}
          onPress={() => this.props.navigation.goBack()}>
          <Image
            style={styles.tabbutton}
            source={require('../../../assets/back.png')}
          />
        </TouchableOpacity>
        <TopImage />
        <Logo />
        <View
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            marginTop: 80,
            width: '100%',
          }}>
          <Switcher onChoose={this.choose} screen={screen} />
          {this.setScreen(screen)}
        </View>
      </View>
      // </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  tabbutton: {
    width: 25,
    height: 25,
  },
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic,
    uid: state.uid,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Landing_Toggle);

// export default StackNavigator;
