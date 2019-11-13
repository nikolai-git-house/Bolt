import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  FlatList,
  Animated,
  Modal,
  Linking,
  Alert
} from "react-native";
import MessageItem from "./MessageItem";
import colors from "../theme/Colors";
const home_emergency_img = require("../assets/choice/newicons/0_home_emergencies.png");
const flood_water_img = require("../assets/choice/newicons/0.1_water_flood.png");
const fire_img = require("../assets/choice/newicons/0.2_fire.png");
const gas_leak_img = require("../assets/choice/newicons/0.3_gas_leak.png");
const burglary_img = require("../assets/choice/newicons/0.4_burglary.png");
const home_repair_img = require("../assets/choice/newicons/1_home_repair.png");
const subscription_packages_img = require("../assets/choice/newicons/15_subscription_packages.png");
const my_subscriptions_img = require("../assets/choice/newicons/16_my_subscriptions.png");
const wellness_img = require("../assets/choice/newicons/17_wellness.png");
const health_img = require("../assets/choice/newicons/18_health.png");
const home_utilities_img = require("../assets/choice/newicons/19_home_utilities.png");
const token_img = require("../assets/choice/newicons/20_tokens.png");
const travel_img = require("../assets/choice/newicons/21_travel_bookings.png");
const dining_drinking_img = require("../assets/choice/newicons/22_dining_drinking.png");
const arts_culture_img = require("../assets/choice/newicons/23_arts_cultures.png");
const entertainment_img = require("../assets/choice/newicons/24_entertainment.png");
const beauty_treatments_img = require("../assets/choice/newicons/25_beauty_treatments.png");
const groceries_shopping_img = require("../assets/choice/newicons/26_groceries_shopping.png");
const fashion_shopping_img = require("../assets/choice/newicons/27_fashion_shopping.png");
const pets_img = require("../assets/choice/newicons/28_pets.png");
const bike_scooter_img = require("../assets/choice/newicons/29_bike_scooter.png");
const talk_img = require("../assets/choice/newicons/30_talk_to_a_human.png");
const app_bug_img = require("../assets/choice/newicons/31_app_bugs.png");
const my_housemates_img = require("../assets/choice/newicons/39_my_housemates.png");
const my_trips_img = require("../assets/choice/newicons/40_my_trips.png");
const speak_to_a_doctor_img = require("../assets/choice/newicons/42_speak_to_a_doctor.png");
const healthy_eating_img = require("../assets/choice/newicons/36_healthy_eating.png");
const sport_img = require("../assets/choice/newicons/43_sport.png");
const music_img = require("../assets/choice/newicons/37_music.png");
const cashback_img = require("../assets/choice/newicons/35_cashback.png");
const my_card_img = require("../assets/choice/newicons/38_my_card.png");
const request_callback_img = require("../assets/choice/newicons/41_request_callback.png");

const my_home_img = require("../assets/choice/newicons/1st_layer/my_home.png");
const my_shopping_img = require("../assets/choice/newicons/1st_layer/my_shopping.png");
const my_travel_goals_img = require("../assets/choice/newicons/1st_layer/my_travel_goals.png");
const my_health_wellness_img = require("../assets/choice/newicons/1st_layer/my_health_wellness.png");
const my_social_life_img = require("../assets/choice/newicons/1st_layer/my_social_life.png");
const my_wallet_img = require("../assets/choice/newicons/1st_layer/my_wallet.png");
const my_concierge_img = require("../assets/choice/newicons/1st_layer/my_concierge.png");
const my_renting_img = require("../assets/choice/newicons/1st_layer/my_renting.png");
const my_calendar_img = require("../assets/choice/newicons/1st_layer/my_calendar.png");
class Choice extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      dataSource: [
        {
          title: "My Home",
          src: my_home_img,
          value: [
            { id: 0, title: "Home Emergency", src: home_emergency_img },
            { id: 1, title: "Home Repairs", src: home_repair_img },
            { id: 19, title: "Home Utilities", src: home_utilities_img },
            { id: 39, title: "My Housemates", src: my_housemates_img }
          ]
        },
        {
          title: "My Shopping",
          src: my_shopping_img,
          value: [
            {
              id: 15,
              title: "Subscription Packages",
              src: subscription_packages_img
            },
            { id: 16, title: "My Subscriptions", src: my_subscriptions_img },
            {
              id: 26,
              title: "Groceries Shopping",
              src: groceries_shopping_img
            },
            { id: 27, title: "Fashion Shopping", src: fashion_shopping_img }
          ]
        },
        {
          title: "My Travel Goals",
          src: my_travel_goals_img,
          value: [
            { id: 21, title: "Travel Bookings", src: travel_img },
            { id: 40, title: "My Trips", src: my_trips_img }
          ]
        },
        {
          title: "My Health & Wellness",
          src: my_health_wellness_img,
          value: [
            {
              id: 42,
              title: "Speak to a doctor",
              src: speak_to_a_doctor_img
            },
            { id: 17, title: "My Wellness", src: wellness_img },
            { id: 18, title: "Health", src: health_img },
            { id: 36, title: "Healthy Eating", src: healthy_eating_img },
            { id: 25, title: "Beauty Treatments", src: beauty_treatments_img }
          ]
        },
        {
          title: "Dining & Bars",
          id: 22,
          src: dining_drinking_img,
          value: []
        },
        // {
        //   title: "My Social Life",
        //   src: my_social_life_img,
        //   value: [
        //     { id: 22, title: "Dining & Bars", src: dining_drinking_img },
        //     { id: 23, title: "Arts & Culture", src: arts_culture_img },
        //     { id: 24, title: "Entertainment", src: entertainment_img },
        //     { id: 43, title: "Sport", src: sport_img },
        //     { id: 37, title: "Music", src: music_img }
        //   ]
        // },
        {
          title: "My Wallet",
          src: my_wallet_img,
          value: [
            { id: 20, title: "Tokens", src: token_img },
            { id: 35, title: "Cashback", src: cashback_img },
            { id: 38, title: "My Card", src: my_card_img }
          ]
        },
        {
          title: "My Concierge",
          src: my_concierge_img,
          value: [
            { id: 30, title: "Talk to a human", src: talk_img },
            { id: 31, title: "App Bugs", src: app_bug_img },
            { id: 41, title: "Request callback", src: request_callback_img }
          ]
        },
        {
          title: "My Renting",
          src: my_renting_img,
          value: []
        },
        {
          title: "My Calendar",
          src: my_calendar_img,
          value: []
        }
      ],
      emergency_source: [
        { id: 0.1, title: "Flood Water", src: flood_water_img },
        { id: 0.2, title: "Fire", src: fire_img },
        { id: 0.3, title: "Gas Leak", src: gas_leak_img },
        { id: 0.4, title: "Burglary", src: burglary_img }
      ],
      emergency_visible: false,
      second_layer: [],
      second_layer_visible: false,
      on_renting_clicked: false,
      on_calendar_clicked: false,
      choice_selected: false
    };
  }
  componentDidMount() {
    this.handleAnimation();
  }
  handleAnimation = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1
    }).start();
  };
  selectChoice = choice => {
    const { on_selectChoice } = this.props;
    if (choice.id) {
      on_selectChoice(choice);
      this.setState({ choice_selected: true });
    } else this.setState({ emergency_visible: true });
  };
  selectEmergency = choice => {
    this.setState({ emergency_visible: false });
    let phoneNumber;
    if (Platform.OS !== "android") {
      phoneNumber = `telprompt:999`;
    } else {
      phoneNumber = `tel:999`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert("Phone number is not available");
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };
  closeModal = () => {
    console.log("pressed");
    this.setState({ emergency_visible: false });
  };
  selectInFirstLayer = item => {
    const { scrollView } = this.props;
    console.log("item.title", item.title);
    if (item.title === "Dining & Bars") {
      this.selectChoice(item);
    } else if (item.title === "My Renting") {
      this.setState({ on_renting_clicked: true, on_calendar_clicked: false });
    } else if (item.title === "My Calendar") {
      this.setState({ on_calendar_clicked: true, on_renting_clicked: false });
    } else {
      this.setState({
        second_layer: item.value,
        second_layer_visible: true
      });
      setTimeout(() => scrollView.scrollToEnd(), 200);
    }
  };
  render() {
    const {
      emergency_visible,
      second_layer,
      second_layer_visible,
      on_calendar_clicked,
      on_renting_clicked,
      choice_selected
    } = this.state;
    const animatedStyle = { transform: [{ scale: this.animatedValue }] };
    return (
      <View style={styles.MainContainer}>
        {!second_layer_visible && (
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item, index }) => (
              <Animated.View style={animatedStyle} key={index}>
                <TouchableOpacity onPress={() => this.selectInFirstLayer(item)}>
                  <View
                    style={{
                      width: 90,
                      height: 90,
                      margin: 15,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      backgroundColor: colors.white,
                      shadowColor: "black",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.2,
                      elevation: 3
                    }}
                  >
                    <Image style={styles.imageThumbnail} source={item.src} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index}
          />
        )}
        {on_renting_clicked && (
          <MessageItem
            message={{
              type: "bot",
              text:
                "We don't offer renting right now but we will soon. Hang tight."
            }}
          />
        )}
        {on_calendar_clicked && (
          <MessageItem
            message={{
              type: "bot",
              text:
                "Calendar isn't quite ready yet but it will be soon. Hang tight."
            }}
          />
        )}
        {second_layer_visible && (
          <View
            style={{
              width: "100%",
              height: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <FlatList
              data={this.state.second_layer}
              renderItem={({ item, index }) => (
                <Animated.View style={animatedStyle} key={index}>
                  <TouchableOpacity onPress={() => this.selectChoice(item)}>
                    <View
                      style={{
                        width: 90,
                        height: 90,
                        margin: 15,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        backgroundColor: colors.white,
                        shadowColor: "black",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.2,
                        elevation: 3
                      }}
                    >
                      <Image style={styles.imageThumbnail} source={item.src} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              )}
              //Setting the number of column
              numColumns={3}
              keyExtractor={(item, index) => index}
            />
            {!choice_selected && (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    second_layer_visible: false,
                    on_renting_clicked: false,
                    on_calendar_clicked: false
                  })
                }
                style={styles.button}
              >
                <Text
                  style={{
                    color: "#999999"
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={emergency_visible}
          onRequestClose={() => this.closeModal()}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={styles.modal}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={this.closeModal}
              >
                <Text style={{ color: colors.white }}>X</Text>
              </TouchableOpacity>
              <FlatList
                data={this.state.emergency_source}
                renderItem={({ item, index }) => (
                  <Animated.View style={animatedStyle} key={index}>
                    <TouchableOpacity
                      onPress={() => this.selectEmergency(item)}
                    >
                      <View
                        style={{
                          width: 70,
                          height: 70,
                          margin: 5,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          backgroundColor: colors.white,
                          borderRadius: 10
                        }}
                      >
                        <Image
                          style={styles.imageThumbnail}
                          source={item.src}
                        />
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                )}
                //Setting the number of column
                numColumns={4}
                keyExtractor={(item, index) => index}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default Choice;
const styles = StyleSheet.create({
  MainContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    flex: 1,
    paddingTop: 30
  },
  imageThumbnail: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "contain"
  },
  modal: {
    position: "absolute",
    top: "40%",
    width: "100%",
    height: "25%",
    justifyContent: "space-around",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10
  },
  button: {
    width: 100,
    height: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: colors.white,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3
  }
});
