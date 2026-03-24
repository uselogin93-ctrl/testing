import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Inject Clerk token before every request
api.interceptors.request.use(async (config) => {
  try {
    // getToken is available via useAuth hook; for server-side use getAuth
    if (typeof window !== "undefined") {
      const { Clerk } = window as any;
      if (Clerk?.session) {
        const token = await Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
  } catch (e) {
    // silent — unauthenticated requests will fail at server
  }
  return config;
});

export default api;
