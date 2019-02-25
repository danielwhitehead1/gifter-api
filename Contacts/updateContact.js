import {getUserName} from '../libs/getUserName-lib';
import mysqlPool from '../libs/createpool-lib';
import {failure, success} from '../libs/response-lib';

var pool = mysqlPool

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const userSub = getUserName(event);
  const body = JSON.parse(event.body);
  let tags = body.keywords;
  let contact = body.contact;
  contact.userCognitoId = userSub;
  contact.updatedAt = Date.now();

  pool.getConnection(function(err, connection) {
    if (err) console.log(err);

    connection.query(
      `
        UPDATE contacts SET ?
        WHERE id=${contact.id} AND userCognitoId="${contact.userCognitoId}"
      `, contact,
      function(error, results) {
        if (error) {
          console.log(error);
          callback(null, failure({
            status: false,
            error: "Contact not updated."
          }));
        }
        connection.query(
          `
            DELETE FROM tags WHERE contactId=${contact.id} AND userCognitoId="${userSub}";
          `,
          function(error, results) {
            if (error) {
              console.log(error);
              callback(null, failure({
                status: false,
                error: "Tags not deleted."
              }));
            }
            let values = [];
            tags.map(function(tag) {
              return (values.push([userSub, contact.id, tag, contact.updatedAt]))
            });
            if(tags.length > 0) {
              connection.query(
                `
                  INSERT INTO tags (userCognitoId, contactId, tag, createdAt)
                  VALUES ?
                `, [values],
                function(error, results) {
                  if (error) {
                    console.log(error);
                    callback(null, failure({
                      status: false,
                      error: "Tags not created."
                    }));
                  }
                  connection.release();
                  callback(null, success({
                    status: true
                  }));
                });
            } else { 
              connection.release();
              callback(null, success({
                status: true
              }));
            }
          });
      });
  });
}