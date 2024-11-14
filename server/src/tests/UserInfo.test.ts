import { UserInfo } from "../models/index.js";
describe("UserInfo", ()=>{
    it('should create and save a new user', async () => {
        const user = new UserInfo({
            username: 'John Doe',
            password: 'password123',
        });
        expect(user.username).toBe('John Doe');
        expect(user.password).toBe('password123');
    });
})

