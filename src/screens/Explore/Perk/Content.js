import React, { Component } from "react";
import { View, StyleSheet, WebView } from "react-native";
import { connect } from "react-redux";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    const {} = this.state;
    return (
      <WebView
        style={{ marginTop: 180, zIndex: 100 }}
        ref={r => (this.webview = r)}
        originWhitelist={["*"]}
        source={{
          uri: `https://aiconcierge.io/perks?category=Fashion`
        }}
        startInLoadingState
        javaScriptEnabled
        onLoad={this.onLoadFinished}
        mixedContentMode="always"
        thirdPartyCookiesEnabled
        allowUniversalAccessFromFileURLs
        useWebKit={true}
      />
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
)(Content);
