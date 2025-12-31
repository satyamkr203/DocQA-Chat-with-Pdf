import type { ChatMessage } from "./chat.types";

export default function ChatMessages({
  messages,
}: {
  messages: ChatMessage[];
}) {
  return (
    <div className="space-y-4 mb-4">
      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">Start a conversation by asking a question</p>
        </div>
      ) : (
        messages.map((m, i) => (
        <div
          key={i}
            className={`flex fade-in ${
            m.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
              className={`max-w-[75%] px-4 py-3 rounded-lg text-sm shadow-sm ${
              m.role === "user"
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white"
                  : "bg-gray-100 text-gray-900 border border-gray-200"
            }`}
          >
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
