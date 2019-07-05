import React, { Component } from "react";
import { View, Text } from "react-native";
import CheckDiv from "../components/CheckDiv";

class Twocheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstcheck: true,
      secondcheck: false
    };
  }
  componentDidMount() {
    const { value } = this.props;
    console.log("TwoCheckBox", value);
    if (value === "yes" || value === "female")
      this.setState({ firstcheck: true });
    if (value === "no" || value === "male")
      this.setState({ secondcheck: true });
  }
  checkFirst = () => {
    const { onCheckFirst } = this.props;
    onCheckFirst();
    this.setState({ firstcheck: true });
    this.setState({ secondcheck: false });
  };
  checkSecond = () => {
    const { onCheckSecond } = this.props;
    onCheckSecond();
    this.setState({ firstcheck: false });
    this.setState({ secondcheck: true });
  };
  render() {
    const { title1, title2 } = this.props;
    const { firstcheck, secondcheck } = this.state;
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginBottom: 10
        }}
      >
        <CheckDiv
          title={title1}
          onCheck={this.checkFirst}
          checked={firstcheck}
        />
        <CheckDiv
          title={title2}
          onCheck={this.checkSecond}
          checked={secondcheck}
        />
      </View>
    );
  }
}
export default Twocheckbox;
