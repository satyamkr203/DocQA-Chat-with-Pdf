export default function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
    />
  );
}
