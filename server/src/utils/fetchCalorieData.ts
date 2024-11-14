import FoodItem from '../models/FoodItem.js';
import axios from 'axios';

export async function fetchCalorieData(name: string) {
  try {
    let foodItem = await FoodItem.findOne({ name: name.toLocaleLowerCase() });
    if (foodItem) {
      return foodItem;
    };

    const response = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${name}`, {
      headers: {'ex-api-key': 'your-api-key'}
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