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

import UserService from './services/UserService';
const userService = new UserService();

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
});

export const createUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const reqBody = JSON.parse(event.body as string);
    const result = await userService.create(reqBody);
    return result;
};


const fetchUserById = async (id: string) => {
  const result = await userService.find(id);
  return result;
};


export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return await fetchUserById(event.pathParameters?.id as string);
};

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const id = event.pathParameters?.id as string;
  const reqBody = JSON.parse(event.body as string);

  const result = await userService.update(reqBody,id);
  return result;

};

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters?.id as string;
    const result = await userService.delete(id);
    return result;
};

export const listUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const result = await userService.list();
  return result;
};
