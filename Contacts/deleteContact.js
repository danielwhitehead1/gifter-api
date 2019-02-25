import {getUserName} from '../libs/getUserName-lib';
import mysqlPool from '../libs/createpool-lib';
import { failure, success} from '../libs/response-lib';

var pool = mysqlPool

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const userSub = getUserName(event);
  const body = JSON.parse(event.body)

  pool.getConnection(function(err, connection) {
    if (err) console.log(err);

    connection.query(
      `
        DELETE FROM contacts
        WHERE id=${body.id} AND userCognitoId="${userSub}"
      `, body,
      function(error, results, fields) {
        if (error) {
          console.log(error);
          callback(null, failure({
            status: false,
            error: "Contact not deleted."
          }));
        }
        connection.query(
          `
          DELETE FROM tags WHERE contactId=${body.id} AND userCognitoId="${userSub}";
          `,
          function(error, results) {
            if (error) {
              console.log(error);
              callback(null, failure({
                status: false,
                error: "Tags not deleted."
              }));
            }
            connection.query(
              `
              DELETE FROM suggestions WHERE contactId=${body.id} AND userCognitoId="${userSub}";
              `,
              function(error, results) {
                if (error) {
                  console.log(error);
                  callback(null, failure({
                    status: false,
                    error: "Suggestions not deleted."
                  }));
                }
                connection.query(
                  `
                  DELETE FROM ratings WHERE contactId=${body.id} AND userCognitoId="${userSub}";
                  `,
                  function(error, results) {
                    if (error) {
                      console.log(error);
                      callback(null, failure({
                        status: false,
                        error: "Ratings not deleted."
                      }));
                    }
                    connection.query(
                      `
                      UPDATE events SET contactId=0 WHERE contactId=${body.id} AND userCognitoId="${userSub}"
                      `, 
                      function(error, results) {
                        if(error) {
                          console.log(error);
                          callback(null, failure({
                            statuse: false,
                            error: 'Event contact not deleted.'
                          }))
                        }
                        connection.release();
                        callback(null, success({
                          status: true
                        }));
                      });
                  });
              });
          });
      });
  });
}