import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import WebView from 'react-native-webview';
import {connect} from 'react-redux';
import colors from '../../theme/Colors';
import {Metrics} from '../../theme';
const TAB_HEIGHT = 50;
function clearAllTimeout() {
  var id = window.setTimeout(function() {}, 0);
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
}
class TravelBooking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboard: 'invisible',
      keyboard_Height: 0,
      show_booking_travel: false,
      show_exit_travel: false,
    };
  }
  componentWillMount() {
    clearAllTimeout();
  }
  resetWebViewToInitialUrl = () => {
    const {key} = this.state;
    this.setState({
      key: key + 1,
    });
  };
  renderLoading = () => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator
          size="large"
          style={{
            marginBottom: 10,
          }}
        />
        <Text>Please wait...</Text>
      </View>
    );
  };
  componentWillReceiveProps(nextProps) {
    this.resetWebViewToInitialUrl();
  }
  componentDidMount() {}
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  onLoadIframeFinished = () => {
    let self = this;
    this.setState({show_exit_travel: true});
    console.log('loaded iframe');
  };
  skipTravel = () => {
    this.props.navigation.goBack();
  };
  render() {
    const {key, show_exit_travel} = this.state;
    const {uid} = this.props;
    return (
      <View style={styles.maincontainer}>
        <WebView
          originWhitelist={['*']}
          key={key}
          source={{
            uri: `https://booking.thetravelrobot.com/bolt?bolt_user_id=${uid}&iframe`,
          }}
          automaticallyAdjustContentInsets={false}
          renderLoading={this.renderLoading}
          startInLoadingState
          onLoad={this.onLoadIframeFinished}
        />
        {show_exit_travel && (
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.skipTravel();
              }}
              style={{
                width: 200,
                height: 40,
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
              }}>
              <Text style={{color: '#999999'}}>Exit travel booking</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    paddingBottom: 20,
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
    uid: state.uid,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TravelBooking);
