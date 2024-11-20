import { useQuery } from "@apollo/client";
import { GET_USER_HISTORY } from "../utils/queries";

const UserHistory = () => { 
    const {loading, error, data } = useQuery(GET_USER_HISTORY);

    console.log(data);

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error.message}</p>

    type FoodItem = {
        name: string;
      };
      
      const foodNames = data.getUserHistoryLog.foodItems.map((food: FoodItem) => food.name);
      

    return(
        <div>
            <h2>User History for {data.getUserHistoryLog.username}</h2>
            <p>Current Calories: {data.getUserHistoryLog.currentCalories}</p>
            <p>Food Item:{foodNames.join(", ")}</p>
            <p></p>
        </div>
    )
}

export default UserHistory;