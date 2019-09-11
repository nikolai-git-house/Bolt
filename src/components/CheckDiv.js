import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import colors from "../theme/Colors";
import { CheckBox } from "react-native-elements";

export default class CheckDiv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }
  componentWillReceiveProps = props => {
    this.setState({ checked: props.checked });
  };

  render() {
    //const { checked } = this.state;
    const { title, onCheck, checked } = this.props;
    return (
      <CheckBox
        center
        title={title}
        checked={checked}
        onIconPress={onCheck}
        checkedColor={colors.darkblue}
        uncheckedColor={colors.darkblue}
        fontFamily="Gothic A1"
        containerStyle={{
          backgroundColor: "transparent",
          borderWidth: 0,
          margin: 0
        }}
      />
    );
  }
}
