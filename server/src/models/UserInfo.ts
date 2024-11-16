import { Schema, Types, model, type Document } from 'mongoose';

export interface IUserInfo extends Document {
  _id: String;
  username: string;
  password: string;
  weight: number;
  feet: number;
  inches: number;
  gender: boolean;
  age: number;
  recommendedCalorieCalculation: number;
  dailyCaloricIntake: number;
  currentCalories: number;
  foodItems: Types.ObjectId[];
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
  feet: {
    type: Number,
  },
  inches: {
    type: Number,

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
currentCalories: {
    type: Number,
  },
foodItems: [{
  type: Types.ObjectId,
  ref: 'FoodItem',
  }],
});

const UserInfo = model<IUserInfo>('UserInfo', UserInfoSchema);
export default UserInfo; 
