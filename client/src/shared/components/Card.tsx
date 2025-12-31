export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 fade-in border border-gray-100">
      {children}
    </div>
  );
}
