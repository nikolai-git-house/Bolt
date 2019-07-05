import * as firebase from "firebase";
import { Alert } from "react-native";
import { filterArrayByKey } from "../utils/functions";
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
  static pushProfileImage = (uid, url) => {
    firebase
      .firestore()
      .collection("user")
      .doc(`${uid}`)
      .set({ avatar_url: url }, { merge: true });
  };
  static pet_signup = profile => {
    console.log("pet_profile", profile);
    const uid = profile.uid;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("pets")
        .doc(`${uid}`)
        .set(profile, { merge: true })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static bike_signup = profile => {
    console.log("pet_profile", profile);
    const uid = profile.uid;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("bikes")
        .doc(`${uid}`)
        .set(profile, { merge: true })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static health_signup = profile => {
    console.log("healthprofile", profile);
    const uid = profile.uid;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("physical_profile")
        .doc(`${uid}`)
        .set(profile, { merge: true })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static home_signup = profile => {
    console.log("homeprofile", profile);
    const uid = profile.uid;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("home")
        .doc(`${uid}`)
        .set(profile, { merge: true })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static isActive = uid => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("user")
        .doc(`${uid}`)
        .get()
        .then(doc => {
          if (doc.exists) {
            console.log("doc", doc.data());
            if (doc.data().email) {
              resolve(true);
            } else resolve(false);
          } else {
            resolve(false);
            console.log("No Such data");
          }
        })
        .catch(err => {
          console.log("Error", err);
        });
    });
  };
  static isPaymentReady = uid => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("user")
        .doc(`${uid}`)
        .get()
        .then(doc => {
          if (doc.exists) {
            if (doc.data().mandate) {
              resolve(true);
            } else resolve(false);
          } else {
            resolve(false);
            console.log("No Such data");
          }
        })
        .catch(err => {
          console.log("Error", err);
        });
    });
  };

  static isGroupLeader = async (uid, groupId) => {
    let res = await firebase
      .firestore()
      .collection("group")
      .doc(`${groupId}`)
      .get();
    return res.data().inviter === uid ? true : false;
  };
  static isPackageGot = async (uid, pkgname) => {
    console.log("uid", uid);
    let res = await firebase
      .firestore()
      .collection("user")
      .doc(`${uid}`)
      .get();
    if (res.data().packages)
      return res.data().packages.includes(pkgname) ? true : false;
    else return false;
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
          else resolve(res.docs[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  static activate = (uid, email, password) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("user")
        .doc(`${uid}`)
        .set({ email: email, password: password }, { merge: true })
        .then(() => {
          firebase
            .firestore()
            .collection("user")
            .doc(`${uid}`)
            .get()
            .then(res => {
              resolve(res.data());
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  static findFriends = uid => {
    console.log("findfriends of uid", uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("group")
        .where("members", "array-contains", uid)
        .limit(1)
        .get()
        .then(res => {
          if (res.size === 0) resolve(false);
          else resolve(res.docs[0].data().members);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getMemberList = groupId => {
    return firebase
      .firestore()
      .collection("group")
      .doc(`${groupId}`)
      .get()
      .then(res => {
        return res.data().members;
      });
  };
  static addMember = (groupId, uid) => {
    return Firebase.getMemberList(groupId).then(res => {
      let temp = res;
      temp.push(uid);
      return firebase
        .firestore()
        .collection("group")
        .doc(`${groupId}`)
        .set({ members: temp }, { merge: true })
        .then(() => {
          console.log("return true");
          return true;
        });
    });
  };
  static getUserDatafromUID = uid => {
    console.log("getUserDatafromUID", uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("user")
        .doc(`${uid}`)
        .get()
        .then(res => {
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getPetDatafromUID = uid => {
    console.log("getPetDatafromUID", uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("pets")
        .doc(`${uid}`)
        .get()
        .then(res => {
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getBikeDatafromUID = uid => {
    console.log("getBikeDatafromUID", uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("bikes")
        .doc(`${uid}`)
        .get()
        .then(res => {
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getHealthDatafromUID = uid => {
    console.log("getHealthDatafromUID", uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("physical_profile")
        .doc(`${uid}`)
        .get()
        .then(res => {
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getHomeDatafromUID = uid => {
    console.log("getHomeDatafromUID", uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("home")
        .doc(`${uid}`)
        .get()
        .then(res => {
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };

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
  static getPackageInfo = pkgName => {
    let path = "packages/";
    var pkgRef = firebase
      .database()
      .ref(path)
      .orderByChild("caption")
      .equalTo(pkgName);
    return new Promise((resolve, reject) => {
      pkgRef.on("value", snapshot => {
        resolve(Object.values(snapshot.val())[0]);
      });
    });
  };
  static findAnswer = (item, room, adjective, callback) => {
    let path = "chatbot/quez";
    firebase
      .database()
      .ref(path)
      .orderByChild("item_room_adjective")
      .equalTo(item + "_" + room + "_" + adjective)
      .once("value", snapshot => {
        let res = [];
        if (snapshot.val()) {
          res = Object.values(snapshot.val());
        }
        console.log("result in ques", res);
        if (!res.length) {
          firebase
            .database()
            .ref(path)
            .orderByChild("item_room_adjective")
            .equalTo(item + "__" + adjective)
            .once("value", snapshot => {
              let result = [];
              if (snapshot.val()) {
                result = Object.values(snapshot.val());
                const ticket = result[0].ticket;
                let sub_path = "chatbot/answers";
                firebase
                  .database()
                  .ref(sub_path)
                  .orderByChild("ticket")
                  .equalTo(ticket)
                  .once("value", snapshot => {
                    let result = [];
                    result = Object.values(snapshot.val());
                    callback(result[0]);
                  });
              }
            });
        } else {
          const ticket = res[0].ticket;
          let sub_path = "chatbot/answers";
          firebase
            .database()
            .ref(sub_path)
            .orderByChild("ticket")
            .equalTo(ticket)
            .once("value", snapshot => {
              let result = [];
              result = Object.values(snapshot.val());
              callback(result[0]);
            });
        }
      });
  };
  static getAllItem(callback) {
    console.log("getAllItem");
    let path = "chatbot/quez";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, "item");
        let result = a.map(item => item.item);
        callback(result);
      });
  }
  static getAllRoom(callback) {
    console.log("getAllRoom");
    let path = "chatbot/rooms";
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
  static getAllAdjective(callback) {
    console.log("getAllAdjective");
    let path = "chatbot/quez";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, "adjective");
        let result = a.map(item => item.adjective);
        callback(result);
      });
  }
  static getRoomByItem(item, callback) {
    let path = "chatbot/quez";
    firebase
      .database()
      .ref(path)
      .orderByChild("item")
      .equalTo(item)
      .once("value", snapshot => {
        let res = [];
        if (snapshot.val()) res = snapshot.val();
        res = Object.values(res);
        console.log("result before filter", res);
        var adjective = res.map(item => {
          return { value: item.adjective };
        });
        console.log("adjectives array", adjective);
        if (!res.pop().room) callback(null, adjective);
        else {
          var a = filterArrayByKey(res, "room");
          let result = a.map(item => item.room);
          callback(result, adjective);
        }
      });
  }
  static updateUserData = (uid, data) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("user")
        .doc(`${uid}`)
        .set(data, { merge: true })
        .then(() => {
          firebase
            .firestore()
            .collection("user")
            .doc(`${uid}`)
            .get()
            .then(res => {
              resolve(res.data());
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  static requestChat = (uid, username, ticket) => {
    let data = {
      uid: uid,
      username: username,
      established: "waiting"
    };
    let path = "livechat/" + uid;
    firebase
      .database()
      .ref(path)
      .update(data);
    let ticket_id = "" + ticket.id;
    let child_id = ticket_id.split(".").join("");
    let ticket_path = "livechat/" + uid + "/tickets/" + child_id;
    firebase
      .database()
      .ref(ticket_path)
      .set({
        ticket_id: ticket.id,
        issue: ticket.issue,
        status: ticket.status
      });
  };
  static getAgencyRespond(uid, callback) {
    let path = "livechat/" + uid;
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        if (res.established === "ok") {
          callback(true);
        } else callback(false);
      });
  }
  static getChats(room_id, callback) {
    console.log("getAllChat");
    let path = "livechat/" + room_id + "/content";
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
  static getStatus(room_id, callback) {
    let path = "livechat/" + room_id + "/established";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) {
          callback(snapshot.val());
        }
      });
  }
  static addMessage(room_id, message, callback) {
    console.log("writedMessage", message);
    let path = "livechat/" + room_id + "/content";
    var newChild = firebase
      .database()
      .ref(path)
      .push();
    newChild.set(message, callback);
  }
  static getAgencyTyping(room_id, callback) {
    let path = "livechat/" + room_id + "/agency_typing";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static terminateChat(room_id, callback) {
    let path = "livechat/" + room_id;
    firebase
      .database()
      .ref(path)
      .update({ established: "false", content: null })
      .then(() => {
        var activeTickets = firebase
          .database()
          .ref(path + "/tickets")
          .orderByChild("status")
          .equalTo("Active");
        activeTickets.once("value", snapshot => {
          Object.keys(snapshot.val()).map(item => {
            let subpath = "livechat/" + room_id + "/tickets/" + item;
            console.log("subpath", subpath);
            firebase
              .database()
              .ref(subpath)
              .update({ status: "Open" })
              .then(() => {
                callback("success");
              });
          });
        });
      })
      .catch(err => {
        callback(err);
      });
  }
  static setTypeValue(room_id, value) {
    let path = "livechat/" + room_id;
    firebase
      .database()
      .ref(path)
      .update({ user_typing: value });
  }
}
Firebase.initialize();
export default Firebase;
