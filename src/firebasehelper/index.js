import * as firebase from "firebase";
import { Alert } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBlBJtz1oV7_pWAyjrlkxdJ7ZenisHP5sk",
  databaseURL: "https://boltconcierge-2f0f9.firebaseio.com",
  storageBucket: "boltconcierge-2f0f9.appspot.com"
};

class Firebase {
  static initialize() {
    firebase.initializeApp(firebaseConfig);
  }
  //
  static storage() {
    return firebase.storage();
  }
  static getStorage() {
    return firebase.storage;
  }
  static writeUserdata(userid, data) {
    let path = "user/" + userid;
    console.log(data);
    firebase
      .database()
      .ref(path)
      .set(data);
  }
  static getUserData(userid, callback) {
    let path = "user/" + userid;

    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }

        callback(res);
      });
  }
  static getPackagesData(callback) {
    console.log("getPackagesData");
    let path = "packages/";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }

        callback(res);
      });
  }
  static getUsersData(callback) {
    console.log("getUsersData");
    let path = "user/";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }

        callback(res);
      });
  }
  static getCountChild(name, callback) {
    let path = name + "/";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var length = Object.keys(res).length;
        callback(length);
      });
  }
}
Firebase.initialize();
export default Firebase;
