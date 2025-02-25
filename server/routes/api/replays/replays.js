/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const express = require('express');
const request = require('superagent');
const Promise = require('bluebird');
const knex = require('../../../lib/data_access/knex');
const DataAccessHelpers = require('../../../lib/data_access/helpers');
const Logger = require('../../../../app/common/logger');
const config = require('../../../../config/config');
const t = require('tcomb-validation');
const UtilsGameSession = require("../../../../app/common/utils/utils_game_session");
const GameSession = require('../../../../app/sdk/gameSession');
const Errors = require('../../../lib/custom_errors');
const generatePushId = require('../../../../app/common/generate_push_id');
const _ = require("underscore");

const awsRegion = config.get('aws.region');
const awsReplaysBucket = config.get('aws.replaysBucketName');

const router = express.Router();

router.get("/:replay_id", function(req, res, next) {
  const result = t.validate(req.params.replay_id, t.subtype(t.Str, s => s.length <= 36));
  if (!result.isValid()) {
    return next();
  }

  const replay_id = result.value;

  return knex("user_replays").where('replay_id',replay_id).first()
  .bind({})
  .then(function(replayData){
    this.replayData = replayData;
    if (replayData != null) {
      const {
        game_id
      } = replayData;
      const gameDataUrl = `https://s3.${awsRegion}.amazonaws.com/${awsReplaysBucket}/${config.get('env')}/${game_id}.json`;
      const mouseUIDataUrl = `https://s3.${awsRegion}.amazonaws.com/${awsReplaysBucket}/${config.get('env')}/ui_events/${game_id}.json`;
      Logger.module("API").debug(`starting download of game ${game_id} replay data from ${gameDataUrl}`);

      const downloadGameSessionDataAsync = new Promise((resolve, reject) => request.get(gameDataUrl).end(function(err, res) {
        if ((res != null) && (res.status >= 400)) {
          // Network failure, we should probably return a more intuitive error object
          Logger.module("API").error(`ERROR! Failed to connect to games data: ${res.status} `.red);
          return reject(new Error("Failed to connect to games data."));
        } else if (err) {
          // Internal failure
          Logger.module("API").error(`ERROR! _retrieveGameSessionData() failed: ${err.message} `.red);
          return reject(err);
        } else {
          return resolve(res.text);
        }
      }));

      const downloadMouseUIDataAsync = new Promise((resolve, reject) => request.get(mouseUIDataUrl).end(function(err, res) {
        if ((res != null) && (res.status >= 400)) {
          // Network failure, we should probably return a more intuitive error object
          Logger.module("API").error(`ERROR! Failed to connect to ui event data: ${res.status} `.red);
          return reject(new Error("Failed to connect to ui event data."));
        } else if (err) {
          // Internal failure
          Logger.module("API").error(`ERROR! _retrieveGameUIEventData() failed: ${err.message} `.red);
          return reject(err);
        } else {
          return resolve(res.text);
        }
      }));

      return Promise.all([
        downloadGameSessionDataAsync,
        downloadMouseUIDataAsync
      ]);
    } else {
      return [null,null];
    }})
  .spread(function(gameDataString,mouseUIDataString){
    Logger.module("API").debug(`downloaded replay id: ${replay_id} data. size:${(gameDataString != null ? gameDataString.length : undefined) || 0}`);
    if ((gameDataString == null) || (mouseUIDataString == null)) {
      return res.status(404).json({});
    } else {
      let gameSessionData = JSON.parse(gameDataString);
      const mouseUIData = JSON.parse(mouseUIDataString);

      // scrub the data here
      const gameSession = GameSession.create();
      gameSession.deserializeSessionFromFirebase(JSON.parse(gameDataString));
      Logger.module("API").debug(`scrubbing replay from perspective of ${this.replayData.user_id}`);
      gameSessionData = UtilsGameSession.scrubGameSessionData(gameSession,gameSessionData,this.replayData.user_id,true);

      return res.status(200).json({
        gameSessionData,
        mouseUIData,
        replayData: this.replayData
      });
    }}).catch(error => next(error));
});

module.exports = router;
