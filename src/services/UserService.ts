import {v4} from "uuid";
import {UserRequest} from '../requests/UserRequest';
import {User} from "../entities/User"
import * as Repo from "../repositories/UserRepository"
import {BodyResponse, ResponseStruct} from "../response/UserRespose"
import {HttpResponseCode} from "../common/httpResponseCode"

const saltRounds = 16;
const UserRepo = new Repo.UserRepo();
const headers = {
  "content-type": "application/json",
};

export default class UserService {
    async create(data: any) :Promise<any>{
        try {
            const bcrypt = require('bcrypt');
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(data.password, salt);

            const userRequest = new UserRequest(data)
            try {
                await userRequest.createValidate();
            } catch (err:any) {
                const errRes = new BodyResponse(HttpResponseCode.badRequest, HttpResponseCode.badRequest, "validation fail", err.errors);
                return errRes.toString();
            }
            
            const user = {
              email: data.email,
              password: hash,
              uuid: v4(),
            };

            let result = await UserRepo.create(user);
            if (result instanceof Error) {
                return ResponseStruct.error("Create fail")
            }
            return ResponseStruct.success(result.Item)
            
          } catch (e) {
            return ResponseStruct.error("Server error")
          }
    }

    async find(id:string) :Promise<any>{
       try {
        let result = await UserRepo.find(id);
        if(typeof result.email !== 'undefined'){
            result.password = "";
            return ResponseStruct.success(result)
        }else{
            return ResponseStruct.error("Not found")
        }
       } catch (error) {
            return ResponseStruct.error("Server error")
       }
    }

    async list() :Promise<any>{
        try{
            let result = await UserRepo.list();
            if (!result.Items){
                return ResponseStruct.error("Not found")
            }
            result.Items?.forEach((element:any) => element.password = '')
            return ResponseStruct.success(result.Items)
        }catch (e){
            return ResponseStruct.error("Server error")
        }
        
    }

    async update(data: any, id: string) :Promise<any>{
        try{
            const userRequest = new UserRequest(data)
            try {
                await userRequest.createValidate();
            } catch (err:any) {
                const errRes = new BodyResponse(HttpResponseCode.badRequest, HttpResponseCode.badRequest, "validation fail", err.errors);
                return errRes.toString();
            }
            let result = await UserRepo.update(data,id);
            return ResponseStruct.success(result.Item)
        }catch (e){
            return ResponseStruct.error("Server error")
        }
        
    }

    async delete(id: string) :Promise<any>{
        try{
            let currentUser = await UserRepo.find(id);
            if(typeof currentUser.email !== 'undefined'){
                currentUser.password = "";
                let result = await UserRepo.delete(id);
                return ResponseStruct.success(result.Item)
            }else{
                return ResponseStruct.error("Not found")
            }
        }catch (e){
            return ResponseStruct.error("Server error")
        }
        
    }
}
    



