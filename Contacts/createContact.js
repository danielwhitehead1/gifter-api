import { getUserName } from '../libs/getUserName-lib';
import mysqlPool from '../libs/createpool-lib';
import { failure, success } from '../libs/response-lib';

var pool = mysqlPool

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const userSub = getUserName(event);
  const body = JSON.parse(event.body);
  let contact = body.contact;
  let tags = body.keywords;
  contact.userCognitoId = userSub;
  contact.createdAt = Date.now();

  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query("INSERT INTO contacts SET ?", contact, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(null, failure({status: false, error: "Contact not created."}));
      }
      let values = [];
      tags.map(function(tag) {
        return(values.push([userSub, results.insertId, tag, contact.createdAt]))
      });
      connection.query('INSERT INTO ratings SET ?', { userCognitoId: userSub, contactId: results.insertId },
        function(error, results, fields) {
          if(error) console.log(error);

          if(tags.length > 0) {
            connection.query(
              `
                INSERT INTO tags (userCognitoId, contactId, tag, createdAt)
                VALUES ?
              `
              , [values], function(error, results, fields) {
                if(error) {
                  console.log(error);
                  callback(null, failure({status: false, error: "Contact tags not created."}));
                }
                connection.release();
                callback(null, success({status: true}));
            });
          } else {
            connection.release();
            callback(null, success({status: true}));
          }
      });
    });
  });
}