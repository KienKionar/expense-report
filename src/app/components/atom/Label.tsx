import React from "react";

export default function Label({
  children = "Label",
  htmlFor = "",
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <>
      <label htmlFor={htmlFor} className="block mb-1 text-slate-300 text-sm">
        {children}
      </label>
    </>
  );
}
