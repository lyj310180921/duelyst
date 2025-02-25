/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
let card, cardId, cardsUpToLevel, factionId, i, nonPrismaticCardsUpToLevel, reward;
let asc1, end1;
const _ = require('underscore');
const Factions = require('app/sdk/cards/factionsLookup');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CosmeticsLookup = require('app/sdk/cosmetics/cosmeticsLookup');

class FactionProgression {
  static initClass() {
  
    this.winXP = 10;
    this.lossXP = 7;
  
    this.winsBeforeLVLTenGiveFullLvlOfXp = true;
  
    this.maxLevel =51;
    this.levelXPTable = {
      0:0,
      1:7,
      2:14,
      3:21,
      4:32,
      5:45,
      6:65,
      7:85,
      8:105,
      9:130,
      10:150,
      11:180,
      12:220,
      13:290,
      14:350,
      15:410,
      16:480,
      17:570,
      18:670,
      19:780,
      20:900,
      21:1000,
      22:1120,
      23:1240,
      24:1360,
      25:1480,
      26:1600,
      27:1720,
      28:1840,
      29:1960,
      30:2110,
      31:2260,
      32:2410,
      33:2560,
      34:2710,
      35:2860,
      36:3010,
      37:3160,
      38:3310,
      39:3460,
      40:3660,
      41:3860,
      42:4060,
      43:4260,
      44:4460,
      45:4660,
      46:4860,
      47:5060,
      48:5260,
      49:5460,
      50:5660,
      51:5860
    };
  
    this.levelRewardsTable = {
      1: { // Lyonar
        1: {
          cards:[{
            id:Cards.Spell.DivineBond,
            count:3
          }
          ]
        },
        3: {
          cards:[{
            id:Cards.Faction1.SilverguardKnight,
            count:3
          }
          ]
        },
        6: {
          cards:[{
            id:Cards.Spell.Martyrdom,
            count:3
          }
          ]
        },
        9: {
          cards:[{
            id:Cards.Spell.Tempest,
            count:3
          }
          ]
        },
        10: {
          cards:[{
            id:Cards.Faction1.AltGeneral,
            count:1
          }
          ]
        },
        13: {
          cards:[{
            id:Cards.Faction1.WindbladeAdept + Cards.Prismatic,
            count:3
          }
          ]
        },
        15: {
          cards:[{
            id:Cards.Spell.WarSurge + Cards.Prismatic,
            count:3
          }
          ]
        },
        17: {
          cards:[{
            id:Cards.Neutral.RockPulverizer + Cards.Prismatic,
            count:3
          }
          ]
        },
        19: {
          cards:[{
            id:Cards.Artifact.SunstoneBracers + Cards.Prismatic,
            count:3
          }
          ]
        },
        21: {
          cards:[{
            id:Cards.Faction1.LysianBrawler + Cards.Prismatic,
            count:3
          }
          ]
        },
        23: {
          cards:[{
            id:Cards.Neutral.SkyrockGolem + Cards.Prismatic,
            count:3
          }
          ]
        },
        25: {
          cards:[{
            id:Cards.Spell.TrueStrike + Cards.Prismatic,
            count:3
          }
          ]
        },
        27: {
          cards:[{
            id:Cards.Spell.DivineBond + Cards.Prismatic,
            count:3
          }
          ]
        },
        30: {
          cards:[{
            id:Cards.Neutral.ThornNeedler + Cards.Prismatic,
            count:3
          }
          ]
        },
        33: {
          cards:[{
            id:Cards.Faction1.SilverguardKnight + Cards.Prismatic,
            count:3
          }
          ]
        },
        36: {
          cards:[{
            id:Cards.Spell.Martyrdom + Cards.Prismatic,
            count:3
          }
          ]
        },
        39: {
          cards:[{
            id:Cards.Neutral.HealingMystic + Cards.Prismatic,
            count:3
          }
          ]
        },
        42: {
          cards:[{
            id:Cards.Spell.Tempest + Cards.Prismatic,
            count:3
          }
          ]
        },
        45: {
          cards:[{
            id:Cards.Faction1.General + Cards.Prismatic,
            count:1
          }
          ]
        },
        49: {
          cards:[{
            id:Cards.Faction1.AltGeneral + Cards.Prismatic,
            count:1
          }
          ]
        },
        51: {
          cards:[{
            id:Cards.Faction1.ThirdGeneral + Cards.Prismatic,
            count:1
          }
          ]
        }
      },
      2: { // Songhai
        1: {
          cards:[{
            id:Cards.Spell.InnerFocus,
            count:3
          }
          ]
        },
        3: {
          cards:[{
            id:Cards.Spell.SaberspineSeal,
            count:3
          }
          ]
        },
        6: {
          cards:[{
            id:Cards.Spell.GhostLightning,
            count:3
          }
          ]
        },
        9: {
          cards:[{
            id:Cards.Faction2.ChakriAvatar,
            count:3
          }
          ]
        },
        10: {
          cards:[{
            id:Cards.Faction2.AltGeneral,
            count:1
          }
          ]
        },
        13: {
          cards:[{
            id:Cards.Faction2.KaidoAssassin + Cards.Prismatic,
            count:3
          }
          ]
        },
        15: {
          cards:[{
            id:Cards.Spell.KillingEdge + Cards.Prismatic,
            count:3
          }
          ]
        },
        17: {
          cards:[{
            id:Cards.Neutral.ValeHunter + Cards.Prismatic,
            count:3
          }
          ]
        },
        19: {
          cards:[{
            id:Cards.Artifact.MaskOfBloodLeech + Cards.Prismatic,
            count:3
          }
          ]
        },
        21: {
          cards:[{
            id:Cards.Faction2.Widowmaker + Cards.Prismatic,
            count:3
          }
          ]
        },
        23: {
          cards:[{
            id:Cards.Neutral.StormmetalGolem + Cards.Prismatic,
            count:3
          }
          ]
        },
        25: {
          cards:[{
            id:Cards.Spell.PhoenixFire + Cards.Prismatic,
            count:3
          }
          ]
        },
        27: {
          cards:[{
            id:Cards.Spell.InnerFocus + Cards.Prismatic,
            count:3
          }
          ]
        },
        30: {
          cards:[{
            id:Cards.Neutral.FireSpitter + Cards.Prismatic,
            count:3
          }
          ]
        },
        33: {
          cards:[{
            id:Cards.Spell.SaberspineSeal + Cards.Prismatic,
            count:3
          }
          ]
        },
        36: {
          cards:[{
            id:Cards.Spell.GhostLightning + Cards.Prismatic,
            count:3
          }
          ]
        },
        39: {
          cards:[{
            id:Cards.Neutral.RepulsionBeast + Cards.Prismatic,
            count:3
          }
          ]
        },
        42: {
          cards:[{
            id:Cards.Faction2.ChakriAvatar + Cards.Prismatic,
            count:3
          }
          ]
        },
        45: {
          cards:[{
            id:Cards.Faction2.General + Cards.Prismatic,
            count:1
          }
          ]
        },
        49: {
          cards:[{
            id:Cards.Faction2.AltGeneral + Cards.Prismatic,
            count:1
          }
          ]
        },
        51: {
          cards:[{
            id:Cards.Faction2.ThirdGeneral + Cards.Prismatic,
            count:1
          }
          ]
        }
      },
      3: { // Vetruvian
        1: {
          cards:[{
            id:Cards.Spell.ScionsSecondWish,
            count:3
          }
          ]
        },
        3: {
          cards:[{
            id:Cards.Faction3.BrazierRedSand,
            count:3
          }
          ]
        },
        6: {
          cards:[{
            id:Cards.Spell.Blindscorch,
            count:3
          }
          ]
        },
        9: {
          cards:[{
            id:Cards.Spell.CosmicFlesh,
            count:3
          }
          ]
        },
        10: {
          cards:[{
            id:Cards.Faction3.AltGeneral,
            count:1
          }
          ]
        },
        13: {
          cards:[{
            id:Cards.Faction3.Pyromancer + Cards.Prismatic,
            count:3
          }
          ]
        },
        15: {
          cards:[{
            id:Cards.Spell.ScionsFirstWish + Cards.Prismatic,
            count:3
          }
          ]
        },
        17: {
          cards:[{
            id:Cards.Neutral.PlanarScout + Cards.Prismatic,
            count:3
          }
          ]
        },
        19: {
          cards:[{
            id:Cards.Artifact.StaffOfYKir + Cards.Prismatic,
            count:3
          }
          ]
        },
        21: {
          cards:[{
            id:Cards.Faction3.WindShrike + Cards.Prismatic,
            count:3
          }
          ]
        },
        23: {
          cards:[{
            id:Cards.Neutral.BrightmossGolem + Cards.Prismatic,
            count:3
          }
          ]
        },
        25: {
          cards:[{
            id:Cards.Spell.EntropicDecay + Cards.Prismatic,
            count:3
          }
          ]
        },
        27: {
          cards:[{
            id:Cards.Spell.ScionsSecondWish + Cards.Prismatic,
            count:3
          }
          ]
        },
        30: {
          cards:[{
            id:Cards.Neutral.FlameWing + Cards.Prismatic,
            count:3
          }
          ]
        },
        33: {
          cards:[{
            id:Cards.Faction3.BrazierRedSand + Cards.Prismatic,
            count:3
          }
          ]
        },
        36: {
          cards:[{
            id:Cards.Spell.Blindscorch + Cards.Prismatic,
            count:3
          }
          ]
        },
        39: {
          cards:[{
            id:Cards.Neutral.SaberspineTiger + Cards.Prismatic,
            count:3
          }
          ]
        },
        42: {
          cards:[{
            id:Cards.Spell.CosmicFlesh + Cards.Prismatic,
            count:3
          }
          ]
        },
        45: {
          cards:[{
            id:Cards.Faction3.General + Cards.Prismatic,
            count:1
          }
          ]
        },
        49: {
          cards:[{
            id:Cards.Faction3.AltGeneral + Cards.Prismatic,
            count:1
          }
          ]
        },
        51: {
          cards:[{
            id:Cards.Faction3.ThirdGeneral + Cards.Prismatic,
            count:1
          }
          ]
        }
      },
      4: { // Abyssian
        1: {
          cards:[{
            id:Cards.Spell.DaemonicLure,
            count:3
          }
          ]
        },
        3: {
          cards:[{
            id:Cards.Faction4.AbyssalCrawler,
            count:3
          }
          ]
        },
        6: {
          cards:[{
            id:Cards.Spell.SoulshatterPact,
            count:3
          }
          ]
        },
        9: {
          cards:[{
            id:Cards.Spell.ShadowNova,
            count:3
          }
          ]
        },
        10: {
          cards:[{
            id:Cards.Faction4.AltGeneral,
            count:1
          }
          ]
        },
        13: {
          cards:[{
            id:Cards.Faction4.GloomChaser + Cards.Prismatic,
            count:3
          }
          ]
        },
        15: {
          cards:[{
            id:Cards.Spell.WraithlingSwarm + Cards.Prismatic,
            count:3
          }
          ]
        },
        17: {
          cards:[{
            id:Cards.Neutral.SpottedDragonlark + Cards.Prismatic,
            count:3
          }
          ]
        },
        19: {
          cards:[{
            id:Cards.Artifact.HornOfTheForsaken + Cards.Prismatic,
            count:3
          }
          ]
        },
        21: {
          cards:[{
            id:Cards.Faction4.ShadowWatcher + Cards.Prismatic,
            count:3
          }
          ]
        },
        23: {
          cards:[{
            id:Cards.Neutral.BloodshardGolem + Cards.Prismatic,
            count:3
          }
          ]
        },
        25: {
          cards:[{
            id:Cards.Spell.DarkTransformation + Cards.Prismatic,
            count:3
          }
          ]
        },
        27: {
          cards:[{
            id:Cards.Spell.DaemonicLure + Cards.Prismatic,
            count:3
          }
          ]
        },
        30: {
          cards:[{
            id:Cards.Neutral.Necroseer + Cards.Prismatic,
            count:3
          }
          ]
        },
        33: {
          cards:[{
            id:Cards.Faction4.AbyssalCrawler + Cards.Prismatic,
            count:3
          }
          ]
        },
        36: {
          cards:[{
            id:Cards.Spell.SoulshatterPact + Cards.Prismatic,
            count:3
          }
          ]
        },
        39: {
          cards:[{
            id:Cards.Neutral.BloodtearAlchemist + Cards.Prismatic,
            count:3
          }
          ]
        },
        42: {
          cards:[{
            id:Cards.Spell.ShadowNova + Cards.Prismatic,
            count:3
          }
          ]
        },
        45: {
          cards:[{
            id:Cards.Faction4.General + Cards.Prismatic,
            count:1
          }
          ]
        },
        49: {
          cards:[{
            id:Cards.Faction4.AltGeneral + Cards.Prismatic,
            count:1
          }
          ]
        },
        51: {
          cards:[{
            id:Cards.Faction4.ThirdGeneral + Cards.Prismatic,
            count:1
          }
          ]
        }
      },
      5: { // Magmar
        1: {
          cards:[{
            id:Cards.Spell.DampeningWave,
            count:3
          }
          ]
        },
        3: {
          cards:[{
            id:Cards.Faction5.PrimordialGazer,
            count:3
          }
          ]
        },
        6: {
          cards:[{
            id:Cards.Spell.DanceOfDreams,
            count:3
          }
          ]
        },
        9: {
          cards:[{
            id:Cards.Spell.PlasmaStorm,
            count:3
          }
          ]
        },
        10: {
          cards:[{
            id:Cards.Faction5.AltGeneral,
            count:1
          }
          ]
        },
        13: {
          cards:[{
            id:Cards.Faction5.Phalanxar + Cards.Prismatic,
            count:3
          }
          ]
        },
        15: {
          cards:[{
            id:Cards.Spell.GreaterFortitude + Cards.Prismatic,
            count:3
          }
          ]
        },
        17: {
          cards:[{
            id:Cards.Neutral.PiercingMantis + Cards.Prismatic,
            count:3
          }
          ]
        },
        19: {
          cards:[{
            id:Cards.Artifact.AdamantineClaws + Cards.Prismatic,
            count:3
          }
          ]
        },
        21: {
          cards:[{
            id:Cards.Faction5.EarthWalker + Cards.Prismatic,
            count:3
          }
          ]
        },
        23: {
          cards:[{
            id:Cards.Neutral.DragoneboneGolem + Cards.Prismatic,
            count:3
          }
          ]
        },
        25: {
          cards:[{
            id:Cards.Spell.NaturalSelection + Cards.Prismatic,
            count:3
          }
          ]
        },
        27: {
          cards:[{
            id:Cards.Spell.DampeningWave + Cards.Prismatic,
            count:3
          }
          ]
        },
        30: {
          cards:[{
            id:Cards.Neutral.Bloodletter + Cards.Prismatic,
            count:3
          }
          ]
        },
        33: {
          cards:[{
            id:Cards.Faction5.PrimordialGazer + Cards.Prismatic,
            count:3
          }
          ]
        },
        36: {
          cards:[{
            id:Cards.Spell.DanceOfDreams + Cards.Prismatic,
            count:3
          }
          ]
        },
        39: {
          cards:[{
            id:Cards.Neutral.PrimusShieldmaster + Cards.Prismatic,
            count:3
          }
          ]
        },
        42: {
          cards:[{
            id:Cards.Spell.PlasmaStorm + Cards.Prismatic,
            count:3
          }
          ]
        },
        45: {
          cards:[{
            id:Cards.Faction5.General + Cards.Prismatic,
            count:1
          }
          ]
        },
        49: {
          cards:[{
            id:Cards.Faction5.AltGeneral + Cards.Prismatic,
            count:1
          }
          ]
        },
        51: {
          cards:[{
            id:Cards.Faction5.ThirdGeneral + Cards.Prismatic,
            count:1
          }
          ]
        }
      },
      6: { // Vanar
        1: {
          cards:[{
            id:Cards.Spell.AspectOfTheWolf,
            count:3
          }
          ]
        },
        3: {
          cards:[{
            id:Cards.Faction6.FenrirWarmaster,
            count:3
          }
          ]
        },
        6: {
          cards:[{
            id:Cards.Spell.ChromaticCold,
            count:3
          }
          ]
        },
        9: {
          cards:[{
            id:Cards.Spell.Avalanche,
            count:3
          }
          ]
        },
        10: {
          cards:[{
            id:Cards.Faction6.AltGeneral,
            count:1
          }
          ]
        },
        13: {
          cards:[{
            id:Cards.Faction6.CrystalCloaker + Cards.Prismatic,
            count:3
          }
          ]
        },
        15: {
          cards:[{
            id:Cards.Spell.PermafrostShield + Cards.Prismatic,
            count:3
          }
          ]
        },
        17: {
          cards:[{
            id:Cards.Neutral.KomodoCharger + Cards.Prismatic,
            count:3
          }
          ]
        },
        19: {
          cards:[{
            id:Cards.Artifact.Snowpiercer + Cards.Prismatic,
            count:3
          }
          ]
        },
        21: {
          cards:[{
            id:Cards.Faction6.ArcticDisplacer + Cards.Prismatic,
            count:3
          }
          ]
        },
        23: {
          cards:[{
            id:Cards.Neutral.HailstoneGolem + Cards.Prismatic,
            count:3
          }
          ]
        },
        25: {
          cards:[{
            id:Cards.Spell.FlashFreeze + Cards.Prismatic,
            count:3
          }
          ]
        },
        27: {
          cards:[{
            id:Cards.Spell.AspectOfTheWolf + Cards.Prismatic,
            count:3
          }
          ]
        },
        30: {
          cards:[{
            id:Cards.Neutral.PutridMindflayer + Cards.Prismatic,
            count:3
          }
          ]
        },
        33: {
          cards:[{
            id:Cards.Faction6.FenrirWarmaster + Cards.Prismatic,
            count:3
          }
          ]
        },
        36: {
          cards:[{
            id:Cards.Spell.ChromaticCold + Cards.Prismatic,
            count:3
          }
          ]
        },
        39: {
          cards:[{
            id:Cards.Neutral.EphemeralShroud + Cards.Prismatic,
            count:3
          }
          ]
        },
        42: {
          cards:[{
            id:Cards.Spell.Avalanche + Cards.Prismatic,
            count:3
          }
          ]
        },
        45: {
          cards:[{
            id:Cards.Faction6.General + Cards.Prismatic,
            count:1
          }
          ]
        },
        49: {
          cards:[{
            id:Cards.Faction6.AltGeneral + Cards.Prismatic,
            count:1
          }
          ]
        },
        51: {
          cards:[{
            id:Cards.Faction6.ThirdGeneral + Cards.Prismatic,
            count:1
          }
          ]
        }
      }
    };
  
    // endregion XP HELPERS
  
    // region CARD HELPERS
  
    this._unlockedCardsUpToLevel = {};
    this._unlockedNonPrismaticCardsUpToLevel = {};
    this._unlockedCardsUpToLevelByFaction = {};
    this._unlockedNonPrismaticCardsUpToLevelByFaction = {};
  
    this._levelRequiredByCardId = {};
  
    this._factionRequiredByCardId = {};
  }

  // region XP HELPERS

  static xpEarnedForGameOutcome(isWinner, prevFactionLevel) {
    if (isWinner) {
      if (this.winsBeforeLVLTenGiveFullLvlOfXp && (prevFactionLevel != null) && (prevFactionLevel < 10)) {
        return Math.max(this.deltaXPForLevel(prevFactionLevel+1),this.winXP);
      } else {
        return this.winXP;
      }
    } else {
      return this.lossXP;
    }
  }

  static levelForXP(xp_amount) {

    if ((xp_amount == null) || (xp_amount < this.levelXPTable[1])) {
      return 0;
    }

    let level_attained = 0;

    for (var level in this.levelXPTable) {
      var xp_required = this.levelXPTable[level];
      xp_required = parseInt(xp_required);
      if (xp_amount < xp_required) {
        break;
      } else {
        level_attained = parseInt(level);
      }
    }

    return level_attained;
  }

  static deltaXPForLevel(level) {

    level = parseInt(level);

    const xp_prev = this.levelXPTable[level-1] || 0;
    const xp_next = this.levelXPTable[level];

    return xp_next - xp_prev;
  }

  static totalXPForLevel(level) {
    return this.levelXPTable[level];
  }

  static hasLeveledUp(xp,xp_earned) {
    const level_before = this.levelForXP(xp-xp_earned);
    const level_after = this.levelForXP(xp);
    return level_after > level_before;
  }

  static rewardDataForLevel(factionId,level) {
    return (this.levelRewardsTable[factionId] != null ? this.levelRewardsTable[factionId][level] : undefined);
  }
  static unlockedCardsUpToLevel(level, factionId, excludePrismatics) {
    if ((level != null) && (level > 0)) {
      if (excludePrismatics) {
        if (factionId != null) {
          return this._unlockedNonPrismaticCardsUpToLevelByFaction[factionId][level];
        } else {
          return this._unlockedNonPrismaticCardsUpToLevel[level];
        }
      } else if (factionId != null) {
        return this._unlockedCardsUpToLevelByFaction[factionId][level];
      } else {
        return this._unlockedCardsUpToLevel[level];
      }
    }
    return [];
  }

  static unlockedCardsUpToXP(xp, factionId) {
    const level = this.levelForXP(xp);
    return this.unlockedCardsUpToLevel(level, factionId);
  }
  static levelRequiredForCard(cardId) {
    return this._levelRequiredByCardId[cardId] || 0;
  }
  static factionRequiredForCard(cardId) {
    return this._factionRequiredByCardId[cardId];
  }
}
FactionProgression.initClass();

  // endregion CARD HELPERS

// cache table lookups
const factionIds = Object.keys(FactionProgression.levelRewardsTable);
for (factionId of Array.from(factionIds)) {
  var asc, end;
  factionId = parseInt(factionId);
  var cardsUpToLevelForFaction = (FactionProgression._unlockedCardsUpToLevelByFaction[factionId] = {});
  var nonPrismaticCardsUpToLevelForFaction = (FactionProgression._unlockedNonPrismaticCardsUpToLevelByFaction[factionId] = {});
  cardsUpToLevel = [];
  nonPrismaticCardsUpToLevel = [];

  for (i = 0, end = FactionProgression.maxLevel, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    reward = FactionProgression.rewardDataForLevel(factionId, i);

    // cards
    if (reward != null ? reward.cards : undefined) {
      for (card of Array.from((reward != null ? reward.cards : undefined))) {
        cardId = parseInt(card.id);
        cardsUpToLevel.push(cardId);
        FactionProgression._levelRequiredByCardId[cardId] = i;
        FactionProgression._factionRequiredByCardId[cardId] = factionId;
        if (!Cards.getIsPrismaticCardId(cardId)) {
          nonPrismaticCardsUpToLevel.push(cardId);
        }
      }
    }
    cardsUpToLevelForFaction[i] = cardsUpToLevel.slice(0);
    nonPrismaticCardsUpToLevelForFaction[i] = nonPrismaticCardsUpToLevel.slice(0);
  }
}

cardsUpToLevel = [];
nonPrismaticCardsUpToLevel = [];
for (i = 0, end1 = FactionProgression.maxLevel, asc1 = 0 <= end1; asc1 ? i <= end1 : i >= end1; asc1 ? i++ : i--) {
  for (factionId of Array.from(factionIds)) {
    factionId = parseInt(factionId);
    reward = FactionProgression.rewardDataForLevel(factionId, i);

    // cards
    if (reward != null ? reward.cards : undefined) {
      for (card of Array.from((reward != null ? reward.cards : undefined))) {
        cardId = parseInt(card.id);
        cardsUpToLevel.push(cardId);
        if (!Cards.getIsPrismaticCardId(cardId)) {
          nonPrismaticCardsUpToLevel.push(cardId);
        }
      }
    }
  }

  FactionProgression._unlockedCardsUpToLevel[i] = cardsUpToLevel.slice(0);
  FactionProgression._unlockedNonPrismaticCardsUpToLevel[i] = nonPrismaticCardsUpToLevel.slice(0);
}

module.exports = FactionProgression;
