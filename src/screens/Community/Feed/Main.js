import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import FeedItem from "../component/FeedItem";
import colors from "../../../theme/Colors";
import Firebase from "../../../firebasehelper";
import { Metrics } from "../../../theme";

const TAB_HEIGHT = 50;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: false
    };
  }
  componentDidMount() {
    this.setState({ posts: this.props.posts });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ posts: nextProps.posts });
    console.log("posts in Main", nextProps.posts);
  }
  _renderItem = ({ item }) => {
    return (
      <FeedItem
        avatar_url={item.avatar_url}
        username={item.fullname}
        title={item.title}
        content={item.content}
        poster={item.img_url}
        time={item.time}
      />
    );
  };
  onAddPost = () => {
    const { onAddPost } = this.props;
    onAddPost();
  };
  render() {
    const { posts, loading } = this.state;
    return (
      <View
        style={{
          fontFamily: "Gothic A1",
          width: "100%"
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: 10,
            marginBottom: 10,
            height: 40
          }}
        >
          <TouchableOpacity onPress={this.onAddPost}>
            <Image
              style={styles.imageContainer}
              source={require("../../../assets/Explore/community/edit_post.png")}
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 10 }}>Something on your mind?</Text>
        </View>
        {loading && <ActivityIndicator size="large" color="black" />}
        {!loading && (
          <View
            style={{
              width: "100%",
              height: Metrics.screenHeight - 220 - TAB_HEIGHT
            }}
          >
            <FlatList
              data={posts}
              renderItem={this._renderItem}
              style={{ backgroundColor: colors.lightgrey }}
              keyExtractor={(item, index) => item.key}
            />
          </View>
        )}
        <View
          style={{
            width: "100%",
            height: TAB_HEIGHT
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  imageContainer: {
    width: 30,
    height: 30
  }
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    posts: state.posts,
    basic: state.basic,
    uid: state.uid
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
