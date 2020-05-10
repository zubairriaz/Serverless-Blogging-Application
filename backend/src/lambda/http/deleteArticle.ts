import 'source-map-support/register'
import {deleteArticle} from "../../busineesLogic/articles";

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
try {
  if (!(await deleteArticle(event))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    };
  }
} catch (error) {
  return {
    statusCode: 404,
    body: JSON.stringify({
      error:error
    })
  };
}



  // TODO: Remove a TODO item by id
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  };
  }

