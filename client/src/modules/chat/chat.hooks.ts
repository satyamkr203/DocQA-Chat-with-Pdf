import { useState, useEffect } from "react";
import { askQuery } from "../../api/query.api";
import type { ChatMessage } from "./chat.types";
import { saveChatHistory, getChatHistory } from "./chatHistory";

export function useChat(historyId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | undefined>(historyId);

  useEffect(() => {

    if (historyId) {
      const history = getChatHistory();
      const item = history.find((h) => h.id === historyId);
      if (item) {
        setMessages(item.messages as ChatMessage[]);
        setCurrentHistoryId(historyId);
      }
    } else {

      setCurrentHistoryId(undefined);
    }
  }, [historyId]);

  const sendMessage = async (question: string) => {
    setLoading(true);
    const userMessage: ChatMessage = { role: "user", content: question };
    
    setMessages((m) => {
      const updated = [...m, userMessage];
      

      askQuery(question)
        .then((res) => {
          const assistantMessage: ChatMessage = { role: "assistant", content: res.answer };
          setMessages((prev) => {
            const finalMessages = [...prev, assistantMessage];
            // Generate new history ID if this is a new conversation
            let idToUse = currentHistoryId;
            if (!idToUse) {
              idToUse = Date.now().toString();
              setCurrentHistoryId(idToUse);
            }
            saveChatHistory(finalMessages, idToUse);
            return finalMessages;
          });
        })
        .catch(() => {

          setMessages((prev) => prev.slice(0, -1)); // Remove the user message if query failed
        })
        .finally(() => {
          setLoading(false);
        });
      
      return updated;
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return { messages, sendMessage, loading, clearMessages };
}
