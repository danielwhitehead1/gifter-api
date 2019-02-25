import mysqlPool from '../libs/createpool-lib';
import { failure, success } from '../libs/response-lib';
import { getUserName } from '../libs/getUserName-lib';

var pool = mysqlPool;

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const body = JSON.parse(event.body);
  let rating = body.rating;
  let contactId = body.contact.id;
  let itemId = body.item.id;
  let userCognitoId = getUserName(event);

  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query(`UPDATE ratings SET ? WHERE userCognitoId="${userCognitoId}" AND contactId=${contactId}`
      , rating, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(null, failure({state: false, error: "Failed to update ratings."}));
      }
      connection.query(`UPDATE suggestions SET rated=1 WHERE userCognitoId="${userCognitoId}" AND contactId=${contactId} and itemId=${itemId}`,
        function(error, results, fields) {
          if(error) {
            console.log(error);
            callback(null, failure({state: false, error: "Failed to update suggestion."}));
          }
          connection.release();
          callback(null, success({status: true}));
        })
    })
  });
}