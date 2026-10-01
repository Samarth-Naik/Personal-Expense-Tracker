import { useState } from "react";
import type { User } from "firebase/auth";
import { NavLink } from "react-router-dom";

type HeaderProps = {
  user: User;
  onLogout: () => void;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `header-nav-link${isActive ? " is-active" : ""}`;

const sidePanelLinkClass = ({ isActive }: { isActive: boolean }) =>
  `side-panel-link${isActive ? " is-active" : ""}`;

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function CategoriesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.59 13.41 13.42 20.59a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const closePanel = () => setIsPanelOpen(false);

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <button
            type="button"
            className="hamburger-button"
            aria-label="Open menu"
            onClick={() => setIsPanelOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          <h1>Expense Tracker</h1>
        </div>

        <nav className="header-nav">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>
          <button
            type="button"
            className="header-nav-link header-nav-logout"
            onClick={onLogout}
          >
            Logout
          </button>
        </nav>

        <div className="user-section">
          <span className="desktop-user">{user.displayName}</span>

          <div className="profile-avatar" aria-hidden="true">
            {user.photoURL ? <img src={user.photoURL} alt="" /> : "👤"}
          </div>
        </div>
      </div>

      <div
        className={`side-panel-backdrop${isPanelOpen ? " is-visible" : ""}`}
        onClick={closePanel}
        aria-hidden="true"
      />

      <nav
        className={`side-panel${isPanelOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        <button
          type="button"
          className="side-panel-close"
          aria-label="Close menu"
          onClick={closePanel}
        >
          ✕
        </button>

        <div className="side-panel-links">
          <NavLink
            to="/"
            end
            className={sidePanelLinkClass}
            onClick={closePanel}
          >
            <HomeIcon />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className={sidePanelLinkClass}
            onClick={closePanel}
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/categories"
            className={sidePanelLinkClass}
            onClick={closePanel}
          >
            <CategoriesIcon />
            <span>Categories</span>
          </NavLink>
        </div>

        <button
          type="button"
          className="side-panel-link side-panel-logout"
          onClick={onLogout}
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </nav>
    </header>
  );
}