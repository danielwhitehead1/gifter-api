import * as dynamoDbLib from "./libs/dynamodb-lib";

export async function main(event, context, callback) {
  const userAttributes = event.request.userAttributes;
  const params = {
    TableName: "users",
    Item: {
      userId: event.userName,
      firstname: userAttributes['custom:firstname'],
      surname: userAttributes['custom:surname'],
      email: userAttributes['email'],
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, event);
  } catch (e) {
    console.log(e);
    callback(null, {});
  }
}