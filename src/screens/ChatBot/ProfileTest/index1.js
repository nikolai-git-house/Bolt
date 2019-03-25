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
  Dimensions,
  Keyboard
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import colors from "../../../theme/Colors";
import Bubble from "../../../components/Bubble";
import Logo from "../../../components/Logo";
import { numberWithCommas } from "../../../utils/functions";
import {
  InfoGuide_Text,
  time_out,
  fontsize,
  loadingGIF_height
} from "../../../utils/Constants.js";
import { Metrics } from "../../../theme";

const question_length = InfoGuide_Text.length;
const dataSource = [
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[0]
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[1]
  },
  {
    dataType: "image",
    src: require("../../../assets/infoguide.png")
  },
  {
    dataType: "beginbutton",
    class: "beginTest",
    text: "Begin Test"
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[2]
  },
  {
    dataType: "button",
    step: "2",
    text: "Creative"
  },
  {
    dataType: "button",
    step: "2",
    text: "Functional"
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[3]
  },
  {
    dataType: "button",
    step: "3",
    text: "Reading & learning"
  },
  {
    dataType: "button",
    step: "3",
    text: "Health & Exercise"
  },
  {
    dataType: "button",
    step: "3",
    text: "Music & Arts"
  },
  {
    dataType: "button",
    step: "3",
    text: "Exploring & Eating"
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[4]
  },
  {
    dataType: "button",
    step: "4",
    text: "Cat"
  },
  {
    dataType: "button",
    step: "4",
    text: "Dog"
  },
  {
    dataType: "button",
    step: "4",
    text: "Fish"
  },
  {
    dataType: "button",
    step: "4",
    text: "I don't like pets or have one"
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[5]
  },
  {
    dataType: "button",
    step: "5",
    text: "Socialising"
  },
  {
    dataType: "button",
    step: "5",
    text: "Travel"
  },
  {
    dataType: "button",
    step: "5",
    text: "Fashion"
  },
  {
    dataType: "button",
    step: "5",
    text: "Health"
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[6]
  },
  {
    dataType: "button",
    step: "6",
    text: "Employed"
  },
  {
    dataType: "button",
    step: "6",
    text: "Self Employed"
  },
  {
    dataType: "button",
    step: "6",
    text: "Other"
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[7]
  },
  {
    dataType: "salary",
    text: "E.g. xxxx"
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[8]
  },
  {
    dataType: "button",
    step: "8",
    text: "Owned"
  },
  {
    dataType: "button",
    step: "8",
    text: "Rented"
  },
  {
    dataType: "button",
    step: "8",
    text: "Other"
  },
  {
    dataType: "message",
    messageType: "robot",
    message: InfoGuide_Text[10]
  },
  {
    dataType: "acceptbutton",
    text: "Accept"
  }
];
class ProfileTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      salary: "",
      email: "",
      keyboard: "invisible",
      keyboard_Height: 0,
      loading: "true",
      username: "User"
    };
    this._renderItem = this._renderItem.bind(this);
    this.Step1 = this.Step1.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }
  _keyExtractor = (item, index) => item.id;

  componentDidMount() {
    const { basic } = this.props;
    this.setState({ username: basic.firstname });
    this.Step1();
  }
  render() {
    const { keyboard_Height, username } = this.state;
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          backgroundColor: colors.lightgrey,
          paddingTop: 50
        }}
      >
        <Logo />
        <View
          style={{
            flex: 1
          }}
        >
          <ScrollView
            ref="scrollView"
            style={{
              width: "100%",
              height: "95%"
            }}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <FlatList
              style={{
                width: "90%",
                paddingTop: 40
              }}
              data={this.state.data}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center"
              }}
            />
          </ScrollView>
          <View
            style={{
              width: "100%",
              height: loadingGIF_height,
              backgroundColor: colors.lightgrey
            }}
          >
            {this.state.loading === "true" && (
              <Image
                style={{ width: 47, height: loadingGIF_height }}
                source={require("../../../assets/typing.gif")}
              />
            )}
          </View>
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
  Accept = () => {
    let self = this;
    setTimeout(() => self.props.navigation.navigate("ProfileSuccess"), 500);
  };
  _renderItem = ({ item }) => {
    const { username } = this.state;
    if (item.dataType == "message")
      return (
        <Bubble
          key={item.id}
          message={item.message}
          messageType={item.messageType}
          name={username}
        />
      );

    if (item.dataType == "image")
      return <Image style={{ width: 200, height: 200 }} source={item.src} />;
    if (item.dataType == "beginbutton")
      return (
        <TouchableOpacity
          style={{
            width: 280,
            height: 40,
            borderRadius: 20,
            borderWidth: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: 40,
            backgroundColor: colors.yellow
          }}
          onPress={this.Step2}
        >
          <Text>{item.text}</Text>
        </TouchableOpacity>
      );
    if (item.dataType == "button")
      return (
        <TouchableOpacity
          style={{
            width: 280,
            height: 40,
            borderRadius: 15,
            backgroundColor: colors.white,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: 20,
            shadowOffset: { height: 1, width: 1 },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.1
          }}
          onPress={() => {
            if (item.step == "2") this.Step3(item.text);
            if (item.step == "3") this.Step4(item.text);
            if (item.step == "4") this.Step5(item.text);
            if (item.step == "5") this.Step6(item.text);
            if (item.step == "6") this.Step7(item.text);
            if (item.step == "8") this.Step9(item.text);
          }}
        >
          <Text>{item.text}</Text>
        </TouchableOpacity>
      );
    if (item.dataType == "salary")
      return (
        <View
          style={{
            width: 150,
            height: 30,
            display: "flex",
            flexDirection: "row",
            paddingLeft: "5%",
            borderRadius: 20,
            backgroundColor: colors.white,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: 20
          }}
        >
          {/* <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 35,
              borderWidth: 1,
              borderColor: colors.cardborder,
              backgroundColor: colors.darkblue,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: colors.white, fontSize: fontsize.salary }}>
              £
            </Text>
          </View> */}
          <Text
            style={{
              color: "black",
              fontSize: fontsize.salary,
              marginLeft: 20
            }}
          >
            £
          </Text>
          <TextInput
            style={{
              width: "100%",
              height: "100%",
              fontSize: fontsize.salary
            }}
            onChangeText={text => {
              this.setState({ salary: text });
            }}
            onEndEditing={this.Step8}
            value={this.state.salary}
          />
        </View>
      );
    if (item.dataType == "email")
      return (
        <View
          style={{
            width: 280,
            height: 30,
            display: "flex",
            flexDirection: "row",
            paddingLeft: "5%",
            borderRadius: 20,
            borderWidth: 1,
            backgroundColor: colors.white,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: 20
          }}
        >
          {/* <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 35,
              borderWidth: 1,
              borderColor: colors.cardborder,
              backgroundColor: colors.darkblue,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              style={{ width: 30, height: 30 }}
              source={require("../../../assets/mail.png")}
            />
          </View> */}
          <TextInput
            style={{
              width: "100%",
              height: "100%",
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: fontsize.email
            }}
            onChangeText={text => {
              this.setState({ email: text });
            }}
            onEndEditing={this.Step10}
            value={this.state.email}
          />
        </View>
      );
    if (item.dataType == "acceptbutton")
      return (
        <TouchableOpacity
          style={{
            width: 280,
            height: 40,
            borderRadius: 20,
            borderWidth: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: 40,
            backgroundColor: colors.yellow
          }}
          onPress={this.Accept}
        >
          <Text>{item.text}</Text>
        </TouchableOpacity>
      );
  };
  Step1 = () => {
    var offset = time_out;
    let self = this;
    for (let index = 0; index < 4; index++) {
      setTimeout(function() {
        self.setState({ loading: "false" });
        let data = self.state.data;
        let tempArray = data;
        tempArray.push(dataSource[index]);
        self.setState({ data: tempArray });
        setTimeout(() => {
          self.refs.scrollView.scrollToEnd();
          if (index < 2) self.setState({ loading: "true" });
        }, 100);
      }, offset);
      offset += time_out;
    }
  };
  Step2 = () => {
    let self = this;
    let data = self.state.data;
    let tempArray = data;
    self.setState({ loading: "true" });
    setTimeout(function() {
      self.setState({ loading: "false" });
      tempArray.push(dataSource[4]);
      self.setState({ data: tempArray });
      setTimeout(() => {
        self.refs.scrollView.scrollToEnd();
      }, 100);
    }, time_out);
    self.setState({ loading: "true" });
    var offset = time_out;
    setTimeout(() => {
      for (let index = 5; index < 7; index++) {
        setTimeout(function() {
          self.setState({ loading: "false" });
          let data = self.state.data;
          let tempArray = data;
          tempArray.push(dataSource[index]);
          self.setState({ data: tempArray });
          setTimeout(() => {
            self.refs.scrollView.scrollToEnd();
            if (index != 6) self.setState({ loading: "true" });
          }, 100);
        }, offset);
        offset += 500;
      }
    }, time_out);
  };
  Step3 = text => {
    let self = this;
    let data = self.state.data;
    let tempArray = data;
    //show man's answer as bubble
    const newobj = {
      dataType: "message",
      messageType: "man",
      message: text
    };
    tempArray.push(newobj);
    self.setState({ data: tempArray });
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
      self.setState({ loading: "true" });
    }, 100);

    setTimeout(function() {
      self.setState({ loading: "false" });
      tempArray.push(dataSource[7]);
      self.setState({ data: tempArray });
      setTimeout(() => {
        self.refs.scrollView.scrollToEnd();
      }, 100);
    }, time_out);
    var offset = 0;
    setTimeout(() => {
      for (let index = 8; index < 12; index++) {
        setTimeout(function() {
          let data = self.state.data;
          let tempArray = data;
          tempArray.push(dataSource[index]);
          self.setState({ data: tempArray });
          setTimeout(() => {
            self.refs.scrollView.scrollToEnd();
          }, 100);
        }, 0 + offset);
        offset += 500;
      }
    }, time_out);
  };
  Step4 = text => {
    let self = this;
    let data = self.state.data;
    let tempArray = data;
    //show man's answer as bubble
    const newobj = {
      dataType: "message",
      messageType: "man",
      message: text
    };
    tempArray.push(newobj);
    self.setState({ data: tempArray });
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
      self.setState({ loading: "true" });
    }, 100);

    setTimeout(function() {
      self.setState({ loading: "false" });
      tempArray.push(dataSource[12]);
      self.setState({ data: tempArray });
      setTimeout(() => {
        self.refs.scrollView.scrollToEnd();
      }, 100);
    }, time_out);

    var offset = 0;
    setTimeout(() => {
      for (let index = 13; index < 17; index++) {
        setTimeout(function() {
          let data = self.state.data;
          let tempArray = data;
          tempArray.push(dataSource[index]);
          self.setState({ data: tempArray });
          setTimeout(() => {
            self.refs.scrollView.scrollToEnd();
          }, 100);
        }, 0 + offset);
        offset += 500;
      }
    }, time_out);
  };
  Step5 = text => {
    let self = this;
    let data = self.state.data;
    let tempArray = data;
    //show man's answer as bubble
    const newobj = {
      dataType: "message",
      messageType: "man",
      message: text
    };
    tempArray.push(newobj);
    self.setState({ data: tempArray });
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
      self.setState({ loading: "true" });
    }, 100);

    setTimeout(function() {
      self.setState({ loading: "false" });
      tempArray.push(dataSource[17]);
      self.setState({ data: tempArray });
      setTimeout(() => {
        self.refs.scrollView.scrollToEnd();
      }, 100);
    }, time_out);

    var offset = 0;
    setTimeout(() => {
      for (let index = 18; index < 22; index++) {
        setTimeout(function() {
          let data = self.state.data;
          let tempArray = data;
          tempArray.push(dataSource[index]);
          self.setState({ data: tempArray });
          setTimeout(() => {
            self.refs.scrollView.scrollToEnd();
          }, 100);
        }, 0 + offset);
        offset += 500;
      }
    }, time_out);
  };
  Step6 = text => {
    let self = this;
    let data = self.state.data;
    let tempArray = data;
    //show man's answer as bubble
    const newobj = {
      dataType: "message",
      messageType: "man",
      message: text
    };
    tempArray.push(newobj);
    self.setState({ data: tempArray });
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
      self.setState({ loading: "true" });
    }, 100);

    setTimeout(function() {
      self.setState({ loading: "false" });
      tempArray.push(dataSource[22]);
      self.setState({ data: tempArray });
      setTimeout(() => {
        self.refs.scrollView.scrollToEnd();
      }, 100);
    }, time_out);

    var offset = 0;
    setTimeout(() => {
      for (let index = 23; index < 26; index++) {
        setTimeout(function() {
          let data = self.state.data;
          let tempArray = data;
          tempArray.push(dataSource[index]);
          self.setState({ data: tempArray });
          setTimeout(() => {
            self.refs.scrollView.scrollToEnd();
          }, 100);
        }, 0 + offset);
        offset += 500;
      }
    }, time_out);
  };
  Step7 = text => {
    let self = this;
    let data = self.state.data;
    let tempArray = data;
    //show man's answer as bubble
    const newobj = {
      dataType: "message",
      messageType: "man",
      message: text
    };
    tempArray.push(newobj);
    self.setState({ data: tempArray });
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
      self.setState({ loading: "true" });
    }, 100);

    setTimeout(function() {
      self.setState({ loading: "false" });
      tempArray.push(dataSource[26]);
      self.setState({ data: tempArray });
      setTimeout(() => {
        self.refs.scrollView.scrollToEnd();
      }, 100);
    }, time_out);

    var offset = 0;
    setTimeout(() => {
      for (let index = 27; index < 28; index++) {
        setTimeout(function() {
          let data = self.state.data;
          let tempArray = data;
          tempArray.push(dataSource[index]);
          self.setState({ data: tempArray });
          setTimeout(() => {
            self.refs.scrollView.scrollToEnd();
          }, 100);
        }, 0 + offset);
        offset += 500;
      }
    }, time_out);
  };
  Step8 = () => {
    console.log("next clicked");
    let self = this;
    let data = self.state.data;
    let tempArray = data;

    let salary = "£" + numberWithCommas(self.state.salary);
    //show man's answer as bubble
    const newobj = {
      dataType: "message",
      messageType: "man",
      message: salary
    };
    tempArray.push(newobj);
    self.setState({ loading: "true" });
    setTimeout(() => {
      tempArray.push(dataSource[28]);
      self.setState({ data: tempArray });
      setTimeout(() => {
        self.refs.scrollView.scrollToEnd();
        self.setState({ loading: "false" });
      }, 100);
    }, time_out);

    var offset = 0;
    setTimeout(() => {
      for (let index = 29; index < 32; index++) {
        setTimeout(function() {
          let data = self.state.data;
          let tempArray = data;
          tempArray.push(dataSource[index]);
          self.setState({ data: tempArray });
          setTimeout(() => {
            self.refs.scrollView.scrollToEnd();
          }, 100);
        }, 0 + offset);
        offset += 500;
      }
    }, time_out);
  };
  Step9 = text => {
    let self = this;
    let data = self.state.data;
    let tempArray = data;

    //show man's answer as bubble
    const newobj = {
      dataType: "message",
      messageType: "man",
      message: text
    };
    tempArray.push(newobj);
    self.setState({ data: tempArray });
    setTimeout(() => {
      self.refs.scrollView.scrollToEnd();
      self.setState({ loading: "true" });
    }, 100);

    var offset = 0;
    setTimeout(() => {
      for (let index = 32; index < 34; index++) {
        setTimeout(function() {
          self.setState({ loading: "false" });
          let data = self.state.data;
          let tempArray = data;
          tempArray.push(dataSource[index]);
          self.setState({ data: tempArray });
          setTimeout(() => {
            self.refs.scrollView.scrollToEnd();
            if (index != 33) self.setState({ loading: "true" });
          }, 100);
        }, 0 + offset);
        offset += 500;
      }
    }, time_out);
  };
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
    marginLeft: -50
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
)(ProfileTest);
