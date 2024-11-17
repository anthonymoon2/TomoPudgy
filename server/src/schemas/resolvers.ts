import UserInfo, { IUserInfo } from "../models/UserInfo.js";
import FoodItem, { IFoodItem } from '../models/FoodItem.js';
import { Types } from 'mongoose';
import fetchCalorieData from '../utils/fetchCalorieData.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface AddProfileArgs{
  input: {
    username: string;
    password: string;
  }
}
interface Context {
  user?: IUserInfo | null;
}

const calculateBMR = (weight: number, height: number, age: number, gender: boolean): number => {
  const bmr = gender
    ? 10 * weight + 6.25 * height - 5 * age + 5 // If male
    : 10 * weight + 6.25 * height - 5 * age - 161; // else female
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
    me: async (_parent: any, _args: any, context: Context): Promise<IUserInfo | null> => {
      console.log("Context User:", context.user);
      if (context.user) {
        return await UserInfo.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('QUERY_ME: You are not authenticated');
    },
  },

  Mutation: {
    recommendedCalorieCalculation: async (
      _parent: any,
      { _id }:
        { _id: string }
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
          {
            recommendedCalorieCalculation: calculatedBMR,
          },
          { new: true }
        );
        return calculatedBMR;
      } catch (error) {
        console.error("Error updating recommended calories:", error);
        throw new Error("Error updating recommended calories.");
      }
    },
    createUser: async (_parent: any, { input }: AddProfileArgs): Promise<{ token: string; profile: IUserInfo }> => {
      const profile = await UserInfo.create({ ...input });
      const token = signToken(profile.username, profile._id);
      return { token, profile };
    },
    loginUser: async (
      _parent: any,
      { username, password }: { username: string; password: string }
    ): Promise<{ token:string; userLogin: IUserInfo }> => {
      try {
        const userLogin = await UserInfo.findOne({ username });
        if (!userLogin) {
          throw AuthenticationError;
        }

        const isMatch = await userLogin.isCorrectPassword(password);
        if (!isMatch) {
          throw AuthenticationError;
        }
        const token = signToken(userLogin.username, userLogin._id);
        return {token, userLogin};

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
        const updateData = { weight, age, feet, inches, gender }
        const updatedUserInfo = await UserInfo.findByIdAndUpdate(
          _id,
          updateData,
          { new: true }
        );
        console.log(updatedUserInfo)
        if (!updatedUserInfo) {
          throw new Error("User not found.");
        }
        return updatedUserInfo;
      } catch (err) {
        console.error("Error updating UserInfo:", err);
        throw new Error("Error updating user information.");
      }
    },


    compareUserCalories: async ( _: any, { _id}: { _id: string;}): Promise<Object | null> => {
      try {
        //retrieving the user id from the database
        const user = await UserInfo.findById(_id);
        if (!user) {
          throw new Error('User not found');
        }
        // fetching the calories food response from the 3rd party api
        // const apiFoodCalorieResponse = await fetchCalorieData(foodName);
        // if (!apiFoodCalorieResponse || typeof apiFoodCalorieResponse.calories !== 'number') {
        //   throw new Error ('Invalid calorie data from external source');
        // }
        // // updating the user's current calories with the food calorie from the API response
        // const currentCalories = (user.currentCalories || 0) + apiFoodCalorieResponse.calories;
        // // updating the user's current calorie count with the new total value
        // user.currentCalories = currentCalories;
        // // saving the updated user data to the database
        // await user.save();
        // getting the user's recommended daily calorie intake
        const recommendedCalories = user.recommendedCalorieCalculation;
        const currentCalories = user.currentCalories;
        // checking if the recommendedCalories is a valid number if it isnt it throws an error
        if (typeof recommendedCalories !== 'number') {
          throw new Error('Invalid recommended calorie data');
        }
        // returns true if the currentCalories is greater than recommendedCalories and returns false if the currentCalories is less than or equal to the recommendedCalories
        return {
          result: currentCalories > recommendedCalories,
          // currentCalories
        };
      } catch (error) {
        console.error('Error comparing user calories:', error);
        return null;
      }
    },

    addFoodItemToUser: async (_: any, { userId, foodName}: { userId: string, foodName: string}): Promise<IFoodItem | null> => {
      try {
        const apiFoodCalorieResponse = await fetchCalorieData(foodName);
        if (!apiFoodCalorieResponse || typeof apiFoodCalorieResponse.calories !== 'number') {
          throw new Error('Invalid calorie data from external source');
        }
        const foodItem = new FoodItem({
          name: foodName,
          calories: apiFoodCalorieResponse.calories,
        })
        

        const savedFoodItem = await foodItem.save();
        if(!savedFoodItem || !savedFoodItem._id) {
          throw new Error('Failed to save food item')
        }

        const user = await UserInfo.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        user.foodItems.push(savedFoodItem._id as Types.ObjectId);
        // updating the user's current calories with the food calorie from the API response
        const currentCalories = (user.currentCalories || 0) + apiFoodCalorieResponse.calories;
        // updating the user's current calorie count with the new total value
        user.currentCalories = currentCalories;
        await user.save();

        return savedFoodItem;

      } catch (error) {
        console.error('Error adding food item:', error);
        return null;
      }
    },
  },
};

export default resolvers;
