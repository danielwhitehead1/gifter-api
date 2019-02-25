import sources from '../sources';
var randomNormal = require('random-normal');
const probabilitys = {
  noun: 0.5,
  rest: 0.5,
  adjective: 0.4,
  gender: 0.2,
  adverb: 0.1
};
const words = ['noun', 'rest', 'adjective', 'gender', 'adverb']

export function allocateSource() {
  let itemSources = sources.itemSources;
  return {source: itemSources[Math.floor(Math.random() * itemSources.length)], type: 'item'}
}

export function createKeywords(Sentencer, type) {
  let count = { noun: 0, rest: 0, adjective: 0, gender: 0, adverb: 0 }
  let length = Math.ceil(randomNormal({mean: 3.7, dev: 1.3}));
  while(length <= 0 ) { length += 1; }
  let sentence = "";
  let probability = 0;
  while(sentence.split(' ').length < length + 1) {
    for(let word of words) {
      if(sentence.split(' ').length >= length + 1) { break; }
      probability = probabilitys[word] * ( 1 / (count[word] + 1) );
      if(probability <= Math.random()) {
        let sentencerFormat = `{{ ${word} }}`;
        let keyword = Sentencer.make(sentencerFormat);
        if(keyword !== '' ) {
          sentence = sentence + ' ' + keyword; 
        }
        console.log(sentence);
        count[word] += 1;
      }
    }
  }
  return sentence
}