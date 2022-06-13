import * as yup from "yup";
import { User } from "../entities/User";

const schema = yup.object().shape({
    email: yup.string().required()
});

export class UserRequest {
    private request: User;

    constructor(req: User) {
        this.request = req;
    }

    createValidate = async () => {
        await schema.validate(this.request, { abortEarly: false });
    }

    updateValidate = async () => {
        await schema.validate(this.request, { abortEarly: false });
    }
}