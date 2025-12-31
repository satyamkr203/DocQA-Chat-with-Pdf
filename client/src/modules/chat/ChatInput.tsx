import { useState } from "react";

export default function ChatInput({
  onSend,
  loading,
}: {
  onSend: (q: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex gap-2 border-t border-gray-200 pt-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !loading && submit()}
        placeholder="Ask a question..."
        disabled={loading}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={submit}
        disabled={loading || !value.trim()}
        className="bg-linear-to-r from-gray-900 to-gray-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-gray-800 hover:to-gray-700 active:scale-[0.98] transition-all duration-200"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
