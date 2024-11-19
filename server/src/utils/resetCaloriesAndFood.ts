import UserInfo from "../models/UserInfo.js";

// Midnight-Based Reset (working)
// reminder: change the cron.schedule on server file to: cron.schedule('0 0 * * *',)

export const resetCaloriesForAllUsers = async () => {
  try {
    const users = await UserInfo.find({});
    console.log(`Fetched users:`, users);

    // Get the current date and time
    const now = new Date();
    console.log('Current time:', now.toISOString());

    // Get the start of the current day (midnight)
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0); // Reset time to midnight (00:00:00.000)

    for (const user of users) {
      // Ensure the lastReset field is a Date object
      const lastResetDate = new Date(user.lastReset);
      lastResetDate.setHours(0, 0, 0, 0); // Reset time to midnight (00:00:00.000)
      console.log(`User: ${user.username}, Last Reset: ${lastResetDate}, Start of Day: ${startOfDay}`);

      // Compare if the last reset date is different from the current day
      if (lastResetDate.getTime() !== startOfDay.getTime()) {
        console.log(`Resetting calories and food items for user: ${user.username}`);

        // Create a history entry for today's reset
        const resetHistoryEntry = {
          date: new Date(),  // The current date (reset time)
          calories: user.currentCalories || 0, // The calories before reset
          foodItems: user.foodItems.map(food => food.toString()),  // List food items by their IDs
        };

        // Check if reset history already contains an entry for today (midnight)
        const existingHistory = user.resetHistory.find(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0); // Normalize to midnight
          return entryDate.getTime() === startOfDay.getTime();
        });

        if (!existingHistory) {
          // Add the reset history entry to the user's resetHistory
          user.resetHistory.push(resetHistoryEntry);
        }

        // Reset the user's calories and food items
        user.currentCalories = 0;
        user.foodItems = []; // Empty the foodItems array

        // Update lastReset to start of the current day (midnight)
        user.lastReset = startOfDay;

        // Save the updated user record
        await user.save();

        console.log(`After resetting: ${user.username}, currentCalories: ${user.currentCalories}, foodItems: ${user.foodItems.length}`);
      }
    }

    console.log('Midnight-based calorie reset completed.');
  } catch (error) {
    console.error('Error during midnight-based calorie reset:', error);
  }
};


// Minute-Based Reset (working)
// reminder: change the cron.schedule on server file to: cron.schedule('* * * * *',)

// import UserInfo from "../models/UserInfo.js";

// export const resetCaloriesForAllUsers = async () => {
//   try {
//     const users = await UserInfo.find({});
//     console.log(`Fetched users:`, users);

//     // Get the current date and time (with minutes precision)
//     const now = new Date();
//     // console.log('Current time:', now.toISOString());

//     for (const user of users) {
//       // Ensure the lastReset field is a Date object, then reset to current minute
//       const lastResetDate = new Date(user.lastReset);
//       lastResetDate.setSeconds(0, 0); // Reset seconds and milliseconds to match minute precision
//       // console.log(`User: ${user.username}, Last Reset: ${lastResetDate}, Now: ${now}`);

//       // Compare the minute precision of last reset and current time
//       if (lastResetDate.getTime() !== now.getTime()) {
//         // console.log(`Resetting calories and food items for user: ${user.username}`);

//         const existingHistory = user.resetHistory.find(entry => {
//           const entryDate = new Date(entry.date);
//           return entryDate.getFullYear() === now.getFullYear() &&
//                 entryDate.getMonth() === now.getMonth() &&
//                 entryDate.getDate() === now.getDate() &&
//                  entryDate.getMinutes() === now.getMinutes(); // Compare minutes
//         });

//         if (!existingHistory) {
//           // Add the reset history entry to the user's resetHistory
//           const resetHistoryEntry = {
//             date: new Date(),
//             calories: user.currentCalories || 0,
//             foodItems: user.foodItems.map(food => food.toString()),
//           };
//           user.resetHistory.push(resetHistoryEntry);
//         }

//         // Reset the user's calories and food items
//         user.currentCalories = 0;
//         user.foodItems = []; // Empty the foodItems array

//         // Update lastReset to current time (minute-by-minute)
//         user.lastReset = now;

//         // Save the updated user record
//         await user.save();

//         // console.log(`After resetting: ${user.username}, currentCalories: ${user.currentCalories}, foodItems: ${user.foodItems.length}`);
//       }
//     }

//     console.log('Minute-based calorie reset completed.');
//   } catch (error) {
//     console.error('Error during minute-based calorie reset:', error);
//   }
// };
