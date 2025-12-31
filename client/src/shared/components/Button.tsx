import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-lg font-medium text-sm shadow-md hover:shadow-lg ${
        props.disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:from-gray-800 hover:to-gray-700 active:scale-[0.98]"
      } transition-all duration-200`}
    >
      {children}
    </button>
  );
}
