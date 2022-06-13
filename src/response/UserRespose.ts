import { HttpResponseCode } from "../common/HttpResponseCode";
import { User } from "../entities/User";

export class UserResponse {
    statusCode: number | undefined;
    body: string | undefined
}

export class BodyResponse<T> {
    private statusCode: number;
    private code: number;
    private message: string;
    private data: T

    constructor(statusCode: number, code: number, message: string, data: T) {
        this.statusCode = statusCode;
        this.code = code;
        this.message = message;
        this.data = data
    }

    toString() {
        return {
            statusCode: this.statusCode,
            body: JSON.stringify({
                code: this.code,
                message: this.message,
                data: this.data,
            }),
        }
    }
}

export class ResponseStruct {
    static success(data: User) {
        const result = new BodyResponse(HttpResponseCode.success, HttpResponseCode.success, 'success', data)
        return result.toString()
    }

    static error(message: string, code: number = HttpResponseCode.badRequest) {
        const result = new BodyResponse(HttpResponseCode.badRequest, code, message, null)
        return result.toString()
    }

    static successList(data: AWS.DynamoDB.DocumentClient.ScanOutput) {
        const result = new BodyResponse(HttpResponseCode.success, HttpResponseCode.success, 'success', data.Items)
        return result.toString()
    }
}