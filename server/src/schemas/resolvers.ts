import bcrypt from 'bcryptjs';
import UserInfo, { IUserInfo } from "../models/UserInfo.js";
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
    calculateUserCalories: async (_: any, { _id, foodName }: { _id: string; foodName: string }): Promise<number | null> => {
      try {
        const user = await UserInfo.findById(_id);
        if (!user) {
          throw new Error("User not found");
        }
        const apiFoodCalorieResponse = await fetchCalorieData(foodName);
        if (!apiFoodCalorieResponse || typeof apiFoodCalorieResponse.calories !== "number") {
          throw new Error("Invalid calorie data from external source");
        }
        const databaseFoodCalorie = user.currentCalories || 0;
        const combinedCalories = databaseFoodCalorie + apiFoodCalorieResponse.calories;
        return combinedCalories;
      } catch (error) {
        console.error("Error calculating combined calories:", error);
        
        return null;
      }
    }
  },

  Mutation: {
    createUser: async (
      _parent: any,
      args: { username: string; password: string }
    ): Promise<IUserInfo | null> => {
      try {
        const { username, password } = args;

        // Ensure both username and password are provided
        if (!username || !password) {
          throw new Error("Username and password are required.");
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const userLogin = await UserInfo.create({
          username,
          password: hashedPassword, // Store the hashed password
        });

        return userLogin;
      } catch (err) {
        console.error("Error creating UserLogin:", err);
        throw new Error("Error creating user.");
      }
    },

    loginUser: async (
      _parent: any,
      { username, password }: { username: string; password: string }
    ): Promise<IUserInfo | null> => {
      try {
        const userLogin = await UserInfo.findOne({ username });

        // If user doesn't exist or passwords don't match, throw an error
        if (!userLogin) {
          throw new Error('User not found.');
        }

        const isMatch = await bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
          throw new Error('Invalid credentials.');
        }

        return userLogin;
      } catch (err) {
        console.error("Error checking UserLogin:", err);
        throw new Error("Error logging in.");
      }
    },

    addUserInfo: async (
      _parent: any,
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
        throw new Error("Error updating user information.");
      }
    },

    compareUserCalories: async ( _: any, { _id, foodName}: { _id: string; foodName: string}): Promise<Object | null> => {
      try {
        //retrieving the user id from the database
        const user = await UserInfo.findById(_id);
        if (!user) {
          throw new Error('User not found');
        }
        // fetching the calories food response from the 3rd party api
        const apiFoodCalorieResponse = await fetchCalorieData(foodName);
        if (!apiFoodCalorieResponse || typeof apiFoodCalorieResponse.calories !== 'number') {
          throw new Error ('Invalid calorie data from external source');
        }
        // updating the user's current calories with the food calorie from the API response
        const currentCalories = (user.currentCalories || 0) + apiFoodCalorieResponse.calories;
        // updating the user's current calorie count with the new total value
        user.currentCalories = currentCalories;
        // saving the updated user data to the database
        await user.save();

        // getting the user's recommended daily calorie intake
        const recommendedCalories = user.recommendedCalorieCalculation;
        // checking if the recommendedCalories is a valid number if it isnt it throws an error
        if (typeof recommendedCalories !== 'number') {
          throw new Error('Invalid recommended calorie data');
        }
        // returns true if the currentCalories is greater than recommendedCalories and returns false if the currentCalories is less than or equal to the recommendedCalories
          return {
          result: currentCalories > recommendedCalories,
          currentCalories
        };
      } catch (error) {
        console.error('Error comparing user calories:', error);
        return null;
      }
    }
  },
};
export default resolvers;
