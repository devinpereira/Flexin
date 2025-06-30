import React, { useState, useRef, useEffect } from "react";

const mockMessages = [
  {
    id: 1,
    sender: "subscriber",
    text: "Hi coach, I'm excited to start my new plan!",
    time: "09:15",
  },
  {
    id: 2,
    sender: "trainer",
    text: "Welcome! Let me know if you have any questions.",
    time: "09:16",
  },
];

const MessageModal = ({ open, onClose, subscriber }) => {
  const [messages, setMessages] = useState(mockMessages);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMessages(mockMessages);
      setMessage("");
      setSent(false);
      setSending(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  if (!open) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "trainer",
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setMessage("");
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 1000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1A1A2F] rounded-2xl shadow-2xl max-w-md w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232342]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#f67a45]/40">
              <img
                src={subscriber?.avatar || "/src/assets/profile1.png"}
                alt={subscriber?.name || "Subscriber"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/profile1.png";
                }}
              />
            </div>
            <div>
              <div className="text-white font-semibold text-base truncate">
                {subscriber?.name || "Subscriber"}
              </div>
              <div className="text-xs text-gray-400">Direct Message</div>
            </div>
          </div>
          <button
            className="text-white/70 hover:text-white text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#18182f]">
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "trainer" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.sender === "trainer"
                      ? "bg-[#f67a45] text-white rounded-br-none"
                      : "bg-[#232342] text-white rounded-bl-none"
                    }`}
                >
                  <div>{msg.text}</div>
                  <div className="text-xs text-right text-white/60 mt-1">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
        {/* Info Note */}
        <div className="px-6 py-2 bg-[#232342] text-xs text-white/70 border-t border-[#232342]">
          <span>
            <b>Note:</b> For calls or full chat history, go to the{" "}
            <b>Messages</b> page.
          </span>
        </div>
        {/* Input */}
        <form
          className="flex items-center gap-2 px-4 py-3 border-t border-[#232342] bg-[#1A1A2F]"
          onSubmit={handleSend}
        >
          <input
            className="flex-1 bg-[#18182f] border border-[#232342] rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-[#f67a45]"
            placeholder={`Message ${subscriber?.name || "subscriber"}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending || sent}
            autoFocus
          />
          <button
            type="submit"
            className={`px-5 py-2 rounded-full font-medium transition-colors ${sending || sent || !message.trim()
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#f67a45] text-white hover:bg-[#e56d3d]"
              }`}
            disabled={sending || sent || !message.trim()}
          >
            {sent ? "Sent!" : sending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;
