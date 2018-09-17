exports.handler = function(user, firestore) {

  const uid = helper.is_undefined(user.uid);
  const email = helper.is_undefined(user.email);
  const displayName = helper.is_undefined(user.displayName); // The display name of the user.
  const photoURL = helper.is_undefined(user.providerData.photoURL);
  const createdAt= helper.is_undefined(user.metadata.creationTime);
  const lastSignInTime = helper.is_undefined(user.metadata.lastSignInTime);

  const users = firestore.collection('users');

  return users.doc(uid).set({
      uid: uid,
      createdAt: createdAt,
      email: email,
      displayName: displayName,
      photoURL: photoURL,
      lastSignInTime: lastSignInTime,
      notification_tokens: {
        token: true
      }
    });
}
