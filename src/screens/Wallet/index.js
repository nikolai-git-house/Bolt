import React, { Component } from "react";
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
  Modal
} from "react-native";
import { connect } from "react-redux";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import Header from "./component/Header.js";
import { sendInvitation } from "../../functions/Auth";
import { saveOnboarding } from "../../Redux/actions";
import colors from "../../theme/Colors";
import Firebase from "../../firebasehelper";
import token_img from "../../assets/wallet/token.png";
import cup_img from "../../assets/wallet/cup.png";
import confirm_img from "../../assets/popup/balloon.png";
import { Metrics } from "../../theme";
const GIFT_ADDUSER = 5;
class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokens: props.basic.tokens,
      inviteVisible: false,
      successVisible: false,
      phone: "",
      username: ""
    };
  }
  componentDidMount = () => {};
  componentWillReceiveProps = nextProps => {
    this.setState({ tokens: nextProps.basic.tokens });
  };
  onChangePhoneNumber = phone => {
    this.setState({ phone: phone });
  };
  onChangeUsername = username => {
    this.setState({ username: username });
  };
  toggleInvite = visible => {
    this.setState({ inviteVisible: visible });
  };
  toggleSuccess = visible => {
    this.setState({ successVisible: visible });
  };
  Invite = () => {
    const { basic, uid } = this.props;
    const { phone, username } = this.state;
    const inviter = basic.firstname;
    const tokens = basic.tokens;

    if (username) {
      let response = sendInvitation(phone, inviter);
      Firebase.updateUserData(uid, { tokens: tokens + GIFT_ADDUSER }).then(
        res => {
          this.props.dispatch(saveOnboarding(res));
        }
      );
      this.toggleInvite(false);
      this.toggleSuccess(true);
    }
  };
  navigateTo = (page, props = {}) => {
    this.props.navigation.navigate(page, props);
  };
  openExplore = () => {
    this.navigateTo("Explore");
  };
  openCommunity = () => {
    this.navigateTo("Community");
  };
  openHomeProfile = () => {
    this.navigateTo("Profile", { page: "Home" });
  };
  render() {
    const { basic } = this.props;
    const { firstname } = basic;
    const { tokens, phone, username } = this.state;
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View
        style={{
          flex: 1,
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          alignItems: "center",
          backgroundColor: colors.white
        }}
      >
        <TopImage />
        <Logo />
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            marginTop: Metrics.screenHeight > 750 ? 180 : 120,
            paddingLeft: 20,
            paddingRight: 20,
            alignItems: "center",
            backgroundColor: colors.white,
            fontFamily: "Gothic A1"
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Gothic A1",
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 10
            }}
          >
            {firstname}'s Bolt Tokens
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Gothic A1",
              fontSize: 18,
              fontWeight: "200",
              marginBottom: 10
            }}
          >
            Your bolt member currency.
          </Text>

          <ImageBackground
            source={token_img}
            style={{
              width: 100,
              height: 100,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ fontSize: 20, textAlign: "center" }}>{tokens}</Text>
          </ImageBackground>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Gothic A1",
              fontSize: 18,
              fontWeight: "200",
              marginTop: 10,
              marginBottom: 10
            }}
          >
            Redeem tokens on Bolt packages or add to your Bolt spending card.
          </Text>
          <TouchableOpacity style={styles.Button} onPress={this.openExplore}>
            <Text>Spend your tokens</Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 40,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              style={styles.White_Button}
              onPress={() => this.toggleInvite(true)}
            >
              <Text style={styles.Font}>Invite {"\n"} Friends</Text>
            </TouchableOpacity>
            <Text style={styles.Font}>Earn tokens</Text>
            <TouchableOpacity
              style={styles.White_Button}
              onPress={this.openExplore}
            >
              <Text style={styles.Font}>Become {"\n"}Member</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              style={styles.White_Button}
              onPress={this.openHomeProfile}
            >
              <Text style={styles.Font}>Add Home {"\n"} Profile</Text>
            </TouchableOpacity>
            <Image
              source={cup_img}
              style={{ width: 120, height: 120, marginTop: -30 }}
            />
            <TouchableOpacity
              style={styles.White_Button}
              onPress={this.openCommunity}
            >
              <Text style={styles.Font}>Take your {"\n"} ProfileTest</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.inviteVisible}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => this.toggleInvite(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Text style={styles.Title}>Invite friends for tokens</Text>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>
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
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around"
                }}
              >
                <TouchableHighlight
                  onPress={this.Invite}
                  style={{
                    backgroundColor: colors.yellow,
                    width: 100,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    elevation: 3
                  }}
                >
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    elevation: 3
                  }}
                >
                  <Text style={styles.text}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.successVisible}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => this.toggleSuccess(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Image source={confirm_img} style={{ width: 80, height: 80 }} />
              <Text
                style={{
                  fontWeight: "700",
                  marginBottom: 10,
                  textAlign: "center"
                }}
              >
                Congratulations
              </Text>
              <Text style={{ textAlign: "center", marginBottom: 10 }}>
                You've invited {username}. We've given you 5 tokens.
              </Text>

              <TouchableOpacity
                onPress={() => this.toggleSuccess(false)}
                style={{
                  marginTop: 20,
                  backgroundColor: colors.yellow,
                  width: 100,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: colors.grey,
                  borderWidth: 1,
                  shadowColor: "black",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.2,
                  elevation: 3
                }}
              >
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
  Button: {
    borderRadius: 20,
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.yellow,
    shadowOffset: { height: 1, width: 1 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3
  },
  White_Button: {
    borderRadius: 10,
    padding: 10,
    width: 100,
    height: 60,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    shadowOffset: { height: 1, width: 1 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3
  },
  Font: {
    textAlign: "center",
    fontFamily: "Gothic A1",
    fontSize: 12
  },
  Title: {
    fontSize: 20,
    fontFamily: "Gothic A1",
    color: colors.darkblue,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.darkblue,
    width: "100%",
    paddingLeft: 10,
    marginBottom: 20
  },
  modal: {
    position: "absolute",
    left: "10%",
    top: "20%",
    width: "80%",
    height: "35%",
    justifyContent: "space-around",
    alignItems: "center",
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 20
  }
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic,
    uid: state.uid
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);

// export default StackNavigator;
