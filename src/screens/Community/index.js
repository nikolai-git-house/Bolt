import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import Feed from "./Feed/index";
import Users from "./Users";
import Message from "./Message/index";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import Header from "./component/Header";
import colors from "../../theme/Colors";
class Community extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Feeds"
    };
  }
  onTap = screen => {
    console.log(screen);
    this.setState({ screen: screen });
  };
  componentDidMount = () => {
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  };
  load = () => {
    const { navigation } = this.props;
    if (navigation.state.params) {
      console.log("navigation", navigation);
      const { page } = navigation.state.params;
      console.log("page", page);
      this.setState({ screen: page });
    }
  };
  setScreen = screen => {
    const { uid } = this.props;
    switch (screen) {
      case "Feeds":
        return <Feed uid={uid} />;
        break;
      case "Friends":
        return <Users uid={uid} />;
        break;
      case "Messages":
        return <Message uid={uid} />;
        break;
      default:
        return <Message />;
    }
  };
  render() {
    const { screen } = this.state;
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: colors.white
        }}
      >
        <TopImage />
        <Logo />
        <Header onTap={this.onTap} />
        <View
          style={{
            flex: 1,
            marginTop: 180,
            width: "100%"
          }}
        >
          {this.setScreen(screen)}
        </View>
      </View>
      // </KeyboardAwareScrollView>
    );
  }
}
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
)(Community);

// export default StackNavigator;
