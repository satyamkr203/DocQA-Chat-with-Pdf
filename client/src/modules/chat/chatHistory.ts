export type ChatHistoryItem = {
  id: string;
  title: string;
  timestamp: number;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
};

const CHAT_HISTORY_KEY = "chat_history";
const MAX_HISTORY = 5;

export function saveChatHistory(messages: Array<{ role: "user" | "assistant"; content: string }>, currentHistoryId?: string) {
  if (messages.length === 0) return;

  const firstUserMessage = messages.find((m) => m.role === "user");
  if (!firstUserMessage) return;

  const existingHistory = getChatHistory();
  

  if (currentHistoryId) {
    const existingIndex = existingHistory.findIndex((h) => h.id === currentHistoryId);
    if (existingIndex !== -1) {
      existingHistory[existingIndex] = {
        ...existingHistory[existingIndex],
        messages: [...messages],
        timestamp: Date.now(), 
      };
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(existingHistory));
      return;
    }
  }


  const isDuplicate = existingHistory.some((item) => {
    const firstMsg = item.messages.find((m) => m.role === "user");
    return firstMsg && firstMsg.content === firstUserMessage.content;
  });

  if (isDuplicate) {
    const duplicateIndex = existingHistory.findIndex((item) => {
      const firstMsg = item.messages.find((m) => m.role === "user");
      return firstMsg && firstMsg.content === firstUserMessage.content;
    });
    
    if (duplicateIndex !== -1) {
      existingHistory[duplicateIndex] = {
        ...existingHistory[duplicateIndex],
        messages: [...messages],
        timestamp: Date.now(),
      };

      const updated = existingHistory.splice(duplicateIndex, 1)[0];
      existingHistory.unshift(updated);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(existingHistory));
      return;
    }
  }


  const historyItem: ChatHistoryItem = {
    id: Date.now().toString(),
    title: firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? "..." : ""),
    timestamp: Date.now(),
    messages: [...messages],
  };

  const newHistory = [historyItem, ...existingHistory].slice(0, MAX_HISTORY);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newHistory));
}

export function getChatHistory(): ChatHistoryItem[] {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function clearChatHistory() {
  localStorage.removeItem(CHAT_HISTORY_KEY);
}

