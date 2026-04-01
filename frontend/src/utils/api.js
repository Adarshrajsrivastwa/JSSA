// Prefer explicit env vars, but safely fall back to Vite proxy (/api).
const RAW_API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "/api";

const API_BASE_URL = (() => {
  const base = String(RAW_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) return "/api";

  // If absolute URL is provided without /api suffix, append it to match backend routes.
  if (/^https?:\/\//i.test(base) && !/\/api$/i.test(base)) {
    return `${base}/api`;
  }

  return base;
})();

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
      // Improve error message handling for objects
      let errorMessage = "Request failed";
      if (data) {
        if (typeof data.message === 'object') {
          errorMessage = JSON.stringify(data.message);
        } else {
          errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Only log non-network errors (network errors are expected in some cases)
    if (error.message !== "Failed to fetch" && error.name !== "TypeError") {
      console.error("API Error:", error);
    }
    
    // Provide more helpful error messages
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      // Return error structure instead of throwing for better error handling
      return {
        success: false,
        data: null,
        error: `Cannot connect to backend server. Please ensure:
1. Backend server is running (npm run dev:backend)
2. Backend is accessible at ${API_BASE_URL}
3. Check CORS settings in backend`
      };
    }
    
    // For other errors, return error structure instead of throwing
    return {
      success: false,
      data: null,
      error: error.message || "Unknown error"
    };
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
  nimbusLoginRequest: async (phone) => {
    return apiRequest("/auth/nimbus-login-request", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },
  nimbusLoginVerify: async (phone, otp) => {
    return apiRequest("/auth/nimbus-login-verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });
  },
  forgotPassword: async (email) => {
    return apiRequest("/auth/me", { method: "GET" });
  },

  forgotPassword: async (email) => {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyOTP: async (email, otp) => {
    return apiRequest("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (email, otp, newPassword) => {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
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
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    if (params.jobPostingId) queryParams.append("jobPostingId", params.jobPostingId);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.paymentStatus) queryParams.append("paymentStatus", params.paymentStatus);
    
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

  updatePaymentStatus: async (id, paymentStatus) => {
    return apiRequest(`/applications/${id}/payment-status`, {
      method: "PATCH",
      body: JSON.stringify({ paymentStatus }),
    });
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
    if (params.limit !== undefined) queryParams.append("limit", params.limit);
    if (params.includeCounts) queryParams.append("includeCounts", params.includeCounts);
    
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
    if (params.limit !== undefined) queryParams.append("limit", params.limit);

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

/**
 * Notices API
 */
export const noticesAPI = {
  getAll: async (active = null) => {
    const query = active !== null ? `?active=${active}` : "";
    return apiRequest(`/notices${query}`, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/notices/${id}`, { method: "GET" });
  },

  create: async (data) => {
    return apiRequest("/notices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/notices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/notices/${id}`, { method: "DELETE" });
  },
};

/**
 * Question Bank API
 */
export const questionBankAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);
    if (params.subject) queryParams.append("subject", params.subject);
    if (params.difficulty) queryParams.append("difficulty", params.difficulty);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/question-bank${queryString ? `?${queryString}` : ""}`;
    return apiRequest(url, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/question-bank/${id}`, { method: "GET" });
  },

  create: async (data) => {
    return apiRequest("/question-bank", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/question-bank/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/question-bank/${id}`, { method: "DELETE" });
  },
};

/**
 * Create Paper API
 */
export const createPaperAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);
    if (params.page) queryParams.append("page", params.page);
    if (params.limit !== undefined) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/create-paper${queryString ? `?${queryString}` : ""}`;
    return apiRequest(url, { method: "GET" });
  },

  getById: async (id) => {
    return apiRequest(`/create-paper/${id}`, { method: "GET" });
  },

  create: async (data) => {
    return apiRequest("/create-paper", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return apiRequest(`/create-paper/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return apiRequest(`/create-paper/${id}`, { method: "DELETE" });
  },

  getAssigned: async () => {
    return apiRequest("/create-paper/assigned", { method: "GET" });
  },

  getReview: async (id) => {
    return apiRequest(`/create-paper/${id}/review`, { method: "GET" });
  },

  submitAttempt: async (id, data) => {
    return apiRequest(`/create-paper/${id}/submit`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

/**
 * Upload API
 */
export const uploadAPI = {
  uploadAdvertisement: async (file) => {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload/advertisement`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || "Upload failed");
    }
    return data;
  },
};

/**
 * Test Results API
 */
export const testResultsAPI = {
  getAll: async () => {
    return apiRequest("/test-result", { method: "GET" });
  },
};

// Combined API object
export const api = {
  auth: authAPI,
  applications: applicationsAPI,
  jobPostings: jobPostingsAPI,
  questionBank: questionBankAPI,
  createPaper: createPaperAPI,
  upload: uploadAPI,
  testResults: testResultsAPI,
};

export default apiRequest;
