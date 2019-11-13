import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  DeviceEventEmitter,
  Image,
  ActivityIndicator,
  AsyncStorage,
  Text,
  WebView
} from "react-native";
import { connect } from "react-redux";
import OneSignal from "react-native-onesignal";
import colors from "../../theme/Colors";
import { Metrics } from "../../theme";
import MessageItem from "../../components/MessageItem";
import MessageInput from "../../components/MessageInput";
import TopImage from "../../components/TopImage";
import Logo from "../../components/Logo";
import IssueInput from "../../components/IssueInput";
import RestaurantInput from "../../components/RestaurantInput";
import Firebase from "../../firebasehelper";
import { buildBotMessages } from "./botMessages";
import { saveOnboarding, saveInvitation } from "../../Redux/actions/index";
import Choice from "../../components/Choice";
import RecommendPackage from "./RecommendPackage";
import PackCarousel from "../../components/PackCarousel";
import Subscription from "../../components/Subscription";
import { isTicketforLandlord } from "../../utils/functions";
const TAB_HEIGHT = 50;
let items = [];
let rooms = [];
let adjectives = [];
let locations = [];
let cuisines = [];

Firebase.getAllItem(res => {
  items = res;
  //items = res.map(item => item.toLowerCase());
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
Firebase.getAllLocations(res => {
  console.log("locations", res);
  locations = res;
});
Firebase.getAllCuisines(res => {
  console.log("cuisines", res);
  cuisines = res;
});
function arraytoString(array) {
  let str = "";
  array.forEach(item => {
    str += " " + item;
  });
  return str;
}
function clearAllTimeout() {
  var id = window.setTimeout(function() {}, 0);
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
}
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renter_owner: props.basic.renter_owner === "Renter" ? 1 : 2,
      keyboard: "invisible",
      keyboard_Height: 0,
      message_txt: "",
      botMessages: [],
      messages: [],
      isUserTurn: false,
      isfinalQuestion: false,
      startbooking: false,
      duration: 3000,
      info: "",
      email: "",
      password: "",
      choiceselected: false,
      goinglivechat: false,
      waiting_reply: false,
      issue_opened: false,
      show_package: false,
      show_booking_travel: false,
      show_exit_travel: false,
      pkgs: []
    };
    // this._keyboardDidShow = this._keyboardDidShow.bind(this);
    // this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
  // componentWillMount() {
  //   this.keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     this._keyboardDidShow
  //   );
  //   this.keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     this._keyboardDidHide
  //   );
  // }

  // componentWillUnmount() {
  //   this.keyboardDidShowListener.remove();
  //   this.keyboardDidHideListener.remove();
  //   console.log("unmount Main");
  //   clearAllTimeout();
  // }
  // resetWebViewToInitialUrl = () => {
  //   const { key } = this.state;
  //   this.setState({
  //     key: key + 1
  //   });
  // };
  // renderLoading = () => {
  //   return (
  //     <View
  //       style={{
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         justifyContent: "center"
  //       }}
  //     >
  //       <ActivityIndicator
  //         size="large"
  //         style={{
  //           marginBottom: 10
  //         }}
  //       />
  //       <Text>Please wait...</Text>
  //     </View>
  //   );
  // };
  // componentWillReceiveProps(nextProps) {
  //   console.log("pkgs", this.props.basic.packages);
  //   this.resetWebViewToInitialUrl();
  //   if (this.props.basic.packages) {
  //     let promises = this.props.basic.packages.map(item => {
  //       return Firebase.getPackageInfo(item.caption).then(res => {
  //         return res;
  //       });
  //     });
  //     Promise.all(promises).then(res => {
  //       console.log("pkgs", res);
  //       this.setState({ pkgs: res });
  //     });
  //   } else {
  //     this.setState({ pkgs: [] });
  //   }
  // }
  componentDidMount() {
    let { uid, basic } = this.props;
    console.log("pkgs", this.props.basic.packages);
    if (this.props.basic.packages) {
      let promises = this.props.basic.packages.map(item => {
        return Firebase.getPackageInfo(item.caption).then(res => {
          return res;
        });
      });
      Promise.all(promises).then(res => {
        console.log("pkgs", res);
        this.setState({ pkgs: res });
      });
    } else {
      this.setState({ pkgs: [] });
    }
    let phone = "";
    this.unsubscribeUserProfile = Firebase.firestore()
      .collection("user")
      .doc(uid)
      .onSnapshot(snapshot => {
        let userprofile = snapshot.data();
        phone = userprofile.phonenumber;
        this.props.dispatch(saveOnboarding(userprofile));
        AsyncStorage.setItem("profile", JSON.stringify(userprofile));
      });
    this.unsubscribeInvitations = Firebase.firestore()
      .collection("invitations")
      .onSnapshot(snapshot => {
        let data = snapshot.docs;
        data.map(item => {
          let invite_item = item.data();
          if (invite_item.phone === phone) {
            console.log("invite item found in Concierge", basic);
            this.props.dispatch(saveInvitation(invite_item));
            this.navigateTo("Home");
          }
        });
        console.log("invitation data", data);
      });
    Firebase.getChatsById(uid, res => {
      if (res) {
        this.navigateTo("LiveChat", { uid, ticket_id: res });
      }
    });
    OneSignal.getPermissionSubscriptionState(state => {
      console.log("notifId", state.userId);
      this.setState({ notifId: state.userId });
      Firebase.updateUserData(uid, { uuid: state.userId }).then(res => {
        this.props.dispatch(saveOnboarding(res));
        AsyncStorage.setItem("profile", JSON.stringify(res));
      });
    });
    this.props.navigation.addListener("willFocus", this.catchPreviousScreen);
  }
  componentWillUnmount() {
    this.unsubscribeUserProfile();
    this.unsubscribeInvitations();
  }
  catchPreviousScreen = () => {
    this.restart();
  };
  restart = async () => {
    // this.setState({
    //   messages: [],
    //   choiceselected: false,
    //   goinglivechat: false,
    //   packagesBought: [],
    //   show_subscriptions: false,
    //   isUserTurn: false,
    //   isfinalQuestion: false,
    //   startBooking: false
    // });
    // let profile = this.props.basic;
    // let uid = this.props.uid;
    // if (!profile) {
    //   profile = {
    //     firstname: "Test",
    //     dob: "08/12/1994",
    //     phonenumber: "+9721323",
    //     email: "test@gmail.com",
    //     password: "test"
    //   };
    //}
    // const botMessages = buildBotMessages(profile);
    // this.setState({ botMessages });
    //setTimeout(() => this.StartBot(), 100);
    // let pkgs = await Firebase.getPackagesBoughtByUserID(uid);
    // this.setState({ packagesBought: pkgs });
    this.webview.reload();
  };
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  // AnalyzeText = (answer, item, room, adjective) => {
  //   const _this = this;
  //   const { duration } = this.state;
  //   const { uid } = this.props;
  //   let ticket = {
  //     id: answer.ticket,
  //     issue: answer.issue,
  //     status: "Waiting",
  //     title: "Home Repairs",
  //     response_sla: answer.response_sla,
  //     repair_sla: answer.repair_sla,
  //     band: answer.band,
  //     memberID: uid,
  //     item,
  //     room,
  //     adjective
  //   };
  //   console.log("answer.ticket", answer.ticket);
  //   if (answer.ticket === 14.1) {
  //     this.addMessage({
  //       type: "bot",
  //       text: "Thanks for reporting this issue."
  //     });
  //     setTimeout(() => {
  //       _this.addMessage({
  //         type: "bot",
  //         text: "This issue is not covered by Bolt."
  //       });
  //     }, duration);
  //     setTimeout(() => {
  //       _this.addMessage({
  //         type: "bot",
  //         isUserNext: true,
  //         isChoice: true,
  //         choiceselected: false
  //       });
  //     }, 2 * duration);
  //   } else {
  //     const result = [
  //       { type: "bot", text: "Thanks for reporting this issue." },
  //       { type: "bot", text: "This is a " + answer.band + "." },
  //       { type: "bot", text: "This is covered by Bolt." },
  //       {
  //         type: "bot",
  //         text: "A Bolt worker will be in touch " + answer.response_sla + "."
  //       },
  //       {
  //         type: "bot",
  //         text: "We aim to have this repair made " + answer.repair_sla + "."
  //       },
  //       {
  //         type: "bot",
  //         text:
  //           "We have logged a ticket, which our team will be monitoring. If you have any other questions please do let me know."
  //       }
  //     ];
  //     result.some((item, index) => {
  //       setTimeout(() => {
  //         _this.addMessage(item);
  //       }, index * duration);
  //       if (index === 5) {
  //         setTimeout(() => {
  //           _this.requestChat(ticket);
  //           _this.refs.scrollView.scrollToEnd();
  //         }, index * duration);
  //       }
  //     });
  //   }
  // };
  // isFailedIssue = () => {
  //   this.addMessage({
  //     type: "bot",
  //     text: "Sorry, this is not issue what I can help you."
  //   });
  //   this.startAIBot();
  // };
  // showErrorComment = (ticket, pkgName) => {
  //   const { duration } = this.state;
  //   let _this = this;
  //   setTimeout(() => {
  //     _this.addMessage({
  //       type: "bot",
  //       text: `In order for me to help you with ${ticket} you must buy ${pkgName} in explore.`
  //     });
  //   }, duration);
  //   setTimeout(() => {
  //     _this.addMessage({
  //       type: "bot",
  //       isUserNext: true,
  //       isRecommend: true
  //     });
  //   }, 2 * duration);
  //   setTimeout(() => {
  //     _this.refs.scrollView.scrollToEnd();
  //   }, 2 * duration + 100);
  // };
  // startAIBot = () => {
  //   const { duration } = this.state;
  //   let _this = this;
  //   setTimeout(() => {
  //     _this.addMessage({
  //       type: "bot",
  //       text: `Please could you describe your problem in detail?`
  //     });
  //     _this.setState({ isfinalQuestion: true });
  //   }, duration);
  //   setTimeout(() => {
  //     _this.setState({ isUserTurn: true, issue_opened: true });
  //   }, duration + 2000);
  //   setTimeout(() => {
  //     _this.refs.scrollView.scrollToEnd();
  //   }, duration + 2100);
  // };
  // startBookingBar = () => {
  //   const { duration } = this.state;
  //   let _this = this;
  //   setTimeout(() => {
  //     _this.addMessage({
  //       type: "bot",
  //       text: `Let's build your perfect dining experience.`
  //     });
  //   }, duration);
  //   setTimeout(() => {
  //     _this.addMessage({
  //       type: "bot",
  //       text: `I'll earn you tokens & find discounts + upgrades.`
  //     });
  //     _this.setState({ startbooking: true });
  //   }, 2 * duration);

  //   setTimeout(() => {
  //     _this.setState({ isUserTurn: true, issue_opened: true });
  //   }, 2 * duration + 2000);
  //   setTimeout(() => {
  //     _this.refs.scrollView.scrollToEnd();
  //   }, 2 * duration + 2100);
  // };
  // StartBot = () => {
  //   const { botMessages, duration } = this.state;
  //   let _this = this;
  //   botMessages.some((item, index) => {
  //     setTimeout(() => {
  //       _this.addMessage(item);
  //       _this.refs.scrollView.scrollToEnd();
  //     }, index * duration);
  //     if (item.isUserNext) {
  //       this.setState({ info: item.key });
  //       setTimeout(() => {
  //         if (!item.isChoice) _this.setState({ isUserTurn: true });
  //         botMessages.splice(0, index + 1);
  //         _this.setState({ botMessages });
  //       }, (index + 1) * duration);
  //     }
  //     return item.isUserNext;
  //   });
  // };
  // createBugReport = bug => {
  //   let ticket_id = 31;
  //   let issue = bug;
  //   let ticket = {
  //     id: ticket_id,
  //     issue: issue,
  //     status: "Waiting",
  //     title: "App Bugs"
  //   };
  //   this.requestChat(ticket);
  // };
  // talktoHuman = () => {
  //   const { duration } = this.state;
  //   const { uid, basic } = this.props;
  //   const { firstname } = basic;
  //   let self = this;
  //   let ticket_id = 30;
  //   let issue = "Talk to human";
  //   let ticket = {
  //     id: ticket_id,
  //     issue: "Talk to human",
  //     status: "Waiting",
  //     title: "Talk to human"
  //   };

  //   setTimeout(() => {
  //     self.setState({ waiting_reply: true });
  //   }, 200);
  //   setTimeout(() => {
  //     self.refs.scrollView.scrollToEnd();
  //   }, 300);

  //   Firebase.requestChat(uid, firstname, ticket);
  // };
  // onChooseSubPackages = () => {
  //   let self = this;
  //   const { duration } = this.state;
  //   setTimeout(() => {
  //     self.addMessage({
  //       type: "bot",
  //       text: `Sure, here's our bolt packages, scroll through...`
  //     });
  //   }, duration);
  //   setTimeout(() => {
  //     self.refs.scrollView.scrollToEnd();
  //   }, duration + 100);
  //   setTimeout(() => {
  //     self.setState({ show_package: true });
  //   }, duration + 1500);
  // };
  // onChooseMySubscriptions = () => {
  //   let self = this;
  //   const { duration, pkgs } = this.state;
  //   if (pkgs.length > 0) {
  //     setTimeout(() => {
  //       self.addMessage({
  //         type: "bot",
  //         text: `Here's your subscriptions. Access more info below...`
  //       });
  //     }, duration);
  //     setTimeout(() => {
  //       self.refs.scrollView.scrollToEnd();
  //     }, duration + 100);
  //     setTimeout(() => {
  //       self.setState({ show_subscriptions: true });
  //     }, duration + 1500);
  //     setTimeout(() => {
  //       self.refs.scrollView.scrollToEnd();
  //     }, duration + 1600);
  //   } else {
  //     setTimeout(() => {
  //       self.addMessage({
  //         type: "bot",
  //         text: `Sorry, you have subscribed nothing.`
  //       });
  //     }, duration);
  //     setTimeout(() => {
  //       self.refs.scrollView.scrollToEnd();
  //     }, duration + 100);
  //     setTimeout(() => {
  //       self.addMessage({
  //         type: "bot",
  //         isUserNext: true,
  //         isChoice: true,
  //         choiceselected: false
  //       });
  //     }, 2 * duration);
  //   }
  // };
  // createTicket = choice => {
  //   let ticket_id = choice.id;
  //   let issue = choice.title;
  //   let ticket = {
  //     id: ticket_id,
  //     issue: issue,
  //     status: "Waiting",
  //     title: issue
  //   };
  //   this.requestChat(ticket);
  // };
  // requestChat = ticket => {
  //   let self = this;
  //   const { duration } = this.state;
  //   const { uid, basic } = this.props;
  //   const { firstname } = basic;
  //   let time = new Date().getTime().toString();
  //   ticket.time = time;
  //   setTimeout(() => {
  //     self.addMessage({
  //       type: "bot",
  //       text: `Thanks, ${firstname}, one of our agents will be in touch shortly.`
  //     });
  //   }, duration);
  //   setTimeout(() => {
  //     self.refs.scrollView.scrollToEnd();
  //   }, duration + 100);
  //   setTimeout(() => {
  //     self.addMessage({
  //       type: "bot",
  //       text: `Is there anything else I can help with today ${firstname}?`
  //     });
  //   }, 2 * duration);
  //   setTimeout(() => {
  //     self.refs.scrollView.scrollToEnd();
  //   }, 2 * duration + 100);
  //   setTimeout(() => {
  //     self.addMessage({
  //       type: "bot",
  //       isUserNext: true,
  //       isChoice: true,
  //       choiceselected: false
  //     });
  //   }, 3 * duration);
  //   Firebase.requestChat(uid, firstname, ticket);
  //   if (isTicketforLandlord(ticket.ticket_id)) {
  //     Firebase.addFeed(property_id, ticket.title);
  //   }
  // };
  // _keyboardDidShow(e) {
  //   const { issue_opened } = this.state;
  //   this.setState({ keyboard: "visible" });
  //   let keyboard_Height = e.endCoordinates.height;
  //   this.setState({ keyboard_Height });
  //   let self = this;
  //   console.log("issue_opened", issue_opened);
  //   setTimeout(() => {
  //     self.moveScroll(80);
  //     if (issue_opened) self.moveScroll(80);
  //     else self.refs.scrollView.scrollToEnd();
  //   }, 100);
  // }
  // selectedChoice = async choice => {
  //   const { uid } = this.props;
  //   console.log("choice", choice);
  //   let self = this;
  //   const { duration, packagesBought } = this.state;
  //   let packageRequired = await Firebase.getPackNamesByTicketID(choice.id);
  //   Keyboard.dismiss();

  //   this.setState({ keyboard: "invisible", choiceselected: true });
  //   if (choice.id != 30 && choice.id != 31 && choice.id != 21) {
  //     this.addMessage({
  //       type: "user",
  //       text: `I'd like your help with ${choice.title} please bolt?`
  //     });
  //     setTimeout(() => {
  //       self.refs.scrollView.scrollToEnd();
  //     }, 100);
  //   }
  //   if (choice.id === 1) {
  //     this.startAIBot();
  //   } else if (choice.id === 15) {
  //     this.onChooseSubPackages();
  //     //this.createTicket(choice);
  //   } else if (choice.id === 16) {
  //     this.onChooseMySubscriptions();
  //   } else if (choice.id === 21) {
  //     this.navigateTo("TravelBooking");
  //     //this.setState({ show_booking_travel: true });
  //   } else if (choice.id === 22) {
  //     this.startBookingBar();
  //   } else if (choice.id === 30) {
  //     this.talktoHuman();
  //   } else if (choice.id === 31) {
  //     this.setState({ info: "bug" });
  //     this.setState({ isUserTurn: true });
  //     setTimeout(() => {
  //       self.refs.scrollView.scrollToEnd();
  //     }, 100);
  //     //app bug
  //   } else {
  //     console.log("packageBought", packagesBought);
  //     console.log("packageRequired", packageRequired);
  //     this.setState({ packageRequired });
  //     let pkgNames = arraytoString(packageRequired);
  //     if (packageRequired.length > 0) {
  //       if (packagesBought) {
  //         console.log("packagesBought");
  //         if (
  //           !packageRequired.every(elem => packagesBought.indexOf(elem) > -1)
  //         ) {
  //           this.showErrorComment(choice.title, pkgNames);
  //         } else this.createTicket({ id: choice.id, title: choice.title });
  //       } else {
  //         this.showErrorComment(choice.title, pkgNames);
  //       }
  //     } else this.createTicket({ id: choice.id, title: choice.title });
  //   }
  // };
  // selectRecommend = option => {
  //   const { uid } = this.props;
  //   const { duration, packageRequired } = this.state;

  //   if (option === "explore") {
  //     console.log("packageRequired", packageRequired);
  //     this.navigateTo("MainList", {
  //       ongoBack: () => console.log("Will go back from nextComponent"),
  //       packageRequired: packageRequired
  //     });
  //   } else {
  //     this.addMessage({
  //       type: "bot",
  //       isUserNext: true,
  //       isChoice: true,
  //       choiceselected: false
  //     });
  //   }
  // };
  // _keyboardDidHide() {
  //   this.setState({ keyboard: "invisible" });
  // }
  // setMessages() {
  //   const { messages } = this.state;
  //   const { basic } = this.props;
  //   const avatar_url = basic.avatar_url;
  //   return messages.map((message, i) => {
  //     if (message.isChoice) {
  //       return (
  //         <Choice
  //           on_selectChoice={this.selectedChoice}
  //           scrollView={this.refs.scrollView}
  //         />
  //       );
  //     } else if (message.isRecommend) {
  //       return <RecommendPackage on_selectRecommend={this.selectRecommend} />;
  //     } else
  //       return (
  //         <MessageItem message={message} key={i} avatar_url={avatar_url} />
  //       );
  //   });
  // }
  // addMessage = message => {
  //   const { messages } = this.state;
  //   const _this = this;
  //   let temp = messages;
  //   temp.push(message);
  //   this.setState({ messages: temp }, () => {
  //     console.log("added Message");
  //     setTimeout(() => {
  //       if (message.isChoice) {
  //         if (messages.length === 2) this.moveScroll(100);
  //         else this.moveScroll(500);
  //       } else if (messages.length === 1) this.moveScroll(10);
  //       else _this.refs.scrollView.scrollToEnd();
  //     }, 100);
  //   });
  // };
  // SendMessage = () => {
  //   const { message_txt, messages, info, isfinalQuestion } = this.state;
  //   let self = this;
  //   Keyboard.dismiss();
  //   this.setState({ keyboard: "invisible", [info]: message_txt });
  //   this.addMessage({ type: "user", text: message_txt });
  //   setTimeout(() => {
  //     self.setState({ message_txt: "" });
  //     self.refs.scrollView.scrollToEnd();
  //   }, 100);
  //   this.setState({ isUserTurn: false });
  //   if (info === "bug") {
  //     this.createBugReport(message_txt);
  //   } else setTimeout(() => this.StartBot(), 1000);
  // };
  // onChangeMessage = text => {
  //   this.setState({ message_txt: text });
  // };
  // ChooseIssue = (item, room, adjective) => {
  //   let self = this;
  //   let text = "";

  //   text = "The " + item + " in the " + room + " is " + adjective + ".";
  //   this.addMessage({ type: "user", text: text });
  //   setTimeout(() => {
  //     self.refs.scrollView.scrollToEnd();
  //   }, 100);
  //   this.setState({ isUserTurn: false });
  //   setTimeout(() => this.StartBot(), 1000);

  //   Firebase.findAnswer(item, room, adjective, res => {
  //     if (!res) {
  //       self.isFailedIssue();
  //     } else {
  //       console.log("findanswer result", res);
  //       self.AnalyzeText(res, item, room, adjective);
  //       self.setState({ isfinalQuestion: false, issue_opened: false });
  //     }
  //   });
  // };
  // BookCuisine = (cuisine, location) => {};
  GoLiveChat = () => {
    const { uid } = this.props;
    this.setState({ waiting_reply: false });
    this.navigateTo("LiveChat", {
      ongoBack: () => console.log("Will go back from nextComponent"),
      room_id: uid
    });
  };
  // onOpenIssue = () => {
  //   console.log("opened");
  //   let _this = this;
  //   this.setState({ keyboard_Height: 100 });
  //   setTimeout(() => {
  //     this.setState({ keyboard: "visible" });
  //   }, 200);
  // };
  // onCloseIssue = () => {
  //   let _this = this;
  //   this.setState({ keyboard_Height: 100 });
  //   this.setState({ keyboard: "invisible" });
  //   setTimeout(() => {
  //     _this.refs.scrollView.scrollToEnd();
  //   }, 100);
  // };
  // onExplorePackage = () => {
  //   this.navigateTo("MainList", {
  //     ongoBack: () => console.log("Will go back from nextComponent")
  //   });
  //   this.setState({ show_package: false });
  // };
  // handleScroll = e => {
  //   this.setState({ scrollY: e.nativeEvent.contentOffset.y });
  // };
  // moveScroll = offset => {
  //   this.refs.scrollView.scrollTo({ y: this.state.scrollY + offset });
  // };
  // moveIssueScroll = () => {
  //   console.log("scrollY", this.state.scrollY);
  //   this.refs.scrollView.scrollTo({ y: this.state.scrollY + 10 });
  // };
  // onLoadIframeFinished = () => {
  //   let self = this;
  //   this.setState({ show_exit_travel: true });
  //   console.log("loaded iframe");
  //   setTimeout(() => self.refs.scrollView.scrollToEnd(), 500);
  // };
  // skipTravel = () => {
  //   let _this = this;
  //   this.setState({ show_booking_travel: false, show_exit_travel: false });
  //   setTimeout(() => {
  //     _this.addMessage({
  //       type: "bot",
  //       isUserNext: true,
  //       isChoice: true,
  //       choiceselected: false
  //     });
  //   }, 1000);
  // };
  onLoadFinished = () => {
    if (this.webview) {
      console.log("posted message");
      this.webview.postMessage(
        JSON.stringify({
          fromMobile: true
        })
      );
    }
  };
  render() {
    // const {
    //   keyboard_Height,
    //   message_txt,
    //   isUserTurn,
    //   isfinalQuestion,
    //   startbooking,
    //   waiting_reply,
    //   show_package,
    //   renter_owner,
    //   show_subscriptions,
    //   pkgs
    // } = this.state;
    const { uid } = this.props;
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
          <TopImage />
          <Logo />
        </View>
        <WebView
          style={{ zIndex: 100, marginTop: 100 }}
          ref={r => (this.webview = r)}
          originWhitelist={["*"]}
          source={{ uri: `https://aiconcierge.io?uid=${uid}` }}
          onMessage={event => this.onEventHandler(event.nativeEvent.data)}
          startInLoadingState
          javaScriptEnabled
          onLoad={this.onLoadFinished}
          mixedContentMode="always"
          thirdPartyCookiesEnabled
          allowUniversalAccessFromFileURLs
          useWebKit={true}
        />
        {/* <ScrollView
          ref="scrollView"
          style={{ marginTop: 75, paddingLeft: 16 }}
          contentContainerStyle={{
            width: "100%",
            paddingBottom: 50,
            minHeight:
              Metrics.screenHeight > 750
                ? Metrics.screenHeight - 100
                : Metrics.screenHeight - 120
          }}
          keyboardShouldPersistTaps={"handled"}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
        >
          <View style={{ height: 60 }}></View>

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
          {isUserTurn && !isfinalQuestion && !startbooking && (
            <MessageInput
              style={{ marginTop: "auto" }}
              onChange={this.onChangeMessage}
              onSend={this.SendMessage}
              value={message_txt}
            />
          )}
          {isUserTurn && isfinalQuestion && !startbooking && (
            <IssueInput
              onOpen={this.onOpenIssue}
              onClose={this.onCloseIssue}
              items={items}
              rooms={rooms}
              adjectives={adjectives}
              onSend={this.ChooseIssue}
            />
          )}
          {isUserTurn && startbooking && (
            <RestaurantInput
              onOpen={this.onOpenIssue}
              onClose={this.onCloseIssue}
              cuisines={cuisines}
              locations={locations}
              onSend={this.BookCuisine}
            />
          )}
          {show_package && (
            <View>
              <PackCarousel
                getActive={async (isgroup, price, imgName, pkgName) => {
                  console.log(pkgName);
                }}
                onLoad={() => {
                  setTimeout(() => this.refs.scrollView.scrollToEnd(), 100);
                }}
                renter_owner={renter_owner}
              />
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.CalltoAction}
                  onPress={this.onExplorePackage}
                >
                  <Text>Explore Package</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.CalltoAction}
                  onPress={() => {
                    this.createTicket({
                      id: 15,
                      title: "Subscription Packages"
                    });
                    this.setState({ show_package: false });
                  }}
                >
                  <Text>I'd like more help</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {show_subscriptions &&
            pkgs.map((item, index) => {
              return (
                <Subscription
                  price={item.price}
                  pkgName={item.caption}
                  key={index}
                />
              );
            })}
          {show_subscriptions && (
            <TouchableOpacity
              style={styles.CalltoAction}
              onPress={() => {
                this.createTicket({
                  id: 16,
                  title: "My Subscriptions"
                });
                this.setState({ show_subscriptions: false });
              }}
            >
              <Text>I'd like more help</Text>
            </TouchableOpacity>
          )}
        </ScrollView> */}
        {/* {this.state.keyboard == "visible" && Platform.OS === "ios" && (
          <View
            style={{
              width: "100%",
              height: keyboard_Height - TAB_HEIGHT,
              backgroundColor: "rgba(52, 52, 52, 0.0)"
            }}
          />
        )} */}
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
    backgroundColor: colors.white
  },
  CalltoAction: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 15,
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: colors.white,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  },
  button: {
    color: colors.darkblue,
    fontSize: 16,
    fontFamily: "Gothic A1",
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
  buttonGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
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
