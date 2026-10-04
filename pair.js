import { Boom } from '@hapi/boom';

/**
 * Validates and requests a WhatsApp pairing code for a given phone number.
 * 
 * @param {import('@whiskeysockets/baileys').WASocket} sock - The Baileys WhatsApp socket instance
 * @param {string} rawPhoneNumber - The phone number input string
 * @returns {Promise<{success: boolean, code?: string, error?: string, cleanedNumber?: string}>}
 */
export async function requestPairingCode(sock, rawPhoneNumber) {
  if (!rawPhoneNumber) {
    return { success: false, error: 'Phone number is required.' };
  }

  // 3. Remove spaces, "+", "-", and other formatting characters
  const cleanedNumber = rawPhoneNumber.replace(/[^0-9]/g, '');

  // 4. Verify that the resulting number is a valid international phone number format (7 to 15 digits)
  if (cleanedNumber.length < 7 || cleanedNumber.length > 15) {
    return { success: false, error: 'Invalid international phone number format. Must be between 7 and 15 digits.' };
  }

  if (!sock) {
    return { success: false, error: 'WhatsApp socket connection is not active.' };
  }

  try {
    console.log(`[ALSON-XMD Pair] Requesting pairing code for number: ${cleanedNumber}`);
    
    // Give socket a brief moment if needed, then request pairing code
    const code = await sock.requestPairingCode(cleanedNumber);
    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

    console.log(`[ALSON-XMD Pair] Generated Pairing Code: ${formattedCode}`);

    return {
      success: true,
      code: formattedCode,
      rawCode: code,
      cleanedNumber
    };
  } catch (err) {
    console.error('[ALSON-XMD Pair] Failed to request pairing code:', err);
    return { success: false, error: err.message || 'Failed to generate pairing code from WhatsApp servers.' };
  }
}
