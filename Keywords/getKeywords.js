const WordPOS = require('wordpos');
var Sentencer = require('sentencer');
import { failure, success } from '../libs/response-lib';

export function main(event, context, callback) {
  let params = event.queryStringParameters;

  var wordpos = new WordPOS();
  const maleFemale = Object.freeze({'male': 1, 'female': 1});

  wordpos.getPOS(params.keywords, function(result) {
    let wordCount = 0;
    const AVERAGE_LENGTH = 3;
    result.nouns.push("");
    result.adjectives.push("");
    console.log(result);
    Sentencer.configure({
      nounList: result.nouns,
      adjectiveList: result.adjectives,
      // verbList: result.verbs, not included in result, might not be useful for this
      actions: {
        gift: function() {
          let giftWords = ['gift', 'present', ''];
          return giftWords[Math.floor(Math.random() * 3)]
        },
        gender: function() {
          let gender = maleFemale[params.gender] ? params.gender + ' ' : '';
          return Math.floor(Math.random() * 3) < 1 ? gender : '';
        }
      }
    });

    let sentence = "";
    while(!/\S/.test(sentence)) {
      sentence = Sentencer.make("{{gender}}{{ adjective }} {{ noun }} {{ gift }}");
    }

    callback(null, success(sentence));
  });  
}