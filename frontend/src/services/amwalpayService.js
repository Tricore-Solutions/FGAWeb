import CryptoJS from 'crypto-js';

// UAT Test Credentials
const AMWAL_CONFIG = {
  MID: '161869',
  TID: '629772',
  SecureHashKey: '4C30FEEF735AE8F627C99D54994D798E5B83EE96EB4BECC77F3B6CB80A61033C',
  CurrencyId: 512, // OMR
  LanguageId: 'en',
  PaymentViewType: 1, // 1 = Popup, 2 = Full Screen
  ContactInfoType: 1, // 1=All, 2=Email only, 3=Phone only, 4=None
  // UAT Environment
  SmartBoxUrl: 'https://test.amwalpg.com:7443/js/SmartBox.js?v=1.1'
};

/**
 * Generate Secure Hash for AmwalPay
 * VERIFIED ALGORITHM: HMAC-SHA256(payload, hex-decoded-key)
 * 
 * Steps:
 * 1. Construct query string with parameters in ALPHABETICAL order
 * 2. Decode SecureHashKey from hex to binary
 * 3. Generate HMAC-SHA256 with payload and decoded key
 * 4. Convert to uppercase hex
 */
export const generateSecureHash = (params) => {
  const {
    Amount,
    CurrencyId,
    MerchantId,
    MerchantReference,
    RequestDateTime,
    SessionToken,
    TerminalId
  } = params;

  // Construct query string in alphabetical order
  const queryString = `Amount=${Amount}&CurrencyId=${CurrencyId}&MerchantId=${MerchantId}&MerchantReference=${MerchantReference}&RequestDateTime=${RequestDateTime}&SessionToken=${SessionToken}&TerminalId=${TerminalId}`;

  // Decode the SecureHashKey from hex to binary
  const keyHex = CryptoJS.enc.Hex.parse(AMWAL_CONFIG.SecureHashKey);

  // Generate HMAC-SHA256 hash with hex-decoded key
  const hash = CryptoJS.HmacSHA256(queryString, keyHex).toString(CryptoJS.enc.Hex).toUpperCase();
  
  return hash;
};

/**
 * Format amount for AmwalPay
 * Removes trailing zeros after decimal point
 * Examples: 10.000 -> "10", 10.500 -> "10.5", 10.125 -> "10.125"
 */
export const formatAmount = (amount) => {
  // Parse to float, fix to 3 decimals, then remove trailing zeros
  const formatted = parseFloat(amount).toFixed(3);
  // Remove trailing zeros and unnecessary decimal point
  return formatted.replace(/\.?0+$/, '');
};

/**
 * Format price for OrderItems (must be "OMR X.XXX")
 */
export const formatPrice = (amount) => {
  return `OMR ${formatAmount(amount)}`;
};

/**
 * Get current date and time in ISO format: "YYYY-MM-DDTHH:mm:ss.SSSZ"
 * Matching AmwalPay simulator format
 */
export const getCurrentDateTime = () => {
  return new Date().toISOString();
};

/**
 * Initialize AmwalPay Checkout
 */
export const initializeAmwalPay = (paymentData, callbacks) => {
  // Check if SmartBox is loaded
  if (typeof window.SmartBox === 'undefined') {
    console.error('SmartBox.js is not loaded. Please ensure the script is included in your HTML.');
    return false;
  }

  const {
    amount,
    merchantReference,
    orderItems = [],
    sessionToken = '',
    languageId = 'en'
  } = paymentData;

  const formattedAmount = formatAmount(amount);
  const trxDateTime = getCurrentDateTime();

  // Prepare order items - if none provided, create a default one
  const formattedOrderItems = orderItems.length > 0 
    ? orderItems.map(item => ({
        Name: item.name || 'Item',
        DescriptionOne: item.descriptionOne || '',
        DescriptionTwo: item.descriptionTwo || '',
        Price: formatPrice(item.price || amount)
      }))
    : [{
        Name: 'Membership Subscription',
        DescriptionOne: 'Monthly subscription',
        DescriptionTwo: 'Quantity: 1',
        Price: formatPrice(amount)
      }];

  // Generate secure hash with parameters in alphabetical order (matching payload structure)
  const secureHash = generateSecureHash({
    Amount: formattedAmount,
    CurrencyId: AMWAL_CONFIG.CurrencyId,
    MerchantId: AMWAL_CONFIG.MID,
    MerchantReference: merchantReference,
    RequestDateTime: trxDateTime,
    SessionToken: sessionToken,
    TerminalId: AMWAL_CONFIG.TID
  });

  // Configure SmartBox - this should be an object assignment
  window.SmartBox.Checkout.configure = {
    MID: AMWAL_CONFIG.MID,
    TID: AMWAL_CONFIG.TID,
    CurrencyId: AMWAL_CONFIG.CurrencyId,
    AmountTrxn: formattedAmount,
    MerchantReference: merchantReference,
    LanguageId: languageId,
    PaymentViewType: AMWAL_CONFIG.PaymentViewType,
    TrxDateTime: trxDateTime,
    SessionToken: sessionToken,
    ContactInfoType: AMWAL_CONFIG.ContactInfoType,
    OrderItems: formattedOrderItems,
    SecureHash: secureHash,
    completeCallback: function (data) {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess(data);
      }
    },
    errorCallback: function (data) {
      console.error('Payment error:', data);
      if (callbacks?.onError) {
        callbacks.onError(data);
      }
    },
    cancelCallback: function () {
      if (callbacks?.onCancel) {
        callbacks.onCancel();
      }
    }
  };

  return true;
};

/**
 * Open AmwalPay Checkout
 */
export const openAmwalPayCheckout = () => {
  if (typeof window.SmartBox === 'undefined') {
    console.error('SmartBox.js is not loaded');
    return false;
  }

  if (typeof window.SmartBox.Checkout === 'undefined') {
    console.error('SmartBox.Checkout is not available');
    return false;
  }

  try {
    // Use showSmartBox or showPaymentPage based on PaymentViewType
    // PaymentViewType 1 = Popup, 2 = Full Screen
    if (typeof window.SmartBox.Checkout.showSmartBox === 'function') {
      window.SmartBox.Checkout.showSmartBox();
      return true;
    } else if (typeof window.SmartBox.Checkout.showPaymentPage === 'function') {
      window.SmartBox.Checkout.showPaymentPage();
      return true;
    } else {
      console.error('No valid checkout method found. Available methods:', Object.keys(window.SmartBox.Checkout));
      return false;
    }
  } catch (error) {
    console.error('Error opening AmwalPay checkout:', error);
    return false;
  }
};

export default {
  AMWAL_CONFIG,
  generateSecureHash,
  formatAmount,
  formatPrice,
  getCurrentDateTime,
  initializeAmwalPay,
  openAmwalPayCheckout
};

