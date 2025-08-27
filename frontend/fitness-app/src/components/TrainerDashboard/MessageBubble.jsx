import React from 'react';
import { FaFile, FaPlay } from 'react-icons/fa';

const MessageBubble = ({ msg, subscriberImage, formatTime }) => {
  const isTrainer = msg.sender === 'trainer';

  // Function to format timestamp for chat messages
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${isTrainer ? 'justify-end' : 'justify-start'} mb-4 w-full group`}
    >
      {!isTrainer && (
        <img
          src={subscriberImage}
          alt="Subscriber"
          className="w-8 h-8 rounded-full mr-2 mt-1 object-cover flex-shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/src/assets/profile1.png';
          }}
        />
      )}
      <div
        className={`max-w-[75%] rounded-lg p-3 ${isTrainer
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
                e.target.src = '/src/assets/no-image.png';
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
            <span className="text-white/60 text-xs">{formatTime(msg.duration || 0)}</span>
          </div>
        )}

        {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}

        <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${isTrainer ? 'text-white/70' : 'text-white/50'
          }`}>
          {formatMessageTime(msg.time)}
          {isTrainer && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              {msg.isRead ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
      {isTrainer && (
        <img
          src="/src/assets/profile1.png"
          alt="You"
          className="w-8 h-8 rounded-full ml-2 mt-1 object-cover flex-shrink-0"
        />
      )}
    </div>
  );
};

export default MessageBubble;
