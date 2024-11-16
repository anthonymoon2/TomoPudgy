import bcrypt from 'bcryptjs';
import UserInfo, { IUserInfo } from "../models/UserInfo.js";
import FoodItem, { IFoodItem } from '../models/FoodItem.js';
import { Types } from 'mongoose';
import fetchCalorieData from '../utils/fetchCalorieData.js';
import { signToken } from '../utils/auth.js';

const calculateBMR = (weight: number, height: number, age: number, gender: boolean): number => {
  const bmr = gender
    ? 10 * weight + 6.25 * height - 5 * age + 5 // If male, true
    : 10 * weight + 6.25 * height - 5 * age - 161; // else female , false
  return Math.round(bmr);
};

const resolvers = {
  Query: {
    getFoodItem: async (_: any, { foodName }: { foodName: string }) => {
      try {
        const foodItem = await fetchCalorieData(foodName);
        return foodItem;
      } catch (error) {
        console.error('Error fetching food item:', error);
        throw new Error('Unable to fetch food item data.');
      }
    },

    getUserInfo: async (_: any, { _id }: { _id: string }): Promise<IUserInfo | null> => {
      try {
        const user = await UserInfo.findById(_id).populate('foodItems');
        if (!user) {
          throw new Error('User not found.');
        }
        return user;
      } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
      }
    },
  },

  Mutation: {
    recommendedCalorieCalculation: async (
      _parent: any,
      { _id }: { _id: string }
    ): Promise<Number | null> => {
      try {
        const user = await UserInfo.findById(_id);
        if (!user) {
          throw new Error("User not found.");
        }
        const weightInKg = user.weight * 0.453592;
        const heightInCm = (user.feet * 12 + user.inches) * 2.54;
        const calculatedBMR = calculateBMR(weightInKg, heightInCm, user.age, user.gender);
        await UserInfo.findByIdAndUpdate(
          _id,
          { recommendedCalorieCalculation: calculatedBMR },
          { new: true }
        );
        return calculatedBMR;
      } catch (error) {
        console.error("Error updating recommended calories:", error);
        throw new Error("Error updating recommended calories.");
      }
    },

    createUser: async (_parent: any, { username, password }: { username: string; password: string }) => {
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
        const token = signToken(userLogin.username, userLogin._id);
        return { token, userLogin };
      } catch (err) {
        console.error("Error creating user:", err);
        throw new Error("Error creating user.");
      }
    },

    loginUser: async (
      _parent: any,
      { username, password }: { username: string; password: string }
    ): Promise<{ token: string; userLogin: IUserInfo }> => {
      try {
        const userLogin = await UserInfo.findOne({ username });
        if (!userLogin) {
          throw new Error("User not found.");
        }
        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          throw new Error("Invalid credentials.");
        }
        const token = signToken(userLogin.username, userLogin._id);
        return { token, userLogin };
      } catch (err) {
        console.error("Error logging in:", err);
        throw new Error("Error logging in.");
      }
    },

    addUserInfo: async (
      _parent: any,
      { _id, weight, age, feet, inches, gender }: { _id: string; weight: number, age: number, feet: number, inches: number, gender: boolean }
    ): Promise<IUserInfo | null> => {
      try {
        const updateData = { weight, age, feet, inches, gender };
        const updatedUserInfo = await UserInfo.findByIdAndUpdate(
          _id,
          updateData,
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

    compareUserCalories: async (_: any, { _id }: { _id: string; }): Promise<Object | null> => {
      try {
        const user = await UserInfo.findById(_id);
        if (!user) {
          throw new Error('User not found');
        }
        const recommendedCalories = user.recommendedCalorieCalculation;
        const currentCalories = user.currentCalories;
        if (typeof recommendedCalories !== 'number') {
          throw new Error('Invalid recommended calorie data');
        }
        // Comparing calories
        const isOverRecommendedCalories = currentCalories > recommendedCalories;
        // Update/Add the result to the user document
        user.isOverRecommendedCalories = isOverRecommendedCalories;
        // incrementing/decrementing the user's weight based on the comparison
        if (isOverRecommendedCalories) {
          user.weight += 1; // Increase weight if over recommended calories
        } else {
          user.weight -= 1; // Decrease weight if under recommended calories
        }
        // Save the updated user document
        await user.save();
        return {
          result: isOverRecommendedCalories,
          currentCalories,
          weight: user.weight,
        };
      } catch (error) {
        console.error('Error comparing user calories:', error);
        return null;
      }
    },

    addFoodItemToUser: async (_: any, { userId, foodName }: { userId: string; foodName: string; }): Promise<IFoodItem | null> => {
      try {
        const apiFoodCalorieResponse = await fetchCalorieData(foodName);
        if (!apiFoodCalorieResponse || typeof apiFoodCalorieResponse.calories !== 'number') {
          throw new Error('Invalid calorie data from external source');
        }
        const foodItem = new FoodItem({
          name: foodName,
          calories: apiFoodCalorieResponse.calories,
        });
        await foodItem.save();
        const user = await UserInfo.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        // Add the new food item's ID to the user's foodItems array
        user.foodItems.push(foodItem._id as Types.ObjectId);
        // Update the user's current calorie count
        const currentCalories = (user.currentCalories || 0) + foodItem.calories;
        user.currentCalories = currentCalories;
        await user.save();
        return foodItem;
      } catch (error) {
        console.error('Error adding food item:', error);
        return null;
      }
    }
  },
};

export default resolvers;
