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
        <div className="loginStyle flex items-center justify-center min-h-screen">
          <div>
            {loginData || registerData ? (
              <p>
                Success! You may now head <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <form className="flex flex-col p-6 rounded-lg shadow-lg w-full max-w-sm">
                <input placeholder="Your username" name="username" type="text" value={formState.username} onChange={handleChange} required />
                <input placeholder="******" name="password" type="password" value={formState.password} onChange={handleChange} required />
                <div className="flex justify-between">
                  {/* Login Button */}
                  <button type="button" onClick={handleRegisterSubmit}>
                    Register
                  </button>
                  <button type="button" onClick={handleLoginSubmit}>
                    Login
                  </button>
                  {/* Register Button */}
                </div>
              </form>
            )}

            {(loginError || registerError) && <div>{(loginError ?? registerError)?.message}</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
