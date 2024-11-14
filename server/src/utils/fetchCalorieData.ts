import FoodItem from '../models/FoodItem.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchCalorieData(name: string) {
  try {
    let foodItem = await FoodItem.findOne({ name: name.toLocaleLowerCase() });
    if (foodItem) {
      return foodItem;
    };

    const response = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${name}`, {
      headers: {'X-Api-Key': process.env.CALORIE_NINJA_API_KEY }
    });
    const itemData = response.data.items[0];
    const newFoodItem = await FoodItem.create({
      name: name.toLocaleLowerCase(),
      calories: itemData.calories,
    });
    return newFoodItem;
  } catch (error) {
    console.error('Error fetching calorie data:', error);
    throw new Error('Unable to fetch calorie data');
  }
};

export default fetchCalorieData;