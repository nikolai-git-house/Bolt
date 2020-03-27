import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Home from './Home';
import Renting from './Renting';
import Housemates from './Housemates';
import Logo from '../../components/Logo';
import TopImage from '../../components/TopImage';
import colors from '../../theme/Colors';
import Header from './component/Header';
import SwitchButton from './component/SwitchButton';
class MyHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'Home',
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
    console.log('loaded!');
    if (this.props.navigation.state.params) {
      const {page} = this.props.navigation.state.params;
      console.log('page', page);
      this.setState({screen: page});
    }
  };
  setScreen = screen => {
    switch (screen) {
      case 'Home':
        return <Home {...this.props} />;
      case 'Renting':
        return <Renting {...this.props} />;
      case 'Housemates':
        return <Housemates {...this.props} />;
      default:
        return <Home {...this.props} />;
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
          backgroundColor: colors.white,
        }}>
        <TopImage />
        <Logo />
        <Header onTap={this.onTap} />
        <View
          style={{
            flex: 1,
            marginTop: 180,
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
    uid: state.uid,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MyHome);

// export default StackNavigator;
