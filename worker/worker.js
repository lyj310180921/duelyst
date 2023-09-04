/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const fs = require('fs');
const os = require('os');
const Logger = require('../app/common/logger.coffee');
const config = require('../config/config.js');
const Promise = require('bluebird');
const { Jobs } = require('../server/redis');

if (config.isDevelopment()) {
  Logger.module("WORKER").log("DEV MODE: enabling long stack support");
  process.env.BLUEBIRD_DEBUG = 1;
  Promise.longStackTraces();
}

// Increase the number of event listeners in Node.js.
// Raising this suppresses benign warnings without losing leak detection.
const events = require('events');
events.EventEmitter.defaultMaxListeners = 20; // Default is 10.

/*
Job Queue Consumer // aka Worker
*/
const kue = require('kue');

/*
Setup Kue connection
prefix namespaces the queue
*/
const worker = require('../server/redis/r-jobs');

// job failed
worker.on("job failed", function(id, errorMessage) {
  Logger.module("WORKER").error(`[J:${id}] has failed: ${errorMessage}`.red);
  return kue.Job.get(id, function(err, job) {
    if (err) { return; }
  });
});

/*
Kue Shutdown Event
Finishes current job, 10s timeout before shutting down.
*/
const cleanShutdown = () => worker.shutdown(10000, function(err) {
  if (err) {
    Logger.module("WORKER").error(`Shutdown error occured: ${err.message}`);
  }
  Logger.module("WORKER").log("Shutting down.");
  return process.exit(0);
});

process.on("SIGTERM", cleanShutdown);
process.on("SIGINT", cleanShutdown);
process.on("SIGHUP", cleanShutdown);
process.on("SIGQUIT", cleanShutdown);
process.on("SIGABRT", cleanShutdown);

/*
Setup Jobs
*/
const archiveGame = require('./jobs/archive-game.coffee');
const updateUserPostGame = require('./jobs/update-user-post-game.coffee');
const updateUserAchievements = require('./jobs/update-user-achievements.coffee');
const updateUserChargeLog = require('./jobs/update-user-charge-log.coffee');
const matchmakingSetupGame = require('./jobs/matchmaking-setupgame.coffee');
const matchmakingSearchRanked = require('./jobs/matchmaking-search-ranked.coffee');
const matchmakingSearchCasual = require('./jobs/matchmaking-search-casual.coffee');
const matchmakingSearchArena = require('./jobs/matchmaking-search-arena.coffee');
const matchmakingSearchRift = require('./jobs/matchmaking-search-rift.coffee');
const dataSyncUserBuddyList = require('./jobs/data-sync-user-buddy-list.coffee');
const processUserReferralEvent = require('./jobs/process-user-referral-event.coffee');
const updateUsersRatings = require('./jobs/update-users-ratings.coffee');
const updateUserSeenOn = require('./jobs/update-user-seen-on.coffee');
const rotateBosses = require('./jobs/rotate-bosses.coffee');

worker.process('archive-game', 1, archiveGame);
worker.process('update-user-post-game', 2, updateUserPostGame);
worker.process('update-user-achievements', 1, updateUserAchievements);
worker.process('update-user-charge-log', 1, updateUserChargeLog);
worker.process('matchmaking-setup-game', 1, matchmakingSetupGame);
worker.process('matchmaking-search-ranked', 1, matchmakingSearchRanked);
worker.process('matchmaking-search-casual', 1, matchmakingSearchCasual);
worker.process('matchmaking-search-arena', 1, matchmakingSearchArena);
worker.process('matchmaking-search-rift', 1, matchmakingSearchRift);
worker.process('data-sync-user-buddy-list', 1, dataSyncUserBuddyList);
worker.process('process-user-referral-event', 1, processUserReferralEvent);
worker.process('update-users-ratings', 1, updateUsersRatings);
worker.process('update-user-seen-on', 1, updateUserSeenOn);

// Run the rotateBosses job once on startup.
// TODO: Find another way to trigger this hourly.
worker.process('rotate-bosses', 1, rotateBosses);
const runRotateBossesJob = () => Jobs.create('rotate-bosses', {
  name: 'Rotate Bosses',
  title: 'Rotating Boss Event'
}
).removeOnComplete(true).save();
setTimeout(runRotateBossesJob, 1000);
