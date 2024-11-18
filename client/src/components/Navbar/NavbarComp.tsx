import { NavLink } from "react-router-dom";
import "../../styles/App.css";
import AuthService from "../../utils/auth.js"

const Navbar = () => {

  const handleLogout = () => {
    AuthService.logout(); // Call the logout method
  };

  return (
    <nav className="navbarStyle flex justify-between text-4xl tracking-[.75rem]">
      <div className="text-5xl">
        <NavLink to="/me" className="navbarLink">
          <h1>TAMAPUDGY</h1>
        </NavLink>
      </div>
      <div className="flex flex-wrap space-x-12">
        <NavLink to="/me" className="navbarLink">
          Home
        </NavLink>
        <NavLink to="/profile" className="navbarLink">
          Profile
        </NavLink>
        <NavLink to="/" className="navbarLink" onClick={handleLogout}>
          Logout
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
