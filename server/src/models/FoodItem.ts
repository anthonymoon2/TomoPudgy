import { Schema, model, type Document } from 'mongoose';

export interface IFoodItem extends Document {
  name: string;
  calories: number;
}

const FoodItemSchema = new Schema<IFoodItem>({
  name: {type: String, required: true },
  calories: { type: Number, required: true },
});

const FoodItem = model<IFoodItem>('FoodItem', FoodItemSchema);

export default FoodItem;