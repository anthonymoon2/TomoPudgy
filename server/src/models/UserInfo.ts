import { Schema, model, type Document } from 'mongoose';

export interface IUserInfo extends Document {
  _id: String;
  username: string;
  password: string;
  Weight: number;
  Height: string;
  Gender: boolean;
  Age: number;
  RecommendedCalorieCalculation: number;
  DailyCaloricIntake: number;
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
  Weight: {
    type: Number,
  },
  Height: {
    type: String,
  },
  Gender: {
    type: Boolean,
  },
  Age: {
    type: Number,
  },
  RecommendedCalorieCalculation: {
    type: Number,
  },
  DailyCaloricIntake: {
    type: Number,
  },
});

const UserInfo = model<IUserInfo>('UserInfo', UserInfoSchema);
export default UserInfo; 
