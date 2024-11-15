import bcrypt from 'bcryptjs';
import UserInfo, { IUserInfo } from "../models/UserInfo.js";
import fetchCalorieData from '../utils/fetchCalorieData.js';

const calculateBMR = (weight: number, height: number, age: number, gender: boolean): number => {
  const bmr = gender
    ? 10 * weight + 6.25 * height - 5 * age + 5 // If male
    : 10 * weight + 6.25 * height - 5 * age - 161; // else female
  return Math.round(bmr);
};
const resolvers = {
  Query: {
    getFoodItem: async (_: any, { name }: { name: string }) => {
      try {
        const foodItem = await fetchCalorieData(name);
        return foodItem;
      } catch (error) {
        console.error('Error fetching food item:', error);
        throw new Error('Unable to fetch food item data.');
      }
    },
    getUserInfo: async (_: any, { _id }: { _id: string }): Promise<IUserInfo | null> => {
      try {
        const user = await UserInfo.findById(_id);
        if (!user) {
          throw new Error('User not found.');
        }
        return user;
      } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
      }
    },
    calculateUserCalories: async (
      _: any,
      { _id, foodName }: { _id: string; foodName: string }
    ): Promise<number> => {
      try {
        const user = await UserInfo.findById(_id);
        if (!user) {
          throw new Error("User not found.");
        }
        const apiFoodCalorieResponse = await fetchCalorieData(foodName);
        if (!apiFoodCalorieResponse || typeof apiFoodCalorieResponse.calories !== "number") {
          throw new Error("Invalid calorie data from external source.");
        }
        const combinedCalories = (user.currentCalories || 0) + apiFoodCalorieResponse.calories;
        return combinedCalories;
      } catch (error) {
        console.error("Error calculating combined calories:", error);
        return 0;
      }
    },
  },

  Mutation: {
    recommendedCalorieCalculation: async (
      _parent: any,
      { _id, weight, feet, inches, age, gender }:
        { _id: string; weight: number; feet: number; inches: number; age: number; gender: boolean }
    ): Promise<Number | null> => {
      try {
        const user = await UserInfo.findById(_id);
        if (!user) {
          throw new Error("User not found.");
        }
        const weightInKg = weight * 0.453592;
        const heightInCm = (feet * 12 + inches) * 2.54;
        const calculatedBMR = calculateBMR(weightInKg, heightInCm, age, gender);
        await UserInfo.findByIdAndUpdate(
          _id,
          {
            recommendedCalorieCalculation: calculatedBMR,
            dailyCaloricIntake: calculatedBMR,
          },
          { new: true }
        );
        return calculatedBMR;
      } catch (error) {
        console.error("Error updating recommended calories:", error);
        throw new Error("Error updating recommended calories.");
      }
    },
    createUser: async (
      _parent: any,
      { username, password }: { username: string; password: string }
    ): Promise<IUserInfo | null> => {
      try {
        if (!username || !password) {
          throw new Error("Username and password are required.");
        }

        const existingUser = await UserInfo.findOne({ username });
        if (existingUser) {
          throw new Error("Username already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userLogin = await UserInfo.create({
          username,
          password: hashedPassword,
        });

        return userLogin;
      } catch (err) {
        console.error("Error creating user:", err);
        throw new Error("Error creating user.");
      }
    },
    loginUser: async (
      _parent: any,
      { username, password }: { username: string; password: string }
    ): Promise<IUserInfo | null> => {
      try {
        const userLogin = await UserInfo.findOne({ username });
        if (!userLogin) {
          throw new Error("User not found.");
        }

        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          throw new Error("Invalid credentials.");
        }

        return userLogin;
      } catch (err) {
        console.error("Error logging in:", err);
        throw new Error("Error logging in.");
      }
    },
    addUserInfo: async (
      _parent: any,
      { _id, updateData }: { _id: string; updateData: Partial<IUserInfo> }
    ): Promise<IUserInfo | null> => {
      try {
        const updatedUserInfo = await UserInfo.findByIdAndUpdate(
          _id,
          { $set: updateData },
          { new: true }
        );
        if (!updatedUserInfo) {
          throw new Error("User not found.");
        }
        return updatedUserInfo;
      } catch (err) {
        console.error("Error updating UserInfo:", err);
        throw new Error("Error updating user information.");
      }
    },
  },
};

export default resolvers;
