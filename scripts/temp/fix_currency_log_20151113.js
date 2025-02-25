/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const knex = require("../../server/lib/data_access/knex");
const generatePushId = require("../../app/common/generate_push_id");
const Promise = require("bluebird");
const PrettyError = require('pretty-error');

// configure pretty error
const prettyError = new PrettyError();
prettyError.skipNodeFiles();
prettyError.skipPackage('bluebird');

knex.transaction(tx => tx("user_spirit_orbs")
  .where('created_at','>','2015-10-02 03:04:12.53+00')
  .andWhere('created_at','<','2015-11-19 23:56:19.086+00') //TODO: put deployment date in here
  .andWhere('transaction_type','soft')
  .select('id','user_id','created_at')
.then(function(orbRows){
  const allPromises = [];
  for (var row of Array.from(orbRows)) {
    allPromises.push(tx("user_currency_log").insert({
      id: generatePushId(),
      user_id: row.user_id,
      created_at: row.created_at,
      gold: -100,
      memo: `spirit orb ${row.id}`
    })
    );
  }
  return Promise.all(allPromises);}).then(tx.commit)
.catch(tx.rollback)).then(function(){
  console.log("done");
  return process.exit(0);}).catch(function(e){
  console.log(`ERROR! ${e.message}`);
  console.log(prettyError.render(e));
  throw e;
  return process.exit(1);
});
