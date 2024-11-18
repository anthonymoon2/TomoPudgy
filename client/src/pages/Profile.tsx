import { useMutation, useQuery } from "@apollo/client";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { UPDATE_USER } from "../utils/mutations";
import { useParams } from 'react-router-dom';

import Auth from '../utils/auth';
import { GET_USER_INFO, QUERY_ME } from '../utils/queries';

const Profile = () => {
    const [formState, setFormState] = useState({ weight: "", feet: "", inches: "", age: "", gender: ""});
    const [updateUser] = useMutation(UPDATE_USER);

    // get user data
    const { profileId } = useParams();
    console.log('User profile:', Auth.getProfile());

    const { loading, data, error } = useQuery(
        profileId ? GET_USER_INFO : QUERY_ME,
        { variables: { profileId: profileId } }
    );
    
    const profile = data?.me || data?.getUserInfo || {};
    const profileIdString = profile._id;
    console.log(`PROFILE ID: ${profile._id}`);
    console.log(`PROFILE NAME: ${profile.username}`);
    
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

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value,
        });

        console.log()
    };

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            // call mutation and pass in form values
            await updateUser({
                variables: { 
                    id: profileIdString, 
                    weight: parseFloat(formState.weight) || null, 
                    feet: parseInt(formState.feet) || null, 
                    inches: parseInt(formState.inches) || null, 
                    gender: formState.gender === "true", 
                    age: parseInt(formState.age) || null
                },
            })

            console.log("User updated successfully")
        } catch (e) {
            console.error(e);
        }
        setFormState({ weight: "", feet: "", inches: "", age: "", gender: "" });
    }

    return (
        <div className="profile-container">
            <div className="profile-container-left-outer">
                <div className="profile-container-left">
                    <h1>{profile.username}'s Pudgy</h1>

                    <div className="profile-container-left-avatar">
                        <img src="/figure1.gif" className="figure-gif"></img>
                    </div>
                </div>
            </div>
            <div className="profile-container-right-outer">
                <div className="profile-container-right">
                    <form>
                        Weight (lbs)
                        <input placeholder="300" name="weight" type="text" value={formState.weight} onChange={handleChange} required />

                        Age
                        <input placeholder="22" name="age" type="text" value={formState.age} onChange={handleChange} required />

                        Gender
                        <select name="gender" value={formState.gender} onChange={handleChange} required>
                            <option value="" disabled>
                                Select Gender
                            </option>
                            <option value="true">Male</option>
                            <option value="false">Female</option>
                        </select>

                        Height
                        <div className="flex space-x-4">
                            <select name="feet" value={formState.feet} onChange={handleChange} required>
                                <option value="" disabled>
                                    Select Feet
                                </option>
                                <option value="2">2'</option>
                                <option value="3">3'</option>
                                <option value="4">4'</option>
                                <option value="5">5'</option>
                                <option value="6">6'</option>
                                <option value="7">7'</option>
                            </select>

                            <select name="inches" value={formState.inches} onChange={handleChange} required>
                                <option value="" disabled>
                                    Select inches
                                </option>
                                <option value="0">0"</option>
                                <option value="1">1"</option>
                                <option value="2">2"</option>
                                <option value="3">3"</option>
                                <option value="4">4"</option>
                                <option value="5">5"</option>
                                <option value="6">6"</option>
                                <option value="7">7"</option>
                                <option value="8">8"</option>
                                <option value="9">9"</option>
                                <option value="10">10"</option>
                                <option value="11">11"</option>
                            </select>
                        </div>

                        <button className="form-submit-button" onClick={handleFormSubmit}>
                            Submit
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile; 