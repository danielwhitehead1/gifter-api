import mysqlPool from '../libs/createpool-lib';
import { failure, success } from '../libs/response-lib';
import { getUserName } from '../libs/getUserName-lib';

var pool = mysqlPool;

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  let cognitoId = getUserName(event);

  pool.getConnection(function(err, connection) {
    console.log(connection);
    if(err) console.log(err);

    connection.query(
      `
        SELECT id, firstname, surname, gender
        FROM contacts 
        WHERE userCognitoId = "${cognitoId}"
        ORDER BY firstname ASC
      `
      , function(error, results, fields) {
        console.log(results);
      if(error) {
        console.log(error);
        callback(null, failure({state: false, error: "Failed to get contacts."}));
      }
      connection.release();
      callback(null, success(results));
    })
  });
}