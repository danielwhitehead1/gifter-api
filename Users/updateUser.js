import { success, failure } from "../libs/response-lib";
import mysqlPool from "../libs/createpool-lib";
import { getUserName } from "../libs/getUserName-lib";

var pool = mysqlPool

export function main(event, context, callback) {
  const data = JSON.parse(event.body);
  let cognitoId = getUserName(event);
  
  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query("SOME SQL", function(error, results, fields) {
      if(error) {
        console.log(error);
        connection.release();
        callback(null, failure({status: false, error: "Update Failed."}));
      };
      connection.release();
      callback(null, success({status: true}));
    })
  })
}