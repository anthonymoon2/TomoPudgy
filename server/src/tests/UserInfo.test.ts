import { IUserInfo } from "../models/IUserInfo";

it('should create and save a new user', async () => {
    const user = new IUserInfo({
        username: 'John Doe',
        password: 'password123',
    });


    const savedUser = await user.save();
    expect(savedUser._id).
        expect(savedUser.username).toBe('John Doe');
    expect(savedUser.password).toBe('password123');
});
