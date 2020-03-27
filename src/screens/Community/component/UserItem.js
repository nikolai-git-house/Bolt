import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

class UserItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: props.avatar,
    };
    console.log('avatar', props.avatar);
  }
  onPressChat = () => {
    const {onPressChat} = this.props;
    onPressChat();
  };
  render() {
    const {username} = this.props;
    const {avatar} = this.state;
    return (
      <View
        style={{
          width: 300,
          height: 90,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10,
          marginBottom: 20,
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.2,
          elevation: 3,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          {avatar && (
            <ImageBackground
              style={styles.imageContainer}
              source={{uri: avatar}}
            />
          )}
          {!avatar && (
            <ImageBackground
              style={styles.imageContainer}
              source={require('../../../assets/Explore/community/avatar.png')}
            />
          )}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingLeft: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Gothic A1',
                fontWeight: '600',
              }}>
              {username}
            </Text>
            <Text style={{fontSize: 13}}>Age 25</Text>
            <Text style={{fontSize: 13}}>London</Text>
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            alignSelf: 'flex-end',
          }}>
          <TouchableOpacity onPress={this.onPressChat}>
            <Image
              source={require('../../../assets/Explore/community/comment.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../../assets/Explore/community/blogging.png')}
              style={{width: 28, height: 28}}
            />
          </TouchableOpacity>
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
    overflow: 'hidden',
  },
});
export default UserItem;
