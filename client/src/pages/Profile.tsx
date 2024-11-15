import { useMutation } from "@apollo/client";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { UPDATE_USER } from "../utils/mutations";

const Profile = () => {
    const [formState, setFormState] = useState({ weight: "", height: "", age: "", gender: ""});
    const [updateUser] = useMutation(UPDATE_USER);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormState({
          ...formState,
          [name]: value,
        });
    };

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            await updateUser({
                variables: { ...formState },
            })
        } catch (e) {
            console.error(e);
        }
        setFormState({ weight: "", height: "", age: "", gender: "" });
    }

    return (
        <div className="profile-container">
            <div className="profile-container-left-outer">
                <div className="profile-container-left">
                    User's Pudgy
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

                        Height (cm)
                        <input placeholder="178" name="height" type="text" value={formState.height} onChange={handleChange} required />

                        Age
                        <input placeholder="22" name="age" type="text" value={formState.age} onChange={handleChange} required />

                        Gender
                        <select name="gender" value={formState.gender} required>
                            <option value="" disabled>
                                Select Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

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