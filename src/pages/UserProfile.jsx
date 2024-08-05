import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import VideoCard from "../components/videos/VideoCard";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { fetchUserVideos } from "../features/UserSlice";
import Avatar from "../components/Avatar";

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [activeSection, setActiveSection] = useState("videos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userVideos = useSelector((state) => state.user.videos);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/c/${username}`);
        setProfile(response.data.data);
        setSubscribed(response.data.data.isSubscribed);
        setSubscribersCount(response.data.data.subscribersCount);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
        setLoading(false);
      }
    };

    dispatch(fetchUserVideos(username));

    const fetchUserPlaylists = async () => {
      try {
        const response = await axiosInstance.get(`/playlist/${username}`);
        setPlaylists(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    };

    fetchUserProfile();
    fetchUserPlaylists();
  }, [username, dispatch]);

  const handleSubscription = async () => {
    if (!user?._id) return;

    try {
      await axiosInstance.post(`subscription/toggle/${profile._id}`);
      setSubscribed(!isSubscribed);
      setSubscribersCount(
        isSubscribed ? subscribersCount - 1 : subscribersCount + 1
      );
    } catch (error) {
      console.error("Error:", error.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full mx-auto px-8 bg-gray-100 min-h-screen">
      <div className="relative w-full">
        {/* Cover Image */}
        {profile?.coverImage ? (
          <div className="relative pb-[33.33%]">
            <img
              src={profile.coverImage}
              alt="Cover"
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-md"
            />
          </div>
        ) : (
          <div className="relative pb-[20%] bg-gray-300 rounded-t-md">
            <div className="absolute top-1/2 left-1/2 text-3xl text-gray-500 transform -translate-x-1/2 -translate-y-1/2">
              No Cover
            </div>
          </div>
        )}

        {/* Avatar */}
        <div className="absolute bottom-[-75px] left-1/2 transform -translate-x-1/2 flex justify-center items-center w-full">
          <Avatar user={profile} type="large" />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-32 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          {profile?.fullname}
        </h1>
        <p className="text-lg text-gray-600">@{profile?.username}</p>
        <div className="mt-4 flex justify-center items-center space-x-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-700">
              <strong>Subscribers:</strong> {subscribersCount}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-700">
              <strong>Subscribed to:</strong>{" "}
              {profile?.channelSubscribedToCount}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-gray-700">
              <strong>Videos:</strong> {userVideos.length}
            </p>
          </div>
        </div>
        {user?.username === username ? null : (
          <div className="mt-4">
            <button
              onClick={handleSubscription}
              className={`px-6 py-2 rounded-full text-white font-semibold ${
                isSubscribed
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8">
        <div className="flex justify-around border-b border-gray-300">
          <button
            className={`py-2 px-4 text-lg font-medium ${
              activeSection === "videos"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "border-b-2 border-transparent text-gray-600"
            } hover:border-blue-500`}
            onClick={() => setActiveSection("videos")}
          >
            Videos
          </button>
          <button
            className={`py-2 px-4 text-lg font-medium ${
              activeSection === "playlists"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "border-b-2 border-transparent text-gray-600"
            } hover:border-blue-500`}
            onClick={() => setActiveSection("playlists")}
          >
            Playlists
          </button>
          <button
            className={`py-2 px-4 text-lg font-medium ${
              activeSection === "about"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "border-b-2 border-transparent text-gray-600"
            } hover:border-blue-500`}
            onClick={() => setActiveSection("about")}
          >
            About
          </button>
        </div>
      </div>

      {/* Conditional Rendering */}
      <div className="mt-8">
        {activeSection === "videos" && (
          <>
            {userVideos.length === 0 ? (
              <p className="text-center text-gray-600">No videos found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </>
        )}
        {activeSection === "playlists" && (
          <div>
            {playlists.length === 0 ? (
              <p className="text-center text-gray-600">No playlists found.</p>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="bg-white p-4 rounded-lg shadow-md mb-4"
                >
                  <h3 className="text-xl font-bold text-gray-800">
                    {playlist.title}
                  </h3>
                  <p className="text-gray-600">{playlist.description}</p>
                </div>
              ))
            )}
          </div>
        )}
        {activeSection === "about" && (
          <div className="flex justify-center items-center">
            <p className="text-gray-700">
              {profile?.about || "No information available."}
            </p>
          </div>
        )}
      </div>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Spinner loading={loading} />
        </div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  );
};

export default UserProfile;
