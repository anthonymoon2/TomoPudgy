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
    required: true,
  },
  Height: {
    type: String,
    required: true,
  },
  Gender: {
    type: Boolean,
    required: true,
  },
  Age: {
    type: Number,
    required: true,
  },
  RecommendedCalorieCalculation: {
    type: Number,
    required: true,
  },
  DailyCaloricIntake: {
    type: Number,
    required: true,
  },
});

const UserInfo = model<IUserInfo>('UserInfo', UserInfoSchema);
export default UserInfo; 
