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

//TIED TO FOURTH STEP
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
    me: async (_parent: any, _args: any, context: Context): Promise<IUserInfo | null> => {
      console.log("Context User:", context.user);
      if (context.user) {
        return await UserInfo.findOne({ _id: context.user._id }).populate("foodItems");
      }
      throw new AuthenticationError('QUERY_ME: You are not authenticated');
    },
  },

  Mutation: {

    //  FIRST STEP
    createUser: async (_parent: any, { input }: AddProfileArgs): Promise<{ token: string; profile: IUserInfo }> => {
      const profile = await UserInfo.create({ ...input });
      const token = signToken(profile.username, profile._id);
      return { token, profile };
    },

    // SECOND STEP
    loginUser: async (
      _parent: any,
      { username, password }: { username: string; password: string }
    ): Promise<{ token: string; userLogin: IUserInfo }> => {
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

    // THIRD STEP
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

    //FOURTH STEP
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
    

    //FIFTH STEP
    addFoodItemToUser: async (_: any, { userId, foodName }: { userId: string; foodName: string; }): Promise<IFoodItem | null> => {
      try {
        // Fetch the calorie data from the calorie response for the foodName from the API (returns only the calorie count)
        const calories = await fetchCalorieData(foodName);
        if (typeof calories !== 'number') {
          throw new Error('Invalid calorie data');
        }
        // Create the NEW FoodItem document
        const foodItem = new FoodItem({
          name: foodName.toLowerCase(),
          calories,
        });
        await foodItem.save();
        // Find the user._id and add to foodItem[]
        const user = await UserInfo.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        user.foodItems.push(foodItem._id as Types.ObjectId);
        // Update the user document with current calorie count based on added food
        user.currentCalories = (user.currentCalories || 0) + foodItem.calories;
        await user.save();
        return foodItem; // Return the created food item
      } catch (error) {
        console.error('Error adding food item:', error);
        return null;
      }
    },
    
// SXTH & FINAL STEP: WONT WORK IF DONE OUT OF ORDER
    compareUserCalories: async ( _: any, { _id}: { _id: string;}): Promise<Object | null> => {
      try {
        //retrieving the user id from the database
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

  // Resetting the calorie and meal for the day
    

  },
};

export default resolvers;
