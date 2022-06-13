import * as yup from "yup";
const schema = yup.object().shape({
    email: yup.string().required()
});
export class UserRequest {
    private request : any;
    constructor(req : any) {
        this.request = req;
    }

    createValidate = async () => {
        await schema.validate(this.request, { abortEarly: false });
    }

    updateValidate = async () => {
        await schema.validate(this.request, { abortEarly: false });
    }
}