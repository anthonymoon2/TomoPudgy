import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER, REGISTER_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";
import "../../styles/App.css";

const Login = () => {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [login, { error: loginError, data: loginData }] = useMutation(LOGIN_USER);
  const [register, { error: registerError, data: registerData }] = useMutation(REGISTER_USER);

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
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }
    setFormState({ username: "", password: "" });
  };

  const handleRegisterSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await register({
        variables: { ...formState },
      });
      if (data) {
        alert("Registration successful! Please log in.");
      }
    } catch (e) {
      console.error(e);
    }
    setFormState({ username: "", password: "" });
  };

  return (
    <main>
      <div className="tamagotchi">
        <div className="screenStyle">
          {loginData || registerData ? (
            <p>
              Success! You may now head <Link to="/">back to the homepage.</Link>
            </p>
          ) : (
            <div className="flex items-start justify-center w-full flex-col">
              <img src="sprite.gif" alt="Tamagotchi Display" className="spriteStyle w-full h-2/3 object-cover rounded-lg mb-4" />
              <form className="formStyle flex flex-col w-full">
                <input
                  placeholder="Your username"
                  name="username"
                  type="text"
                  value={formState.username}
                  onChange={handleChange}
                  required
                  className="mb-4 p-2 border border-gray-300 rounded"
                />
                <input
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                  className="mb-4 p-2 border border-gray-300 rounded"
                />
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
          {(loginError || registerError) && <div>{(loginError ?? registerError)?.message}</div>}

          <div className="directionalButtons">
            <div className="horizontal-buttons flex space-x-2">
              <button className="direction-button left w-16 h-16 text-2xl">⬭</button>
              <button className="direction-button right w-16 h-16 text-2xl">⬭</button>
            </div>
            <button className="direction-button up w-16 h-16 text-2xl mt-2">⬭</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
