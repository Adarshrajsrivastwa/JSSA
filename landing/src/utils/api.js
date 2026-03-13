const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "";

if (!API_BASE_URL) {
  console.error("VITE_API_URL or VITE_BACKEND_URL must be set in environment variables");
}

/**
 * Make API request (public endpoints don't need authentication)
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 * @param {string} options.token - Optional authentication token
 */
async function apiRequest(endpoint, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured. Please set VITE_API_URL or VITE_BACKEND_URL in your .env file");
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  const { token, ...restOptions } = options;

  const config = {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...restOptions.headers,
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
        "1. Backend server is running\n" +
        "2. Backend is accessible at " + API_BASE_URL
      );
    }
    
    throw error;
  }
}

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

  getLatestResults: async () => {
    return apiRequest("/job-postings/latest-results", { method: "GET" });
  },

  getLatestVacancies: async () => {
    return apiRequest("/job-postings/latest-vacancies", { method: "GET" });
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
};

/**
 * Gallery API
 */
export const galleryAPI = {
  getAll: async (active = null) => {
    const query = active !== null ? `?active=${active}` : "";
    return apiRequest(`/gallery${query}`, { method: "GET" });
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
};

/**
 * Payments API
 */
export const paymentsAPI = {
  createOrder: async (jobPostingId, gender, category, token = null) => {
    return apiRequest("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ jobPostingId, gender, category }),
      token,
    });
  },

  verifyPayment: async (orderId, paymentId, signature, applicationId, token = null) => {
    return apiRequest("/payments/verify", {
      method: "POST",
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        applicationId: applicationId,
      }),
      token,
    });
  },

  calculateFee: async (jobPostingId, gender, category, token = null) => {
    return apiRequest(
      `/payments/calculate-fee?jobPostingId=${jobPostingId}&gender=${gender}&category=${category}`,
      { method: "GET", token }
    );
  },
};

export default apiRequest;
