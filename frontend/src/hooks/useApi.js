"use client";
import { useAuth } from "@clerk/nextjs";
import { useRef, useCallback } from "react";
import { createAuthClient } from "../lib/api";

export function useApi() {
  const { getToken } = useAuth();
  // Use ref so the client instance is stable across renders
  const clientRef = useRef(null);

  if (!clientRef.current) {
    clientRef.current = createAuthClient(getToken);
  }

  // Expose a refresh in case token changes (e.g. after sign-in)
  const refreshClient = useCallback(() => {
    clientRef.current = createAuthClient(getToken);
  }, [getToken]);

  return clientRef.current;
}
