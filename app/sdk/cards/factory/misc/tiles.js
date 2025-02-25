// do not add this file to a package
// it is specifically parsed by the package generation script

const _ = require('underscore');
const moment = require('moment');

const Logger = require('app/common/logger');

const CONFIG = require('app/common/config');
const RSX = require('app/data/resources');

const Card = require('app/sdk/cards/card');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const Factions = require('app/sdk/cards/factionsLookup');
const FactionFactory = require('app/sdk/cards/factionFactory');
const Races = require('app/sdk/cards/racesLookup');
const Rarity = require('app/sdk/cards/rarityLookup');

const Tile = require('app/sdk/entities/tile');

const ModifierStackingShadows = require('app/sdk/modifiers/modifierStackingShadows');
const ModifierStackingShadowsDebuff = require('app/sdk/modifiers/modifierStackingShadowsDebuff');
const ModifierCollectableBonusMana = require('app/sdk/modifiers/modifierCollectableBonusMana');
const ModifierHallowedGround = require('app/sdk/modifiers/modifierHallowedGround');
const ModifierHallowedGroundBuff = require('app/sdk/modifiers/modifierHallowedGroundBuff');
const ModifierSandPortal = require('app/sdk/modifiers/modifierSandPortal');
const ModifierPrimalProtection = require('app/sdk/modifiers/modifierPrimalProtection');
const ModifierPrimalTile = require('app/sdk/modifiers/modifierPrimalTile');
const ModifierCollectableCard = require('app/sdk/modifiers/modifierCollectableCard');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}

class CardFactory_Tiles {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Tile.BonusMana) {
      card = new Tile(gameSession);
      card.factionId = Factions.Neutral;
      card.id = Cards.Tile.BonusMana;
      card.name = i18next.t("modifiers.mana_spring_name");
      card.setDescription("");
      card.setIsHiddenInCollection(true);
      card.manaCost = 0;
      card.uses = 1;
      card.dieOnDepleted = false;
      card.setInherentModifiersContextObjects([
        ModifierCollectableBonusMana.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Tile.BonusMana"]);
      card.setSpriteOptions({
        occludes: true,
        castsShadows: false,
        depthRotation: {x: -Math.PI * 0.5, y: 0.0, z: 0.0} // tile should be flat on ground for occlusion
      });
      card.setBaseAnimResource({
        idle: RSX.tileManaIdle.name,
        depleted: RSX.tileManaDepleted.name
      });
      card.setBaseSoundResource({
        depleted: RSX.sfx_unit_run_magical_3.audio
      });
    }

    if (identifier === Cards.Tile.Shadow) {
      card = new Tile(gameSession);
      card.factionId = Factions.Neutral;
      card.id = Cards.Tile.Shadow;
      card.name = i18next.t("modifiers.shadow_creep_name");
      //      card.setDescription("Deals damage to enemy minion equal to the number of Shadow Creep tiles on the battlefield.")
      card.setIsHiddenInCollection(true);
      card.manaCost = 0;
      card.setInherentModifiersContextObjects([ModifierStackingShadows.createContextObject(), ModifierStackingShadowsDebuff.createContextObject()]);
      card.setFXResource(["FX.Cards.Tile.Shadow"]);
      card.setSpriteOptions({
        scale: 1.3,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.3},
        occludes: true,
        castsShadows: false,
        depthRotation: {x: -Math.PI * 0.5, y: 0.0, z: 0.0} // tile should be flat on ground for occlusion
      });
      card.setCardOptions({
        scale: 1.3,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.15}
      });
      card.setBaseAnimResource({
        apply: RSX.fxShadowCreepSpawn.name,
        idle: RSX.fxShadowCreepIdle.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_f4_daemongate_death.audio
      });
    }

    if (identifier === Cards.Tile.Hallowed) {
      card = new Tile(gameSession);
      card.factionId = Factions.Neutral;
      card.id = Cards.Tile.Hallowed;
      card.name = i18next.t("modifiers.hallowed_ground_name");
      card.setIsHiddenInCollection(true);
      card.manaCost = 0;
      card.setInherentModifiersContextObjects([ModifierHallowedGround.createContextObject(), ModifierHallowedGroundBuff.createContextObject()]);
      card.setFXResource(["FX.Cards.Tile.Hallowed"]);
      card.setSpriteOptions({
        scale: 1.3,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.3},
        occludes: true,
        castsShadows: false,
        depthRotation: {x: -Math.PI * 0.5, y: 0.0, z: 0.0} // tile should be flat on ground for occlusion
      });
      card.setCardOptions({
        scale: 1.3,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.15}
      });
      card.setBaseAnimResource({
        apply: RSX.fxHolyTileSpawn.name,
        idle: RSX.fxHolyTileIdle.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_lastingjudgement.audio
      });
    }

    if (identifier === Cards.Tile.SandPortal) {
      card = new Tile(gameSession);
      card.factionId = Factions.Neutral;
      card.id = Cards.Tile.SandPortal;
      card.name = i18next.t("modifiers.exhuming_sand_name");
      card.setIsHiddenInCollection(true);
      card.manaCost = 0;
      card.setInherentModifiersContextObjects([ModifierSandPortal.createContextObject()]);
      card.setFXResource(["FX.Cards.Tile.SandPortal"]);
      card.setSpriteOptions({
        scale: 1.3,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.3},
        occludes: true,
        castsShadows: false,
        depthRotation: {x: -Math.PI * 0.5, y: 0.0, z: 0.0} // tile should be flat on ground for occlusion
      });
      card.setCardOptions({
        scale: 1.3,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.15}
      });
      card.setBaseAnimResource({
        apply: RSX.fxSandTileSpawn.name,
        idle: RSX.fxSandTileIdle.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_drainmorale.audio
      });
    }

    if (identifier === Cards.Tile.PrimalMojo) {
      card = new Tile(gameSession);
      card.factionId = Factions.Neutral;
      card.id = Cards.Tile.PrimalMojo;
      card.name = i18next.t("modifiers.primal_flourish_name");
      card.setIsHiddenInCollection(true);
      card.manaCost = 0;
      card.setInherentModifiersContextObjects([ModifierPrimalTile.createContextObject(), ModifierPrimalProtection.createContextObject()]);
      card.setFXResource(["FX.Cards.Tile.PrimalMojo"]);
      card.setSpriteOptions({
        scale: 1.3,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.3},
        occludes: true,
        castsShadows: false,
        depthRotation: {x: -Math.PI * 0.5, y: 0.0, z: 0.0} // tile should be flat on ground for occlusion
      });
      card.setCardOptions({
        scale: 1.3,
        offset: {x: 0.0, y: CONFIG.TILESIZE * 0.15}
      });
      card.setBaseAnimResource({
        apply: RSX.fxPrimalTileSpawn.name,
        idle: RSX.fxPrimalTileIdle.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_tranquility.audio
      });
    }

    if (identifier === Cards.Tile.FrostfireChest) {
      card = new Tile(gameSession);
      card.factionId = Factions.Neutral;
      card.id = Cards.Tile.HolidayChest;
      card.name = i18next.t("modifiers.frostfire_chest_name");
      card.setDescription(i18next.t("modifiers.frostfire_chest_desc"));
      card.setIsHiddenInCollection(true);
      card.manaCost = 0;
      card.uses = 1;
      card.dieOnDepleted = true;
      card.obstructsOtherTiles = true;
      card.canBeDispelled = false;
      card.setInherentModifiersContextObjects([
        ModifierCollectableCard.createContextObject({id: Cards.BossSpell.HolidayGift})
      ]);
      card.setFXResource(["FX.Cards.Tile.FrostfireChest"]);
      card.setSpriteOptions({
        occludes: true,
        castsShadows: false,
        depthRotation: {x: -Math.PI * 0.5, y: 0.0, z: 0.0} // tile should be flat on ground for occlusion
      });
      card.setBaseAnimResource({
        idle: RSX.tileTreasureFestiveIdle.name,
        depleted: RSX.tileTreasureFestiveOpen.name
      });
      card.setBaseSoundResource({
        depleted: RSX.sfx_unit_run_magical_3.audio
      });
    }

    return card;
  }
}

module.exports = CardFactory_Tiles;
