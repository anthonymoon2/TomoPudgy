import FoodItem from '../models/FoodItem.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchCalorieData(name: string): Promise<number> {
  try {
    const foodName = name.toLowerCase();
    //so it doesnt duplicate a new fooditem document 
    // Check if the food item already exists in the database
    let foodItem = await FoodItem.findOne({ name: foodName });
    if (foodItem) {
      return foodItem.calories; // Return the calories from the existing document
    }
    // Fetch data from the external API
    const response = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${foodName}`, {
      headers: { 'X-Api-Key': process.env.CALORIE_NINJA_API_KEY },
    });
    const itemData = response.data.items[0];
    if (!itemData || typeof itemData.calories !== 'number') {
      throw new Error('Invalid calorie data from API');
    }
    return itemData.calories; // Return the calories from the API response
  } catch (error) {
    console.error('Error fetching calorie data:', error);
    throw new Error('Unable to fetch calorie data');
  }
}

export default fetchCalorieData;