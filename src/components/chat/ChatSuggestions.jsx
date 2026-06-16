import { MessageSquare } from 'lucide-react';

function ChatSuggestions({ role, onSelect }) {
  const defaultSuggestions = [
    "What products are available?",
    "How do I use this system?",
  ];

  const roleSuggestions = {
    BUYER: [
      "What products are available?",
      "Show me my recent orders",
      "What's the status of order #ORD-123?",
      "How do I place an order?",
      "What are your payment terms?"
    ],
    EMPLOYEE: [
      "How do I add new stock?",
      "Show me farmer list",
      "What's the quality grading process?",
      "How to create a shipment?"
    ],
    MANAGER: [
      "Show me pending buyer applications",
      "What's today's revenue?",
      "List low stock items",
      "How many orders need approval?"
    ],
    ADMIN: [
      "System health status",
      "User activity summary",
      "Show all pending tasks",
      "Generate monthly report"
    ],
    SUPER_ADMIN: [
      "System health status",
      "User activity summary",
      "Show all pending tasks",
      "Generate monthly report"
    ]
  };

  const suggestions = roleSuggestions[role] || defaultSuggestions;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
        <MessageSquare size={32} />
      </div>
      <h4 className="text-lg font-semibold text-gray-700 mb-2">How can I help you today?</h4>
      <p className="text-sm text-gray-500 mb-6">Ask me anything about your role or the system.</p>
      
      <div className="flex flex-col gap-2 w-full">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(suggestion)}
            className="text-left text-sm bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChatSuggestions;
