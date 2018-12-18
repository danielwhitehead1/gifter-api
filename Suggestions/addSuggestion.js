import mysqlPool from '../libs/createpool-lib';
import { failure, success } from '../libs/response-lib';
import { getUserName } from '../libs/getUserName-lib';

var pool = mysqlPool;

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const body = JSON.parse(event.body)
  body.userCognitoId = getUserName(event);
  body.createdAt = Date.now();

  console.log(body);

  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query(`INSERT INTO suggestions SET ?`
      , body, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(null, failure({state: false, error: "Failed to add suggestion."}));
      }
      callback(null, success({status: true}));
    })
  });
}