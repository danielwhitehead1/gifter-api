import mysqlPool from '../libs/createpool-lib';

var pool  = mysqlPool

export function main(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  const userAttributes = event.request.userAttributes;
  var user = {
    cognitoId: event.userName,
    firstname: userAttributes['custom:firstname'],
    surname: userAttributes['custom:surname'],
    email: userAttributes['email'],
    createdAt: Date.now()
  }

  pool.getConnection(function(err, connection) {
    if (err) console.log(err);
  
    connection.query('INSERT INTO users SET ?', user, function (error, results, fields) {
      connection.release();
  
      if (error) {
        console.log(error);
        callback(null, {}); 
      }
      callback(null, event);
    });
  });
}