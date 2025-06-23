import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrainerLayout from '../../components/Trainers/TrainerLayout';
import { FaStar, FaRegStar, FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { BsCalendarWeek, BsStarHalf } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Mock trainer data
  const trainer = {
    id: trainerId,
    name: "Nipuna Lakruwan",
    title: "Certified Personal Trainer",
    image: "/src/assets/trainer.png",
    specialty: "Strength & Conditioning",
    rating: 4.8,
    reviewCount: 28,
    price: "$50/session",
    description: "Nipuna is a dedicated fitness professional with over 10 years of experience helping clients achieve their fitness goals. Specializing in strength training and conditioning, Nipuna has worked with clients of all fitness levels, from beginners to professional athletes. His personalized approach ensures that each client receives a tailored program designed to meet their specific needs and goals.",
    socialMedia: {
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      tiktok: "https://tiktok.com/",
      twitter: "https://twitter.com/"
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-[#f67a45]" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<BsStarHalf key={i} className="text-[#f67a45]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#f67a45]" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <TrainerLayout pageTitle={`Trainer: ${trainer.name}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/trainers')}
        className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
      >
        <MdArrowBack size={20} />
        <span>Back to Trainers</span>
      </button>

      {/* Profile Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mb-6">
        {/* Left side - Profile content */}
        <div className="lg:col-span-3">
          <div className="mb-4 sm:mb-8 relative">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-wider">
              <span className="text-transparent bg-clip-text" style={{
                WebkitTextStroke: '2px #f67a45',
                textStroke: '2px #f67a45'
              }}>
                {trainer.name}
              </span>
            </h1>
            <h2 className="text-white text-lg sm:text-xl mt-2">{trainer.title}</h2>
          </div>

          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">About</h2>
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">
              {trainer.description}
            </p>

            <div className="flex gap-4 mt-6">
              {trainer.socialMedia.facebook && (
                <a
                  href={trainer.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#f67a45] transition-colors"
                >
                  <FaFacebook size={20} />
                </a>
              )}

              {trainer.socialMedia.instagram && (
                <a
                  href={trainer.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#f67a45] transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
              )}

              {trainer.socialMedia.tiktok && (
                <a
                  href={trainer.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#f67a45] transition-colors"
                >
                  <FaTiktok size={20} />
                </a>
              )}

              {trainer.socialMedia.twitter && (
                <a
                  href={trainer.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#f67a45] transition-colors"
                >
                  <FaTwitter size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Trainer info and actions */}
        <div className="lg:col-span-1">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[200px] aspect-square rounded-lg overflow-hidden mb-4">
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

              <div className="flex items-center mb-2">
                {renderStars(trainer.rating)}
                <span className="text-white ml-2">{trainer.rating} ({trainer.reviewCount})</span>
              </div>

              <div className="text-white text-xl font-bold mb-4">{trainer.price}</div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-3">
                <button
                  onClick={() => navigate(`/schedule/${trainerId}`)}
                  className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <BsCalendarWeek size={14} />
                  <span>Schedule</span>
                </button>

                <button
                  onClick={() => navigate(`/meal-plan/${trainerId}`)}
                  className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <GiMeal size={14} />
                  <span>Meal Plan</span>
                </button>

                <button
                  onClick={() => navigate(`/chat/${trainerId}`)}
                  className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <BiChat size={14} />
                  <span>Chat</span>
                </button>

                <button
                  onClick={() => navigate(`/subscription/${trainerId}`)}
                  className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <RiVipDiamondLine size={14} />
                  <span>Subscription</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Sections Container - Add proper width constraints */}
      <div className="w-full overflow-visible">
        {/* Certifications */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Certifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Certification Items - responsive grid */}
            {[
              {
                name: "NASM Certified Personal Trainer",
                image: "/src/assets/certifications/cert1.png",
                fallbackImage: "/src/assets/medal.png"
              },
              {
                name: "ACE Fitness Nutrition Specialist",
                image: "/src/assets/certifications/cert2.png",
                fallbackImage: "/src/assets/medal1.png"
              },
              {
                name: "Best Trainer Award 2024",
                image: "/src/assets/certifications/cert3.png",
                fallbackImage: "/src/assets/medal2.png"
              },
              {
                name: "CSCS Strength & Conditioning Specialist",
                image: "/src/assets/certifications/cert4.png",
                fallbackImage: "/src/assets/medal3.png"
              }
            ].map((cert, idx) => (
              <div key={idx} className="bg-[#1A1A2F] p-3 sm:p-4 rounded-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-3 bg-[#f67a45]/10 flex items-center justify-center">
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = cert.fallbackImage;
                    }}
                  />
                </div>
                <h3 className="text-white font-medium text-xs sm:text-sm">{cert.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Services - Ensure proper content wrapping */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Services - Responsive layout */}
            {[
              {
                title: "Personalized Training",
                desc: "Custom workout plans designed specifically for your goals, fitness level, and preferences."
              },
              {
                title: "Progress Monitoring",
                desc: "Regular assessments and adjustments to ensure you're continuously making progress toward your goals."
              },
              {
                title: "Nutrition Guidance",
                desc: "Expert advice on meal planning and nutritional strategies to complement your fitness routine."
              },
              {
                title: "One-on-One Attention",
                desc: "Dedicated personal sessions with focused attention on form, technique, and motivation."
              },
              {
                title: "Virtual Training",
                desc: "Remote coaching sessions accessible from anywhere, with real-time feedback and guidance."
              },
              {
                title: "24/7 Support",
                desc: "Ongoing communication and support to answer questions and provide motivation between sessions."
              }
            ].map((service, idx) => (
              <div key={idx} className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#f67a45]/10 rounded-bl-full"></div>
                <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">{service.title}</h3>
                <p className="text-white/70 text-sm sm:text-base">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Photos Gallery - Fix overflow and ensure proper spacing */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Photos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* Gallery images - responsive grid */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <img
                  src={`/src/assets/gallery/trainer-photo${num}.jpg`}
                  alt={`Trainer photo ${num}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/trainer.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Packages - Improve container width and responsiveness */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Training Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Silver Package */}
            <div className="border border-gray-700 rounded-lg p-4 sm:p-6 bg-[#121225] hover:border-[#f67a45]/50 transition-all">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-white text-lg sm:text-xl font-bold">Silver Package</h3>
                <span className="text-xs px-2 sm:px-3 py-1 bg-white/10 text-white rounded-full">Basic</span>
              </div>

              <div className="text-[#f67a45] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">$49.99<span className="text-sm text-white/60 font-normal">/month</span></div>
              <p className="text-white/60 mb-4 sm:mb-6 text-xs sm:text-sm">Perfect for beginners looking to start their fitness journey.</p>

              <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm">
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Weekly workout plan</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Basic nutrition advice</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Email support within 48 hours</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>1 video consultation per month</span>
                </li>
              </ul>

              <button className="w-full bg-white/10 text-white py-2 rounded-full hover:bg-[#f67a45]/20 transition-colors text-sm">
                Get Started
              </button>
            </div>

            {/* Gold Package (Featured) */}
            <div className="border-2 border-[#f67a45] rounded-lg p-4 sm:p-6 bg-[#1A1A2F] relative">
              <div className="absolute top-0 right-4 sm:right-6 translate-y-[-50%] bg-[#f67a45] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                Popular
              </div>

              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-white text-lg sm:text-xl font-bold">Gold Package</h3>
                <span className="text-xs px-2 sm:px-3 py-1 bg-[#f67a45]/20 text-[#f67a45] rounded-full">Recommended</span>
              </div>

              <div className="text-[#f67a45] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">$89.99<span className="text-sm text-white/60 font-normal">/month</span></div>
              <p className="text-white/60 mb-4 sm:mb-6 text-xs sm:text-sm">Our most popular option with personalized training.</p>

              <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm">
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Customized weekly workout plan</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Detailed nutrition plan</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Priority email support within 24 hours</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>2 video consultations per month</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Real-time workout adjustments</span>
                </li>
              </ul>

              <button className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm">
                Get Started
              </button>
            </div>

            {/* Ultimate Package */}
            <div className="border border-gray-700 rounded-lg p-4 sm:p-6 bg-[#121225] hover:border-[#f67a45]/50 transition-all">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-white text-lg sm:text-xl font-bold">Ultimate Package</h3>
                <span className="text-xs px-2 sm:px-3 py-1 bg-white/10 text-white rounded-full">Premium</span>
              </div>

              <div className="text-[#f67a45] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">$149.99<span className="text-sm text-white/60 font-normal">/month</span></div>
              <p className="text-white/60 mb-4 sm:mb-6 text-xs sm:text-sm">Complete fitness solution with maximum personal attention.</p>

              <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm">
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Fully personalized workout program</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Customized meal plans with recipes</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>24/7 chat support</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Weekly video consultations</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Progress tracking and analysis</span>
                </li>
                <li className="flex items-start text-white">
                  <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                  <span>Access to exclusive workshops</span>
                </li>
              </ul>

              <button className="w-full bg-white/10 text-white py-2 rounded-full hover:bg-[#f67a45]/20 transition-colors text-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Customer Feedback - Ensure container fits well */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-white text-xl sm:text-2xl font-bold">Customer Feedback</h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <select className="w-full bg-[#1A1A2F] text-white border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45]">
                  <option value="newest">Newest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>

              <button className="w-full sm:w-auto bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm">
                Write Review
              </button>
            </div>
          </div>

          {/* Overall Rating Summary */}
          <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col md:flex-row items-center">
            <div className="text-center md:text-left md:mr-10 mb-4 md:mb-0">
              <div className="text-[#f67a45] text-4xl sm:text-5xl font-bold mb-2">4.8</div>
              <div className="flex justify-center md:justify-start mb-2">
                <div className="flex">
                  <FaStar className="text-[#f67a45] text-sm sm:text-base" />
                  <FaStar className="text-[#f67a45] text-sm sm:text-base" />
                  <FaStar className="text-[#f67a45] text-sm sm:text-base" />
                  <FaStar className="text-[#f67a45] text-sm sm:text-base" />
                  <BsStarHalf className="text-[#f67a45] text-sm sm:text-base" />
                </div>
              </div>
              <div className="text-white/60 text-xs sm:text-sm">Based on 28 reviews</div>
            </div>

            {/* Rating Distribution */}
            <div className="w-full md:flex-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center mb-2">
                  <div className="text-white mr-2 w-2 text-sm">{rating}</div>
                  <div className="flex-1 bg-white/10 rounded-full h-2 sm:h-3 mr-2">
                    <div
                      className="bg-[#f67a45] h-2 sm:h-3 rounded-full"
                      style={{
                        width: rating === 5 ? '75%' :
                          rating === 4 ? '20%' :
                            rating === 3 ? '5%' : '0%'
                      }}
                    ></div>
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm w-8">
                    {rating === 5 ? '75%' :
                      rating === 4 ? '20%' :
                        rating === 3 ? '5%' : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6 w-full">
            {[
              {
                name: "Alex Johnson",
                image: "/src/assets/users/user1.jpg",
                date: "March 1, 2025",
                rating: 5,
                review: "I've been training with John for 3 months and the results have been incredible. His knowledge and personalized approach make every session valuable. He knows exactly when to push me harder and when to focus on form and technique."
              },
              {
                name: "Sarah Miller",
                image: "/src/assets/users/user2.jpg",
                date: "February 15, 2025",
                rating: 5,
                review: "John has helped me achieve my fitness goals faster than I expected. His meal plans are practical and easy to follow, and his workouts are challenging but achievable. I highly recommend him, especially if you've tried other trainers without success."
              },
              {
                name: "Michael Chen",
                image: "/src/assets/users/user3.jpg",
                date: "January 28, 2025",
                rating: 4,
                review: "Great trainer with a solid understanding of fitness principles. John is always on time and prepared for our sessions. The only reason I'm giving 4 stars is that sometimes the communication between sessions could be better, but the training itself is excellent."
              }
            ].map((review, idx) => (
              <div key={idx} className="border-b border-gray-700 pb-4 sm:pb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/profile1.png';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm sm:text-base">{review.name}</h4>
                      <div className="flex items-center">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            i < review.rating ?
                              <FaStar key={i} className="text-[#f67a45] text-xs sm:text-sm" /> :
                              <FaRegStar key={i} className="text-[#f67a45] text-xs sm:text-sm" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-white/50 text-xs sm:text-sm">{review.date}</div>
                </div>
                <p className="text-white/80 text-sm sm:text-base">
                  {review.review}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A2F] text-white flex items-center justify-center hover:bg-[#f67a45]/20 text-sm">
                &lt;
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f67a45] text-white flex items-center justify-center text-sm">
                1
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A2F] text-white flex items-center justify-center hover:bg-[#f67a45]/20 text-sm">
                2
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A2F] text-white flex items-center justify-center hover:bg-[#f67a45]/20 text-sm">
                3
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A2F] text-white flex items-center justify-center hover:bg-[#f67a45]/20 text-sm">
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Contact Form - Ensure proper width */}
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible" id="contact-form">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Get in Touch</h2>
          <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-white mb-1 sm:mb-2 text-sm">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-1 sm:mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-white mb-1 sm:mb-2 text-sm">Subject</label>
                <select
                  id="subject"
                  className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="training">Training Inquiry</option>
                  <option value="pricing">Pricing Information</option>
                  <option value="availability">Availability Check</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-white mb-1 sm:mb-2 text-sm">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent"
                  placeholder="How can I help you?"
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="consent"
                  className="w-4 h-4 text-[#f67a45] border-gray-700 rounded focus:ring-[#f67a45]"
                />
                <label htmlFor="consent" className="ml-2 text-xs sm:text-sm text-white/70">
                  I consent to having this website store my submitted information so they can respond to my inquiry.
                </label>
              </div>

              <div>
                <button type="submit" className="bg-[#f67a45] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium text-sm sm:text-base">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* CTA - Ensure proper width */}
        <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-8 my-4 sm:my-8 text-center w-full overflow-visible">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Ready to Transform Your Fitness Journey?</h2>
          <p className="text-white/70 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Join my community of successful clients and let's work together to achieve your fitness goals.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button className="bg-[#f67a45] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium text-sm sm:text-base">
              Enroll Now
            </button>
            <button
              onClick={() => {
                document.getElementById('contact-form').scrollIntoView({
                  behavior: 'smooth'
                });
              }}
              className="bg-transparent border border-[#f67a45] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#f67a45]/10 transition-colors text-sm sm:text-base"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </TrainerLayout>
  );
};

export default TrainerProfile;