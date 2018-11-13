import { success, failure } from "./libs/response-lib";
import mysqlPool from "./libs/createpool-lib";
import { getUserName } from "./libs/getUserName-lib";

var pool = mysqlPool;

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  let cognitoId = getUserName(event);
  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query("DELETE FROM users WHERE cognitoId= ?", cognitoId, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(null, failure({status: false, error: "User not deleted"}))
      }
      callback(null, success({state: true}))
    });
  })
}