import { NavLink } from "react-router-dom";
import "../../styles/App.css";
import AuthService from "../../utils/auth.js";

const Navbar = () => {
  const handleLogout = () => {
    AuthService.logout(); // Call the logout method
  };

  return (
    <nav className="navbarStyle text-5xl tracking-[.75rem]">
      <div className="max-w-screen-l flex flex-wrap items-center justify-between mx-auto p-2">
        <NavLink to="/me" className="navbarLink flex items-center space-x-3 rtl:space-x-reverse">
          <h1>TAMAPUDGY</h1>
        </NavLink>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-blue-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0">
            <li>
              <NavLink to="/me" className="navbarLink block py-2 px-3 text-white rounded md:bg-transparent md:p-0 dark:text-white" aria-current="page">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className="navbarLink block py-2 px-3 text-gray-900 rounded md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white 0 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className="navbarLink block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={handleLogout}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
