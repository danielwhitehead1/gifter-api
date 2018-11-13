import { getUserName } from './libs/getUserName-lib';
import mysqlPool from './libs/createpool-lib';
import { failure, success } from './libs/response-lib';

var pool = mysqlPool

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const userSub = getUserName(event);
  const body = JSON.parse(event.body)
  const userEvent = {
    userCognitoId: userSub,
    startTime: body.startTime,
    endTime: body.endTime,
    date: body.date,
    type: event.body.type,
    contact: body.contact,
    info: body.info,
    createdAt: Date.now()
  };

  pool.getConnection(function(err, connection) {
    if(err) console.log(err);

    connection.query("INSERT INTO events SET ?", userEvent, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(null, failure({status: false, error: "Event not created."}));
      }
      callback(null, success({status: true}));
    });
  });
}