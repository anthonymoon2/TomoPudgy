import { UserInfo } from '../models/index.js';
import process from 'process';

const cleanDB = async (): Promise<void> => {
  try {
    // Delete documents from THought collection
    await UserInfo.deleteMany({});
    console.log('Thought collection cleaned.');

    // Delete documents from User collection

  } catch (err) {
    console.error('Error cleaning collections:', err);
    process.exit(1);
  }
};

export default cleanDB;
