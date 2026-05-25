"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, Users, Bell, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Welcome to BoostEra! Need assistance? Click the button below to chat with our support team on Telegram.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 5000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Direct Telegram support link
  const TELEGRAM_SUPPORT_URL = "https://t.me/CryptoDiver8";
  const TELEGRAM_CHANNEL_URL = "https://t.me/boostera_fun";

  const openTelegramSupport = () => {
    window.open(TELEGRAM_SUPPORT_URL, "_blank");
  };

  const openTelegramChannel = () => {
    window.open(TELEGRAM_CHANNEL_URL, "_blank");
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing
    setTimeout(() => {
      const botMsg: Message = {
        id: messages.length + 2,
        text: "Thank you for your message! For immediate assistance, please click the 'Message Support' button below to chat with our team on Telegram.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating welcome notification */}
      <AnimatePresence>
        {showWelcome && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl cursor-pointer hover:bg-white/10 transition"
                 onClick={() => setIsOpen(true)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Need help? 💬</p>
                  <p className="text-xs text-white/60">Click here to get support</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center cursor-pointer hover:shadow-xl transition-all"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-96 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">Customer Support</span>
                <span className="text-xs text-white/70 ml-2">Online</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[300px] overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm"
                        : "bg-white/10 text-white/90 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-[10px] opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="px-4 py-3 border-t border-white/10 space-y-2">
              <button
                onClick={openTelegramSupport}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-semibold text-white transition hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                💬 Message Support on Telegram
              </button>
              <button
                onClick={openTelegramChannel}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-sm font-semibold text-white transition hover:scale-105"
              >
                <Bell className="w-4 h-4" />
                📢 Join Announcements Channel
              </button>
              <p className="text-center text-[10px] text-white/40 pt-1">
                For fastest response, message us directly on Telegram
              </p>
            </div>

            {/* Input Section */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl text-white hover:scale-105 transition disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-center text-[10px] text-white/30 mt-2">
                Our team will respond faster on Telegram
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
