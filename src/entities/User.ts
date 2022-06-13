export class User {
    private uuid: string
    private email: string;
    private password: string;

    constructor(uuid : string, name: string, password: string) {
        this.email = name;
        this.password = password;
        this.uuid = uuid;
    }
}
