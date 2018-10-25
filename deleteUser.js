import * as dynamoDb from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const params = {
    TableName: "users",
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId
    }
  }

  try {
    const result = await dynamoDb.call("delete", params);
    callback(null, success({ status: true }));
  } catch(e) {
    console.log(e);
    callback(null, failure({status: false }));
  }
}