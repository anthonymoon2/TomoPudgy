import { NavLink } from "react-router-dom";
import "../../styles/App.css";

const Navbar = () => {
  return (
    <nav className="navbarStyle flex justify-between text-4xl tracking-[.75rem]">
      <div className="text-5xl">
        <h1>TAMAPUDGY</h1>
      </div>
      <div className="flex flex-wrap space-x-12">
        <h3 className="navbarLink">
          <NavLink to="/home" className="navbarLink">
            Home
          </NavLink>
        </h3>
        <h3 className="navbarLink">
          <NavLink to="/profile" className="navbarLink">
            Profile
          </NavLink>
        </h3>
      </div>
    </nav>
  );
};

export default Navbar;
