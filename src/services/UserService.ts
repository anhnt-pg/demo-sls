import {v4} from "uuid";
import {UserRequest} from '../requests/UserRequest';
import {User} from "../entities/User"
import * as Repo from "../repositories/UserRepository"
import {ResponseStruct} from "../response/UserRespose"
import bcrypt from 'bcrypt';

const saltRounds = 16;
const UserRepo = new Repo.UserRepo();
const salt = bcrypt.genSaltSync(saltRounds);

export default class UserService {
    async create(data: User) :Promise<User>{
            const hash = bcrypt.hashSync(data.password, salt);
            const user = {
              email: data.email,
              password: hash,
              uuid: v4(),
            };
            await UserRepo.create(user);
            user.password = ""
            return user
    }

    async find(id:string) :Promise<User>{
        return UserRepo.find(id);
    }

    async list() :Promise<object>{
        const result = await UserRepo.list();
        if (!result.Items){
            return ResponseStruct.error("Not found")
        }
        result.Items?.forEach(element => element.password = '')
        return result  
    }

    async update(data: User, id: string) :Promise<User>{
        const userRequest = new UserRequest(data)
        await userRequest.createValidate();
        await UserRepo.update(data,id);
        return data
    }

    async delete(id: string) :Promise<object>{
        try{
            const currentUser = await UserRepo.find(id);
            if(typeof currentUser.email !== 'undefined'){
                currentUser.password = "";
                await UserRepo.delete(id);
                return ResponseStruct.success(currentUser)
            }else{
                return ResponseStruct.error("Not found")
            }
        }catch (e){
            return ResponseStruct.error("Server error")
        }
        
    }
}
    



