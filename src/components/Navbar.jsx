import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser, FaBars } from "react-icons/fa";
import { RiVideoUploadLine } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { logout, getCurrentUser } from "../features/UserSlice";
import UploadForm from "./UploadForm";
import UploadStatusDialog from "../components/UploadStatusDialog";
import SearchBar from "./Search";
import Avatar from "./Avatar";
import Notification from "./Notification";
import {
  selectUnreadNotificationsCount,
  fetchNotifications,
} from "../features/NotificationSlice";

const Navbar = ({ toggleMenu }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const toggleRef = useRef();
  const profileRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationRef = useRef();

  const unreadNotificationsCount = useSelector(selectUnreadNotificationsCount); // Get unread notifications count

  const currentUser = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleForm = () => {
    setIsFormOpen((prev) => !prev);
  };

  const handleCloseDialog = () => {
    setIsFormOpen(false);
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const toggleUserDialog = () => {
    setIsUserDialogOpen((prev) => !prev);
  };

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleProfileNavigation = () => {
    if (currentUser) {
      navigate(`/c/${currentUser.username}`);
    } else {
      navigate("/login");
    }
    setIsUserDialogOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsUserDialogOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg py-4 px-6 z-50 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMenu}
          className="text-gray-200 hover:text-white transition duration-300 ease-in-out"
        >
          <div className="p-3 rounded-full hover:bg-gray-700 transform hover:scale-110 transition-transform duration-300 ease-in-out">
            <FaBars size={24} />
          </div>
        </button>
        <Link
          to="/"
          className="text-3xl font-extrabold text-white hover:text-yellow-300 transition duration-300 ease-in-out"
        >
          StudyFlicks
        </Link>
      </div>

      <div className="hidden md:flex md:px-5">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 border rounded-lg p-3 bg-teal-600 text-white font-semibold cursor-pointer transition-transform transform hover:scale-105 hover:bg-teal-700"
          onClick={toggleForm}
        >
          <RiVideoUploadLine size={30} />
          <span className="hidden md:block text-base">Upload</span>
        </div>
        <div
          className="relative p-2 rounded-full cursor-pointer"
          onClick={toggleNotification}
          ref={notificationRef}
        >
          <IoNotifications size={30} className="text-white" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs text-center text-white bg-red-600 rounded-full">
              {unreadNotificationsCount}
            </span>
          )}
        </div>
        <div
          onClick={toggleUserDialog}
          className="relative cursor-pointer"
          ref={toggleRef}
        >
          <Avatar user={currentUser} type="medium" />
          {isUserDialogOpen && (
            <div className="absolute right-0 top-12 w-52 bg-white border rounded-lg shadow-lg z-10 text-sm">
              <div className="p-2 flex items-center gap-4">
                <Avatar user={currentUser} type="medium" />
                <div>
                  <span>{currentUser?.fullname}</span>
                  <p>@{currentUser?.username}</p>
                </div>
              </div>
              <div
                onClick={handleProfileNavigation}
                className="text-blue-600 cursor-pointer mx-2 p-2 hover:bg-gray-100"
                role="button"
                tabIndex="0"
              >
                View your profile
              </div>
              <hr />
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="text-red-500 cursor-pointer hover:bg-gray-100 w-full text-left p-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isNotificationOpen && <Notification />}
      {isFormOpen && <UploadForm handleCloseDialog={handleCloseDialog} />}
      <UploadStatusDialog />
    </nav>
  );
};

export default Navbar;
