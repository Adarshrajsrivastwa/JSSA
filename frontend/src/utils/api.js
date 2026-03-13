const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get auth token from localStorage
 */
function getToken() {
  const session = localStorage.getItem("jssa_auth");
  if (!session) return null;
  try {
    const parsed = JSON.parse(session);
    return parsed.token || null;
  } catch {
    return null;
  }
}

/**
 * Make API request with authentication
 */
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is JSON
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || "Server returned non-JSON response");
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    
    // Provide more helpful error messages
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error(
        "Cannot connect to backend server. Please ensure:\n" +
        "1. Backend server is running (npm run dev:backend)\n" +
        "2. Backend is accessible at " + API_BASE_URL + "\n" +
        "3. Check CORS settings in backend"
      );
    }
    
    throw error;
  }
}

/**
 * Auth API
 */
export const authAPI = {
  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (identifier, password, role) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password, role }),
    });
  },

  getProfile: async () => {
    return apiRequest("/auth/me", { method: "GET" });
  },
};

/**
 * Applications API
 */
export const applicationsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.jobPostingId) queryParams.append("jobPostingId", params.jobPostingId);
    
    const queryString = queryParams.toString();
    const url = `/applications${queryString ? `?${queryString}` : ""}`;
    return apiRequest(url, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/applications/${id}`, { method: "GET" });
  },

  create: async (applicationData) => {
    return apiRequest("/applications", {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  },

  update: async (id, applicationData) => {
    return apiRequest(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(applicationData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/applications/${id}`, { method: "DELETE" });
  },

  checkApplication: async (jobPostingId) => {
    return apiRequest(`/applications/check/${jobPostingId}`, { method: "GET" });
  },
};

/**
 * Job Postings API
 */
export const jobPostingsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/job-postings${queryString ? `?${queryString}` : ""}`;
    return apiRequest(url, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/job-postings/${id}`, { method: "GET" });
  },

  create: async (postingData) => {
    return apiRequest("/job-postings", {
      method: "POST",
      body: JSON.stringify(postingData),
    });
  },

  update: async (id, postingData) => {
    return apiRequest(`/job-postings/${id}`, {
      method: "PUT",
      body: JSON.stringify(postingData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/job-postings/${id}`, { method: "DELETE" });
  },
};

/**
 * Students API
 */
export const studentsAPI = {
  register: async (studentData) => {
    return apiRequest("/students/register", {
      method: "POST",
      body: JSON.stringify(studentData),
    });
  },

  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/students${queryString ? `?${queryString}` : ""}`;
    return apiRequest(url, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/students/${id}`, { method: "GET" });
  },

  update: async (id, studentData) => {
    return apiRequest(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    });
  },
};

/**
 * Dashboard API
 */
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest("/dashboard/stats", { method: "GET" });
  },
};

/**
 * Settings API
 */
export const settingsAPI = {
  get: async () => {
    return apiRequest("/settings", { method: "GET" });
  },

  update: async (settingsData) => {
    return apiRequest("/settings", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    });
  },

  getRazorpayStatus: async () => {
    return apiRequest("/settings/razorpay/status", { method: "GET" });
  },

  verifyRazorpayCredentials: async () => {
    return apiRequest("/settings/razorpay/verify", { method: "POST" });
  },
};

/**
 * Gallery API
 */
export const galleryAPI = {
  getAll: async (active = null) => {
    const query = active !== null ? `?active=${active}` : "";
    return apiRequest(`/gallery${query}`, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/gallery/${id}`, { method: "GET" });
  },

  upload: async (formData) => {
    const token = getToken();
    const url = `${API_BASE_URL}/gallery`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || "Server returned non-JSON response");
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  },

  update: async (id, updateData) => {
    return apiRequest(`/gallery/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/gallery/${id}`, { method: "DELETE" });
  },
};

/**
 * Scroller API
 */
export const scrollerAPI = {
  getAll: async (active = null) => {
    const query = active !== null ? `?active=${active}` : "";
    return apiRequest(`/scroller${query}`, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/scroller/${id}`, { method: "GET" });
  },

  upload: async (formData) => {
    const token = getToken();
    const url = `${API_BASE_URL}/scroller`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || "Server returned non-JSON response");
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  },

  update: async (id, updateData) => {
    return apiRequest(`/scroller/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/scroller/${id}`, { method: "DELETE" });
  },
};

/**
 * Payments API
 */
export const paymentsAPI = {
  createOrder: async (jobPostingId, gender, category) => {
    return apiRequest("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ jobPostingId, gender, category }),
    });
  },

  verifyPayment: async (orderId, paymentId, signature, applicationId) => {
    return apiRequest("/payments/verify", {
      method: "POST",
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        applicationId: applicationId,
      }),
    });
  },

  calculateFee: async (jobPostingId, gender, category) => {
    return apiRequest(
      `/payments/calculate-fee?jobPostingId=${jobPostingId}&gender=${gender}&category=${category}`,
      { method: "GET" }
    );
  },
};

/**
 * Notifications API
 */
export const notificationsAPI = {
  getAll: async (active = null) => {
    const query = active !== null ? `?active=${active}` : "";
    return apiRequest(`/notifications${query}`, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/notifications/${id}`, { method: "GET" });
  },

  create: async (data) => {
    return apiRequest("/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/notifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/notifications/${id}`, { method: "DELETE" });
  },
};

export default apiRequest;
