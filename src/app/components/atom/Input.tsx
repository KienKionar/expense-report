import React from "react";

export default function Input({
  type = "text",
  holder = "Placeholder",
  val = "",
  action = () => {},
}: {
  type?: string;
  holder?: string;
  val?: string;
  action?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <input
        type={type}
        placeholder={holder}
        className="w-full rounded outline-none placeholder:text-gray-500 placeholder:text-sm focus:border-b-slate-300 focus:border-x-0 focus:border-t-0 focus:border-2 transition-all duration-150 ease-in-out border-slate-600 border-b-2 p-2 mb-4"
        value={val}
        onChange={action}
      />
    </>
  );
}
