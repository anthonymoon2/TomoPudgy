import { UserInfo } from "../models/UserInfo";

it('should create and save a new user', async () => {
    const user = new UserInfo({
        username: 'John Doe',
        password: 'password123',
    });
 const savedUser = await user.save();
    expect(savedUser._id)
    expect(savedUser.username).toBe('John Doe');
    expect(savedUser.password).toBe('password123');
});
