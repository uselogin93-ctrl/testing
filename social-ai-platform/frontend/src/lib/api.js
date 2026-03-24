import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
});

/**
 * Create an authenticated Axios instance using a Clerk token getter.
 * Usage: const api = createAuthClient(getToken);
 */
export const createAuthClient = (getToken) => {
  const client = axios.create({ baseURL: `${API_URL}/api` });

  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

// ─── Typed API helpers ────────────────────────────────────────────────────────

export const api = {
  // Users
  getMe: (client) => client.get("/users/me"),
  getUser: (client, id) => client.get(`/users/${id}`),
  getAllUsers: (client) => client.get("/users"),
  followUser: (client, id) => client.post(`/users/follow/${id}`),
  registerUser: (data) => apiClient.post("/users/register", data),

  // Posts
  createPost: (client, data) => client.post("/posts", data),
  getFeed: (client) => client.get("/posts/feed"),
  getExplore: (client) => client.get("/posts/explore"),
  getPost: (client, id) => client.get(`/posts/${id}`),
  likePost: (client, id) => client.post(`/posts/like/${id}`),

  // Comments
  addComment: (client, postId, content) =>
    client.post(`/comments/${postId}`, { content }),
  getComments: (client, postId) => client.get(`/comments/${postId}`),

  // Messages
  sendMessage: (client, receiverId, content) =>
    client.post("/messages", { receiverId, content }),
  getMessages: (client, userId) => client.get(`/messages/${userId}`),
};
