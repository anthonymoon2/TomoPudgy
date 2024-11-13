import { Schema, model, type Document } from 'mongoose';

export interface IUserLogin extends Document {
  username: string;
  password: string;
}

const UserLoginSchema = new Schema<IUserLogin>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserLogin = model('UserLogin', UserLoginSchema);

export default UserLogin;
