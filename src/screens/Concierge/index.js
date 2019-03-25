import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image,
  WebView
} from "react-native";
import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import { Metrics } from "../../theme";

export default class Concierge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.maincontainer}>
        <Logo />
        <WebView
          originWhitelist={["*"]}
          source={{ uri: "https://chat-concierge.firebaseapp.com" }}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          scalesPageToFit={false}
          onLoadEnd={this._onLoadEnd}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  caption: {
    fontSize: 20,
    color: colors.darkblue,
    fontWeight: "700",
    marginBottom: 20
  },
  subcaption: {
    fontSize: 15,
    textAlign: "center"
  },
  containter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40
  },
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    display: "flex",
    flexDirection: "column",
    paddingTop: 50,
    backgroundColor: colors.lightgrey
  },
  subcontainer: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between"
  }
});
