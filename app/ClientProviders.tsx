"use client";

import React from "react";
import ContextProvider from "./components/context/index";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContextProvider>{children}</ContextProvider>;
}
