import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet
} from "react-native";
import colors from "../theme/Colors";

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
          marginBottom: 20,
          marginLeft: 20
        }}
      >
        {avatar != "" && (
          <ImageBackground
            style={styles.imageContainer}
            source={
              avatar === undefined
                ? require("../assets/Groups/user.png")
                : { uri: avatar }
            }
          />
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
    width: 50,
    height: 50,
    borderRadius: 40,
    overflow: "hidden"
  }
});
export default MemberItem;
