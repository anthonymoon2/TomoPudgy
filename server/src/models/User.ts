import { Schema, model, type Document } from 'mongoose';

export interface IUser extends Document {
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

const userSchema = new Schema<IUser>({
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

const UserInfo = model<IUser>('User', userSchema);
export default UserInfo; 
