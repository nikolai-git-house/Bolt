import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { savePosts } from "../../../Redux/actions/index";
import FeedItem from "../component/FeedItem";
import Main from "./Main";
import AddPost from "./AddPost";
import colors from "../../../theme/Colors";
import Firebase from "../../../firebasehelper";

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adding_post: false,
      posts: []
    };
  }
  componentDidMount() {}
  componentWillUnmount() {}
  onAddPost = () => {
    this.setState({ adding_post: true });
  };
  onGoBack = () => {
    this.setState({ adding_post: false });
  };
  render() {
    const { adding_post, posts } = this.state;
    return (
      <View>
        {!adding_post && <Main onAddPost={this.onAddPost} />}
        {adding_post && (
          <AddPost onGoBack={this.onGoBack} uid={this.props.uid} />
        )}
      </View>
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
)(Feed);
