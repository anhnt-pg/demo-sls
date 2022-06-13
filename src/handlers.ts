import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ResponseStruct} from "./response/UserRespose"
import {UserRequest} from './requests/UserRequest';

import UserService from './services/UserService';
const userService = new UserService();

export const createUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const reqBody = JSON.parse(event.body as string);
      const userRequest = new UserRequest(reqBody)
      await userRequest.createValidate();
      await userService.create(reqBody);
      return ResponseStruct.success(reqBody)
    } catch (error) {
      return ResponseStruct.error("Validate fail")
    }
};


const fetchUserById = async (id: string) => {
  try {
    const result = await userService.find(id);
    if(typeof result.email !== 'undefined'){
      result.password = "";
      return ResponseStruct.success(result)
    }
    return ResponseStruct.error("Not found")
  } catch (error) {
    return ResponseStruct.error("Server error")
  }
};


export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return fetchUserById(event.pathParameters?.id as string);
};

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;
    const reqBody = JSON.parse(event.body as string);
    await userService.update(reqBody,id);
    return ResponseStruct.success(reqBody)
  } catch (error) {
    return ResponseStruct.error("Server error")
  }

};

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;
    await userService.delete(id);
    const user = {
        uuid: id,
        email: "",
        password: ""
    }
    return ResponseStruct.success(user)
  } catch (error) {
    return ResponseStruct.error("Server error")
  }
};

export const listUser = async (): Promise<APIGatewayProxyResult> => {
  try {
    const result = await userService.list();
    return ResponseStruct.successList(result)
  } catch (error) {
    return ResponseStruct.error("Server error")
  }
};
