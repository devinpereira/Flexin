import React, { useState, useEffect, useContext } from "react";
import {
  FaBell,
  FaUserPlus,
  FaHeart,
  FaComment,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { SocketContext } from "../../context/SocketContext";
import CommunityLayout from "../../layouts/CommunityLayout";

const CommunityNotifications = () => {
  const socket = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.NOTIFICATION.GET_NOTIFICATIONS}`
        );

        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Socket event listeners for real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on("likePostNotify", (data) => {
        setNotifications((prevNotifications) => [
          {
            id: data.notificationId,
            type: "like",
            user: {
              name: data.likerName,
              profileImage: data.likerProfileImage,
            },
            content: data.message,
            postImage: data.postImage,
            time: new Date().toISOString(),
            read: false,
          },
          ...prevNotifications,
        ]);
      });

      socket.on("commentPostNotify", (data) => {
        setNotifications((prevNotifications) => [
          {
            id: data.notificationId,
            type: "comment",
            user: {
              name: data.commenterName,
              profileImage: data.commenterProfileImage,
            },
            content: data.message,
            postImage: data.postImage,
            time: new Date().toISOString(),
            read: false,
          },
          ...prevNotifications,
        ]);
      });
    }

    return () => {
      if (socket) {
        socket.off("likePostNotify");
        socket.off("commentPostNotify");
      }
    };
  }, [socket]);

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    // In a real app, you would call an API to mark all as read on the server
  };

  // Get the appropriate icon for each notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <FaHeart className="text-red-500" />;
      case "comment":
        return <FaComment className="text-blue-400" />;
      case "follow":
        return <FaUserPlus className="text-green-400" />;
      default:
        return <FaBell className="text-[#f67a45]" />;
    }
  };

  // Handle follow request response
  const handleFollowRequest = (notificationId, accept) => {
    // In a real app, you would call an API to accept/decline the follow request
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, pending: false, accepted: accept }
          : notification
      )
    );
  };

  return (
    <CommunityLayout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white text-xl font-bold">Notifications</h3>
            {notifications.some((n) => !n.read) && (
              <button
                className="text-sm text-[#f67a45] hover:underline"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f67a45]"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`p-4 rounded-lg flex items-start ${
                    notification.read
                      ? "bg-[#1A1A2F]"
                      : "bg-[#1A1A2F]/80 border-l-4 border-[#f67a45]"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="p-2 rounded-full bg-[#1A1A2F] flex-shrink-0 mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={notification.user.profileImage}
                        alt={notification.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/src/assets/profile1.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white">
                          <span className="font-medium">
                            {notification.user.name}
                          </span>{" "}
                          {notification.content}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {formatDistanceToNow(new Date(notification.time), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>

                    {notification.type === "follow_request" &&
                      notification.pending && (
                        <div className="flex gap-2 mt-2">
                          <button
                            className="bg-[#f67a45] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            onClick={() =>
                              handleFollowRequest(notification.id, true)
                            }
                          >
                            <FaCheck size={12} />
                            Accept
                          </button>
                          <button
                            className="bg-[#1A1A2F] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            onClick={() =>
                              handleFollowRequest(notification.id, false)
                            }
                          >
                            <FaTimes size={12} />
                            Decline
                          </button>
                        </div>
                      )}

                    {notification.type === "follow_request" &&
                      !notification.pending && (
                        <p className="text-sm mt-1">
                          {notification.accepted ? (
                            <span className="text-green-500">
                              Request accepted
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Request declined
                            </span>
                          )}
                        </p>
                      )}

                    {notification.postImage && (
                      <div className="mt-3 ml-12">
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img
                            src={notification.postImage}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {!notification.read && (
                    <div className="w-3 h-3 rounded-full bg-[#f67a45] flex-shrink-0 mt-1"></div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="inline-block p-4 rounded-full bg-[#1A1A2F] mb-4">
                <FaBell size={24} className="text-[#f67a45]" />
              </div>
              <p className="text-white font-medium">No notifications yet</p>
              <p className="text-gray-400 mt-2">
                When you get notifications, they'll show up here
              </p>
            </div>
          )}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityNotifications;
