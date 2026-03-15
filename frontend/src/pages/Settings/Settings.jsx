import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Settings as SettingsIcon, Save, Eye, EyeOff, CreditCard, CheckCircle, XCircle, Loader } from "lucide-react";
import { settingsAPI } from "../../utils/api";
import { useAuth } from "../../auth/AuthProvider";

const Settings = () => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const [showLiveSecret, setShowLiveSecret] = useState(false);
  const [showTestSecret, setShowTestSecret] = useState(false);

  const [formData, setFormData] = useState({
    razorpay: {
      keyId: "",
      keySecret: "",
      isTestMode: true,
      testKeyId: "rzp_test_1DP5mmOlF5G5ag",
      testKeySecret: "",
    },
  });

  useEffect(() => {
    if (role !== "admin") {
      setError("Access denied. Only admins can view settings.");
      setLoading(false);
      return;
    }

    fetchSettings();
  }, [role]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsAPI.get();
      
      if (response.success && response.data.settings) {
        setFormData({
          razorpay: {
            keyId: response.data.settings.razorpay?.keyId || "",
            keySecret: response.data.settings.razorpay?.keySecret || "",
            isTestMode: response.data.settings.razorpay?.isTestMode ?? true,
            testKeyId: response.data.settings.razorpay?.testKeyId || "rzp_test_1DP5mmOlF5G5ag",
            testKeySecret: response.data.settings.razorpay?.testKeySecret || "",
          },
        });
      }
    } catch (err) {
      console.error("Fetch settings error:", err);
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("razorpay.")) {
      const field = name.replace("razorpay.", "");
      setFormData((prev) => ({
        ...prev,
        razorpay: {
          ...prev.razorpay,
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (role !== "admin") {
      setError("Access denied. Only admins can update settings.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await settingsAPI.update({
        razorpay: {
          keyId: formData.razorpay.keyId,
          keySecret: formData.razorpay.keySecret,
          isTestMode: formData.razorpay.isTestMode,
          testKeyId: formData.razorpay.testKeyId,
          testKeySecret: formData.razorpay.testKeySecret,
        },
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // Refresh settings to get updated values including credentials
        fetchSettings();
      }
    } catch (err) {
      console.error("Update settings error:", err);
      setError(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const loadTestCredentials = () => {
    setFormData((prev) => ({
      ...prev,
      razorpay: {
        ...prev.razorpay,
        testKeyId: "rzp_test_1DP5mmOlF5G5ag",
        testKeySecret: "YOUR_TEST_SECRET_KEY",
        isTestMode: true,
      },
    }));
  };

  const handleVerifyCredentials = async () => {
    try {
      setVerifying(true);
      setError(null);
      setVerificationResult(null);

      const response = await settingsAPI.verifyRazorpayCredentials();

      if (response.success && response.data) {
        setVerificationResult({
          valid: response.data.valid,
          message: response.data.message,
          mode: response.data.mode,
          keyId: response.data.keyId,
          error: response.data.error,
        });
      }
    } catch (err) {
      console.error("Verify credentials error:", err);
      setVerificationResult({
        valid: false,
        message: err.message || "Failed to verify credentials",
        mode: "unknown",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (role !== "admin") {
    return (
      <DashboardLayout>
        <div className="p-3 sm:p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <p className="text-red-700 text-sm">Access denied. Only admins can view settings.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 text-sm sm:text-base">Loading settings...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activePath="/settings">
      <div className="p-3 sm:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#3AB000] flex items-center justify-center flex-shrink-0">
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">Manage application settings and payment gateway credentials</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-green-700 text-xs sm:text-sm font-medium">Settings saved successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <p className="text-red-700 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Razorpay Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#3AB000] flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Razorpay Payment Gateway</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              Configure your Razorpay credentials for payment processing. Use test mode for development and testing.
            </p>

            {/* Current Active Credentials Display */}
            {formData.razorpay.isTestMode ? (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">Currently Active: Test Mode</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Test Key ID:</span>
                    <p className="font-mono text-gray-900 mt-1 break-all">{formData.razorpay.testKeyId || "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Test Key Secret:</span>
                    <p className="font-mono text-gray-900 mt-1 break-all">
                      {formData.razorpay.testKeySecret ? (showTestSecret ? formData.razorpay.testKeySecret : "••••••••") : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">Currently Active: Live Mode</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Live Key ID:</span>
                    <p className="font-mono text-gray-900 mt-1 break-all">{formData.razorpay.keyId || "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Live Key Secret:</span>
                    <p className="font-mono text-gray-900 mt-1 break-all">
                      {formData.razorpay.keySecret ? (showLiveSecret ? formData.razorpay.keySecret : "••••••••") : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Test Mode Toggle */}
            <div className="mb-4 sm:mb-6">
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="razorpay.isTestMode"
                  checked={formData.razorpay.isTestMode}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#3AB000] border-gray-300 rounded focus:ring-[#3AB000] flex-shrink-0"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Enable Test Mode</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6 sm:ml-7">
                When enabled, test credentials will be used for all transactions
              </p>
            </div>

            {/* Test Credentials Section */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">Test Credentials</h3>
                <button
                  type="button"
                  onClick={loadTestCredentials}
                  className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Load Test Credentials
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Test Key ID
                  </label>
                  <input
                    type="text"
                    name="razorpay.testKeyId"
                    value={formData.razorpay.testKeyId}
                    onChange={handleChange}
                    placeholder="rzp_test_..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3AB000] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Test Key Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showTestSecret ? "text" : "password"}
                      name="razorpay.testKeySecret"
                      value={formData.razorpay.testKeySecret}
                      onChange={handleChange}
                      placeholder="Enter test secret key"
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3AB000] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTestSecret(!showTestSecret)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showTestSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Credentials Section */}
            <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3">Live Credentials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Live Key ID
                  </label>
                  <input
                    type="text"
                    name="razorpay.keyId"
                    value={formData.razorpay.keyId}
                    onChange={handleChange}
                    placeholder="rzp_live_..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3AB000] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Live Key Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showLiveSecret ? "text" : "password"}
                      name="razorpay.keySecret"
                      value={formData.razorpay.keySecret}
                      onChange={handleChange}
                      placeholder="Enter live secret key"
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3AB000] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLiveSecret(!showLiveSecret)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showLiveSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`mx-4 sm:mx-6 mb-4 p-3 sm:p-4 rounded-lg border ${
              verificationResult.valid
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-start gap-2 sm:gap-3">
                {verificationResult.valid ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-semibold ${
                    verificationResult.valid ? "text-green-800" : "text-red-800"
                  }`}>
                    {verificationResult.message}
                  </p>
                  {verificationResult.mode && verificationResult.mode !== "unknown" && (
                    <p className="text-xs text-gray-600 mt-1">
                      Mode: {verificationResult.mode === "test" ? "Test" : "Live"}
                    </p>
                  )}
                  {verificationResult.keyId && (
                    <p className="text-xs text-gray-600 mt-1 break-all">
                      Key ID: {verificationResult.keyId}
                    </p>
                  )}
                  {verificationResult.error && (
                    <p className="text-xs text-red-600 mt-1">
                      Error: {verificationResult.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <button
              type="button"
              onClick={handleVerifyCredentials}
              disabled={verifying || saving}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {verifying ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Verify Credentials
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={saving || verifying}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#3AB000] hover:bg-[#2d8a00] text-white text-xs sm:text-sm font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
