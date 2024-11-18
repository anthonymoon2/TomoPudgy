import AnimatedGifComponent from "../components/SpriteAnimation";
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { useState, type FormEvent, type ChangeEvent } from "react";
import { GET_USER_INFO, QUERY_ME } from '../utils/queries';

// import Meal from "../components/Meal/Meal";

const Home = () => {

    const { profileId } = useParams();

    // Debugging: Log the logged-in user profile
    console.log('User profile:', Auth.getProfile());

    // Check if profileId is provided in the URL or if we need to use the logged-in user's data
    const { loading, data, error } = useQuery(
        profileId ? GET_USER_INFO : QUERY_ME,
        { variables: { profileId: profileId } }
    );

    // Debugging: Log data being fetched and the query in use
    console.log("Current query:", profileId ? 'GET_USER_INFO' : 'QUERY_ME');
    console.log("Data fetched:", data);
    console.log("Error fetching data:", error);

    // Handle error case
    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error fetching data...</div>;
    }

    // Handle loading state
    if (loading) {
        console.log('Loading...');  // Added log to check if we're still in the loading state
        return <div>Loading...</div>;
    }

    // Debugging: Check if profile data is available
    const profile = data?.me || data?.getUserInfo || {};
    console.log("Profile data:", profile);
    console.log(`PROFILE ID${profile._id}`);

    // Check if the logged-in user's profile is the same as the requested profile
    if (Auth.loggedIn() && Auth.getProfile().data.id === profileId) {
        console.log("Success - Redirecting");
        return <Navigate to="/me" />;
    }

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

    // Debugging: Log rendering state
    console.log('Rendering Home component with profile:', profile);

    // Set up form state and form handling
    const [formState, setFormState] = useState({ meal: "" });

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    return (
        <div className="grid grid-cols-[2fr_1fr] gap-[50px] m-[0px_50px] h-[500px] minecraftFont">
            <div className="bg-black p-[2px] rounded-[10px]">
                <div className="h-[500px] bg-customBeige border-[6px] border-solid border-amber-400 rounded-[10px]">
                    <div>
                        <AnimatedGifComponent />
                    </div>
                </div>
            </div>

            <div className="bg-black p-[2px] rounded-[10px]">
                <div className="grid justify-center h-[500px] bg-customBeige border-[6px] border-solid border-amber-400 rounded-[10px]">
                    <div className="mt-[20px] bg-amber-400 border-[2px] border-solid border-black h-[100px] p-[10px] rounded-[10px]">
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
                                className="mt-[20px] bg-white p-[4px] hover:bg-neutral-200 rounded-[10px] border-[2px] border-solid border-black"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    <div className="bg-amber-400 border-[2px] border-solid border-black h-[300px] p-[10px] rounded-[10px] text-center">
                        <h1 className="mb-[10px]">My Meals Today</h1>

                        <div className="border-[2px] border-solid border-black p-[10px] rounded-[10px] bg-customBeige h-[90%] overflow-y-auto">
                            <div className="bg-white h-[100px] border-[2px] border-solid border-black rounded-[10px] text-left p-[5px] mb-3">
                                <p>
                                    Steak and Eggs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
