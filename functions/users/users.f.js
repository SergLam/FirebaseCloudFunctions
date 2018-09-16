const helper = require('../helpers/helper.js');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');
const firebase = require("firebase");
try {
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-auth-training.firebaseio.com"
});
} catch (e) {
  console.log(e);
}
const firestore = admin.firestore();
const init = require('../init_app.js');

module.exports = functions.https.onRequest((req, res) => {

  const users = firestore.collection('users');
  const users_array = [];

  return users.get().then(snapshot => {

        snapshot.forEach(doc => {
          const user = {
            uid: doc.id,
            user: doc.data()
          };
          users_array.push(user);
        });

        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(users_array));

      }).catch(err => {
        return console.log('Error getting documents', err);
      });
});
