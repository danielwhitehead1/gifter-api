const WordPOS = require('wordpos');

import { createSentencer } from './../libs/sentencer-lib';
import { allocateSource, createKeywords } from './../libs/suggestionEngine';
import { failure, success } from '../libs/response-lib';

export function main(event, context, callback) {
  let params = event.queryStringParameters;
  var wordpos = new WordPOS();

  wordpos.getPOS(params.keywords, function(result) {
    let source = allocateSource();
    let Sentencer = createSentencer(result, params.gender);
    let keywords = createKeywords(Sentencer, source.type);
    callback(null, success({keywords: keywords, source: source.source}));
  });  
}