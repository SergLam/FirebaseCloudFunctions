const helper = require('../helpers/helper.js');

exports.handler = function(req, res, firestore, firebase) {

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
}
