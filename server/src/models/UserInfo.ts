import { Schema, Types, model, type Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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
  currentCalories: number;
  foodItems: Types.ObjectId[];
  isOverRecommendedCalories: boolean
  isCorrectPassword(password: string): Promise<boolean>;
  lastReset: Date;
  resetHistory: ICalorieAndFoodHistory[];
}

interface ICalorieAndFoodHistory {
  date: Date;
  calories: number;
  foodItems: string[];
}

const CalorieAndFoodHistorySchema = new Schema<ICalorieAndFoodHistory>({
  date: { type: Date, required: true },
  calories: { type: Number, required: true },
  foodItems: { type: [String], required: true }
}, { _id: false });

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
  currentCalories: {
    type: Number,
    default: 0,
  },
  foodItems: [{
    type: Types.ObjectId,
    ref: 'FoodItem',
  }],
  isOverRecommendedCalories: {
    type: Boolean,
    default: null
  },
  lastReset: { 
    type: Date, 
    default: Date.now 
  },
  resetHistory: { type: [CalorieAndFoodHistorySchema], default: []}
});

// set up pre-save middleware to create password
UserInfoSchema.pre<IUserInfo>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
UserInfoSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const UserInfo = model<IUserInfo>('UserInfo', UserInfoSchema);
export default UserInfo; 
