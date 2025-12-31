import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useChat } from "./chat.hooks";
import { useAuth } from "../auth/auth.hooks";
import { getChatHistory, type ChatHistoryItem } from "./chatHistory";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const historyId = searchParams.get("history");
  const { messages, sendMessage, loading, clearMessages } = useChat(historyId || undefined);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    setChatHistory(getChatHistory());
  }, [messages]); 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loadHistory = (id: string) => {
    setSearchParams({ history: id });
  };

  const startNewChat = () => {
    clearMessages();
    setSearchParams({});
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full flex gap-6">
      {/* Sidebar with Chat History */}
      <div className="w-64 shrink-0">
        <div className="bg-white rounded-xl shadow-lg p-4 h-[70vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">History</h2>
            <button
              onClick={startNewChat}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-all duration-200"
            >
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {chatHistory.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No chat history yet
              </p>
            ) : (
              chatHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadHistory(item.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 ${
                    historyId === item.id
                      ? "bg-blue-50 border border-blue-300 shadow-sm"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                  }`}
                >
                  <p className="font-medium text-gray-800 truncate mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{formatTime(item.timestamp)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Chat with Document</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/upload")}
              className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              Upload Document
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto mb-4">
            <ChatMessages messages={messages} />
          </div>

          <ChatInput onSend={sendMessage} loading={loading} />
        </div>
      </div>
    </div>
  );
}
