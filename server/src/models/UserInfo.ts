import { Schema, model, type Document } from 'mongoose';

export interface IUserInfo extends Document {
  _id: String;
  username: string;
  password: string;
  weight: number;
  height: string;
  gender: boolean;
  age: number;
  recommendedCalorieCalculation: number;
  dailyCaloricIntake: number;
}

const UserInfoSchema = new Schema<IUserInfo>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
  },
  height: {
    type: String,
  },
  gender: {
    type: Boolean,
  },
  age: {
    type: Number,
  },
  recommendedCalorieCalculation: {
    type: Number,
  },
  dailyCaloricIntake: {
    type: Number,
  },
});

const UserInfo = model<IUserInfo>('UserInfo', UserInfoSchema);
export default UserInfo; 
