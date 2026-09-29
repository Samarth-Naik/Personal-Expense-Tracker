import { useState } from "react";
import type { User } from "firebase/auth";
import { NavLink } from "react-router-dom";

type HeaderProps = {
  user: User;
  onLogout: () => void;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `header-nav-link${isActive ? " is-active" : ""}`;

export function Header({ user, onLogout }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Expense Tracker</h1>

        <nav className="header-nav">
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>
        </nav>

        <div className="user-section">
          <span className="desktop-user">{user.displayName}</span>

          <button
            className="profile-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {user.photoURL ? <img src={user.photoURL} alt="Profile" /> : "👤"}
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <NavLink
                to="/dashboard"
                className="profile-menu-nav-link"
                onClick={() => setShowProfileMenu(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/categories"
                className="profile-menu-nav-link"
                onClick={() => setShowProfileMenu(false)}
              >
                Categories
              </NavLink>
              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}