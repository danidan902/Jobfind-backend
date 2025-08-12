import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  CalendarPlus,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  Home,
  PlusCircle,
} from "lucide-react";
import clsx from "clsx";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setMenuOpen(false); // auto-close menu on route change
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItemClass = (path) =>
    clsx(
      "relative flex items-center gap-2 font-medium px-3 py-2 transition-all duration-200",
      location.pathname === path
        ? "text-blue-700 after:scale-x-100"
        : "text-gray-700 hover:text-blue-600 after:scale-x-0",
      "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600 after:origin-left after:transition-transform after:duration-300 after:scale-x-0"
    );

  return (
   <header className="sticky top-0 z-50 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg  border-blue-100 dark:border-gray-700">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 flex items-center gap-2"
        >
          <CalendarPlus className="w-6 h-6 text-blue-600" />
          Job Board
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden text-gray-700 focus:outline-none transition-transform"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation */}
        <nav
          className={clsx(
            "md:flex md:items-center md:space-x-6 absolute md:static top-[75px] left-0 w-full md:w-auto bg-white md:bg-transparent px-6 md:px-0 py-4 md:py-0 rounded-md md:rounded-none shadow-md md:shadow-none flex-col md:flex-row space-y-4 md:space-y-0 transition-all duration-300 ease-in-out",
            menuOpen ? "flex" : "hidden"
          )}
        >
          <Link to="/" className={navItemClass("/")}>
            <Home size={18} />
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className={navItemClass("/dashboard")}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/create" className={navItemClass("/create")}>
                <PlusCircle size={18} />
                Post Job
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium px-3 py-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navItemClass("/login")}>
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" className={navItemClass("/register")}>
                <UserPlus size={18} />
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
