import { APIGatewayProxyHandler } from "aws-lambda";
import { connection } from "src/utils/dynamodb";
import { formatDate } from "src/utils/formatDate";
import { v4 as uuid, validate  } from 'uuid';

export const handle:APIGatewayProxyHandler = async (event) => {
  const errors = [];
  const { user_id } = event.pathParameters
  const {
	  title,
	  deadline,
  } = JSON.parse(event.body);

  // Validações
  const deadlineDate = new Date(deadline);
  if(!deadlineDate.valueOf()) {
    errors.push('Invalid deadline format');
  }

  const isValidId = validate(user_id)
  if(!isValidId) {
    errors.push('Invalid uuid');
  }

  if(errors.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: errors.join(`, `)
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
  // 
  const id = uuid();
  const formattedDeadline = formatDate(deadlineDate);

  await connection.put({
    TableName: 'todos',
    Item: {
      id,
      user_id,
      title,
      done: false,
      deadline: formattedDeadline,
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      id,
      user_id,
      title,
      done: false,
      deadline: formattedDeadline,
    }),
    headers:{
      'Content-Type': 'application/json'
    }
  }
}