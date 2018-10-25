import * as dynamoDb from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "users",
    Key : {
      userId: event.requestContext.identity.cognitoIdentityId
    },
    UpdateExpression: "SET #userName = :name",
    ExpressionAttributeValues: {
      ":name": data.name ? data.name : null
    },
    ExpressionAttributeNames: {
      "#userName": "name"
    },
    ReturnValues: "ALL_NEW"
  }

  try {
    const result = await dynamoDb.call("update", params);
    callback(null, success({status: true}));
  } catch(e) {
    console.log(e);
    callback(null, failure({status: false}));
  }
}