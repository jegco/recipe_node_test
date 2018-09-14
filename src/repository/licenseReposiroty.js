"use- strict";

module.exports = {
  getLicenses: (user, numberOfCards, indexToStart) => {
   const cards = require(`../data/cards/${user.username}.json`);

   const result = cards.slice(indexToStart, numberOfCards);
   console.log(result);
   return result;
  }
};
