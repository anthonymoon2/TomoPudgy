// import { Query } from "mongoose";
import UserInfo, { IUserInfo } from "../models/UserInfo.js";
// import FoodItem, { IFoodItem } from '../models/FoodItem.js';
import { fetchCalorieData } from '../utils/fetchCalorieData.js';

const resolvers = {
  Query: {
    getFoodItem: async (_: any, { name }: { name: string }) => {
      try {
        const foodItem = await fetchCalorieData(name);
        return foodItem;
      } catch (error) {
        console.error('Error fetching food item:', error);
        throw new Error('Unable to fetch food item data');
      }
    },
    getUserInfo: async (_: any, { _id }: { _id: string }): Promise<IUserInfo | null> => {
      try {
        const user = await UserInfo.findById(_id);
        return user;
      } catch (error) {
        console.error('Error fetching user info', error);
        return null;
      }
    },
    
    // calculateUserCalories: async (_: any, { _id, foodName }: { _id: string; foodName: string }): Promise<number | null> => {
    //   try {
    //     const user = await UserInfo.findById(_id);
    //     if (!user) {
    //       throw new Error("User not found");
    //     }
    //     const externalFoodCalorie = await fetchCalorieData(foodName);
    //     if (!externalFoodCalorie || typeof externalFoodCalorie.calories !== "number") {
    //       throw new Error("Invalid calorie data from external source");
    //     }
    //     const databaseFoodCalorie = user.calorie || 0;
    //     const combinedCalories = databaseFoodCalorie + externalFoodCalorie.calories;
    //     return combinedCalories;
    //   } catch (error) {
    //     console.error("Error calculating combined calories:", error);
    //     return null;
    //   }
    // },
  },


  Mutation: {
    createUser: async (
      args: { username: string; password: string }
    ): Promise<IUserInfo | null> => {
      try {
        const userLogin = await UserInfo.create(args);
        return userLogin;
      } catch (err) {
        console.error("Error creating UserLogin:", err);
        return null;
      }
    },

    loginUser: async (
      { username, password }: { username: string; password: string }
    ): Promise<IUserInfo | null> => {
      try {
        const userLogin = await UserInfo.findOne({ username, password });
        return userLogin;
      } catch (err) {
        console.error("Error checking UserLogin:", err);
        return null;
      }
    },

    addUserInfo: async (
      { _id, updateData }: { _id: string; updateData: Partial<IUserInfo> }
    ): Promise<IUserInfo | null> => {
      try {
        const updatedUserInfo = await UserInfo.findOneAndUpdate(
          { _id },
          { $set: updateData },
          { new: true }
        );
        return updatedUserInfo;
      } catch (err) {
        console.error("Error updating UserInfo:", err);
        return null;
      }
    },
  },
};

export default resolvers;
