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
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import Logo from '../../../components/Logo';
import TopImage from '../../../components/TopImage';
import Header from './Header';
import Content from './Content';
import {saveScreen} from '../../../Redux/actions';
import colors from '../../../theme/Colors';
import {Metrics} from '../../../theme';
class Perk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'Top 10',
    };
  }
  onTap = category => {
    console.log(category);
    this.setState({category});
    this.webview.reload();
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
  onLoadFinished = () => {
    console.log('load finished');
  };
  LogOut = () => {
    this.props.navigation.navigate('Landing');
  };
  render() {
    const {category} = this.state;
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View style={styles.maincontainer}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 500,
            marginTop: -20,
          }}>
          <Header onTap={this.onTap} />
        </View>
        <WebView
          style={{marginTop: 100, zIndex: 100}}
          ref={r => (this.webview = r)}
          originWhitelist={['*']}
          source={{
            uri: `https://aiconcierge.io/perks?category=${category}`,
          }}
          startInLoadingState
          javaScriptEnabled
          onLoad={this.onLoadFinished}
          mixedContentMode="always"
          thirdPartyCookiesEnabled
          allowUniversalAccessFromFileURLs
          useWebKit={true}
        />
      </View>
      // </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    //minHeight: Metrics.screenHeight - 20,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 29,
    backgroundColor: colors.white,
  },
  CalltoAction: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 15,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: colors.white,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
  },
  button: {
    color: colors.darkblue,
    fontSize: 16,
    fontFamily: 'Gothic A1',
    fontWeight: '100',
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 22,
    paddingRight: 22,
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 3,
    marginTop: -5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  spinnerTextStyle: {
    color: '#FFF',
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
    screen: state.screen,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Perk);

// export default StackNavigator;
