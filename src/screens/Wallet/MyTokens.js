import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
  Image,
  Modal,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import Logo from '../../components/Logo';
import TopImage from '../../components/TopImage';
import Header from './component/Header.js';
import {sendInvitation} from '../../functions/Auth';
import {saveOnboarding} from '../../Redux/actions';
import colors from '../../theme/Colors';
import Firebase from '../../firebasehelper';
import pending_coin_img from '../../assets/wallet/pending_coin.png';
import live_coin_img from '../../assets/wallet/live_coin.png';
import eco_coin_img from '../../assets/wallet/eco_coin.png';
import social_coin_img from '../../assets/wallet/social_coin.png';
import cup_img from '../../assets/wallet/cup.png';
import confirm_img from '../../assets/popup/balloon.png';
import {Metrics} from '../../theme';
const GIFT_ADDUSER = 5;
class MyTokens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokens: props.basic.tokens,
      inviteVisible: false,
      successVisible: false,
      phone: '',
      username: '',
    };
  }
  componentDidMount = () => {};
  componentWillReceiveProps = nextProps => {
    this.setState({tokens: nextProps.basic.tokens});
  };
  onChangePhoneNumber = phone => {
    this.setState({phone: phone});
  };
  onChangeUsername = username => {
    this.setState({username: username});
  };
  toggleInvite = visible => {
    this.setState({inviteVisible: visible});
  };
  toggleSuccess = visible => {
    this.setState({successVisible: visible});
  };
  Invite = () => {
    const {basic, uid} = this.props;
    const {phone, username} = this.state;
    const inviter = basic.firstname;
    const tokens = basic.tokens;

    if (username) {
      let response = sendInvitation(phone, inviter);
      Firebase.updateUserData(uid, {tokens: tokens + GIFT_ADDUSER}).then(
        res => {
          this.props.dispatch(saveOnboarding(res));
          AsyncStorage.setItem('profile', JSON.stringify(res));
        },
      );
      this.toggleInvite(false);
      this.toggleSuccess(true);
    }
  };
  navigateTo = (page, props = {}) => {
    this.props.navigation.navigate(page, props);
  };
  openExplore = () => {
    this.navigateTo('Explore');
  };
  openCommunity = () => {
    this.navigateTo('Community');
  };
  openHomeProfile = () => {
    this.navigateTo('Home', {page: 'Home'});
  };
  render() {
    const {basic, onLinkCard} = this.props;
    const {firstname} = basic;
    const {tokens, phone, username} = this.state;
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View style={styles.main_container}>
        <View style={styles.content_view}>
          <View style={styles.row_view}>
            <View style={styles.group}>
              <Text style={styles.coin_text}>Pending Coins</Text>
              <ImageBackground
                source={pending_coin_img}
                style={styles.token_img_container}>
                <Text style={styles.token_number}>6.8</Text>
              </ImageBackground>
            </View>
            <View style={styles.group}>
              <Text style={styles.coin_text}>Live Coins</Text>
              <ImageBackground
                source={live_coin_img}
                style={styles.token_img_container}>
                <Text style={styles.token_number}>{tokens}</Text>
              </ImageBackground>
            </View>
          </View>
          <View style={styles.row_view}>
            <View style={styles.group}>
              <Text style={styles.coin_text}>Eco Coins</Text>
              <ImageBackground
                source={eco_coin_img}
                style={styles.token_img_container}>
                <Text style={styles.token_number}>0</Text>
              </ImageBackground>
            </View>
            <View style={styles.group}>
              <Text style={styles.coin_text}>Social Coins</Text>
              <ImageBackground
                source={social_coin_img}
                style={styles.token_img_container}>
                <Text style={styles.token_number}>0</Text>
              </ImageBackground>
            </View>
          </View>
          <View style={styles.row_view}>
            <TouchableOpacity style={styles.Button} onPress={this.openExplore}>
              <Text>Spend your tokens</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.Button, {backgroundColor: colors.lightgrey}]}
              onPress={onLinkCard}>
              <Text>Link my cards</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 20,
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={styles.White_Button}
              onPress={() => this.toggleInvite(true)}>
              <Text style={styles.Font}>Invite {'\n'} Friends</Text>
            </TouchableOpacity>
            <Text style={styles.Font}>Earn tokens</Text>
            <TouchableOpacity
              style={styles.White_Button}
              onPress={this.openExplore}
              disabled={basic.active}>
              <Text style={styles.Font}>Become {'\n'}Member</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={styles.White_Button}
              onPress={this.openHomeProfile}>
              <Text style={styles.Font}>Add Home {'\n'} Profile</Text>
            </TouchableOpacity>
            <Image
              source={cup_img}
              style={{width: 120, height: 120, marginTop: -30}}
            />
            <TouchableOpacity
              style={styles.White_Button}
              onPress={this.openCommunity}>
              <Text style={styles.Font}>Take your {'\n'} ProfileTest</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.inviteVisible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => this.toggleInvite(false)}>
              <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Text style={styles.Title}>Invite friends for tokens</Text>
              <Text style={{textAlign: 'center', marginBottom: 20}}>
                Please input your friend's name and phone number here.
              </Text>
              <TextInput
                placeholder="+44"
                onChangeText={txt => this.onChangePhoneNumber(txt)}
                value={phone}
                style={styles.input}
              />
              <TextInput
                placeholder="First Name"
                onChangeText={txt => this.onChangeUsername(txt)}
                value={username}
                style={styles.input}
              />
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <TouchableHighlight
                  onPress={this.Invite}
                  style={{
                    backgroundColor: colors.yellow,
                    width: 100,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: 'black',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.2,
                    elevation: 3,
                  }}>
                  <Text style={styles.text}>OK</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    this.toggleInvite(false);
                  }}
                  style={{
                    backgroundColor: colors.yellow,
                    width: 100,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: 'black',
                    shadowOffset: {width: 0, height: 0},
                    shadowOpacity: 0.2,
                    elevation: 3,
                  }}>
                  <Text style={styles.text}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.successVisible}
          onRequestClose={() => {}}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <TouchableWithoutFeedback
              style={{flex: 1}}
              onPress={() => this.toggleSuccess(false)}>
              <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Image source={confirm_img} style={{width: 80, height: 80}} />
              <Text
                style={{
                  fontWeight: '700',
                  marginBottom: 10,
                  textAlign: 'center',
                }}>
                Congratulations
              </Text>
              <Text style={{textAlign: 'center', marginBottom: 10}}>
                You've invited {username}. We've given you 5 tokens.
              </Text>

              <TouchableOpacity
                onPress={() => this.toggleSuccess(false)}
                style={{
                  marginTop: 20,
                  backgroundColor: colors.yellow,
                  width: 100,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: colors.grey,
                  borderWidth: 1,
                  shadowColor: 'black',
                  shadowOffset: {width: 0, height: 0},
                  shadowOpacity: 0.2,
                  elevation: 3,
                }}>
                <Text style={styles.text}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      // </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  content_view: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: Metrics.screenHeight > 750 ? 50 : 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
    fontFamily: 'Gothic A1',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coin_text: {
    fontSize: 12,
  },
  token_img_container: {
    width: 85,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  token_number: {
    fontSize: 20,
    textAlign: 'center',
  },
  row_view: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  redeem_text: {
    textAlign: 'center',
    fontFamily: 'Gothic A1',
    fontSize: 18,
    fontWeight: '200',
    marginTop: 10,
    marginBottom: 10,
  },
  Button: {
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  White_Button: {
    borderRadius: 10,
    padding: 10,
    width: 100,
    height: 60,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    shadowOffset: {height: 1, width: 1},
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  Font: {
    textAlign: 'center',
    fontFamily: 'Gothic A1',
    fontSize: 12,
  },
  Title: {
    fontSize: 20,
    fontFamily: 'Gothic A1',
    color: colors.darkblue,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.darkblue,
    paddingLeft: 10,
    marginBottom: 20,
  },
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
    padding: 20,
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
export default connect(mapStateToProps, mapDispatchToProps)(MyTokens);

// export default StackNavigator;
