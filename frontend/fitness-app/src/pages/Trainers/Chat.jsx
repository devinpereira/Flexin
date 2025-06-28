import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { FaUserFriends, FaPaperclip, FaImage, FaFile, FaMicrophone, FaPhoneAlt, FaStopCircle, FaBars, FaPlay } from 'react-icons/fa';
import { MdExplore, MdArrowBack, MdSend } from 'react-icons/md';
import { BsCalendarWeek, BsEmojiSmile } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';
// --- Socket.IO client import ---
import { io } from "socket.io-client";

const Chat = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Trainers');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock trainer data
  const trainer = {
    id: trainerId,
    name: "John Smith",
    image: "/src/assets/trainer.png",
    specialty: "Strength & Conditioning",
    status: "Online"
  };

  // --- Replace with your actual user ID logic ---
  const userId = localStorage.getItem("userId") || "demoUserId";

  // --- Socket.IO connection (memoized) ---
  const socket = useMemo(() => io("http://localhost:8000", {
    auth: { token: localStorage.getItem("token") }
  }), []);



  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Listen for incoming messages from Socket.IO ---
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: msg.from === userId ? "user" : "trainer",
          text: msg.message,
          time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    });
    return () => socket.off("receiveMessage");
  }, [socket, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Send message via Socket.IO ---
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    socket.emit("sendMessage", { to: trainerId, message });
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      }
    ]);
    setMessage('');
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, you would upload the file to a server
    // For this demo, we'll just simulate a file message
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      file: {
        name: file.name,
        type: file.type,
        size: file.size
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setShowAttachmentOptions(false);
  };

  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setRecordingTime(0);

      // Simulate sending voice message
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        voiceMessage: true,
        duration: recordingTime,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };

      setMessages([...messages, newMessage]);
    } else {
      // Start recording
      setIsRecording(true);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Save timer ID for cleanup
      return () => clearInterval(timer);
    }
  };

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>

        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${activeSection === 'My Trainers'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/trainers');
              }}
            >
              <FaUserFriends size={20} />
              <span>My Trainers</span>
            </a>

            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${activeSection === 'Explore'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/explore');
              }}
            >
              <MdExplore size={20} />
              <span>Explore</span>
            </a>

            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center gap-3 px-6 py-2">
                <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                <span className="text-white">Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-4 sm:pt-8 px-4 overflow-x-hidden">
        {/* Desktop Side Navigation */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
            <div className="space-y-6 mt-8">
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === 'My Trainers'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/trainers');
                }}
              >
                <FaUserFriends size={20} />
                <span>My Trainers</span>
              </a>

              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === 'Explore'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/explore');
                }}
              >
                <MdExplore size={20} />
                <span>Explore</span>
              </a>

              <div className="mt-32 border-t border-white/20 pt-6">
                <div className="flex items-center gap-3">
                  <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                  <span className="text-white">Account</span>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="w-full md:ml-[275px] lg:ml-[300px] overflow-x-hidden">
          <button
            onClick={() => navigate(`/trainer-profile/${trainerId}`)}
            className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Trainer Profile</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Message area with fixed scrolling */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 h-fit">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-4 sm:mb-8 flex flex-col h-[70vh]">
                {/* Chat Header */}
                <div className="bg-[#1A1A2F] p-3 sm:p-4 flex items-center justify-between border-b border-gray-700">
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/profile1.png';
                        }}
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${trainer.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'
                        } border-2 border-[#1A1A2F]`}></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-medium">{trainer.name}</h3>
                      <p className="text-gray-400 text-xs">{trainer.status}</p>
                    </div>
                  </div>
                  <button
                    className="bg-[#f67a45]/20 text-[#f67a45] p-2 rounded-full hover:bg-[#f67a45]/30"
                    onClick={() => setShowAppointmentModal(true)}
                  >
                    <FaPhoneAlt size={16} />
                  </button>
                </div>

                {/* Messages Area - Fix scrolling issues */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
                  <div className="w-full">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 w-full`}
                      >
                        {msg.sender === 'trainer' && (
                          <img
                            src={trainer.image}
                            alt={trainer.name}
                            className="w-8 h-8 rounded-full mr-2 mt-1 object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/src/assets/profile1.png';
                            }}
                          />
                        )}
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${msg.sender === 'user'
                              ? 'bg-[#f67a45] text-white rounded-tr-none'
                              : 'bg-[#1A1A2F] text-white rounded-tl-none'
                            }`}
                        >
                          {msg.image && (
                            <div className="mb-2">
                              <img
                                src={msg.image}
                                alt="Shared"
                                className="rounded-lg max-w-full h-auto"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/src/assets/image-placeholder.jpg';
                                }}
                              />
                            </div>
                          )}

                          {msg.file && (
                            <div className="flex items-center bg-white/10 rounded-lg p-2 mb-2">
                              <FaFile className="text-white mr-2" />
                              <div className="overflow-hidden">
                                <p className="truncate text-white/90 text-sm">{msg.file.name}</p>
                                <p className="text-white/60 text-xs">
                                  {(msg.file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          )}

                          {msg.voiceMessage && (
                            <div className="flex items-center gap-3">
                              <button className="text-white p-1 bg-white/10 rounded-full">
                                <FaPlay size={12} />
                              </button>
                              <div className="w-32 h-1 bg-white/20 rounded-full">
                                <div className="h-full w-1/3 bg-white rounded-full"></div>
                              </div>
                              <span className="text-white/60 text-xs">{formatTime(msg.duration)}</span>
                            </div>
                          )}

                          {msg.text && <p>{msg.text}</p>}

                          <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-white/50'
                            }`}>
                            {msg.time}
                            {msg.sender === 'user' && (
                              <span>
                                {msg.isRead ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 9.586l-2.293-2.293z" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {msg.sender === 'user' && (
                          <img
                            src="/src/assets/profile1.png"
                            alt="You"
                            className="w-8 h-8 rounded-full ml-2 mt-1 object-cover flex-shrink-0"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                <div className="bg-[#1A1A2F] p-3 border-t border-gray-700 flex-shrink-0">
                  {isRecording ? (
                    <div className="flex items-center justify-between bg-[#121225] rounded-full px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-white">{formatTime(recordingTime)}</span>
                      </div>
                      <button
                        className="bg-red-500 text-white p-2 rounded-full"
                        onClick={toggleRecording}
                      >
                        <FaStopCircle size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          className="text-white/70 hover:text-white p-2"
                          onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                        >
                          <FaPaperclip size={18} />
                        </button>

                        {showAttachmentOptions && (
                          <div className="absolute bottom-12 left-0 bg-[#121225] rounded-lg shadow-lg p-2 flex flex-col gap-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <button
                              className="flex items-center gap-2 p-2 hover:bg-[#1A1A2F] rounded text-white text-sm"
                              onClick={() => {
                                fileInputRef.current.accept = "image/*";
                                fileInputRef.current.click();
                              }}
                            >
                              <FaImage size={16} />
                              <span>Image</span>
                            </button>
                            <button
                              className="flex items-center gap-2 p-2 hover:bg-[#1A1A2F] rounded text-white text-sm"
                              onClick={() => {
                                fileInputRef.current.accept = ".pdf,.doc,.docx,.xlsx";
                                fileInputRef.current.click();
                              }}
                            >
                              <FaFile size={16} />
                              <span>Document</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 bg-[#121225] rounded-full px-4 py-2 flex items-center">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="bg-transparent text-white w-full focus:outline-none"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            className="text-white/70 hover:text-white p-1"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          >
                            <BsEmojiSmile size={18} />
                          </button>
                        </div>
                      </div>

                      {message.trim() ? (
                        <button
                          className="bg-[#f67a45] text-white p-3 rounded-full"
                          onClick={handleSendMessage}
                        >
                          <MdSend size={18} />
                        </button>
                      ) : (
                        <button
                          className="bg-[#f67a45] text-white p-3 rounded-full"
                          onClick={toggleRecording}
                        >
                          <FaMicrophone size={18} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Trainer Info - Fixed for proper display */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6 h-fit">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 sticky top-4">
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 sm:mb-4">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/src/assets/profile1.png';
                      }}
                    />
                  </div>
                  <h3 className="text-white text-lg font-medium text-center">{trainer.name}</h3>
                  <p className="text-gray-400 mb-2 text-sm text-center">{trainer.specialty}</p>
                  <a
                    onClick={() => navigate(`/trainer-profile/${trainerId}`)}
                    className="text-[#f67a45] hover:underline text-sm cursor-pointer"
                  >
                    View Profile
                  </a>
                </div>

                <div className="grid gap-2">
                  <button
                    onClick={() => navigate(`/schedule/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <BsCalendarWeek size={14} />
                    <span>Schedule</span>
                  </button>

                  <button
                    onClick={() => navigate(`/meal-plan/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <GiMeal size={14} />
                    <span>Meal Plan</span>
                  </button>

                  <button
                    className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <BiChat size={14} />
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => navigate(`/subscription/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <RiVipDiamondLine size={14} />
                    <span>Subscription</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] rounded-xl max-w-md w-full p-4 sm:p-6">
            <h3 className="text-white text-lg font-bold mb-4">Schedule a Call</h3>

            <p className="text-white/70 mb-4">Set up a video call with {trainer.name} to discuss your fitness goals in detail.</p>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">Select Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Select Time</label>
              <input
                type="time"
                className="w-full px-4 py-2 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  // In a real app, this would schedule the appointment
                  setTimeout(() => {
                    const appointmentMsg = {
                      id: messages.length + 1,
                      sender: 'user',
                      text: 'I\'ve scheduled a video call for tomorrow at 3:00 PM.',
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isRead: false
                    };
                    setMessages(prev => [...prev, appointmentMsg]);

                    // Simulate trainer response
                    setTimeout(() => {
                      const trainerResponse = {
                        id: messages.length + 2,
                        sender: 'trainer',
                        text: 'Great! I\'ve confirmed our video call for tomorrow at 3:00 PM. Looking forward to our discussion!',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      setMessages(prev => [...prev, trainerResponse]);
                    }, 1500);
                  }, 500);
                }}
                className="px-4 py-2 bg-[#f67a45] rounded-lg text-white hover:bg-[#e56d3d]"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
