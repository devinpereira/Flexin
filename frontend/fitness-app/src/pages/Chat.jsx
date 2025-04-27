import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FaUserFriends, FaPaperclip, FaImage, FaFile, FaMicrophone, FaPhoneAlt, FaStopCircle, FaBars } from 'react-icons/fa';
import { MdExplore, MdArrowBack, MdSend } from 'react-icons/md';
import { BsCalendarWeek, BsEmojiSmile } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';

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

  // Sample initial messages
  useEffect(() => {
    setMessages([
      { id: 1, sender: 'trainer', text: 'Hello! How can I help you today?', time: '09:30 AM' },
      { id: 2, sender: 'user', text: 'Hi, I wanted to ask about my training program', time: '09:31 AM' },
      { id: 3, sender: 'trainer', text: 'Sure! Is there anything specific you want to know about?', time: '09:32 AM' },
      { id: 4, sender: 'user', text: 'Yes, I was wondering if I could modify some exercises due to my knee injury', time: '09:33 AM', 
        isRead: true },
      { id: 5, sender: 'trainer', 
        text: 'Absolutely, we can make modifications. I\'ll send you an updated version of your workout plan with alternative exercises.', 
        time: '09:35 AM' },
      {
        id: 6,
        sender: 'trainer',
        image: '/src/assets/workout-plan.jpg',
        text: 'Here\'s a sample of modified exercises for your knee condition.',
        time: '09:36 AM',
      }
    ]);
  }, []);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle send message
  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate trainer response
    setTimeout(() => {
      const trainerResponse = {
        id: messages.length + 2,
        sender: 'trainer',
        text: 'I received your message and will get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, trainerResponse]);
    }, 1000);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: `Sent a file: ${file.name}`,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file)
        },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };

      // Add image preview if it's an image
      if (file.type.startsWith('image/')) {
        newMessage.image = event.target.result;
      }

      setMessages([...messages, newMessage]);
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
    
    setShowAttachmentOptions(false);
  };

  // Handle voice recording
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setRecordingTime(0);

      // Add voice message to chat
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: 'Voice message',
        voiceMessage: true,
        duration: formatTime(recordingTime),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };

      setMessages([...messages, newMessage]);
    } else {
      // Start recording
      setIsRecording(true);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Store interval reference
      window.recordingInterval = interval;
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Stop recording interval when component unmounts
  useEffect(() => {
    return () => {
      if (window.recordingInterval) {
        clearInterval(window.recordingInterval);
      }
    };
  }, []);

  // Handle appointment request
  const handleRequestAppointment = (dateTime) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: `Appointment requested for ${dateTime}`,
      appointment: {
        dateTime,
        status: 'pending'
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setShowAppointmentModal(false);

    // Simulate trainer response
    setTimeout(() => {
      const trainerResponse = {
        id: messages.length + 2,
        sender: 'trainer',
        text: 'I\'ve received your appointment request and will confirm shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, trainerResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          <FaBars size={24} />
        </button>
      </div>
      
      {/* Mobile Navigation Menu - Slide up from bottom when open */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${
        isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>
        
        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'My Trainers'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('My Trainers');
                navigate('/trainers');
              }}
            >
              <FaUserFriends size={20} />
              <span>My Trainers</span>
            </a>
            
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Explore'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('Explore');
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
      
      <div className="container mx-auto pt-4 sm:pt-8 px-4">
        {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
            <div className="space-y-6 mt-8">
              {/* My Trainers */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'My Trainers'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('My Trainers');
                  navigate('/trainers');
                }}
              >
                <FaUserFriends size={20} />
                <span>My Trainers</span>
              </a>
              
              {/* Explore */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Explore'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('Explore');
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
        
        {/* Main Content with responsive margins */}
        <div className="w-full md:ml-[275px] lg:ml-[300px]">
          <button 
            onClick={() => navigate(`/schedule/${trainerId}`)}
            className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Schedule</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Left side - Chat content - Full width on mobile, 3/4 on desktop */}
            <div className="lg:col-span-3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 flex flex-col h-[calc(100vh-180px)]">
                {/* Chat header - Responsive with smaller padding on mobile */}
                <div className="flex justify-between items-center mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-700">
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        src={trainer.image} 
                        alt={trainer.name} 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/profile1.png';
                        }}
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 ${trainer.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-[#121225]`}></span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm sm:text-base">{trainer.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">{trainer.status}</p>
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => setShowAppointmentModal(true)}
                      className="bg-[#f67a45] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <FaPhoneAlt size={12} sm:size={14} />
                      <span>Request Call</span>
                    </button>
                  </div>
                </div>

                {/* Messages container - Responsive with adjusted padding and spacing */}
                <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 px-1 sm:px-2">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`mb-3 sm:mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[75%] sm:max-w-[70%] rounded-2xl p-2 sm:p-3 ${
                          msg.sender === 'user' 
                            ? 'bg-[#f67a45] text-white rounded-br-none'
                            : 'bg-[#1e1e35] text-white rounded-bl-none'
                        }`}
                      >
                        {msg.image && (
                          <div className="mb-2 rounded-lg overflow-hidden">
                            <img 
                              src={msg.image} 
                              alt="Shared image" 
                              className="w-full h-auto max-h-48 sm:max-h-60 object-contain"
                            />
                          </div>
                        )}
                        
                        {msg.file && !msg.image && (
                          <div className="mb-2 bg-[#121225] p-2 rounded-lg flex items-center">
                            <FaFile className="text-gray-400 mr-2 text-xs sm:text-sm" />
                            <span className="text-xs sm:text-sm text-gray-200 truncate">
                              {msg.file.name}
                            </span>
                          </div>
                        )}
                        
                        {msg.voiceMessage && (
                          <div className="mb-2 bg-[#121225] p-2 rounded-lg flex items-center">
                            <FaMicrophone className="text-gray-400 mr-2 text-xs sm:text-sm" />
                            <div className="flex-1">
                              <div className="w-full bg-gray-700 h-1 rounded-full">
                                <div className="bg-gray-400 h-1 rounded-full w-0"></div>
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-200 ml-2">{msg.duration}</span>
                          </div>
                        )}
                        
                        {msg.appointment && (
                          <div className="mb-2 bg-[#121225] p-2 rounded-lg">
                            <p className="text-xs sm:text-sm text-gray-200 mb-1">
                              Appointment Request: {msg.appointment.dateTime}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                                {msg.appointment.status}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs sm:text-sm md:text-base">{msg.text}</p>
                        <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'} flex justify-between items-center`}>
                          <span>{msg.time}</span>
                          {msg.sender === 'user' && (
                            <span>
                              {msg.isRead ? 'Read' : 'Sent'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input area - Responsive with adjusted sizing */}
                <div className="relative">
                  {isRecording ? (
                    <div className="flex items-center justify-between bg-[#1e1e35] rounded-full px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center flex-1">
                        <FaMicrophone size={16} sm:size={20} className="text-[#f67a45] animate-pulse mr-2 sm:mr-3" />
                        <div className="text-white text-xs sm:text-base">Recording... {formatTime(recordingTime)}</div>
                      </div>
                      <button
                        onClick={handleToggleRecording}
                        className="bg-[#f67a45] text-white p-1.5 sm:p-2 rounded-full hover:bg-[#e56d3d] transition-colors"
                      >
                        <FaStopCircle size={16} sm:size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center bg-[#1e1e35] rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                      <button
                        onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                        className="text-white p-1.5 sm:p-2 hover:text-[#f67a45] transition-colors"
                      >
                        <FaPaperclip size={16} sm:size={20} />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-transparent border-none outline-none text-white flex-1 px-2 sm:px-4 py-1 text-xs sm:text-base"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-white p-1.5 sm:p-2 hover:text-[#f67a45] transition-colors"
                      >
                        <BsEmojiSmile size={16} sm:size={20} />
                      </button>
                      {message.trim() !== '' ? (
                        <button
                          onClick={handleSendMessage}
                          className="bg-[#f67a45] text-white p-1.5 sm:p-2 rounded-full hover:bg-[#e56d3d] transition-colors ml-1 sm:ml-2"
                        >
                          <MdSend size={16} sm:size={20} />
                        </button>
                      ) : (
                        <button
                          onClick={handleToggleRecording}
                          className="bg-[#f67a45] text-white p-1.5 sm:p-2 rounded-full hover:bg-[#e56d3d] transition-colors ml-1 sm:ml-2"
                        >
                          <FaMicrophone size={16} sm:size={20} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* File input (hidden) */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                    accept="image/*,.pdf,.doc,.docx"
                  />

                  {/* Attachment options - Responsive positioning */}
                  {showAttachmentOptions && (
                    <div className="absolute bottom-full left-0 mb-2 bg-[#121225] border border-[#f67a45]/30 rounded-lg p-2 sm:p-3 flex gap-2 sm:gap-4">
                      <button
                        onClick={() => {
                          fileInputRef.current.accept = "image/*";
                          fileInputRef.current.click();
                        }}
                        className="flex flex-col items-center p-2 sm:p-3 hover:bg-[#1e1e35] rounded transition-colors"
                      >
                        <FaImage size={20} sm:size={24} className="text-[#f67a45] mb-1" />
                        <span className="text-white text-xs">Image</span>
                      </button>
                      <button
                        onClick={() => {
                          fileInputRef.current.accept = ".pdf,.doc,.docx";
                          fileInputRef.current.click();
                        }}
                        className="flex flex-col items-center p-2 sm:p-3 hover:bg-[#1e1e35] rounded transition-colors"
                      >
                        <FaFile size={20} sm:size={24} className="text-[#f67a45] mb-1" />
                        <span className="text-white text-xs">Document</span>
                      </button>
                    </div>
                  )}

                  {/* Emoji picker - Simplified and responsive */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 bg-[#121225] border border-[#f67a45]/30 rounded-lg p-2 sm:p-3">
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 sm:gap-2">
                        {["😊", "😂", "❤️", "👍", "🙌", "🔥", "💪", "👏"].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setMessage(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-lg sm:text-2xl hover:bg-[#1e1e35] p-1 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side - Trainer info card - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
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
                  <h3 className="text-white text-xl font-medium">{trainer.name}</h3>
                  <p className="text-gray-400 mb-2">{trainer.specialty}</p>
                  <a 
                    onClick={() => navigate(`/trainer-profile/${trainerId}`)}
                    className="text-[#f67a45] hover:underline text-sm cursor-pointer"
                  >
                  View Profile
                  </a>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate(`/schedule/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <BsCalendarWeek />
                    <span>Schedule</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/meal-plan/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <GiMeal />
                    <span>Meal Plan</span>
                  </button>
                  
                  <button className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2">
                    <BiChat />
                    <span>Chat</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/subscription/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RiVipDiamondLine />
                    <span>Subscription</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Compact trainer info for mobile - Only shown on small screens at bottom of chat */}
            <div className="lg:hidden flex items-center justify-between bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/src/assets/profile1.png';
                    }}
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${trainer.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-[#121225]`}></span>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm sm:text-base">{trainer.name}</h3>
                  <a
                    onClick={() => navigate(`/trainer-profile/${trainerId}`)}
                    className="text-[#f67a45] text-xs sm:text-sm cursor-pointer"
                  >
                    View Profile
                  </a>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/schedule/${trainerId}`)}
                  className="text-white bg-gray-700/50 p-2 rounded-full hover:bg-gray-700"
                >
                  <BsCalendarWeek size={18} />
                </button>
                <button
                  onClick={() => navigate(`/meal-plan/${trainerId}`)}
                  className="text-white bg-gray-700/50 p-2 rounded-full hover:bg-gray-700"
                >
                  <GiMeal size={18} />
                </button>
                <button
                  onClick={() => navigate(`/subscription/${trainerId}`)}
                  className="text-white bg-gray-700/50 p-2 rounded-full hover:bg-gray-700"
                >
                  <RiVipDiamondLine size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal - Responsive */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4">Schedule a Call</h3>
            
            <div className="mb-3 sm:mb-4">
              <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Select Date & Time</label>
              <input 
                type="datetime-local" 
                className="w-full bg-[#1e1e35] border border-gray-700 rounded p-2 sm:p-3 text-white text-sm sm:text-base"
              />
            </div>
            
            <div className="mb-4 sm:mb-5">
              <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Reason for Call</label>
              <select className="w-full bg-[#1e1e35] border border-gray-700 rounded p-2 sm:p-3 text-white text-sm sm:text-base">
                <option>Training Questions</option>
                <option>Nutrition Advice</option>
                <option>Progress Review</option>
                <option>Program Changes</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2 sm:gap-3">
              <button 
                onClick={() => setShowAppointmentModal(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-600 rounded-lg text-white hover:bg-[#1e1e35] text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleRequestAppointment('2023-05-15 15:30')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#f67a45] rounded-lg text-white hover:bg-[#e56d3d] text-sm sm:text-base"
              >
                Request Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;