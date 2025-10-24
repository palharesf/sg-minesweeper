// Helper functions for URL parameter parsing and encoding/decoding game configurations

/**
 * Handles encrypting to make the secret more secure.
 * It won't prevent anyone with access to the code from decoding it, but will make it slightly harder than just pasting the URL into a decrypter and getting the secret straightaway.
 */

import crypto from "https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/+esm";

export function encryptSecret(secret) {
  return crypto.AES.encrypt(secret, "i-cant-stop-you-but-i-can-slow-you-down").toString();
}

export function decryptSecret(encryptedSecret) {
  const bytes = crypto.AES.decrypt(encryptedSecret,"i-cant-stop-you-but-i-can-slow-you-down");
  return bytes.toString(crypto.enc.Utf8);
}

/**
 * Handles compression, so the generated JSON is a bit smaller.
 * Probably this can all be handled more elegantly if I got rid of the JSON entirely.
 * Something to ponder
 */

import pako from "https://cdn.jsdelivr.net/npm/pako@2.0.4/+esm";

/**
 * Encodes game configuration and reward URL into a URL hash string.
 * @param {object} config - Game configuration (rows, cols, mines).
 * @param {string} rewardSecret - The secret to be revealed upon winning.
 * @returns {string} The encoded URL hash string.
 */
export function encodeGameConfig(config, rewardSecret) {
  const data = {
    rows: config.rows,
    cols: config.cols,
    mines: config.mines,
    reward: encryptSecret(rewardSecret),
  };
  const stringifiedData = JSON.stringify(data);
  const compressed = pako.deflate(stringifiedData);
  const base64 = arrayBufferToBase64(compressed);
  return base64;
}

/**
 * Decodes a URL hash string into game configuration and reward URL.
 * @param {string} hash - The URL hash string (e.g., window.location.hash).
 * @returns {object|null} An object containing config and rewardUrl, or null if invalid.
 */
export function decodeGameConfig(hash) {
  if (!hash || hash.length < 2) return null;
  try {
    const base64 = hash.slice(1);
    const compressed = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const decompressed = pako.inflate(compressed);
    const decodedString = new TextDecoder().decode(decompressed);
    const data = JSON.parse(decodedString);
    if (data && data.rows && data.cols && data.mines && data.reward) {
      return {
        config: { rows: data.rows, cols: data.cols, mines: data.mines },
        rewardUrl: decryptSecret(data.reward),
      };
    }
  } catch (e) {
    console.error("Failed to decode game config from URL hash:", e);
  }
  return null;
}

/**
 * Generates a unique ID.
 * @returns {string} A unique ID.
 */
export function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
