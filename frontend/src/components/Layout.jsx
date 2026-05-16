import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="header">
        <NavLink to="/" className="logo">
          Notes<span>Maker</span>
        </NavLink>
        <nav className="nav">
          {isAuthenticated && (
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              My Notes
            </NavLink>
          )}
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
            About
          </NavLink>
          {isAuthenticated ? (
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <NavLink to="/login" className="btn btn-ghost">
              Log in
            </NavLink>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
