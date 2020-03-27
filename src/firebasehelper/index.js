import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/database';
import '@firebase/firestore';
import '@firebase/storage';
import {Alert} from 'react-native';
import {filterArrayByKey} from '../utils/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyBlBJtz1oV7_pWAyjrlkxdJ7ZenisHP5sk',
  projectId: 'boltconcierge-2f0f9',
  databaseURL: 'https://boltconcierge-2f0f9.firebaseio.com',
  storageBucket: 'boltconcierge-2f0f9.appspot.com',
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
  static firestore() {
    return firebase.firestore();
  }
  static signup = profile => {
    console.log('profile', profile);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user')
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
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user')
        .doc(`${uid}`)
        .set({avatar_url: url}, {merge: true})
        .then(() => {
          firebase
            .firestore()
            .collection('user')
            .doc(`${uid}`)
            .get()
            .then(res => {
              resolve(res.data());
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(error => reject(error));
    });
  };
  static pet_signup = profile => {
    console.log('pet_profile', profile);
    const uid = profile.uid;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('pets')
        .doc(`${uid}`)
        .set(profile, {merge: true})
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static bike_signup = profile => {
    console.log('pet_profile', profile);
    const uid = profile.uid;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('bikes')
        .doc(`${uid}`)
        .set(profile, {merge: true})
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static health_signup = profile => {
    console.log('healthprofile', profile);
    const uid = profile.uid;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('physical_profile')
        .doc(`${uid}`)
        .set(profile, {merge: true})
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static home_signup = profile => {
    console.log('homeprofile', profile);
    const uid = profile.uid;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('home')
        .doc(`${uid}`)
        .set(profile, {merge: true})
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
        .collection('user')
        .doc(`${uid}`)
        .get()
        .then(doc => {
          if (doc.exists) {
            console.log('doc', doc.data());
            if (doc.data().active) {
              resolve(true);
            } else resolve(false);
          } else {
            resolve(false);
            console.log('No Such data');
          }
        })
        .catch(err => {
          console.log('Error', err);
        });
    });
  };
  static isPaymentReady = uid => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user')
        .doc(`${uid}`)
        .get()
        .then(doc => {
          if (doc.exists) {
            if (doc.data().customer_id) {
              resolve(true);
            } else resolve(false);
          } else {
            resolve(false);
            console.log('No Such data');
          }
        })
        .catch(err => {
          console.log('Error', err);
        });
    });
  };

  static isGroupLeader = async (uid, groupId) => {
    let res = await firebase
      .firestore()
      .collection('group')
      .doc(`${groupId}`)
      .get();
    return res.data().inviter === uid ? true : false;
  };
  static isPackageGot = async (uid, pkgname) => {
    console.log('uid', uid);
    let res = await firebase
      .firestore()
      .collection('user')
      .doc(`${uid}`)
      .get();
    if (res.data().packages) {
      return res.data().packages.some(item => item.caption === pkgname);
    } else return false;
  };
  static getBoltPackages = () => {
    let path = 'packages/';
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .on('value', snapshot => {
          let result = [];
          result = snapshot.val();
          //let res = Object.values(result)[0];
          console.log('value', result);
          resolve(result);
        });
    });
  };
  static getPackagesBoughtByUserID = async uid => {
    let res = await firebase
      .firestore()
      .collection('user')
      .doc(`${uid}`)
      .get();
    if (res.data().packages)
      return res.data().packages.map(item => {
        return item.caption;
      });
    else return false;
  };
  static getPackNamesByTicketID(ticket_id) {
    let path = 'categories/' + ticket_id;
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .on('value', snapshot => {
          var res = [];
          if (snapshot.val()) {
            res = snapshot.val();
            let result = [];
            if (res.packageA !== 'N/A') result.push(res.packageA);
            if (res.packageB !== 'N/A') result.push(res.packageB);
            if (res.packageC !== 'N/A') result.push(res.packageC);

            resolve(result);
          } else reject('empty packages');
        });
    });
  }
  static getProfile = phonenumber => {
    console.log('phonenumber', phonenumber);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user')
        .where('phonenumber', '==', phonenumber)
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
  static async getAllUsers() {
    const snapshot = await firebase
      .firestore()
      .collection('user')
      .get();
    return snapshot.docs.map(item => {
      return {[item.id]: item.data()};
    });
  }
  static findFriends = uid => {
    console.log('findfriends of uid', uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('group')
        .where('members', 'array-contains', uid)
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
      .collection('property')
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
        .collection('group')
        .doc(`${groupId}`)
        .set({members: temp}, {merge: true})
        .then(() => {
          console.log('return true');
          return true;
        });
    });
  };
  static getUserDatafromUID = uid => {
    console.log('getUserDatafromUID', uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user')
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
    console.log('getPetDatafromUID', uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('pets')
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
    console.log('getBikeDatafromUID', uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('bikes')
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
    console.log('getHealthDatafromUID', uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('physical_profile')
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
    console.log('getHomeDatafromUID', uid);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('home')
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
  static getCreditMembers = () => {
    let path = 'credit_members/';
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .on('value', snapshot => {
          var res = [];
          if (snapshot.val()) {
            res = snapshot.val();
          }
          resolve(res);
        });
    });
  };
  static getPackagesData() {
    console.log('getPackagesData');
    let path = 'packages/';
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .on('value', snapshot => {
          var res = [];

          if (snapshot.val()) {
            res = snapshot.val();
            resolve(res);
          } else reject('empty packages');
        });
    });
  }
  static getPackageInfo = pkgName => {
    let path = 'packages/';
    var pkgRef = firebase
      .database()
      .ref(path)
      .orderByChild('caption')
      .equalTo(pkgName);
    return new Promise((resolve, reject) => {
      pkgRef.on('value', snapshot => {
        resolve(Object.values(snapshot.val())[0]);
      });
    });
  };
  static findAnswer = (item, room, adjective, callback) => {
    let path = 'chatbot/quez';
    firebase
      .database()
      .ref(path)
      .orderByChild('item_room_adjective')
      .equalTo(item + '_' + room + '_' + adjective)
      .once('value', snapshot => {
        let res = [];
        if (snapshot.val()) {
          res = Object.values(snapshot.val());
        }
        console.log('result in ques', res);
        if (!res.length) {
          firebase
            .database()
            .ref(path)
            .orderByChild('item_room_adjective')
            .equalTo(item + '__' + adjective)
            .once('value', snapshot => {
              let result = [];

              if (snapshot.val()) {
                result = Object.values(snapshot.val());
                const ticket = result[0].ticket;
                let sub_path = 'chatbot/answers';
                firebase
                  .database()
                  .ref(sub_path)
                  .orderByChild('ticket')
                  .equalTo(ticket)
                  .once('value', snapshot => {
                    let result = [];
                    result = Object.values(snapshot.val());
                    callback(result[0]);
                  });
              } else callback(false);
            });
        } else {
          const ticket = res[0].ticket;
          let sub_path = 'chatbot/answers';
          firebase
            .database()
            .ref(sub_path)
            .orderByChild('ticket')
            .equalTo(ticket)
            .once('value', snapshot => {
              let result = [];
              result = Object.values(snapshot.val());
              callback(result[0]);
            });
        }
      });
  };
  static getAllItem(callback) {
    console.log('getAllItem');
    let path = 'chatbot/quez';
    firebase
      .database()
      .ref(path)
      .once('value', snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, 'item');
        let result = a.map(item => item.item);
        callback(result);
      });
  }
  static getAllRoom(callback) {
    console.log('getAllRoom');
    let path = 'chatbot/rooms';
    firebase
      .database()
      .ref(path)
      .once('value', snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getAllAdjective(callback) {
    console.log('getAllAdjective');
    let path = 'chatbot/quez';
    firebase
      .database()
      .ref(path)
      .once('value', snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, 'adjective');
        let result = a.map(item => item.adjective);
        callback(result);
      });
  }
  static getRoomByItem(item, callback) {
    let path = 'chatbot/quez';
    firebase
      .database()
      .ref(path)
      .orderByChild('item')
      .equalTo(item)
      .once('value', snapshot => {
        let res = [];
        if (snapshot.val()) res = snapshot.val();
        res = Object.values(res);
        console.log('result before filter', res);
        var adjective = res.map(item => {
          return {value: item.adjective};
        });
        console.log('adjectives array', adjective);
        if (!res.pop().room) callback(null, adjective);
        else {
          var a = filterArrayByKey(res, 'room');
          let result = a.map(item => item.room);
          callback(result, adjective);
        }
      });
  }
  static getLocationByCuisine(cuisine, callback) {
    let path = 'restaurant_foods/';
    firebase
      .database()
      .ref(path)
      .orderByChild('cuisine')
      .equalTo(cuisine)
      .once('value', snapshot => {
        let res = [];
        if (snapshot.val()) res = snapshot.val();
        res = Object.values(res);
        console.log('result before filter', res);
        var a = filterArrayByKey(res, 'location');
        let result = a.map(item => item.location);
        callback(result);
      });
  }
  static getAllLocations(callback) {
    let path = 'restaurant_foods/';
    firebase
      .database()
      .ref(path)
      .once('value', snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, 'location');
        let result = a.map(item => item.location);
        callback(result);
      });
  }
  static getAllCuisines(callback) {
    let path = 'restaurant_foods/';
    firebase
      .database()
      .ref(path)
      .once('value', snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        var a = filterArrayByKey(res, 'cuisine');
        let result = a.map(item => item.cuisine);
        callback(result);
      });
  }
  static updateUserData = (uid, data) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user')
        .doc(`${uid}`)
        .set(data, {merge: true})
        .then(() => {
          firebase
            .firestore()
            .collection('user')
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
  static readMessage = uid => {
    let path = 'livechat/' + uid;
    firebase
      .database()
      .ref(path)
      .update({unread: null});
  };
  static requestChat = (uid, username, ticket) => {
    let data = {
      uid: uid,
      username: username,
    };
    let path = 'livechat/' + uid;
    firebase
      .database()
      .ref(path)
      .update(data);
    let ticket_id = '' + ticket.id;
    let child_id = ticket_id.split('.').join('');
    let ticket_path = 'livechat/' + uid + '/tickets/' + child_id;
    firebase
      .database()
      .ref(ticket_path)
      .set({
        ticket_id: ticket.id,
        issue: ticket.issue,
        title: ticket.title,
        status: ticket.status,
        time: ticket.time,
        item: ticket.item ? ticket.item : null,
        room: ticket.room ? ticket.room : null,
        band: ticket.band ? ticket.band : null,
        adjective: ticket.adjective ? ticket.adjective : null,
        response_sla: ticket.response_sla ? ticket.response_sla : null,
        repair_sla: ticket.repair_sla ? ticket.repair_sla : null,
      });
  };
  static getAgencyRespond(uid, ticket_id, callback) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id;
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        if (res.status === 'Open') {
          callback(true);
        } else callback(false);
      });
  }
  static getAllTicketsById(user_id, callback) {
    let path = 'livechat/' + user_id + '/tickets';
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getChats(uid, ticket_id, callback) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id + '/content';
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }

        callback(res);
      });
  }
  static getTicketData(uid, ticket_id, callback) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id;
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getChatsById(uid, callback) {
    let path = 'livechat/' + uid + '/unread';
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        var res = null;
        console.log('unread,', snapshot.val());
        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getStatus(uid, ticket_id, callback) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id + '/status';
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        if (snapshot.val()) {
          callback(snapshot.val());
        }
      });
  }
  static addMessage(uid, ticket_id, message, callback) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id + '/content';
    var newChild = firebase
      .database()
      .ref(path)
      .push();
    newChild.set(message, callback(true));
  }
  static getAgencyTyping(uid, ticket_id, callback) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id + '/agency_typing';
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static getLandlordTyping(uid, ticket_id, callback) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id + '/landlord_typing';
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static getContractorTyping(uid, ticket_id, callback) {
    let path =
      'livechat/' + uid + '/tickets/' + ticket_id + '/contractor_typing';
    firebase
      .database()
      .ref(path)
      .on('value', snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static terminateChat(uid, ticket_id, feeling, callback) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id;
    firebase
      .database()
      .ref(path)
      .update({content: null, status: 'Closed', feeling: feeling})
      .then(() => {
        callback('success');
      })
      .catch(err => {
        callback(err);
      });
  }
  static setTypeValue(uid, ticket_id, value) {
    let path = 'livechat/' + uid + '/tickets/' + ticket_id;
    firebase
      .database()
      .ref(path)
      .update({user_typing: value});
  }
  static async addPost(post) {
    console.log('post', post);

    const timestamp = await firebase.firestore.Timestamp.fromDate(new Date());
    console.log('timestamp', timestamp);
    return firebase
      .firestore()
      .collection('post')
      .add({
        title: post.title,
        content: post.content,
        uid: post.uid,
        timestamp: timestamp,
      });
  }
  static updatePost = (post_id, data) => {
    return firebase
      .firestore()
      .collection('post')
      .doc(`${post_id}`)
      .set(data, {merge: true});
  };
  static acceptInvitation = (uid, property_id, phone) => {
    console.log('1 uid, property_id, phone', uid, property_id, phone);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('invitations')
        .where('phone', '==', phone)
        .where('property_id', '==', property_id)
        .limit(1)
        .get()
        .then(res => {
          console.log('2 invitation', res.docs[0]);
          let invitation_id = res.docs[0].id;
          firebase
            .firestore()
            .collection('invitations')
            .doc(invitation_id)
            .delete()
            .then(() => {
              //deleted Invitation;
              console.log('3 deleted Invitation');
              firebase
                .firestore()
                .collection('property')
                .doc(property_id)
                .get()
                .then(res => {
                  console.log('4 property info', res);
                  let members = res.data().members;
                  console.log('5 members', members);
                  members = members.map(item => {
                    if (item.phone === phone) {
                      item.accepted = true;
                      item.uid = uid;
                    }
                    return item;
                  });
                  console.log('6 members', members);
                  firebase
                    .firestore()
                    .collection('property')
                    .doc(property_id)
                    .set({members}, {merge: true})
                    .then(() => {
                      resolve(true);
                    })
                    .catch(err => {
                      reject(err);
                    });
                })
                .catch(err => {
                  reject(err);
                });
            })
            .catch(err => {
              reject(err);
            })
            .catch(err => {
              reject(err);
            });
        });
    });
  };
  static rejectInvitation = (uid, property_id, phone) => {
    console.log('1 uid, property_id, phone', uid, property_id, phone);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('invitations')
        .where('phone', '==', phone)
        .where('property_id', '==', property_id)
        .limit(1)
        .get()
        .then(res => {
          console.log('2 invitation', res.docs[0]);
          let invitation_id = res.docs[0].id;
          firebase
            .firestore()
            .collection('invitations')
            .doc(invitation_id)
            .delete()
            .then(() => {
              //deleted Invitation;
              console.log('3 deleted Invitation');
              firebase
                .firestore()
                .collection('property')
                .doc(property_id)
                .get()
                .then(res => {
                  console.log('4 property info', res);
                  let members = res.data().members;
                  console.log('5 members', members);
                  const index = members.findIndex(item => {
                    return item.phone === phone;
                  });
                  members.splice(index, 1);
                  console.log('6 members', members);
                  firebase
                    .firestore()
                    .collection('property')
                    .doc(property_id)
                    .set({members}, {merge: true})
                    .then(() => {
                      resolve(true);
                    })
                    .catch(err => {
                      reject(err);
                    });
                })
                .catch(err => {
                  reject(err);
                });
            })
            .catch(err => {
              reject(err);
            })
            .catch(err => {
              reject(err);
            });
        });
    });
  };
  static getPropertyById(property_id) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('property')
        .doc(`${property_id}`)
        .get()
        .then(res => {
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
Firebase.initialize();
export default Firebase;
