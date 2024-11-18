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
  dailyCaloricIntake: number;
  currentCalories: number;
  foodItems: Types.ObjectId[];
  isOverRecommendedCalories: boolean
  isCorrectPassword(password: string): Promise<boolean>;
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
  isOverRecommendedCalories: {
    type: Boolean,
    default: null
  },
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
