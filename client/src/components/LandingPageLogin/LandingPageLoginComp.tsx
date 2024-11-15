import { useState, type FormEvent, type ChangeEvent, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER, REGISTER_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";
import "../../styles/App.css";

const Login = () => {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [login, { error: loginError, data: loginData }] = useMutation(LOGIN_USER);
  const [register, { error: registerError, data: registerData }] = useMutation(REGISTER_USER);
  const navigate = useNavigate();
  const [currentFocus, setCurrentFocus] = useState(0);
  const inputRefs: [
    React.RefObject<HTMLInputElement>, // Username input
    React.RefObject<HTMLInputElement>, // Password input
    React.RefObject<HTMLButtonElement>, // Register button
    React.RefObject<HTMLButtonElement> // Login button
  ] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
  ];
  

  const focusInput = (index: any) => {
    if (inputRefs[index]?.current) {
      inputRefs[index].current.focus();
      setCurrentFocus(index);
    }
  };

  const handleDirectionClick = (direction: any) => {
    if (direction === "left" && currentFocus > 0) {
      focusInput(currentFocus - 1);
    } else if (direction === "right" && currentFocus < inputRefs.length - 1) {
      focusInput(currentFocus + 1);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleLoginSubmit = async () => {

    try {
      const { data } = await login({
        variables: { ...formState },
      });
      Auth.login(data.login.token);
      navigate("/home");
    } catch (e) {
      console.error(e);
    }
    setFormState({ username: "", password: "" });
  };

  const handleRegisterSubmit = async () => {

    try {
      const { data } = await register({
        variables: { ...formState },
      });
      if (data) {
        alert("Registration successful! Please log in.");
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
                <input
                  ref={inputRefs[0]}
                  placeholder="Your username"
                  name="username"
                  type="text"
                  value={formState.username}
                  onChange={handleChange}
                  required
                  className={`mb-4 p-2 border rounded ${currentFocus === 0 ? "border-purple-500 ring-2 ring-purple-500" : "border-gray-300"}`}
                  tabIndex={-1}
                  disabled={currentFocus !== 0}
                />
                <input
                  ref={inputRefs[1]}
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                  className={`mb-4 p-2 border rounded ${currentFocus === 1 ? "border-purple-500 ring-2 ring-purple-500" : "border-gray-300"}`}
                  tabIndex={-1}
                  disabled={currentFocus !== 1}
                />
                <div className="flex justify-between">
                  <button
                    ref={inputRefs[2]}
                    type="button"
                    onClick={handleRegisterSubmit}
                    className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${currentFocus === 2 ? "border-purple-500 ring-4 ring-purple-500" : "border-gray-300"}`}
                    tabIndex={-1}
                    disabled={currentFocus !== 2}
                  >
                    Register
                  </button>
                  <button
                    ref={inputRefs[3]}
                    type="button"
                    onClick={handleLoginSubmit}
                    className={`bg-green-500 text-white font-bold py-2 px-4 rounded ${currentFocus === 3 ? "border-purple-500 ring-4 ring-purple-500" : "border-gray-300"}`}
                    tabIndex={-1}
                    disabled={currentFocus !== 3}
                  >
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
            {/* Middle button logic */}
            <button
              className="directionMiddle w-8 h-8 text-5xl mt-5"
              tabIndex={-1}
              onClick={() => {
                if (currentFocus === 0 || currentFocus === 1) {
                  // Focus the input so the user can start typing
                  inputRefs[currentFocus]?.current?.focus();
                } else if (currentFocus === 2) {
                  // Trigger Register if focused
                  handleRegisterSubmit();
                } else if (currentFocus === 3) {
                  // Trigger Login if focused
                  handleLoginSubmit();
                }
              }}
            >
              ⬭
            </button>
          </div>
          <div className="bottomButtons flex w-20 justify-between">
            <button className="directionLeft w-8 h-8 text-5xl" tabIndex={-1} onClick={() => handleDirectionClick("left")}>
              ⬭
            </button>
            <button className="directionRight  w-8 h-8 text-5xl" tabIndex={-1} onClick={() => handleDirectionClick("right")}>
              ⬭
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
