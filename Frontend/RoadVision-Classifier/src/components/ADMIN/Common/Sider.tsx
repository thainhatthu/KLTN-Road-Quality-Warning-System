import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdEngineering, MdDashboard } from "react-icons/md";
import PropTypes from "prop-types";
import logo from "../../../assets/img/logo.png";
const Sider: React.FC = () => {
  const location = useLocation();

  const NavLink: React.FC<{
    to: string;
    icon: React.ComponentType;
    text: string;
  }> = ({ to, icon: Icon, text }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-3 space-x-3 rounded-3xl transition-all duration-300 ${
          isActive
            ? "bg-[#23038C] text-white"
            : "text-[#595959] hover:bg-gray-400 hover:text-white"
        }`}
      >
        <Icon />
        <span>{text}</span>
      </Link>
    );
  };

  NavLink.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  return (
    <aside className="h-screen bg-white text-gray-800 w-55 flex flex-col justify-between">
      {/* Header */}
      <div className="relative flex flex-col items-center justify-start py-0">
        {/* Logo */}
        <img
          className="absolute top-0 w-32 h-32 -translate-y-4"
          src={logo}
          alt="Logo"
        />

        {/* ADMIN Text */}
        <h2 className="relative text-2xl font-bold text-[#002C6F] mt-[70px] z-10">
          ADMIN
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-4">
        <NavLink to="/dashboard" icon={MdDashboard} text="Dashboard" />
        <NavLink to="/user-management" icon={FaUser} text="Users" />
        <NavLink
          to="/technician-management"
          icon={MdEngineering}
          text="Technicians"
        />
      </nav>
    </aside>
  );
};

export default Sider;
