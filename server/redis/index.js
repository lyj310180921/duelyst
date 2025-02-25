const Redis = (exports.Redis       = require('./r-client'));
exports.GameManager       = require('./r-gamemanager')(Redis);
exports.TokenManager       = require('./r-tokenmanager')(Redis);
exports.InviteQueue       = require('./r-invitequeue')(Redis);
exports.Jobs           = require('./r-jobs');
exports.PlayerQueue       = require('./r-playerqueue');
exports.TimeSeries         = require('./r-timeseries');
exports.WatchableGamesManager   = require('./r-watchablegamesmanager')(Redis);
exports.SRankManager = require("./r-srankmanager")(Redis);
exports.RiftManager = require("./r-riftmanager")(Redis);
