import { DynamoDB } from 'aws-sdk';

const options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000'
}

export const connection = new DynamoDB.DocumentClient(options);