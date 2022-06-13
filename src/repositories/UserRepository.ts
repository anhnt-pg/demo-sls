import { User } from "../entities/User"
import AWS from "aws-sdk";
import * as Response from "../common/RepoResponse"
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(16);
const tableName = "users";

export class UserRepo {
    private docClient;

    constructor() {
        this.docClient = new AWS.DynamoDB.DocumentClient({ "region": "ap-southeast-1" });
    }

    async create(data: User): Promise<Response.PutItemOutput> {
        return this.docClient.put({
            TableName: tableName,
            Item: data,
        })
            .promise();
    }

    async find(id: string): Promise<User> {
        const result = await this.docClient
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

    async list(): Promise<Response.ScanOutput> {
        return this.docClient
            .scan({
                TableName: tableName,
            })
            .promise();
    }

    async update(data: User, id: string): Promise<Response.UpdateItemOutPut> {
        const currentUser: User = await this.find(id);
        const hash = bcrypt.hashSync(data.password, salt);
        return this.docClient
            .update({
                TableName: tableName,
                Key: {
                    uuid: currentUser.uuid
                },
                UpdateExpression: `set #email = :email, #password = :password`,
                ExpressionAttributeNames: {
                    "#email": "email",
                    "#password": "password",
                },
                ExpressionAttributeValues: {
                    ":email": data.email,
                    ":password": hash,
                },
                ReturnValues: "ALL_NEW"
            })
            .promise();
    }

    async delete(id: string): Promise<Response.DeleteItemOutput> {
        return this.docClient
            .delete({
                TableName: tableName,
                Key: {
                    uuid: id,
                },
            })
            .promise();
    }

}