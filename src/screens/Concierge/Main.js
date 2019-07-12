import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  DeviceEventEmitter,
  Image,
  ActivityIndicator
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import { Metrics } from "../../theme";
import MessageItem from "../../components/MessageItem";
import MessageInput from "../../components/MessageInput";
import IssueInput from "../../components/IssueInput";
import Firebase from "../../firebasehelper";
import { buildBotMessages } from "./botMessages";
import { saveOnboarding } from "../../Redux/actions/index";
import Choice from "../../components/Choice";
import { getTicketNumber } from "../../utils/functions";
const TAB_HEIGHT = 50;
let items = [];
let rooms = [];
let adjectives = [];
Firebase.getAllItem(res => {
  items = res.map(item => item.toLowerCase());
});
Firebase.getAllRoom(res => {
  rooms = res.map(item => {
    return { value: item };
  });
});
Firebase.getAllAdjective(res => {
  adjectives = res.map((item, index) => {
    return { id: index, name: item };
  });
});
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboard: "invisible",
      keyboard_Height: 0,
      message_txt: "",
      botMessages: [],
      messages: [],
      isUserTurn: false,
      isfinalQuestion: false,
      duration: 3000,
      info: "",
      email: "",
      password: "",
      choiceselected: false,
      goinglivechat: false,
      waiting_reply: false
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
    console.log("unmount Main");
  }
  componentDidMount() {
    this.props.navigation.addListener("willFocus", this.restart);
  }
  restart = () => {
    this.setState({
      messages: [],
      choiceselected: false,
      goinglivechat: false
    });
    let profile = this.props.basic;
    let uid = this.props.uid;
    if (!profile) {
      profile = {
        firstname: "Test",
        lastname: "Test",
        dob: "08/12/1994",
        phonenumber: "+9721323",
        email: "test@gmail.com",
        password: "test"
      };
    }
    const botMessages = buildBotMessages(profile);
    this.setState({ botMessages });
    setTimeout(() => this.StartBot(), 100);

    Firebase.getAgencyRespond(uid, res => {
      if (res) {
        this.GoLiveChat();
      }
    });
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  Activate = () => {
    const uid = this.props.uid;
    const basic = this.props.basic;

    const { email, password } = this.state;
    Firebase.activate(uid, email, password)
      .then(res => {
        this.props.dispatch(saveOnboarding(res));
        console.log("activate result", res);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };
  AnalyzeText = (answer, room) => {
    const _this = this;
    const { duration } = this.state;
    const { uid } = this.props;
    let ticket = {
      id: answer.ticket,
      issue: answer.issue,
      status: "Waiting",
      title: "Home Repairs",
      response_sla: answer.response_sla,
      repair_sla: answer.repair_sla,
      room: room,
      memberID: uid
    };
    console.log("answer.ticket", answer.ticket);
    if (answer.ticket === 14.1) {
      this.addMessage({
        type: "bot",
        text: "Thanks for reporting this issue."
      });
      setTimeout(() => {
        _this.addMessage({
          type: "bot",
          text: "This issue is not covered by Bolt."
        });
      }, duration);
      setTimeout(() => {
        _this.addMessage({
          type: "bot",
          isUserNext: true,
          isChoice: true,
          choiceselected: false
        });
      }, 2 * duration);
    } else {
      const result = [
        { type: "bot", text: "Thanks for reporting this issue." },
        { type: "bot", text: "This is a " + answer.band + "." },
        { type: "bot", text: "This is covered by Bolt." },
        {
          type: "bot",
          text: "A Bolt worker will be in touch " + answer.response_sla + "."
        },
        {
          type: "bot",
          text: "We aim to have this repair made " + answer.repair_sla + "."
        },
        {
          type: "bot",
          text:
            "We have logged a ticket, which our team will be monitoring. If you have any other questions please do let me know."
        }
      ];
      result.some((item, index) => {
        setTimeout(() => {
          _this.addMessage(item);
        }, index * duration);
        if (index === 5) {
          setTimeout(() => {
            _this.requestChat(ticket);
            _this.refs.scrollView.scrollToEnd();
          }, index * duration);
        }
      });
    }
  };
  isFailedIssue = () => {
    this.addMessage({
      type: "bot",
      text: "Sorry, this is not issue what I can help you."
    });
    this.startAIBot();
  };
  startAIBot = () => {
    const { duration } = this.state;
    let _this = this;
    setTimeout(() => {
      _this.addMessage({
        type: "bot",
        text: `Please could you describe your problem in detail?`
      });
      _this.setState({ isfinalQuestion: true });
    }, duration);
    setTimeout(() => {
      _this.setState({ isUserTurn: true });
    }, duration + 2000);
    setTimeout(() => {
      _this.refs.scrollView.scrollToEnd();
    }, duration + 2100);
  };
  StartBot = () => {
    const { botMessages, duration } = this.state;
    let _this = this;
    botMessages.some((item, index) => {
      this.setState({ startpoint: index });
      setTimeout(() => {
        _this.addMessage(item);
        _this.refs.scrollView.scrollToEnd();
      }, index * duration);
      if (item.isUserNext) {
        this.setState({ info: item.key });
        setTimeout(() => {
          if (!item.isChoice) _this.setState({ isUserTurn: true });
          botMessages.splice(0, index + 1);
          newbotMessages = botMessages;
          _this.setState({ botMessages: newbotMessages });
        }, (index + 1) * duration);
      }
      if (item.isFinish) {
        this.Activate();
      }
      return item.isUserNext;
    });
  };
  createTicket = choice => {
    let ticket_id = choice.id;
    let issue = choice.title;
    let ticket = {
      id: ticket_id,
      issue: issue,
      status: "Waiting",
      title: issue
    };
    this.requestChat(ticket);
  };
  requestChat = ticket => {
    let self = this;
    const { uid, basic } = this.props;
    const { firstname, lastname } = basic;
    let fullname = firstname + " " + lastname;
    setTimeout(() => {
      self.setState({ waiting_reply: true });
    }, 2000);
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 2100);
    Firebase.requestChat(uid, fullname, ticket);
  };
  _keyboardDidShow(e) {
    this.setState({ keyboard: "visible" });

    let keyboard_Height = e.endCoordinates.height;
    this.setState({ keyboard_Height });
    let self = this;
    setTimeout(() => {
      self.moveScroll();
    }, 100);
  }
  selectedChoice = choice => {
    let self = this;
    Keyboard.dismiss();
    this.setState({ keyboard: "invisible", choiceselected: true });
    this.addMessage({
      type: "user",
      text: `I'd like your help with ${choice.title} please bolt?`
    });
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 100);
    if (choice.id === 1) {
      this.startAIBot();
    } else {
      this.createTicket(choice);
    }
  };
  _keyboardDidHide() {
    this.setState({ keyboard: "invisible" });
  }
  setMessages() {
    const { messages } = this.state;
    const { basic } = this.props;
    const avatar_url = basic.avatar_url;
    return messages.map((message, i) => {
      if (message.isChoice) {
        return <Choice on_selectChoice={this.selectedChoice} />;
      } else
        return (
          <MessageItem message={message} key={i} avatar_url={avatar_url} />
        );
    });
  }
  addMessage = message => {
    const { messages } = this.state;
    const _this = this;
    let temp = messages;
    temp.push(message);
    this.setState({ messages: temp }, () => {
      console.log("added Message");
      setTimeout(() => {
        if (message.isChoice) this.moveScroll();
        else _this.refs.scrollView.scrollToEnd();
      }, 100);
    });
  };
  SendMessage = () => {
    const { message_txt, messages, info, isfinalQuestion } = this.state;
    let self = this;
    Keyboard.dismiss();
    this.setState({ keyboard: "invisible" });
    this.setState({ [info]: message_txt });
    this.addMessage({ type: "user", text: message_txt });

    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 100);
    this.setState({ isUserTurn: false });
    setTimeout(() => this.StartBot(), 1000);
  };
  onChangeMessage = text => {
    this.setState({ message_txt: text });
  };
  ChooseIssue = (item, room, adjective) => {
    let self = this;
    let text = "";

    text = "The " + item + " in the " + room + " is " + adjective + ".";
    this.addMessage({ type: "user", text: text });
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 100);
    this.setState({ isUserTurn: false });
    setTimeout(() => this.StartBot(), 1000);

    Firebase.findAnswer(item, room, adjective, res => {
      if (!res) {
        self.isFailedIssue();
      } else {
        console.log("findanswer result", res);
        self.AnalyzeText(res, room);
        self.setState({ isfinalQuestion: false });
      }
    });
  };
  GoLiveChat = () => {
    const { uid } = this.props;
    this.setState({ waiting_reply: false });
    this.navigateTo("LiveChat", {
      ongoBack: () => console.log("Will go back from nextComponent"),
      room_id: uid
    });
  };
  onOpenIssue = () => {
    console.log("opened");
    let _this = this;
    this.setState({ keyboard_Height: 100 });
    setTimeout(() => {
      this.setState({ keyboard: "visible" });
    }, 200);
    // setTimeout(() => {
    //   _this.moveScroll();
    // }, 300);
  };
  onCloseIssue = () => {
    let _this = this;
    this.setState({ keyboard_Height: 100 });
    this.setState({ keyboard: "invisible" });
    setTimeout(() => {
      _this.refs.scrollView.scrollToEnd();
    }, 100);
  };
  handleScroll = e => {
    this.setState({ scrollY: e.nativeEvent.contentOffset.y });
  };
  moveScroll = () => {
    console.log("scrollY", this.state.scrollY);
    this.refs.scrollView.scrollTo({ y: this.state.scrollY + 20 });
  };
  moveIssueScroll = () => {
    console.log("scrollY", this.state.scrollY);
    this.refs.scrollView.scrollTo({ y: this.state.scrollY + 10 });
  };
  render() {
    const {
      keyboard_Height,
      message_txt,
      isUserTurn,
      isfinalQuestion,
      waiting_reply
    } = this.state;

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
            paddingBottom: 50,
            minHeight: Metrics.screenHeight - 120
          }}
          keyboardShouldPersistTaps={"handled"}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
        >
          <View style={{ height: 20 }} />
          {this.setMessages()}
          {waiting_reply && (
            <View
              style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start"
              }}
            >
              <View style={styles.avatar}>
                <Image
                  source={require("../../assets/onboarding/concierge3.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    resizeMode: "contain"
                  }}
                />
              </View>
              <ActivityIndicator size="large" color={colors.black} />
            </View>
          )}
          {isUserTurn && !isfinalQuestion && (
            <MessageInput
              style={{ marginTop: "auto" }}
              onChange={this.onChangeMessage}
              onSend={this.SendMessage}
              value={message_txt}
            />
          )}
          {isUserTurn && isfinalQuestion && (
            <IssueInput
              onOpen={this.onOpenIssue}
              onClose={this.onCloseIssue}
              items={items}
              rooms={rooms}
              adjectives={adjectives}
              onSend={this.ChooseIssue}
            />
          )}
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
    backgroundColor: colors.yellow,
    borderRadius: 30,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    elevation: 3,
    alignSelf: "flex-end"
  },
  button: {
    color: colors.darkblue,
    fontSize: 16,
    fontFamily: "Graphik",
    fontWeight: "100",
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 22,
    paddingRight: 22
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    marginTop: -5
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  spinnerTextStyle: {
    color: "#FFF"
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
)(Main);
