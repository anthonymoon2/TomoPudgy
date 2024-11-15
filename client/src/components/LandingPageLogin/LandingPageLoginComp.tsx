import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate} from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER, REGISTER_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";
import "../../styles/App.css";

const Login = () => {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [login, { error: loginError, data: loginData }] = useMutation(LOGIN_USER);
  const [register, { error: registerError, data: registerData }] = useMutation(REGISTER_USER);
  const navigate = useNavigate();
  const saveToken = (token: string) => { localStorage.setItem("id_token", token)}; // Save token to localStorage };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      console.log("Login response data:", data);

      // Add the validation check here
      if (!data.loginUser.weight || !data.loginUser.height) {
        console.warn("Some optional fields are missing:", {
          weight: data.loginUser.weight,
          height: data.loginUser.height,
        });
      }
      // Proceed only if the token exists
      Auth.login(data.loginUser.token);
    } catch (e) {
      console.error("Error during login:", e);
    } finally {
      setFormState({ username: "", password: "" }); // Reset form state
    }
  };
  

  const handleRegisterSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await register({
        variables: { ...formState },
      });
      if (data) {
        alert("Registration successful! Please log in.");
        saveToken(data.loginUser.token);
      }
      navigate("/profile");
    } catch (e) {
      console.error(e);
    }
    setFormState({ username: "", password: "" });
  };

  return (
    <main>
      <div className="tamagotchi flex flex-col">
        <div className="screenStyle">
          {loginData || registerData ? (
            <p>
              Success! You may now head <Link to="/">back to the homepage.</Link>
            </p>
          ) : (
            <div className="flex items-start justify-center w-full flex-col">
              <img src="sprite.gif" alt="Tamagotchi Display" className="spriteStyle w-full h-2/3 object-cover rounded-lg mb-4" />
              <form className="formStyle flex flex-col w-full">
                <input placeholder="Your username" name="username" type="text" value={formState.username} onChange={handleChange} required className="mb-4 p-2 border border-gray-300 rounded" />
                <input placeholder="******" name="password" type="password" value={formState.password} onChange={handleChange} required className="mb-4 p-2 border border-gray-300 rounded" />
                <div className="flex justify-between">
                  <button type="button" onClick={handleRegisterSubmit} className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
                    Register
                  </button>
                  <button type="button" onClick={handleLoginSubmit} className="bg-green-500 text-white font-bold py-2 px-4 rounded">
                    Login
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="errorStyle">{(loginError || registerError) && <div>{(loginError ?? registerError)?.message}</div>}</div>
        </div>
        <div className="directionalButtons">
          <div>
            <button className="directionMiddle w-8 h-8 text-5xl mt-5">⬭</button>
          </div>
          <div className="bottomButtons flex w-20 justify-between">
            <button className="directionLeft w-8 h-8 text-5xl">⬭</button>
            <button className="directionRight  w-8 h-8 text-5xl">⬭</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
