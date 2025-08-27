import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { MdArrowBack } from 'react-icons/md';
// --- Socket.IO client import ---
import { getSocket, connectSocket } from "../../utils/socket";
import { BASE_URL } from "../../utils/apiPaths";

// Import components
import ChatSidebar from '../../components/TrainerDashboard/ChatSidebar';
import ChatHeader from '../../components/TrainerDashboard/ChatHeader';
import MessageBubble from '../../components/TrainerDashboard/MessageBubble';
import MessageInput from '../../components/TrainerDashboard/MessageInput';
import AppointmentModal from '../../components/TrainerDashboard/AppointmentModal';

const Chat = () => {
  const { subscriberId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const messageAreaRef = useRef(null);
  const inputTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get current subscriber data from subscribers list or use mock data if not found
  const subscriber = useMemo(() => {
    if (!subscriberId) return null;
    return subscribers.find(sub => sub.id === subscriberId) || {
      id: subscriberId,
      name: "Alex Johnson",
      image: "/src/assets/profile1.png",
      specialty: "Beginner",
      status: "Online",
      isTyping: false,
    };
  }, [subscriberId, subscribers]);

  // --- Get trainer ID ---
  const trainerId = localStorage.getItem("trainerId") || "demoTrainerId";

  // --- Socket.IO connection ---
  const socket = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? connectSocket(token) : null;
  }, []);

  // --- Initialize mock subscribers data ---
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const mockSubscribers = [
      {
        id: "sub1",
        name: "Alex Johnson",
        image: "/src/assets/profile1.png",
        specialty: "Beginner",
        status: "Online",
        lastMessage: {
          text: "How's my progress on the routine?",
          time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        },
      },
      {
        id: "sub2",
        name: "Sarah Williams",
        image: "/src/assets/posts/workout1.png",
        specialty: "Intermediate",
        status: "Offline",
        lastMessage: {
          text: "Thanks for the new schedule!",
          time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
      },
      {
        id: "sub3",
        name: "Mike Chen",
        image: "/src/assets/medal2.png",
        specialty: "Advanced",
        status: "Online",
        lastMessage: {
          text: "I completed yesterday's workout",
          time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
        },
      },
    ];

    setSubscribers(mockSubscribers);
    setOnlineUsers(["sub1", "sub3"]);
    setUnreadCounts({
      sub1: 2,
      sub2: 0,
      sub3: 5,
    });
  }, []);

  // --- Load previous messages ---
  useEffect(() => {
    if (subscriberId) {
      // In a real app, you would fetch messages from an API
      // For now, we'll use mock data
      const mockPreviousMessages = [
        {
          id: 1,
          sender: "trainer",
          text: "Good morning! How are you feeling today?",
          time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          isRead: true
        },
        {
          id: 2,
          sender: "user",
          text: "Morning! I'm feeling great. The new workout routine is really helping.",
          time: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
        },
        {
          id: 3,
          sender: "trainer",
          text: "That's fantastic to hear! Make sure to stretch properly before starting today's session.",
          time: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
          isRead: true
        },
        {
          id: 4,
          sender: "user",
          text: "Will do. I had a question about the nutrition plan though. Can I substitute quinoa with rice?",
          time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
      ];

      setMessages(mockPreviousMessages);

      // Mark messages as read when opening chat
      if (unreadCounts[subscriberId]) {
        setUnreadCounts(prev => ({
          ...prev,
          [subscriberId]: 0
        }));
      }
    }
  }, [subscriberId]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Listen for incoming messages from Socket.IO ---
  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on("receiveMessage", (msg) => {
        const newMessage = {
          id: Date.now(),
          sender: msg.from === trainerId ? "trainer" : "user",
          text: msg.message,
          time: msg.time || new Date().toISOString(),
        };

        setMessages(prev => [...prev, newMessage]);

        // Update last message for the subscriber
        if (msg.from !== trainerId) {
          setSubscribers(prev =>
            prev.map(sub =>
              sub.id === subscriberId
                ? {
                  ...sub,
                  lastMessage: {
                    text: msg.message,
                    time: msg.time || new Date().toISOString()
                  }
                }
                : sub
            )
          );
        }
      });

      // Listen for typing indicators
      socket.on("userTyping", ({ userId, isTyping }) => {
        if (userId === subscriberId) {
          setSubscribers(prev =>
            prev.map(sub =>
              sub.id === subscriberId
                ? { ...sub, isTyping }
                : sub
            )
          );
        }
      });

      // Listen for online status updates
      socket.on("userStatusChange", ({ userId, status }) => {
        if (status === 'online') {
          setOnlineUsers(prev => [...prev, userId]);
        } else {
          setOnlineUsers(prev => prev.filter(id => id !== userId));
        }
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("userTyping");
        socket.off("userStatusChange");
      };
    }
  }, [socket, trainerId, subscriberId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Handle typing indicator ---
  const handleTyping = () => {
    if (socket && subscriberId) {
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // If not currently set as typing, emit event
      if (!typing) {
        setTyping(true);
        socket.emit("typing", { to: subscriberId, isTyping: true });
      }

      // Set timeout to stop typing indicator after 3 seconds of inactivity
      const timeout = setTimeout(() => {
        setTyping(false);
        socket.emit("typing", { to: subscriberId, isTyping: false });
      }, 3000);

      setTypingTimeout(timeout);
    }
  };

  // --- Send message via Socket.IO ---
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "trainer",
      text: message,
      time: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMsg]);

    // Update last message for the subscriber
    setSubscribers(prev =>
      prev.map(sub =>
        sub.id === subscriberId
          ? {
            ...sub,
            lastMessage: {
              text: message,
              time: new Date().toISOString()
            }
          }
          : sub
      )
    );

    // Send message via socket
    if (socket && subscriberId) {
      socket.emit("sendMessage", { to: subscriberId, message });

      // Stop typing indicator
      if (typing) {
        setTyping(false);
        socket.emit("typing", { to: subscriberId, isTyping: false });
        if (typingTimeout) {
          clearTimeout(typingTimeout);
          setTypingTimeout(null);
        }
      }
    }

    setMessage('');
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newMessage = {
      id: Date.now(),
      sender: 'trainer',
      file: {
        name: file.name,
        type: file.type,
        size: file.size
      },
      time: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);

    // In a real implementation, you would upload the file to a server
    // and send the URL via socket
  };

  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      const recordedDuration = recordingTime;
      setRecordingTime(0);

      const newMessage = {
        id: Date.now(),
        sender: 'trainer',
        voiceMessage: true,
        duration: recordedDuration,
        time: new Date().toISOString(),
        isRead: false
      };

      setMessages(prev => [...prev, newMessage]);

      // In a real implementation, you would upload the recording to a server
      // and send the URL via socket
    } else {
      setIsRecording(true);
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Store interval ID for cleanup
      inputTimeoutRef.current = timer;
    }
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle appointment scheduling
  const handleScheduleAppointment = ({ date, time }) => {
    setShowAppointmentModal(false);

    const formattedDate = new Date(date);
    const formattedTime = new Date(`${date}T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    setTimeout(() => {
      const appointmentMsg = {
        id: Date.now(),
        sender: 'trainer',
        text: `I've scheduled a video call for ${formattedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })} at ${formattedTime}.`,
        time: new Date().toISOString(),
        isRead: false
      };
      setMessages(prev => [...prev, appointmentMsg]);

      // Simulate user response
      setTimeout(() => {
        const userResponse = {
          id: Date.now() + 1,
          sender: 'user',
          text: 'Great! Looking forward to our discussion!',
          time: new Date(Date.now() + 1000 * 60).toISOString(), // 1 minute later
        };
        setMessages(prev => [...prev, userResponse]);
      }, 1500);
    }, 500);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (inputTimeoutRef.current) {
        clearInterval(inputTimeoutRef.current);
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  if (!subscriberId && subscribers.length > 0) {
    // If no subscriber selected, navigate to first subscriber
    return (
      <TrainerDashboardLayout activeSection="Messages">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-1">
            <ChatSidebar
              subscribers={subscribers}
              onlineUsers={onlineUsers}
              unreadCounts={unreadCounts}
            />
          </div>
          <div className="lg:col-span-2 hidden lg:flex items-center justify-center h-[70vh] bg-[#121225] border border-[#f67a45]/30 rounded-lg">
            <div className="text-center p-6">
              <h3 className="text-white text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a subscriber from the list to start chatting</p>
            </div>
          </div>
        </div>
      </TrainerDashboardLayout>
    );
  }

  return (
    <TrainerDashboardLayout activeSection="Messages">
      {/* Mobile Back Button */}
      <div className="lg:hidden">
        <button
          onClick={() => navigate("/trainer/subscribers")}
          className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
        >
          <MdArrowBack size={20} />
          <span>Back to Subscribers</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Chat Sidebar (only visible on large screens) */}
        <div className="lg:col-span-1 hidden lg:block">
          <ChatSidebar
            subscribers={subscribers}
            onlineUsers={onlineUsers}
            unreadCounts={unreadCounts}
          />
        </div>

        {/* Message area */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 h-fit">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-4 sm:mb-8 flex flex-col h-[70vh]">
            {/* Chat Header */}
            <ChatHeader
              subscriber={subscriber}
              onShowAppointmentModal={() => setShowAppointmentModal(true)}
            />

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden"
              ref={messageAreaRef}
            >
              {/* Date separator */}
              <div className="flex justify-center my-4">
                <span className="bg-[#1A1A2F] text-gray-400 text-xs px-4 py-1 rounded-full">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="w-full">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    subscriberImage={subscriber?.image}
                    formatTime={formatTime}
                  />
                ))}
              </div>

              {/* Typing indicator */}
              {subscriber?.isTyping && (
                <div className="flex justify-start mb-2">
                  <div className="bg-[#1A1A2F]/50 text-white rounded-lg py-2 px-3 flex items-center space-x-1 max-w-[100px]">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing-dot1"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing-dot2"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-typing-dot3"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <MessageInput
              message={message}
              setMessage={(val) => {
                setMessage(val);
                handleTyping();
              }}
              handleSendMessage={handleSendMessage}
              handleFileUpload={handleFileUpload}
              isRecording={isRecording}
              recordingTime={recordingTime}
              toggleRecording={toggleRecording}
              formatTime={formatTime}
            />
          </div>
        </div>

        {/* Sidebar - Subscriber Info */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6 h-fit">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 sticky top-4">
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 sm:mb-4">
                <img
                  src={subscriber?.image}
                  alt={subscriber?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/profile1.png';
                  }}
                />
              </div>
              <h3 className="text-white text-lg font-medium text-center">{subscriber?.name}</h3>
              <p className="text-gray-400 mb-2 text-sm text-center">{subscriber?.specialty}</p>
              <a
                onClick={() => navigate(`/trainer/subscriber-profile/${subscriberId}`)}
                className="text-[#f67a45] hover:underline text-sm cursor-pointer"
              >
                View Profile
              </a>
            </div>
            <div className="grid gap-2">
              <button
                onClick={() => navigate(`/trainer/subscriber-profile/${subscriberId}`)}
                className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <span>Profile</span>
              </button>
              <button
                className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          subscriber={subscriber}
          onClose={() => setShowAppointmentModal(false)}
          onSchedule={handleScheduleAppointment}
        />
      )}
    </TrainerDashboardLayout>
  );
};

export default Chat;
