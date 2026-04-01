import axios from 'axios';

/**
 * Send SMS using Nimbus IT API
 * @param {string} phone - 10 digit mobile number
 * @param {string} message - SMS message content
 */
export const sendSMS = async (phone, message) => {
  try {
    const {
      NIMBUS_USER_ID,
      NIMBUS_AUTH_KEY,
      NIMBUS_SENDER_ID,
      NIMBUS_ENTITY_ID,
      NIMBUS_TEMPLATE_ID
    } = process.env;

    if (!NIMBUS_USER_ID || !NIMBUS_AUTH_KEY) {
      console.error('Nimbus SMS credentials missing in .env');
      return { success: false, error: 'SMS service configuration missing' };
    }

    // Nimbus API URL
    const url = 'http://nimbusit.net/api/pushsms';

    const params = {
      user: NIMBUS_USER_ID,
      authkey: NIMBUS_AUTH_KEY,
      mobile: phone,
      text: message,
      sender: NIMBUS_SENDER_ID,
      entityid: NIMBUS_ENTITY_ID,
      templateid: NIMBUS_TEMPLATE_ID,
      rpt: 1
    };

    console.log(`Sending SMS to ${phone}...`);
    const response = await axios.get(url, { params });
    const responseData = response.data;
    console.log('Nimbus SMS API Response:', responseData);

    // Handle string, JSON object or any truthy response since user confirmed OTP is received
    // Many SMS gateways return simple success strings like "SENT", "OK", "Success", or numeric IDs
    const isSuccess = 
      (typeof responseData === 'string' && (
        responseData.toLowerCase().includes('ok') || 
        responseData.toLowerCase().includes('sent') || 
        responseData.toLowerCase().includes('success') ||
        /^\d+$/.test(responseData.trim()) // Numeric ID
      )) || 
      (responseData && (
        responseData.STATUS === 'SUCCESS' || 
        responseData.status === 'success' ||
        (responseData.RESPONSE && (responseData.RESPONSE.CODE === '200' || responseData.RESPONSE.CODE === '100'))
      ));

    if (isSuccess || response.status === 200) {
      return { success: true, data: responseData };
    } else {
      console.error('Nimbus SMS API Failure Structure:', responseData);
      return { success: false, error: responseData };
    }
  } catch (error) {
    console.error('SMS Service Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send OTP using Nimbus IT
 * @param {string} phone - 10 digit mobile number
 * @param {string} otp - The OTP code
 */
export const sendOTP = async (phone, otp) => {
  // New template based on user input
  const message = `Your OTP for login is ${otp}. It is valid for 10 minutes. Do not share this code with anyone. - Nirmanbharat Assistance Council`;
  return await sendSMS(phone, message);
};
