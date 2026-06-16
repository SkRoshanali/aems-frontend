import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Minimize2 } from 'lucide-react';
import { sendMessage } from '../../store/slices/chatSlice';
import ChatMessage from './ChatMessage';
import ChatSuggestions from './ChatSuggestions';

function ChatPanel({ onClose }) {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const { messages, isLoading, isWakingUp, userRole } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    
    dispatch(sendMessage({ query: input }));
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Role based colors
  const roleColors = {
    BUYER: 'from-blue-500 to-blue-600',
    EMPLOYEE: 'from-green-500 to-green-600',
    MANAGER: 'from-purple-500 to-purple-600',
    ADMIN: 'from-red-500 to-red-600',
    SUPER_ADMIN: 'from-indigo-500 to-indigo-600'
  };

  const headerGradient = roleColors[userRole] || roleColors.BUYER;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-40 animate-slide-in">
      {/* Header */}
      <div className={`bg-gradient-to-r ${headerGradient} text-white p-4 rounded-t-lg flex justify-between items-center`}>
        <div>
          <h3 className="font-semibold">AI Assistant</h3>
          <p className="text-xs opacity-90">Role: {userRole || 'Guest'}</p>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
          <Minimize2 size={20} />
        </button>
      </div>

      {/* Wake-up Warning */}
      {isWakingUp && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-3">
          <div className="flex items-start gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Waking up services...</p>
              <p className="text-xs text-yellow-700 mt-1">
                Render free tier is starting up (~30 seconds). Your next message will work!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <ChatSuggestions role={userRole} onSelect={setInput} />
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isWakingUp ? "Waking up..." : "Ask me anything..."}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            title="Send message"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
