import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  ListView,
  FlatList,
  TextInput,
  ScrollView,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../../../theme/Colors";
import Bubble from "../../../components/Bubble";
import {
  B_Questions,
  time_out,
  PlaceHolder,
  sender_height,
  loadingGIF_height,
  first_bubble_height
} from "../../../utils/Constants.js";
import { Metrics } from "../../../theme";
import { doSMS } from "../../../apis/Auth";
import { saveOnboarding } from "../../../Redux/actions/index";
import { addZero } from "../../../utils/functions";

var myVar;
const question_length = B_Questions.length;
class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    var d = new Date(); // for now
    const hour = d.getHours(); // => 9
    const minutes = d.getMinutes(); // =>  30
    const time = hour + ":" + minutes;

    this.state = {
      dataSource: [
        {
          messageType: "robot",
          message: B_Questions[0],
          time: time
        }
      ],
      profilename: "Unknown",
      firstname: "",
      lastname: "",
      phonenumber: "",
      number: "",
      street: "",
      city: "",
      postcode: "",
      dob: "",
      age: "",
      text: "",
      quiz_answered: 0,
      loading: "false",
      timerId: 0,
      finished: "false",
      placeholder: PlaceHolder[0],
      PN_flag: "false",
      pin: "",
      keyboard: "invisible",
      keyboard_Height: 0
    };
    this._renderItem = this._renderItem.bind(this);
    this.Send = this.Send.bind(this);
    this.bot_Reply = this.bot_Reply.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
  _keyExtractor = (item, index) => item.id;
  createPincode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
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
  _keyboardDidShow(e) {
    this.setState({ keyboard: "visible" });
    let keyboard_Height = e.endCoordinates.height;

    console.log(keyboard_Height);
    this.setState({ keyboard_Height });
    let self = this;
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 100);
  }

  _keyboardDidHide() {
    this.setState({ keyboard: "invisible" });
  }

  render() {
    const { keyboard_Height } = this.state;
    return (
      <View
        style={{
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          justifyContent: "center"
        }}
      >
        <View
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colors.lightgrey,
              alignItems: "center",
              paddingTop: 60
            }}
          >
            <ScrollView
              ref="scrollView"
              style={{
                width: "100%"
              }}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <FlatList
                style={{ width: "90%" }}
                data={this.state.dataSource}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
              />
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: loadingGIF_height,
            backgroundColor: colors.lightgrey
          }}
        >
          {this.state.loading === "true" && (
            <Image
              style={{ width: 40, height: loadingGIF_height }}
              source={require("../../../assets/typing.gif")}
            />
          )}
        </View>
        <View
          style={{
            width: "100%",
            height: sender_height,
            display: "flex",
            flexDirection: "row",
            paddingLeft: "8%",
            fontSize: 20,
            borderColor: colors.cardborder,
            borderWidth: 1,
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {this.state.PN_flag == "true" && (
            <Text style={{ marginRight: -50 }}>+44</Text>
          )}
          <TextInput
            style={{
              width: "75%",
              height: "100%"
            }}
            placeholder={this.state.placeholder}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={this.Send}
          >
            <Text style={Styles.sendButton}>SEND</Text>
          </TouchableOpacity>
        </View>
        {this.state.keyboard == "visible" && (
          <View
            style={{
              width: "100%",
              height: keyboard_Height,
              backgroundColor: colors.lightgrey
            }}
          />
        )}
      </View>
    );
  }
  bot_Reply = text => {
    const { quiz_answered } = this.state;
    const { profilename } = this.state;
    const { firstname, lastname } = this.state;
    //add thanks message to second question.
    if (quiz_answered == 0) {
      text = "Great, thanks " + firstname + ". " + text;
    }
    let quid = quiz_answered + 1;

    this.setState({ quiz_answered: quid });
    this.setState({ loading: "false" });
    this.setState({ placeholder: PlaceHolder[quid] });
    //if now is phonenumber then show prefex +44
    this.setState({ PN_flag: "false" });
    if (quid == 3) this.setState({ PN_flag: "true" });
    const dataSource = this.state.dataSource;
    var d = new Date(); // for now
    const hour = d.getHours(); // => 9
    const minutes = d.getMinutes(); // =>  30
    const time = hour + ":" + minutes;
    const newobj = {
      messageType: "robot",
      message: text,
      time: time
    };
    dataSource.push(newobj);
    this.setState({ dataSource });
    let self = this;
    //scrolldown
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 50);
    if (quid == question_length - 2) {
      this.setState({ finished: "true" });
      //basic profile creation is finished
      const basicInfo = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        number: this.state.number,
        street: this.state.street,
        city: this.state.city,
        postcode: this.state.postcode,
        phonenumber: this.state.phonenumber,
        dob: this.state.dob,
        age: this.state.age
      };

      this.props.dispatch(saveOnboarding(basicInfo));

      setTimeout(() => this.props.navigation.navigate("Main"), 2000);
    }
  };
  Send = () => {
    if (myVar) clearTimeout(myVar);
    const { quiz_answered } = this.state;
    const { text } = this.state;
    const { pin } = this.state;
    let txt = text;
    //if name question then break into first name and last name
    if (quiz_answered == 0) {
      let name = txt.split(" ");
      let firstname = name[0];
      let lastname = name[1];
      let firstWord = firstname.slice(0, 1);
      this.setState({ profilename: firstWord });
      this.setState({ firstname });
      this.setState({ lastname });
    }
    //if address question then break into number, street, city, country, postcode
    if (quiz_answered == 1) {
      let name = txt.split(", ");
      let number = name[0];
      let street = name[1];
      let city = name[2];
      let postcode = name[3];

      this.setState({ number });
      this.setState({ street });
      this.setState({ city });
      this.setState({ postcode });
    }
    //if dob question then save
    if (quiz_answered == 2) {
      let dob = txt;
      this.setState({ dob });
    }
    // if phonenumber then add +44 prefix and phone number sms verification code send to phone
    if (quiz_answered == 3) {
      txt = "+44" + text;
      this.setState({ phonenumber: txt });
      let pin = this.createPincode();
      pin = pin.toString();
      this.setState({ pin });
      //let response = doSMS(txt, pin);
      //console.log("response", response);
    }

    //add time
    var d = new Date(); // for now
    const hour = d.getHours(); // => 9
    const minutes = d.getMinutes(); // =>  30
    const time = hour + ":" + minutes;

    const newobj = {
      messageType: "man",
      message: txt,
      time: time
    };
    const dataSource = this.state.dataSource;
    //text user typed is inserted to chat array;
    dataSource.push(newobj);
    this.setState({ dataSource });
    let self = this;
    //set empty for text field
    this.setState({ text: "" });
    //scroll down
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
    }, 50);
    // loading...
    this.setState({ loading: "true" });
    const quid = quiz_answered + 1; //future question id
    let question = B_Questions[quid]; //future question
    // confirm of sms code
    // if (quiz_answered == 5) {
    //   if (text == pin) console.log("success!");
    //   else {
    //     this.setState({ quiz_answered: 3 });
    //     question = B_Questions[question_length - 1];
    //   }
    // }
    console.log("bot will reply as ", question);
    myVar = setTimeout(() => this.bot_Reply(question), time_out); // bot will reply after 1 sec with next question
  };
  _renderItem = ({ item }) => (
    <Bubble
      key={item.id}
      message={item.message}
      messageType={item.messageType}
      time={item.time}
      name={this.state.profilename}
    />
  );
}
const Styles = StyleSheet.create({
  logoContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20
  },
  sendButton: {
    color: colors.blue,
    marginLeft: -90,
    fontSize: 23,
    fontWeight: "600"
  }
});
function mapStateToProps(state) {
  return {
    basic: state.basic
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding);
