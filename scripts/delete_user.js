/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

// Configuration object
const config = require("../config/config.js");
const Firebase = require("firebase");
const _ = require("underscore");
const fbRef = new Firebase(config.get("firebase"));

// Firebase secure token for duelyst-dev.firebaseio.com
const firebaseToken = config.get("firebaseToken");
const UsersModule = require("../server/lib/users_module");
const DuelystFirebase= require("../server/lib/duelyst_firebase_module");
const fbUtil = require('../app/common/utils/utils_firebase.js');

if (process.argv[2]) {
  console.log(process.argv);
  const username = process.argv[2];
  console.log("searching for user: " + username);

  DuelystFirebase.connect().getRootRef()
  .bind({})
  .then(function(fbRootRef) {
    this.fbRootRef = fbRootRef;
    return UsersModule.userIdForUsername(username);}).then(function(userId) {
    if (!userId) {
      throw new Error("userid not found");
    } else {
      console.log("Deleting user account data.");
      this.userId = userId;
      this.fbRootRef.child('username-index').child('dummy').remove();
      this.fbRootRef.child('users').child(userId).remove();
      this.fbRootRef.child('user-transactions').child(userId).remove();
      this.fbRootRef.child('user-inventory').child(userId).remove();
      this.fbRootRef.child('user-logs').child(userId).remove();
      this.fbRootRef.child('user-quests').child(userId).remove();
      this.fbRootRef.child('user-ranking').child(userId).remove();
      this.fbRootRef.child('user-aggregates').child(userId).remove();
      this.fbRootRef.child('user-decks').child(userId).remove();
      this.fbRootRef.child('user-games').child(userId).remove();
      return DuelystFirebase.connect(config.get("auth"), config.get("authToken")).getRootRef()
      .then(fbAuthRootRef => {
        fbAuthRootRef.child("user").child(this.userId).remove();
        console.log("User deleted.");
        return process.exit(1);
      }
      );
    }}).catch(function(error) {
    console.log(error);
    return process.exit(1);
  });

} else {
  throw new Error("no username provided");
  process.exit(1);
}
