import { APIGatewayProxyHandler } from "aws-lambda";
import { connection } from "src/utils/dynamodb";
import { validate } from "uuid";

export const handle:APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  if(!validate(user_id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid uuid'
      })
    }
  }

  const todos = (await connection.scan({
    TableName: 'todos',
    FilterExpression: 'user_id = :userId',
    ExpressionAttributeValues: {
      ':userId': user_id
    },
    Limit: 5
  }).promise()).Items

  return {
    statusCode: 200,
    body: JSON.stringify(todos),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}