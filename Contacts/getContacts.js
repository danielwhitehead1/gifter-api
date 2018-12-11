import mysqlPool from '../libs/createpool-lib';
import { failure, success } from '../libs/response-lib';
import { getUserName } from '../libs/getUserName-lib';

var pool = mysqlPool;

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  let cognitoId= getUserName(event);

  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query(
      `
        SELECT id, firstname, surname
        FROM contacts 
        WHERE userCognitoId = ?
        ORDER BY firstname ASC
      `
      , cognitoId, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(null, failure({state: false, error: "Failed to get contacts."}));
      }
      console.log(results);
      callback(null, success(results));
    })
  });
}