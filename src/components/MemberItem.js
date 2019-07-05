import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet
} from "react-native";

class MemberItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.avatar
    };
  }
  render() {
    const { onAdd, username } = this.props;
    const { avatar } = this.state;
    return (
      <View
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        {avatar != "" && (
          <ImageBackground style={styles.imageContainer} source={avatar} />
        )}
        {avatar === "" && (
          <TouchableOpacity onPress={onAdd}>
            <ImageBackground
              style={styles.imageContainer}
              source={require("../assets/Groups/avatar.png")}
            />
          </TouchableOpacity>
        )}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: 20
          }}
        >
          <Text style={{ fontSize: 20 }}>{username}</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    overflow: "hidden"
  }
});
export default MemberItem;
