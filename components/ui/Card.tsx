"use client";

import * as React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  return React.createElement(
    "div",
    {
      className: `rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 ${
        hover
          ? "hover:border-white/20 hover:bg-white/10 transition-all duration-300"
          : ""
      } ${className}`,
    },
    children
  );
}
