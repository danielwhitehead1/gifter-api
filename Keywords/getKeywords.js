const WordPOS = require('wordpos');
var Sentencer = require('sentencer');
import { failure, success } from '../libs/response-lib';

export function main(event, context, callback) {
  let params = event.queryStringParameters;

  var wordpos = new WordPOS();

  wordpos.getPOS(params.keywords, function(result) {
    result.nouns.push(" ");
    result.adjectives.push(" ");
    Sentencer.configure({
      nounList: result.nouns,
      adjectiveList: result.adjectives,
      // verbList: result.verbs, not included in result, might not be useful for this
      actions: {
        gift: function() {
          let giftWords = ['gift', 'present', ''];
          return giftWords[Math.floor(Math.random() * 3)]
        }
      }
    });

    let sentence = "";
    while(!/\S/.test(sentence)) {
      sentence = Sentencer.make("{{ adjective }} {{ noun }} {{ gift }}");
    }

    callback(null, success(sentence));
  });  
}