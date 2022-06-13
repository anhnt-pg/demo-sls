import { User } from "../entities/User"
import AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient({"region": "ap-southeast-1"});
const tableName = "users";

export class UserRepo {
    async create(data: any) :Promise<any>{
        return docClient.put({
            TableName: tableName,
            Item: data,
            })
            .promise();
    }

    async find(id: string) :Promise<User>{
        const result = await docClient
        .get({
          TableName: tableName,
          Key: {
            uuid: id,
          },
        })
        .promise();
        return {
            uuid: result.Item?.uuid,
            email: result.Item?.email,
            password: result.Item?.password,
        }
    }

   async list() :Promise<any>{
    return docClient
        .scan({
            TableName: tableName,
        })
        .promise();
   }
   
   async update(data: any, id: string) :Promise<any>{
    let currentUser : User = await this.find(id);
    let password = currentUser.password
    if (data.password && data.password != ""){
        const bcrypt = require('bcrypt');
        const salt = bcrypt.genSaltSync(16);
        const hash = bcrypt.hashSync(data.password, salt);
        password = hash
    }
    
    return docClient
        .update({
            TableName: tableName,
            Key: {
                uuid : currentUser.uuid
            },
            UpdateExpression: `set #email = :email, #password = :password`,
            ExpressionAttributeNames: {
                "#email": "email",
                "#password": "password",
            },
            ExpressionAttributeValues: {
                ":email": data.email ? data.email : currentUser.email,
                ":password": data.password ? password : currentUser.password,
            },
            ReturnValues: "ALL_NEW"
            })
        .promise();
   }

   async delete(id: string) :Promise<any>{
    return docClient
        .delete({
            TableName: tableName,
            Key: {
                uuid: id,
            },
        })
        .promise();
   }

};