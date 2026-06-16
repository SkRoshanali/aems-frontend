import { User, Bot, AlertTriangle, Info } from 'lucide-react';

function ChatMessage({ message }) {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  const isError = message.type === 'error';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded-lg max-w-[80%] flex items-center gap-2">
          <Info size={14} className="flex-shrink-0" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-red-50 text-red-800 text-xs px-3 py-2 rounded-lg max-w-[80%] flex items-center gap-2">
          <AlertTriangle size={14} className="flex-shrink-0" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      
      <div className={`max-w-[75%] rounded-lg px-4 py-2 ${isUser ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'}`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200/50">
            <p className="text-xs font-semibold opacity-80 mb-1">Sources:</p>
            <ul className="text-xs opacity-70 list-disc list-inside">
              {message.sources.map((source, idx) => (
                <li key={idx} className="truncate" title={source}>{source}</li>
              ))}
            </ul>
          </div>
        )}
        
        <span className={`text-[10px] mt-1 block ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
