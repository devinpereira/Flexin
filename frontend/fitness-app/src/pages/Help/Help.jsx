import React, { useState } from 'react';
import {
  FaQuestionCircle, FaHeadset, FaBook, FaTools, FaChevronDown,
  FaChevronUp, FaSearch, FaVideo, FaPaperPlane, FaSyncAlt
} from 'react-icons/fa';
import Navigation from '../../components/Navigation';

const Help = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqItem, setOpenFaqItem] = useState(null);
  const [messageData, setMessageData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Handle FAQ item toggle
  const toggleFaqItem = (index) => {
    setOpenFaqItem(openFaqItem === index ? null : index);
  };

  // Handle contact form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessageData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle contact form submission
  const handleSubmitMessage = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setMessageSent(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setMessageSent(false);
        setMessageData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  // FAQ data
  const faqData = [
    {
      question: "How do I create a custom workout schedule?",
      answer: "To create a custom workout schedule, navigate to the Calculators section, then click on 'Custom Schedules'. From there, click the 'Add Schedule' button and follow the on-screen instructions to set up your personalized workout plan."
    },
    {
      question: "How do I connect with a trainer?",
      answer: "You can connect with trainers by going to the Trainers section and clicking on 'Explore'. Browse available trainers, view their profiles, and click 'Add Trainer' to connect with them. Once connected, you can access their schedules, meal plans, and chat with them directly."
    },
    {
      question: "How do I track my fitness progress?",
      answer: "PulsePlus offers multiple ways to track your progress. Use the Reports section to view graphs of your weight, BMI, workouts, and more. You can also use the Calculators section to regularly update your measurements and see how they change over time."
    },
    {
      question: "How do I change my notification settings?",
      answer: "To change your notification settings, go to your account Settings page and select the 'Notifications' tab. There, you can toggle various notification types including email notifications, push notifications, training reminders, and more."
    },
    {
      question: "Can I use PulsePlus on mobile devices?",
      answer: "Yes, PulsePlus is fully responsive and works on smartphones and tablets. Simply open your mobile browser and navigate to the PulsePlus website. We're also developing native mobile apps that will be available soon."
    },
    {
      question: "How do I purchase items from the store?",
      answer: "To make a purchase, browse the Store section, add items to your cart, and proceed to checkout. You can pay using various payment methods including credit/debit cards and PayPal. Items will be shipped to your registered address."
    },
    {
      question: "How do I reset my password?",
      answer: "If you've forgotten your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to reset your password. For security reasons, the reset link expires after 24 hours."
    }
  ];

  // Video tutorials data
  const videoTutorials = [
    {
      id: 1,
      title: "Getting Started with PulsePlus",
      duration: "5:24",
      thumbnail: "/src/assets/tutorial1.jpg",
      description: "Learn the basics of navigating and using PulsePlus."
    },
    {
      id: 2,
      title: "Setting Up Your Fitness Profile",
      duration: "3:45",
      thumbnail: "/src/assets/tutorial2.jpg",
      description: "Complete guide to creating your personalized fitness profile."
    },
    {
      id: 3,
      title: "Creating Custom Workout Schedules",
      duration: "7:12",
      thumbnail: "/src/assets/tutorial3.jpg",
      description: "Design effective workout routines tailored to your goals."
    },
    {
      id: 4,
      title: "Connecting with Trainers",
      duration: "4:30",
      thumbnail: "/src/assets/tutorial4.jpg",
      description: "How to find, connect with, and work with fitness trainers."
    }
  ];

  // Filter FAQ based on search
  const filteredFaqs = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      <div className="container mx-auto pt-6 sm:pt-12 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6">Help Center</h1>

          {/* Help Center navigation tabs */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-1 sm:p-2 mb-6 overflow-x-auto">
            <div className="flex">
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors mr-1 ${activeTab === 'faq'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaQuestionCircle /> FAQ
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors mr-1 ${activeTab === 'contact'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaHeadset /> Contact Support
              </button>

              <button
                onClick={() => setActiveTab('guides')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors mr-1 ${activeTab === 'guides'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaBook /> User Guides
              </button>

              <button
                onClick={() => setActiveTab('troubleshooting')}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'troubleshooting'
                    ? 'bg-[#f67a45] text-white'
                    : 'text-white hover:bg-[#1A1A2F]'
                  }`}
              >
                <FaTools /> Troubleshooting
              </button>
            </div>
          </div>

          {/* Help Center content */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
            {/* FAQ Section */}
            {activeTab === 'faq' && (
              <div className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">Frequently Asked Questions</h2>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A1A2F] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#f67a45]"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-white/10 rounded-lg overflow-hidden"
                      >
                        <button
                          className="w-full flex items-center justify-between bg-[#1A1A2F] p-4 text-left text-white hover:bg-[#1A1A2F]/80 transition-colors"
                          onClick={() => toggleFaqItem(index)}
                        >
                          <span className="font-medium">{faq.question}</span>
                          {openFaqItem === index ? <FaChevronUp /> : <FaChevronDown />}
                        </button>

                        {openFaqItem === index && (
                          <div className="p-4 bg-[#121225] text-white/80 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#1A1A2F] rounded-lg p-6 text-center">
                      <p className="text-white/70">No matching FAQ found.</p>
                      <p className="text-white/50 text-sm mt-2">Try different keywords or check our other help resources.</p>
                    </div>
                  )}
                </div>

                {/* Still need help section */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-white font-medium mb-4">Still Need Help?</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="flex-1 bg-[#1A1A2F] text-white px-4 py-3 rounded-lg hover:bg-[#1A1A2F]/80 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaHeadset />
                      <span>Contact Support</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('guides')}
                      className="flex-1 bg-[#1A1A2F] text-white px-4 py-3 rounded-lg hover:bg-[#1A1A2F]/80 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaVideo />
                      <span>Video Tutorials</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Support Section */}
            {activeTab === 'contact' && (
              <div className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">Contact Support</h2>

                {messageSent ? (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="text-green-400 text-2xl" />
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">Message Sent Successfully!</h3>
                    <p className="text-white/70">
                      Thank you for contacting us. Our support team will get back to you within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitMessage}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                      {/* Name */}
                      <div>
                        <label className="block text-white mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={messageData.name}
                          onChange={handleInputChange}
                          className="w-full bg-[#1A1A2F] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-white mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={messageData.email}
                          onChange={handleInputChange}
                          className="w-full bg-[#1A1A2F] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="mb-4">
                      <label className="block text-white mb-2">Subject</label>
                      <select
                        name="subject"
                        value={messageData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A2F] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45]"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="account">Account Issues</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="technical">Technical Support</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <label className="block text-white mb-2">Message</label>
                      <textarea
                        name="message"
                        value={messageData.message}
                        onChange={handleInputChange}
                        className="w-full bg-[#1A1A2F] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f67a45] h-32 resize-none"
                        placeholder="Describe your issue or question in detail"
                        required
                      ></textarea>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSyncAlt className="animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Alternative Contact Methods */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-white font-medium mb-4">Alternative Ways to Reach Us</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#1A1A2F] rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Email Support</h4>
                      <p className="text-white/70 mb-2">For general inquiries and support:</p>
                      <a href="mailto:support@pulseplus.com" className="text-[#f67a45] hover:underline">
                        support@pulseplus.com
                      </a>
                    </div>

                    <div className="bg-[#1A1A2F] rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Live Chat</h4>
                      <p className="text-white/70 mb-2">Available Monday-Friday, 9am-5pm EST:</p>
                      <button className="text-[#f67a45] hover:underline">
                        Start Live Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Guides Section */}
            {activeTab === 'guides' && (
              <div className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">User Guides & Tutorials</h2>

                {/* Video Tutorials */}
                <h3 className="text-white font-medium mb-4">Video Tutorials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {videoTutorials.map((video) => (
                    <div key={video.id} className="bg-[#1A1A2F] rounded-lg overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/video-placeholder.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#f67a45]/80 flex items-center justify-center">
                            <FaPlay className="text-white ml-1" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="text-white font-medium mb-1">{video.title}</h4>
                        <p className="text-white/70 text-sm">{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* User Manuals */}
                <h3 className="text-white font-medium mb-4">User Manuals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a href="#" className="bg-[#1A1A2F] rounded-lg p-4 hover:bg-[#1A1A2F]/80 transition-colors">
                    <div className="mb-3 text-[#f67a45]">
                      <FaBook size={24} />
                    </div>
                    <h4 className="text-white font-medium mb-1">Getting Started Guide</h4>
                    <p className="text-white/70 text-sm">Complete introduction for new users</p>
                  </a>

                  <a href="#" className="bg-[#1A1A2F] rounded-lg p-4 hover:bg-[#1A1A2F]/80 transition-colors">
                    <div className="mb-3 text-[#f67a45]">
                      <FaBook size={24} />
                    </div>
                    <h4 className="text-white font-medium mb-1">Trainer Features Guide</h4>
                    <p className="text-white/70 text-sm">Learn how to work with trainers effectively</p>
                  </a>

                  <a href="#" className="bg-[#1A1A2F] rounded-lg p-4 hover:bg-[#1A1A2F]/80 transition-colors">
                    <div className="mb-3 text-[#f67a45]">
                      <FaBook size={24} />
                    </div>
                    <h4 className="text-white font-medium mb-1">Advanced Features Guide</h4>
                    <p className="text-white/70 text-sm">Master all PulsePlus features</p>
                  </a>
                </div>
              </div>
            )}

            {/* Troubleshooting Section */}
            {activeTab === 'troubleshooting' && (
              <div className="p-4 sm:p-6">
                <h2 className="text-white text-xl font-bold mb-6">Troubleshooting</h2>

                {/* Common Issues */}
                <div className="space-y-6 mb-8">
                  <div className="bg-[#1A1A2F] rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Login Issues</h3>
                    <ol className="list-decimal list-inside space-y-2 text-white/80">
                      <li>Check if your email address is entered correctly</li>
                      <li>Make sure Caps Lock is turned off</li>
                      <li>Clear your browser cookies and cache</li>
                      <li>Try resetting your password using the "Forgot Password" link</li>
                      <li>Ensure you're using the latest version of your browser</li>
                    </ol>
                  </div>

                  <div className="bg-[#1A1A2F] rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Payment Issues</h3>
                    <ol className="list-decimal list-inside space-y-2 text-white/80">
                      <li>Verify your payment information is up to date</li>
                      <li>Check if your card has sufficient funds</li>
                      <li>Ensure your card is not expired or blocked for online transactions</li>
                      <li>Try using a different payment method</li>
                      <li>Contact your bank if the transaction is being declined</li>
                    </ol>
                  </div>

                  <div className="bg-[#1A1A2F] rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">App Performance Issues</h3>
                    <ol className="list-decimal list-inside space-y-2 text-white/80">
                      <li>Check your internet connection</li>
                      <li>Clear your browser cache and cookies</li>
                      <li>Try using a different browser</li>
                      <li>Disable browser extensions that might interfere</li>
                      <li>Ensure your device meets the minimum system requirements</li>
                    </ol>
                  </div>
                </div>

                {/* Diagnostic Tool */}
                <div className="bg-[#1A1A2F] rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">System Diagnostics</h3>
                  <p className="text-white/70 mb-4">
                    Run our diagnostic tool to identify and fix common technical issues automatically.
                  </p>
                  <button className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors">
                    <FaTools className="inline-block mr-2" />
                    Run Diagnostics
                  </button>
                </div>

                {/* Still need help section */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-white font-medium mb-4">Still Experiencing Issues?</h3>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="w-full bg-[#1A1A2F] text-white px-4 py-3 rounded-lg hover:bg-[#1A1A2F]/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaHeadset />
                    <span>Contact Technical Support</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
