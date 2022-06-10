import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 } from "uuid";
import * as yup from "yup";

const docClient = new AWS.DynamoDB.DocumentClient({"region": "ap-southeast-1"});
const tableName = "users";
const headers = {
  "content-type": "application/json",
};

const saltRounds = 16;

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
});

export const createUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const bcrypt = require('bcrypt');
    const reqBody = JSON.parse(event.body as string);
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(reqBody.password, salt);
    await schema.validate(reqBody, { abortEarly: false });
    
    const user = {
      email: reqBody.email,
      password: hash,
      uuid: v4(),
      created_at: String(new Date()),
    };

    await docClient
      .put({
        TableName: tableName,
        Item: user,
      })
      .promise();
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(user),
    };
  } catch (e) {
    return handleError(e);
  }
};

class HttpError extends Error {
  constructor(public statusCode: number, body: Record<string, unknown> = {}) {
    super(JSON.stringify(body));
  }
}


const fetchUserById = async (id: string) => {
  const output = await docClient
    .get({
      TableName: tableName,
      Key: {
        uuid: id,
        created_at: "Fri Jun 10 2022 14:52:03 GMT+0700 (Indochina Time)"
      },
    })
    .promise();

  if (!output.Item) {
    throw new HttpError(404, { error: "not found" });
  }

  output.Item.password = ''

  return output.Item;
};

const handleError = (e: unknown) => {
  if (e instanceof yup.ValidationError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        errors: e.errors,
      }),
    };
  }

  if (e instanceof SyntaxError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `invalid request body format : "${e.message}"` }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: e.statusCode,
      headers,
      body: e.message,
    };
  }

  throw e;
};

export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const user = await fetchUserById(event.pathParameters?.id as string);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(user),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    await fetchUserById(id);

    const reqBody = JSON.parse(event.body as string);

    await schema.validate(reqBody, { abortEarly: false });

    const user = {
      ...reqBody,
      uuid: id,
    };

    await docClient
      .put({
        TableName: tableName,
        Item: user,
      })
      .promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(user),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    await fetchUserById(id);

    await docClient
      .delete({
        TableName: tableName,
        Key: {
          uuid: id,
        },
      })
      .promise();

    return {
      statusCode: 204,
      body: "",
    };
  } catch (e) {
    return handleError(e);
  }
};

export const listUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const output = await docClient
    .scan({
      TableName: tableName,
    })
    .promise();

  output.Items?.forEach(element => element.password = '')

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(output.Items),
  };
};
