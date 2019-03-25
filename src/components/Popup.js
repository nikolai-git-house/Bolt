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
import Dialog, { DialogContent } from "react-native-popup-dialog";
import colors from "../theme/Colors";

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  componentDidMount() {
    this.setState({ visible: this.props.visible });
  }
  render() {
    const { visible } = this.state;
    return (
      <Dialog
        visible={visible}
        onTouchOutside={() => {
          this.setState({ visible: false });
        }}
        width="0.9"
      >
        <DialogContent>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              backgroundColor: colors.hotpink,
              borderRadius: 20,
              borderColor: colors.grey,
              borderStyle: "solid",
              borderWidth: 1
            }}
          >
            <Image
              style={{ width: 50, height: 50 }}
              source={require("../assets/popup/home.png")}
            />
            <Text>
              We need to collect some more information from you to create your
              secure account.
            </Text>
            <Text>You'll have full access to perks.</Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.yellow,
                width: 100,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text>Complete</Text>
            </TouchableOpacity>
          </View>
        </DialogContent>
      </Dialog>
    );
  }
}
