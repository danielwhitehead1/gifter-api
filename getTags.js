import mysqlPool from './libs/createpool-lib';
import { failure, success } from './libs/response-lib';
import { getUserName } from './libs/getUserName-lib';

var pool = mysqlPool;

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const cognitoId= getUserName(event);
  const params = event.queryStringParameters;

  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query(
      `
        SELECT tag
        FROM tags 
        WHERE userCognitoId = "${cognitoId}" AND contactId=${params.contactId}
      `
      , function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(null, failure({state: false, error: "Failed to get tags."}));
      }
      console.log(results);
      callback(null, success(results));
    })
  });
}