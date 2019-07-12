import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import { Metrics } from "../../theme";
import BubbleText from "./BubbleText";
import MessageInput from "../../components/MessageInput";
import Firebase from "../../firebasehelper";
const TAB_HEIGHT = 50;
var timer;
class LiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboard: "invisible",
      keyboard_Height: 0,
      message_txt: "",
      messages: [],
      typing: false
    };
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  componentDidMount() {
    const { room_id } = this.props.navigation.state.params;
    Firebase.getChats(room_id, res => {
      let chats = Object.values(res);
      this.setState({ messages: chats });
    });
    Firebase.getAgencyTyping(room_id, typing => {
      this.setState({ typing: typing });
    });
    Firebase.getStatus(room_id, established => {
      if (established === "false") {
        console.log("established false");
        DeviceEventEmitter.emit("clear_chatbot", {});
        this.props.navigation.goBack();
      }
    });
  }

  _keyboardDidShow(e) {
    this.setState({ keyboard: "visible" });

    let keyboard_Height = e.endCoordinates.height;
    this.setState({ keyboard_Height });
    let self = this;
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 100);
  }
  _keyboardDidHide() {
    this.setState({ keyboard: "invisible" });
  }
  setMessages() {
    console.log("setMessages");
    const { messages } = this.state;
    let self = this;
    setTimeout(() => {
      if (self.refs.scrollView) self.refs.scrollView.scrollToEnd();
    }, 100);
    return messages.map((message, i) => {
      return <BubbleText message={message} key={i} typing={false} />;
    });
  }
  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }
  addMessage = message => {
    const { room_id } = this.props.navigation.state.params;
    setTimeout(() => {
      this.refs.scrollView.scrollToEnd();
    }, 100);
    this.setMessageInState(message);
    Firebase.addMessage(room_id, message, res => {
      console.log("addedChat", res);
    });
  };
  SendMessage = () => {
    const { message_txt } = this.state;
    let self = this;
    Keyboard.dismiss();
    this.setState({ keyboard: "invisible", message_txt: "" });
    if (message_txt) this.addMessage({ type: "user", message: message_txt });
  };
  onChangeMessage = text => {
    const { room_id } = this.props.navigation.state.params;
    Firebase.setTypeValue(room_id, true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      Firebase.setTypeValue(room_id, false);
    }, 1000);
    this.setState({ message_txt: text });
  };
  terminate = () => {
    const { room_id } = this.props.navigation.state.params;
    Firebase.terminateChat(room_id, res => {
      if (res === "success") {
        console.log("Terminated chat");
      }
    });
  };
  render() {
    const { keyboard_Height, message_txt, typing } = this.state;
    return (
      <View style={styles.maincontainer}>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -29
          }}
        >
          <Logo />
        </View>
        <ScrollView
          ref="scrollView"
          style={{ marginTop: 80 }}
          contentContainerStyle={{
            width: "100%",

            minHeight: Metrics.screenHeight - 130
          }}
          keyboardShouldPersistTaps={"handled"}
        >
          <View style={{ height: 20 }} />
          {this.setMessages()}
          {typing && <BubbleText message={{ type: "agency" }} typing={true} />}
          <MessageInput
            style={{ marginTop: "auto" }}
            onChange={this.onChangeMessage}
            onSend={this.SendMessage}
            value={message_txt}
          />
          <TouchableOpacity
            style={styles.CalltoAction}
            onPress={this.terminate}
          >
            <Text style={styles.button}>EndChat</Text>
          </TouchableOpacity>
        </ScrollView>
        {this.state.keyboard == "visible" && (
          <View
            style={{
              width: "100%",
              height: keyboard_Height - TAB_HEIGHT,
              backgroundColor: "rgba(52, 52, 52, 0.0)"
            }}
          />
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
    display: "flex",
    flexDirection: "column",
    paddingTop: 29,
    backgroundColor: colors.white,
    paddingLeft: 16
  },
  CalltoAction: {
    opacity: 0.8,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: colors.darkblue,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    alignSelf: "flex-end"
  },
  button: {
    color: colors.white,
    fontSize: 13,
    fontFamily: "Graphik",
    fontWeight: "100",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 22,
    paddingRight: 22
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
)(LiveChat);
