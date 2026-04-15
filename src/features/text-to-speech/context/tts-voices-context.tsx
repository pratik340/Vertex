"use client";

import { createContext, useContext } from "react";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

type GetAllOutput =
  inferProcedureOutput<AppRouter["voices"]["getAll"]>;

type TTSVoiceItem = GetAllOutput["custom"][number];

export interface TTSVoicesContextValue {
  customVoices: TTSVoiceItem[];
  systemVoices: TTSVoiceItem[];
  allVoices: TTSVoiceItem[];
}

export const TTSVoicesContext =
  createContext<TTSVoicesContextValue | null>(null);

type ProviderProps = {
  children: React.ReactNode;
  value: TTSVoicesContextValue;
};

export function TTSVoicesProvider({
  children,
  value,
}: ProviderProps) {
  return (
    <TTSVoicesContext.Provider value={value}>
      {children}
    </TTSVoicesContext.Provider>
  );
}

export function useTTSVoices(): TTSVoicesContextValue {
  const context = useContext(TTSVoicesContext);

  if (!context) {
    throw new Error(
      "useTTSVoices must be used within a TTSVoicesProvider"
    );
  }

  return context;
};