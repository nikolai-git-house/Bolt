import * as firebase from "firebase";
import { Alert } from "react-native";
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBlBJtz1oV7_pWAyjrlkxdJ7ZenisHP5sk",
  projectId: "boltconcierge-2f0f9",
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
  static signup = profile => {
    console.log("profile", profile);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("user")
        .add(profile)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getProfile = phonenumber => {
    console.log("phonenumber", phonenumber);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("user")
        .where("phonenumber", "==", phonenumber)
        .limit(1)
        .get()
        .then(res => {
          if (res.size === 0) resolve(false);
          else resolve(res.docs[0].data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static async login(phone) {
    return await firebase
      .auth()
      .signInWithPhoneNumber(phone)
      .then(confirmResult => {
        return confirmResult;
      })
      .catch(error => {
        console.error("Error", error);
      });
  }
  static logout(callback) {
    firebase
      .auth()
      .signOut()
      .then(function() {
        callback(null);
      })
      .catch(function(error) {
        callback(error.message);
      });
  }
  static getCurrentUser() {
    return firebase.auth().currentUser;
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
    let path = "users/" + userid;
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
