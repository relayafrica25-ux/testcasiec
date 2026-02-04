import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

// Declaration for Tawk.to API
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export const ChatWidget: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Initialize Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Prevent multiple script injections
    if (document.getElementById('tawk-script')) return;

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.id = 'tawk-script';
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6980a5d758c8b21c3693990d/1jgf8fl14';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }

    // Set up Tawk.to callbacks
    window.Tawk_API.onLoad = function () {
      // Hide the default bubble to use our custom premium UI
      if (window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };

    window.Tawk_API.onChatMaximized = function () {
      setIsMaximized(true);
    };

    window.Tawk_API.onChatMinimized = function () {
      setIsMaximized(false);
    };

    window.Tawk_API.onChatHidden = function () {
      setIsMaximized(false);
    };

    return () => {
      // Clean up if necessary
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

  const toggleChat = () => {
    if (!window.Tawk_API) return;

    if (window.Tawk_API.isChatMinimized && window.Tawk_API.isChatMinimized()) {
      window.Tawk_API.maximize();
    } else if (window.Tawk_API.minimize) {
      window.Tawk_API.minimize();
    } else if (window.Tawk_API.toggle) {
      window.Tawk_API.toggle();
    }
  };

  // When the chat is maximized, we hide our custom trigger to let Tawk.to take over the space
  if (isMaximized) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end pointer-events-none">
      <div className="relative flex items-center pointer-events-auto">
        {/* Tooltip/Bubble Label */}
        <div
          className="absolute right-full mr-5 bg-white text-nova-900 px-5 py-3 rounded-xl shadow-2xl font-bold text-sm whitespace-nowrap transition-all duration-500 origin-right cursor-pointer hover:bg-gray-100 opacity-100 scale-100"
          onClick={toggleChat}
        >
          Specialist Support Active
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 transform origin-center"></div>
        </div>

        {/* Main Floating Button */}
        <button
          onClick={toggleChat}
          className="p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-nova-500 to-purple-600 text-white"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
};