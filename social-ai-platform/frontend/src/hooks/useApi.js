"use client";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createAuthClient } from "../lib/api";

export function useApi() {
  const { getToken } = useAuth();

  const client = useMemo(() => createAuthClient(getToken), [getToken]);

  return client;
}
