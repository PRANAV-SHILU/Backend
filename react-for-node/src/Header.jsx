import { NavLink } from "react-router";

function Header() {
  return (
    <header className="header">
      <div className="header-brand">User Manager</div>
      <nav className="header-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Add User
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
