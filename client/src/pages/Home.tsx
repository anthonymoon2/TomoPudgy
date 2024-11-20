import { useRef } from "react";
import AnimatedGifComponent from "../components/SpriteAnimation";
import { useQuery, useMutation } from '@apollo/client';
import { useState, type ChangeEvent, FormEvent } from "react";
import { ADD_USER_MEAL } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
import { COMPARE_USER_CALORIES } from "../utils/mutations";

const Home = () => {
  // create mutations
  const [addUserMeal] = useMutation(ADD_USER_MEAL, {
    refetchQueries: [
        { query: QUERY_ME }
    ],
  });
  const [compareUserCalories] = useMutation(COMPARE_USER_CALORIES)

  const [formState, setFormState] = useState({ meal: "" });
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const { loading, data, error } = useQuery(QUERY_ME);

    // Handle error case
    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error fetching data.. </div>;
    }3
    // Handle loading state
    if (loading) {
        console.log('Loading...');  // Added log to check if we're still in the loading state
        return <div>Loading...</div>;
    }

    // add profile id to variable
    const profile = data?.me || {};

    // Handle the case where there is no profile username
    if (!profile?.username) {
        console.log('Profile username is missing or user is not logged in.');
        return (
            <h4>
                You need to be logged in to see your profile page. Use the navigation
                links above to sign up or log in!
            </h4>
        );
    }

    const profileIdString = profile._id;
    console.log(`PROFILE ID: ${profileIdString}`);

    // Set up form state and form handling
    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            // call mutation and pass in form values
            await addUserMeal({
                variables: { 
                    userId: profileIdString, 
                    foodName: formState.meal
                },
            })

            console.log("Meal added successfully")
        } catch (e) {
            console.error(e);
        }
        setFormState({ meal: "" });

        window.location.reload();
  }

  const handleDoneButton = async(event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
        // call mutation 
        await compareUserCalories({
            variables: { 
                userId: profileIdString, 
            },
        })
    } catch (e) {
        console.error(e);
    }

    // window.location.reload();
  }

  if (!profile?.username) {
    return (
      <h4>
        You need to be logged in to see your profile page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  const foodItems = data?.me?.foodItems || [];

  const isOverRecommendedCalories = profile.isOverRecommendedCalories;

  console.log(JSON.stringify(profile.isOverRecommendedCalories));
  
  return (
    <div className="container-overlap grid grid-cols-[2fr_1fr] gap-[50px] m-[0px_50px] h-[500px] minecraftFont">
      <div className="bg-black p-[2px] rounded-[10px]">
        <div
          ref={containerRef}
          className="h-[500px] bg-customBeige border-[6px] border-solid border-amber-400 rounded-[10px] backgroundImg"
        >
          <AnimatedGifComponent containerRef={containerRef} isOverRecommendedCalories={isOverRecommendedCalories}  />
        </div>
      </div>

      <div className="container-overlap bg-black p-[2px] rounded-[10px]">
        <div className="grid justify-center h-[500px] bg-customBeige border-[6px] border-solid border-amber-400 rounded-[10px]">
          <div className="mt-[5px] bg-amber-400 border-[2px] border-solid border-black h-[100px] p-[10px] rounded-[10px]">
            <form className="grid">
              <label htmlFor="meal" className="block">
                Add Meal
              </label>
              <input
                placeholder="Steak and Eggs"
                name="meal"
                type="text"
                value={formState.meal}
                onChange={handleChange}
                required
              />
              <button
                className="mt-[10px] bg-white p-[4px] hover:bg-neutral-200 rounded-[10px] border-[2px] border-solid border-black "
                onClick={handleFormSubmit}
              >
                Submit
              </button>
            </form>
          </div>

          <div className="bg-amber-400 border-[2px] border-solid border-black h-[300px] p-[10px] rounded-[10px] text-center">
            <h1 className="mb-[10px]">My Meals Today</h1>
            <div className="text-gray-600 text-xs">
              <h3>Current Calories: {profile.currentCalories} cal</h3>
              <h3>Recommended Calories: {profile.recommendedCalorieCalculation}</h3>
            </div>

            <div className="border-[2px] border-solid border-black p-[10px] rounded-[10px] bg-customBeige h-[70%] overflow-y-auto">
              {foodItems.map((item: { name: string; calories: number }, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 border-[2px] border-solid border-black rounded-[10px] p-[5px] mb-3 text-center"
                >
                  <h1 className="mb-[10px] text-xl">-{item.name}-</h1>
                  <p>Calories: {item.calories}</p>
                </div>
              ))}
            </div>

            <button className="mt-[3px] bg-white p-[4px] hover:bg-neutral-200 rounded-[10px] border-[2px] border-solid border-black" onClick={handleDoneButton}>
              Done for Today
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
