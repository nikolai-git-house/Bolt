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
import Firebase from '../../../firebasehelper';
import colors from '../../../theme/Colors';
import Logo from '../../../components/Logo';
import {Metrics} from '../../../theme';
import {saveOnboarding, saveRedirectToken} from '../../../Redux/actions/index';
import {createRedirectFlow, getResofRedirect} from '../../../gocardlesshelper';
import {generate_token} from '../../../utils/functions';

class DirectDebitSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect_url: '',
      token: '',
      id: '',
    };
  }
  componentDidMount() {
    const token = generate_token(16);
    this.props.dispatch(saveRedirectToken(token));
    this.setState({token: token});
    createRedirectFlow(token).then(res => {
      console.log('redirect', res);
      const result = JSON.parse(res._bodyInit);
      const redirect_url = result.redirect_flows.redirect_url;
      const id = result.redirect_flows.id;
      this.setState({redirect_url: redirect_url});
      this.setState({id: id});
    });
  }
  render() {
    const {redirect_url} = this.state;
    return (
      <View style={styles.maincontainer}>
        {/* <Logo /> */}
        <WebView
          originWhitelist={['*']}
          source={{
            uri: redirect_url,
          }}
          onMessage={event => this.onEventHandler(event.nativeEvent.data)}
          startInLoadingState
        />
      </View>
    );
  }
  onEventHandler = data => {
    const {redirect_url, token, id} = this.state;
    console.log('data', data);
    if (data === 'confirm') {
      getResofRedirect(id, token).then(res => {
        console.log('result of redirect', res);
        const result = JSON.parse(res._bodyInit);
        const {uid} = this.props;
        const GC_info = result.redirect_flows.links;
        Firebase.updateUserData(uid, GC_info).then(res => {
          console.log('res of updated user', res);
        });
      });
      this.props.navigation.goBack();
    }
  };
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 20,
    color: colors.darkblue,
    fontWeight: '700',
    marginBottom: 20,
  },
  subcaption: {
    fontSize: 15,
    textAlign: 'center',
  },
  containter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 50,
    backgroundColor: colors.lightgrey,
  },
  subcontainer: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
function mapStateToProps(state) {
  return {
    basic: state.basic,
    redirect_token: state.redirect_token,
    uid: state.uid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectDebitSetup);
