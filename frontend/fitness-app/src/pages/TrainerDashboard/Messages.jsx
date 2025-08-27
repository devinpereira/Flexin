import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { MdArrowBack } from 'react-icons/md';
import { getSocket, connectSocket, validateTextMessage, emitTextMessage, emitTypingStatus } from "../../utils/socket";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import ChatSidebar from '../../components/TrainerDashboard/ChatSidebar';
import ChatHeader from '../../components/TrainerDashboard/ChatHeader';
import MessageBubble from '../../components/TrainerDashboard/MessageBubble';
import MessageInput from '../../components/TrainerDashboard/MessageInput';
import AppointmentModal from '../../components/TrainerDashboard/AppointmentModal';
import { UserContext } from '../../context/UserContext';

const Chat = () => {
  const { subscriberId } = useParams();
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isValidSubscriberId = (id) => {
    return id && 
           id !== 'undefined' && 
           id !== 'null' && 
           id !== undefined && 
           id !== null;
  };
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
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messageAreaRef = useRef(null);
  const inputTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get current subscriber data from subscribers list or use mock data if not found
  const subscriber = useMemo(() => {
    if (!isValidSubscriberId(subscriberId)) return null;
    return subscribers.find(sub => sub.id === subscriberId) || {
      id: subscriberId,
      name: "Alex Johnson",
      image: "/src/assets/profile1.png",
      specialty: "Beginner",
      status: "Online",
      isTyping: false,
    };
  }, [subscriberId, subscribers]);

  const trainerId = user?.trainerId;

  const socket = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? connectSocket(token) : null;
  }, []);

  useEffect(() => {
    const fetchTrainerChats = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.CHAT.GET_TRAINER_CHATS(trainerId));
        const chatsData = response.data;
        
        const transformedSubscribers = chatsData
          .filter(chat => chat.user)
          .map(chat => {
            const user = typeof chat.user === 'object' ? chat.user : { _id: chat.user, fullName: 'Unknown User' };
            
            return {
              id: user._id || user.id || chat.user,
              name: user.fullName || `${user.firstName || 'Unknown'} ${user.lastName || 'User'}` || 'Unknown User',
              image: user.profileImage || user.profileImageUrl || user.profilePhoto || "/src/assets/profile1.png",
              specialty: "User",
              status: "Offline",
              lastMessage: chat.lastMessage ? {
                text: chat.lastMessage.content,
                time: chat.lastMessage.timestamp,
              } : null,
              isTyping: false,
            };
          })
          .filter((subscriber, index, self) => 
            index === self.findIndex(s => s.id === subscriber.id)
          );

        setSubscribers(transformedSubscribers);
        
        const unreadCountsObj = {};
        chatsData.forEach(chat => {
          if (chat.user && (chat.user._id || chat.user.id || chat.user)) {
            const userId = typeof chat.user === 'object' ? (chat.user._id || chat.user.id) : chat.user;
            unreadCountsObj[userId] = chat.unreadCount || 0;
          }
        });
        setUnreadCounts(unreadCountsObj);
        
      } catch (error) {
        console.error('Error fetching trainer chats:', error);
        setSubscribers([]);
      }
    };

    if (trainerId) {
      fetchTrainerChats();
    }
  }, [trainerId]);

  // --- Load previous messages ---
  useEffect(() => {
    const fetchChatMessages = async () => {
      // Only fetch if we have a valid subscriberId and trainerId
      if (isValidSubscriberId(subscriberId) && trainerId) {
        try {
          setMessages([]);
          
          const response = await axiosInstance.get(`${API_PATHS.CHAT.GET_CHAT}?trainerId=${trainerId}&userId=${subscriberId}`);
          const chatData = response.data;

          const transformedMessages = (chatData.messages || []).map(msg => ({
            id: msg._id,
            sender: user._id && (String(msg.sender) === String(user._id)) ? "trainer" : "user",
            text: msg.content,
            time: msg.timestamp,
            isRead: msg.isRead
          }));

          setMessages(transformedMessages);

          if (unreadCounts[subscriberId]) {
            setUnreadCounts(prev => ({
              ...prev,
              [subscriberId]: 0
            }));
          }
        } catch (error) {
          console.error('Error fetching chat messages:', error);
          setMessages([]);
        }
      }
    };

    fetchChatMessages();
  }, [subscriberId, trainerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      // Listen for incoming text messages
      socket.on("receiveTextMessage", (msg) => {
        if (msg.chatType === "text" && msg.from !== user._id) {
          const newMessage = {
            id: msg.messageId || `temp-${Date.now()}-${Math.random()}`,
            sender: user._id && (String(msg.from) === String(user._id)) ? "trainer" : "user",
            text: msg.message,
            time: msg.time || new Date().toISOString(),
            isRead: false
          };

          // Check if message already exists to prevent duplicates
          setMessages(prev => {
            const exists = prev.some(existingMsg => 
              existingMsg.text === newMessage.text && 
              existingMsg.sender === newMessage.sender &&
              Math.abs(new Date(existingMsg.time) - new Date(newMessage.time)) < 5000 // within 5 seconds
            );
            
            if (exists) {
              return prev;
            }
            
            return [...prev, newMessage];
          });

          // Update last message for the subscriber
          if (String(msg.from) !== String(user._id)) {
            setSubscribers(prev =>
              prev.map(sub =>
                sub.id === msg.from
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
        }
      });

      // Handle typing indicators
      socket.on("userTyping", ({ from, isTyping }) => {
        if (from === subscriberId) {
          setUserTyping(isTyping);
          setSubscribers(prev =>
            prev.map(sub =>
              sub.id === subscriberId
                ? { ...sub, isTyping }
                : sub
            )
          );
        }
      });

      // Handle message read status
      socket.on("messageRead", (data) => {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, isRead: true } : msg
        ));
      });

      // Handle websocket errors
      socket.on("error", (error) => {
        console.error("Socket error:", error.message);
      });

      socket.on("userStatusChange", ({ userId, status }) => {
        if (status === 'online') {
          setOnlineUsers(prev => [...prev, userId]);
        } else {
          setOnlineUsers(prev => prev.filter(id => id !== userId));
        }
      });

      return () => {
        socket.off("receiveTextMessage");
        socket.off("userTyping");
        socket.off("messageRead");
        socket.off("error");
        socket.off("userStatusChange");
      };
    }
  }, [socket, trainerId, subscriberId, user._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Handle typing indicator ---
  const handleTyping = () => {
    if (socket && isValidSubscriberId(subscriberId)) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      if (!typing) {
        setTyping(true);
        emitTypingStatus(subscriberId, true);
      }

      const timeout = setTimeout(() => {
        setTyping(false);
        emitTypingStatus(subscriberId, false);
      }, 3000);

      setTypingTimeout(timeout);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !isValidSubscriberId(subscriberId)) return;

    const messageContent = message.trim();
    
    // Validate text message
    const validation = validateTextMessage(messageContent);
    if (!validation.isValid) {
      console.error("Message validation failed:", validation.error);
      return;
    }

    setMessage('');

    try {
      const response = await axiosInstance.post(API_PATHS.CHAT.CREATE_OR_ADD_MESSAGE, { 
        trainerId, 
        userId: subscriberId, 
        content: messageContent 
      });
      
      const newMsg = {
        id: response.data._id || Date.now(),
        sender: "trainer",
        text: messageContent,
        time: new Date().toISOString(),
        isRead: false
      };

      setMessages(prev => [...prev, newMsg]);

      setSubscribers(prev =>
        prev.map(sub =>
          sub.id === subscriberId
            ? {
              ...sub,
              lastMessage: {
                text: messageContent,
                time: new Date().toISOString()
              }
            }
            : sub
        )
      );

      if (socket && subscriberId) {
        // Send text message via websocket for real-time delivery
        try {
          emitTextMessage(subscriberId, messageContent);
        } catch (socketError) {
          console.error("Socket error:", socketError.message);
        }

        if (typing) {
          setTyping(false);
          emitTypingStatus(subscriberId, false);
          if (typingTimeout) {
            clearTimeout(typingTimeout);
            setTypingTimeout(null);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(messageContent);
    }
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
    } else {
      setIsRecording(true);
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      inputTimeoutRef.current = timer;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

      setTimeout(() => {
        const userResponse = {
          id: Date.now() + 1,
          sender: 'user',
          text: 'Great! Looking forward to our discussion!',
          time: new Date(Date.now() + 1000 * 60).toISOString(),
        };
        setMessages(prev => [...prev, userResponse]);
      }, 1500);
    }, 500);
  };

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

  if (loading || !user || !user.trainerId || !user._id) {
    return (
      <TrainerDashboardLayout activeSection="Messages">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center p-6">
            <h3 className="text-white text-lg font-medium mb-2">Loading...</h3>
            <p className="text-gray-400">Please wait while we load your chat</p>
          </div>
        </div>
      </TrainerDashboardLayout>
    );
  }

  if (!subscriberId && subscribers.length > 0) {
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
        <div className="lg:col-span-1 hidden lg:block">
          <ChatSidebar
            subscribers={subscribers}
            onlineUsers={onlineUsers}
            unreadCounts={unreadCounts}
          />
        </div>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6 h-fit">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-4 sm:mb-8 flex flex-col h-[70vh]">
            <ChatHeader
              subscriber={subscriber}
              onShowAppointmentModal={() => setShowAppointmentModal(true)}
            />

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden"
              ref={messageAreaRef}
            >
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

              {userTyping && (
                <div className="flex justify-start mb-2">
                  <div className="bg-[#1A1A2F]/50 text-white rounded-lg py-2 px-3 flex items-center space-x-1 max-w-[100px]">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

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

        <div className="lg:col-span-1 space-y-4 sm:space-y-6 h-fit">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 sticky top-4">
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 sm:mb-4">
                <img
                  src={subscriber?.image || "/src/assets/profile1.png"}
                  alt={subscriber?.name || "Subscriber"}
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
