import React, { Component } from "react";
import { View, ImageBackground, Text, StyleSheet, Image } from "react-native";
import colors from "../../../theme/Colors";

class FeedItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { username, avatar_url, poster, content, title, time } = this.props;
    return (
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: 10,
          paddingBottom: 10,
          marginBottom: 20,
          backgroundColor: colors.white
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
            marginBottom: 5,
            color: "black"
          }}
        >
          <ImageBackground
            style={styles.imageContainer}
            source={
              avatar_url
                ? {
                    uri: avatar_url
                  }
                : require("../../../assets/Explore/community/avatar.png")
            }
          />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingLeft: 20
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Gothic A1",
                fontWeight: "600"
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Gothic A1",
                fontWeight: "200"
              }}
            >
              {username}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 15,
            marginLeft: 10,
            marginBottom: 5,
            fontFamily: "Gothic A1",
            fontWeight: "400"
          }}
        >
          {content}
        </Text>
        <ImageBackground style={styles.feedImage} source={{ uri: poster }} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            marginTop: 10,
            paddingLeft: 20
          }}
        >
          <Text
            style={{ fontFamily: "Gothic A1", fontWeight: "200", fontSize: 12 }}
          >
            Posted {time}
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    overflow: "hidden"
  },
  feedImage: {
    width: "100%",
    height: 230,
    overflow: "hidden"
  }
});
export default FeedItem;
