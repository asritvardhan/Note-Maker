const API_BASE = import.meta.env.VITE_API_URL || "";

function getToken() {
  return localStorage.getItem("access_token");
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

export const authApi = {
  register: (email, password) =>
    request("/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

export const notesApi = {
  list: (page = 1, limit = 10) =>
    request(`/notes?page=${page}&limit=${limit}`),

  get: (id) => request(`/notes/${id}`),

  create: (note) =>
    request("/notes", {
      method: "POST",
      body: JSON.stringify(note),
    }),

  update: (id, note) =>
    request(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(note),
    }),

  delete: (id) =>
    request(`/notes/${id}`, {
      method: "DELETE",
    }),

  share: (id, share_with_email) =>
    request(`/notes/${id}/share`, {
      method: "POST",
      body: JSON.stringify({ share_with_email }),
    }),

  search: (q) => request(`/search?q=${encodeURIComponent(q)}`),
};

export const aboutApi = {
  get: () => request("/about"),
};
