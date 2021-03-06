import { getUserName } from '../libs/getUserName-lib';
import mysqlPool from '../libs/createpool-lib';
import { failure, success } from '../libs/response-lib';

var pool = mysqlPool

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const userSub = getUserName(event);
  const body = JSON.parse(event.body)

  pool.getConnection(function(err, connection) {
    if(err) console.log(err);
    connection.query(
      `
        DELETE FROM suggestions 
        WHERE itemId="${body.itemId}" AND userCognitoId="${userSub}" AND contactId=${body.contactId} AND seller="${body.seller}"
      `
      , body, function(error, results, fields) {
      if(error) {
        console.log(error);
        connection.release();
        callback(null, failure({status: false, error: "Suggestion not deleted."}));
      }
      connection.release();
      callback(null, success({status: true}));
    });
  });
}