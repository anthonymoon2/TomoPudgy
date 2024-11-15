import { NavLink } from "react-router-dom";
import "../../styles/App.css";

const Navbar = () => {
  return (
    <nav className="navbarStyle flex justify-between text-4xl tracking-[.75rem]">
      <div className="text-5xl">
        <NavLink to="/home" className="navbarLink">
          <h1>TAMAPUDGY</h1>
        </NavLink>
      </div>
      <div className="flex flex-wrap space-x-12">
        <NavLink to="/home" className="navbarLink">
          Home
        </NavLink>
        <NavLink to="/profile" className="navbarLink">
          Profile
        </NavLink>
        <NavLink to="/" className="navbarLink">
          Logout
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
