import { getUserName } from './libs/getUserName-lib';
import mysqlPool from './libs/createpool-lib';
import { failure, success } from './libs/response-lib';

var pool = mysqlPool

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const userSub = getUserName(event);
  const body = JSON.parse(event.body)
  body.userCognitoId = userSub;
  body.createdAt = Date.now();

  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query("INSERT INTO contacts SET ?", body, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(null, failure({status: false, error: "Event not created."}));
      }
      callback(null, success({status: true}));
    });
  });
}