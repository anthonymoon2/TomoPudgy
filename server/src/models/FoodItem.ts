import { Schema, model, type Document } from 'mongoose';

export interface IFoodItem extends Document {
  name: string;
  calories: number;
  fat_total_g: number;
  protein_g: number;
  carbs_total_g: number;
}

const FoodItemSchema = new Schema<IFoodItem>({
  name: {type: String, required: true, unique: true},
  calories: { type: Number, required: true },
  fat_total_g: { type: Number, required: true },
  protein_g: { type: Number, required: true },
  carbs_total_g: { type: Number, required: true },
});

const FoodItem = model<IFoodItem>('FoodItem', FoodItemSchema);

export default FoodItem;