/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const CardFactory = require('app/sdk/cards/cardFactory');
const Factions = require('app/sdk/cards/factionsLookup');
const GameSession = require('app/sdk/gameSession');
const RarityLookup = require('app/sdk/cards/rarityLookup');
const CardSet = require('app/sdk/cards/cardSetLookup');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Logger = require('app/common/logger');
const _ = require('underscore');
const i18next = require('i18next');

class SisterAchievement extends Achievement {
  static initClass() {
    this.id = "swornSister";
    this.title = i18next.t("achievements.sworn_sister_title");
    this.description = i18next.t("achievements.sworn_sister_desc");
    this.progressRequired = 1;
    this.rewards = {
      cards: [
        Cards.Neutral.SwornSister,
        Cards.Neutral.SwornSister,
        Cards.Neutral.SwornSister
      ]
    };
  }


  static progressForCardCollection(cardCollection, allCards) {

    if ((cardCollection == null)) {
      return 0;
    }

    const sisterCount = (cardCollection[Cards.Neutral.SwornSister] != null ? cardCollection[Cards.Neutral.SwornSister].count : undefined) || 0;
    if (sisterCount >= 3) {
      return 0;
    }

    // check if player owns 3 or more of at least 6 rare cards for this faction
    const allFactionRares = _.filter(allCards,card => (card.getFactionId() === Factions.Neutral) &&
        (card.getRarityId() === RarityLookup.Rare) &&
        !card.getIsHiddenInCollection() &&
        card.getIsAvailable() &&
        !Cards.getIsPrismaticCardId(card.getId()) &&
        !Cards.getIsSkinnedCardId(card.getId()));

    let numRaresWith3xCopies = 0;
    const numCompletedRaresRequired = 6;
    for (var card of Array.from(allFactionRares)) {
      var baseCardId = card.getBaseCardId();
      var prismaticCardId = Cards.getPrismaticCardId(baseCardId);
      var cardCollectionBase = cardCollection[baseCardId];
      var cardCollectionPrismatic = cardCollection[prismaticCardId];
      if ((((cardCollectionBase != null ? cardCollectionBase.count : undefined) || 0) + ((cardCollectionPrismatic != null ? cardCollectionPrismatic.count : undefined) || 0)) >= 3) {
        numRaresWith3xCopies += 1;
        if (numRaresWith3xCopies >= 6) {
          return 1;
        }
      }
    }

    return 0;
  }
}
SisterAchievement.initClass();

module.exports = SisterAchievement;
