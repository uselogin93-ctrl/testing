"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useMemo } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useApi() {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: BASE_URL });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return instance;
  }, [getToken]);

  return api;
}
