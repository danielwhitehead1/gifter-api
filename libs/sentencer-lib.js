var Sentencer = require('sentencer');

export function createSentencer(result, paramGender) {
  const maleFemale = Object.freeze({'male': 1, 'female': 1});
  result.nouns.push("");
  result.adjectives.push("");

  console.log(result);

  Sentencer.configure({
    nounList: result.nouns,
    adjectiveList: result.adjectives,
    actions: {
      gift: function() {
        let giftWords = ['gift', 'present', ''];
        return giftWords[Math.floor(Math.random() * 3)]
      },
      gender: function() {
        let gender = maleFemale[paramGender] ? paramGender : '';
        return Math.floor(Math.random() * 3) < 1 ? gender : '';
      },
      rest: function() {
        let rest = result.rest;
        let restWord = rest[Math.floor(Math.random() * rest.length)]; 
        if(restWord) {
          return rest[Math.floor(Math.random() * rest.length)];
        } else {
          return '';
        }
      },
      adverb: function() {
        let adverbs = result.adverbs;
        let adverb = adverbs[Math.floor(Math.random() * adverbs.length)];
        if(adverb) {
          return adverb;
        } else {
          return '';
        }
      }
    }
  });
  return(Sentencer);
}