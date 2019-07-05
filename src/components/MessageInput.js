import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated
} from "react-native";
import colors from "../theme/Colors";
class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      message_txt: props.value,
      placeholder: ""
    };
  }
  componentDidMount() {
    this.handleAnimation();
  }
  componentWillReceiveProps(prevProps) {
    this.setState({ message_txt: prevProps.value });
  }
  handleAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 250
    }).start();
  };
  onChangeMessage = text => {
    const { onChange } = this.props;
    onChange(text);
  };
  SendMessage = () => {
    const { onSend } = this.props;
    onSend();
  };
  render() {
    const { message_txt, placeholder } = this.state;
    return (
      <Animated.View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          position: "relative",
          paddingLeft: 10,
          paddingRight: 10,
          marginTop: "auto",
          opacity: this.animatedValue
        }}
      >
        <TextInput
          style={{
            backgroundColor: "#f6f6f6",
            width: "75%",
            height: 45,
            borderRadius: 30,
            paddingLeft: 20,
            paddingRight: 10,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2
          }}
          value={message_txt}
          placeholder={placeholder}
          onChangeText={this.onChangeMessage}
          onSubmitEditing={this.SendMessage}
        />
        <TouchableOpacity
          onPress={this.SendMessage}
          style={styles.CalltoAction}
        >
          <Text style={styles.Go}>Go</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
export default MessageInput;
const styles = StyleSheet.create({
  CalltoAction: {
    opacity: 0.8,
    marginLeft: 10,
    backgroundColor: colors.yellow,
    borderRadius: 30,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2
  },
  Go: {
    color: colors.darkblue,
    fontSize: 16,
    fontFamily: "Graphik",
    fontWeight: "600",
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 22,
    paddingRight: 22
  }
});
