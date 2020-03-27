import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Logo from '../../components/Logo';
import TopImage from '../../components/TopImage';
import colors from '../../theme/Colors';
import Switcher from './component/Switcher';
import MyTokens from './MyTokens';
import MyCards from './MyCards';
class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'tokens',
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
      case 'tokens':
        return (
          <MyTokens
            {...this.props}
            onLinkCard={() => {
              console.log('link cards');
              this.setState({screen: 'cards'});
            }}
          />
        );
      case 'cards':
        return (
          <MyCards
            {...this.props}
            onBack={() => {
              console.log('go back to tokens');
              this.setState({screen: 'tokens'});
            }}
          />
        );
      default:
        return <MyTokens {...this.props} />;
    }
  };
  goBack = () => {
    const {screen} = this.state;
    console.log('screen', screen);
    if (screen === 'cards') {
      this.setState({screen: 'tokens'});
    } else {
      this.props.navigation.goBack();
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
      <View style={styles.main_container}>
        <TouchableOpacity style={styles.back_button} onPress={this.goBack}>
          <Image
            style={styles.tabbutton}
            source={require('../../assets/back.png')}
          />
        </TouchableOpacity>
        <TopImage />
        <Logo />
        <View style={styles.switcher}>
          <Switcher onChoose={this.choose} screen={screen} />
          {this.setScreen(screen)}
        </View>
      </View>
      // </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  back_button: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-start',
  },
  switcher: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    marginTop: 80,
    width: '100%',
  },
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
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);

// export default StackNavigator;
