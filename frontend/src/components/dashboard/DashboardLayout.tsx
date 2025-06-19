"use client";

import React, { type ReactNode, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  Home,
  Calendar,
  Users,
  Settings,
  PieChart,
  DollarSign,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import "../../styles/dashboard.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const { getHostSpecificEvents } = useEvent();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName =
    user?.firstname && user?.lastname
      ? `${user.firstname} ${user.lastname}`
      : "User";
  const userRole =
    (user?.role?.toLowerCase() as "admin" | "host" | "guest") || "host";

  const getNavItems = () => {
    const commonItems = [
      {
        path: `/dashboard/${userRole}`,
        icon: <Home size={20} />,
        label: "Dashboard",
      },
      {
        path: "/dashboard/my-events",
        icon: <Calendar size={20} />,
        label:
          user.role === "guest" || user.role === "admin"
            ? "Events"
            : "My Events",
      },
      {
        path: "/dashboard/profile",
        icon: <User size={20} />,
        label: "Profile",
      },
      {
        path: "/dashboard/contributions",
        icon: <DollarSign size={20} />,
        label: "Contributions",
      },
    ];

    if (userRole === "admin") {
      return [
        ...commonItems,
        { path: "/dashboard/users", icon: <Users size={20} />, label: "Users" },
        { path: "/dashboard/request-assistance", icon: <Users size={20} />, label: "Request Assistance" },
        { path: "/dashboard/contactus", icon: <Users size={20} />, label: "Contact Us" },
        { path: "/dashboard/stories", icon: <Users size={20} />, label: "Stories" }, // Added Stories tab for admins
      ];
    } else if (userRole === "host") {
      return [
        ...commonItems,
        { path: "/dashboard/invite", icon: <Users size={20} />, label: "Invite" },
      ];
    } else {
      return [
        ...commonItems,
      ];
    }
  };

  const navItems = getNavItems();

  const notifications = [
    {
      id: 1,
      text: "No upcoming events",
      time: new Date().toLocaleTimeString(),
    },
  ];

  return (
    <div className="dashboard-container">
      {sidebarOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={closeSidebar}></div>
      )}

      <div className={`dashboard-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <Heart size={24} className="text-primary me-2" />
            <span>COMMONCHANGE</span>
          </Link>
          <button className="sidebar-close d-lg-none" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <h6 className="mb-0">{userName}</h6>
            <span className="user-role">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
        </div>

        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <Link
                to={item.path}
                className={`sidebar-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="sidebar-item mt-auto">
            <Link
              to="/"
              className="sidebar-link text-danger"
              onClick={() => {
                closeSidebar(), logout();
              }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle d-lg-none" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className="header-title">
              {navItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </h1>
          </div>

          <div className="header-right">
            <div className="dropdown user-dropdown mr-3 mb-3" ref={userDropdownRef}>
              <button
                className="btn btn-icon user-dropdown-toggle"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="user-avatar-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </button>

              <div
                className={`dropdown-menu dropdown-menu-end ${
                  dropdownOpen ? "show" : ""
                }`}
              >
                <div className="dropdown-header">
                  <span>Signed in as</span>
                  <h6 className="mb-0">{userName}</h6>
                </div>
                <Link to="/dashboard/profile" className="dropdown-item">
                  <User size={16} className="me-2" />
                  <span>Profile</span>
                </Link>
                <div className="dropdown-divider"></div>
                <Link
                  to="/"
                  className="dropdown-item text-danger"
                  onClick={logout}
                >
                  <LogOut size={16} className="me-2" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;