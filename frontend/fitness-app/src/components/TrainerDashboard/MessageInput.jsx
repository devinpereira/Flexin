import React, { useState, useRef } from 'react';
import { FaPaperclip, FaImage, FaFile, FaMicrophone, FaStopCircle } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { BsEmojiSmile } from 'react-icons/bs';

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleFileUpload,
  isRecording,
  recordingTime,
  toggleRecording,
  formatTime
}) => {
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
              <div className="absolute bottom-12 left-0 bg-[#121225] rounded-lg shadow-lg p-2 flex flex-col gap-2 z-10 border border-gray-700">
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
                    setShowAttachmentOptions(false);
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
                    setShowAttachmentOptions(false);
                  }}
                >
                  <FaFile size={16} />
                  <span>Document</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 bg-[#121225] rounded-full px-4 py-2 flex items-center">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="bg-transparent text-white w-full focus:outline-none resize-none h-6 max-h-24 overflow-hidden"
              style={{ height: `${Math.min(Math.max(1, (message.split('\n').length)), 4)}em` }}
            />
            <div className="flex items-center gap-2">
              <button
                className="text-white/70 hover:text-white p-1"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <BsEmojiSmile size={18} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-20 bg-[#121225] rounded-lg shadow-lg p-2 z-10 border border-gray-700">
                  {/* Placeholder for emoji picker */}
                  <div className="grid grid-cols-6 gap-1">
                    {['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '🥰', '😘', '👍', '👋', '🙏', '❤️'].map((emoji) => (
                      <button
                        key={emoji}
                        className="p-1 hover:bg-[#1A1A2F] rounded"
                        onClick={() => {
                          setMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {message.trim() ? (
            <button
              className="bg-[#f67a45] text-white p-3 rounded-full hover:bg-[#e56d3d] transition-colors"
              onClick={handleSendMessage}
            >
              <MdSend size={18} />
            </button>
          ) : (
            <button
              className="bg-[#f67a45] text-white p-3 rounded-full hover:bg-[#e56d3d] transition-colors"
              onClick={toggleRecording}
            >
              <FaMicrophone size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageInput;
