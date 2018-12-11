import { getUserName } from '../libs/getUserName-lib';
import { success, failure } from "../libs/response-lib";
import mysqlPool from '../libs/createpool-lib';

var pool  = mysqlPool

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  let cognitoId = getUserName(event);

  pool.getConnection(function(err, connection) {
    if (err) console.log(err);
  
    connection.query('SELECT firstname, surname, email FROM users WHERE cognitoId= ?', cognitoId, function (error, results, fields) {
      connection.release();
  
      if (error) {
        console.log(error);
        callback(null, failure({ status: false, error: "Item not found." })); 
      }
      callback(null, success(results[0]));
    });
  });
}