import Settings from "../models/Settings.js";

/**
 * Get Cashfree credentials
 * @returns {Promise<{appId: string, secretKey: string}>}
 */
export async function getCashfreeCredentials() {
  try {
    // First check environment variables (highest priority)
    const envAppId = process.env.CASHFREE_APP_ID;
    const envSecretKey = process.env.CASHFREE_SECRET_KEY;
    
    if (envAppId && envSecretKey) {
      return {
        appId: envAppId,
        secretKey: envSecretKey,
      };
    }

    // Fallback to database settings
    const settings = await Settings.getSettings();
    const cashfree = settings.cashfree;

    // Return credentials from database or environment variables
    return {
      appId: cashfree?.appId || process.env.CASHFREE_APP_ID || "",
      secretKey: cashfree?.secretKey || process.env.CASHFREE_SECRET_KEY || "",
    };
  } catch (error) {
    console.error("Error getting Cashfree credentials:", error);
    // Return credentials from environment variables only
    return {
      appId: process.env.CASHFREE_APP_ID || "",
      secretKey: process.env.CASHFREE_SECRET_KEY || "",
    };
  }
}

/**
 * Get Cashfree App ID (for frontend use)
 * @returns {Promise<string>}
 */
export async function getCashfreeAppId() {
  try {
    const credentials = await getCashfreeCredentials();
    return credentials.appId;
  } catch (error) {
    console.error("Error getting Cashfree App ID:", error);
    return process.env.CASHFREE_APP_ID || "";
  }
}

/**
 * Verify Cashfree credentials are configured
 * @returns {Promise<{configured: boolean, hasAppId: boolean, hasSecretKey: boolean}>}
 */
export async function verifyCashfreeConfig() {
  try {
    const credentials = await getCashfreeCredentials();
    return {
      configured: !!(credentials.appId && credentials.secretKey),
      hasAppId: !!credentials.appId,
      hasSecretKey: !!credentials.secretKey,
    };
  } catch (error) {
    console.error("Error verifying Cashfree config:", error);
    return {
      configured: false,
      hasAppId: false,
      hasSecretKey: false,
    };
  }
}

/**
 * Create Cashfree payment order
 * @param {Object} orderData - Order data
 * @param {number} orderData.amount - Amount in paise
 * @param {string} orderData.orderId - Unique order ID
 * @param {string} orderData.customerName - Customer name
 * @param {string} orderData.customerEmail - Customer email
 * @param {string} orderData.customerPhone - Customer phone
 * @param {Object} orderData.notes - Additional notes
 * @returns {Promise<Object>}
 */
export async function createCashfreeOrder(orderData) {
  try {
    const credentials = await getCashfreeCredentials();

    if (!credentials.appId || !credentials.secretKey) {
      throw new Error("Cashfree credentials not configured");
    }

    const { amount, orderId, customerName, customerEmail, customerPhone, notes } = orderData;

    // Cashfree API endpoint
    const apiUrl = "https://api.cashfree.com/pg/orders";

    // Prepare order_meta - only include return_url if it's HTTPS (Cashfree requirement)
    const orderMeta = {};
    if (notes?.returnUrl) {
      // Replace PLACEHOLDER with actual orderId if present
      let finalReturnUrl = notes.returnUrl;
      if (finalReturnUrl.includes("PLACEHOLDER")) {
        finalReturnUrl = finalReturnUrl.replace("PLACEHOLDER", orderId);
        console.log("Replaced PLACEHOLDER with orderId in returnUrl:", finalReturnUrl);
      }
      
      if (finalReturnUrl.startsWith("https://")) {
        // For HTTPS URLs, use the returnUrl
        orderMeta.return_url = finalReturnUrl;
        console.log("Setting return_url for Cashfree:", finalReturnUrl);
      } else if (finalReturnUrl.startsWith("http://localhost") || finalReturnUrl.startsWith("http://127.0.0.1")) {
        // For local development, convert HTTP localhost to HTTPS or skip
        // Cashfree doesn't accept HTTP URLs, so we'll skip return_url for localhost
        // The payment will still work, but redirect will be handled by frontend
        console.log("Skipping return_url for localhost HTTP (Cashfree requires HTTPS)");
      } else if (finalReturnUrl.startsWith("http://")) {
        // For other HTTP URLs, try to convert to HTTPS
        orderMeta.return_url = finalReturnUrl.replace("http://", "https://");
        console.log("Converted HTTP to HTTPS for return_url:", orderMeta.return_url);
      }
    }
    if (notes?.notifyUrl) {
      orderMeta.notify_url = notes.notifyUrl;
    }

    const requestBody = {
      order_id: orderId,
      order_amount: amount / 100, // Convert paise to rupees
      order_currency: "INR",
      customer_details: {
        customer_id: notes?.userId?.toString() || orderId,
        customer_name: customerName || "Customer",
        customer_email: customerEmail || "",
        customer_phone: customerPhone || "",
      },
      order_meta: Object.keys(orderMeta).length > 0 ? orderMeta : undefined,
      order_note: notes ? JSON.stringify(notes) : "",
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": credentials.appId,
        "x-client-secret": credentials.secretKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = `Cashfree API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch (e) {
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (e2) {
          // Use default error message
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating Cashfree order:", error);
    throw error;
  }
}

/**
 * Verify Cashfree payment
 * @param {string} orderId - Order ID
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>}
 */
export async function verifyCashfreePayment(orderId, paymentId) {
  try {
    const credentials = await getCashfreeCredentials();

    if (!credentials.appId || !credentials.secretKey) {
      throw new Error("Cashfree credentials not configured");
    }

    // Cashfree payment verification endpoint
    const apiUrl = `https://api.cashfree.com/pg/orders/${orderId}/payments/${paymentId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": credentials.appId,
        "x-client-secret": credentials.secretKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Cashfree API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying Cashfree payment:", error);
    throw error;
  }
}

/**
 * Verify Cashfree payment signature
 * @param {string} orderId - Order ID
 * @param {string} orderAmount - Order amount
 * @param {string} referenceId - Payment reference ID
 * @param {string} txStatus - Transaction status
 * @param {string} paymentMode - Payment mode
 * @param {string} txMsg - Transaction message
 * @param {string} txTime - Transaction time
 * @param {string} signature - Signature to verify
 * @returns {boolean}
 */
export async function verifyCashfreeSignature(
  orderId,
  orderAmount,
  referenceId,
  txStatus,
  paymentMode,
  txMsg,
  txTime,
  signature
) {
  try {
    const credentials = await getCashfreeCredentials();

    // Create signature string
    const signatureData = `${orderId}${orderAmount}${referenceId}${txStatus}${paymentMode}${txMsg}${txTime}`;

    // Generate HMAC SHA256 signature
    const crypto = await import("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", credentials.secretKey)
      .update(signatureData)
      .digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Error verifying Cashfree signature:", error);
    return false;
  }
}
