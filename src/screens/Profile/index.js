import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PersonalProfile from './Personal';
import GroupProfile from './Group';
import HealthProfile from './Health';
import PetsProfile from './Pets';
import TravelProfile from './Travel';
import SubscriptionProfile from './Subscriptions';
import Timeline from './Timeline';
import Logo from '../../components/Logo';
import TopImage from './component/TopImage';
import Header from '../../components/Header';
import {Metrics} from '../../theme';
import colors from '../../theme/Colors';
import {saveScreen} from '../../Redux/actions';
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'Personal',
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
      this.props.dispatch(saveScreen(page));
    }
  };
  LogOut = () => {
    this.props.navigation.navigate('Landing');
  };
  setScreen = screen => {
    switch (screen) {
      case 'Personal':
        return <PersonalProfile navigation={this.props.navigation} />;
      case 'Groups':
        return <GroupProfile navigation={this.props.navigation} />;
      case 'Health':
        return <HealthProfile navigation={this.props.navigation} />;
      case 'Pets':
        return <PetsProfile navigation={this.props.navigation} />;
      case 'Timeline':
        return <Timeline navigation={this.props.navigation} />;
      case 'Subscriptions':
        return <SubscriptionProfile navigation={this.props.navigation} />;
      case 'Travel':
        return <TravelProfile navigation={this.props.navigation} />;
      default:
        return <PersonalProfile navigation={this.props.navigation} />;
    }
  };
  render() {
    const {screen} = this.state;
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: colors.white,
        }}>
        <TopImage screen={screen} />
        <Logo />
        <Header onTap={this.onTap} />
        <View
          style={{
            flex: 1,
            marginTop: screen === 'Personal' ? 250 : 180,
            width: '100%',
          }}>
          {this.setScreen(screen)}
        </View>
      </View>
      // </KeyboardAwareScrollView>
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
    basic: state.basic,
    screen: state.screen,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);

// export default StackNavigator;
