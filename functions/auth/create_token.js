const helper = require('../helpers/helper.js');

exports.createCustomToken = function(firestore, app, uid) {
  const usersRef = firestore.collection('users');
    app.auth().createCustomToken(uid)
      .then(function(customToken) {
            // Add custom token to user record in collection
            const userRef = firestore.collection('users').doc(uid);
            userRef.update({
                    customToken: customToken
            })
            .then(function() {
                console.log("Document successfully updated!");
                return customToken
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
                throw error
            });
          return customToken
        })
      .catch(function(error) {
        console.log("Error creating custom token:", error);
        throw error
      });
}