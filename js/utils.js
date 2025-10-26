// Helper functions for URL parameter parsing and encoding/decoding game configurations

/**
 * Converts Uint8Array to base64 string safely
 */
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Handles compression, so the generated link is a bit smaller.
 */

import pako from "https://cdn.jsdelivr.net/npm/pako@2.0.4/+esm";

/**
 * Encodes game configuration and reward URL into a URL hash string.
 * @param {object} config - Game configuration (rows, cols, mines).
 * @param {string} rewardSecret - The secret to be revealed upon winning.
 * @returns {string} The encoded URL hash string.
 */
export function encodeGameConfig(config, rewardSecret) {
  const key = "i-cant-stop-you-but-i-can-slow-you-down";
  let encrypted = "";
  for (let i = 0; i < rewardSecret.length; i++) {
    encrypted += String.fromCharCode(
      rewardSecret.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }

  const data = `${config.rows},${config.cols},${config.mines},${encrypted}`;
  const compressed = pako.deflate(data);
  const base64 = arrayBufferToBase64(compressed);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Decodes a URL hash string into game configuration and reward URL.
 * @param {string} hash - The URL hash string (e.g., window.location.hash).
 * @returns {object|null} An object containing config and rewardUrl, or null if invalid.
 */
export function decodeGameConfig(hash) {
  if (!hash || hash.length < 2) return null;
  try {
    let base64 = hash.slice(1);
    base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    
    const compressed = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const decompressed = pako.inflate(compressed);
    const decodedString = new TextDecoder().decode(decompressed);
    
    const parts = decodedString.split(",");
    if (parts.length !== 4) {
      return null;
    }
    const [rows, cols, mines, encrypted] = parts;

    const key = "i-cant-stop-you-but-i-can-slow-you-down";
    let decrypted = "";
    for (let i = 0; i < encrypted.length; i++) {
      decrypted += String.fromCharCode(
        encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }

    return {
      config:
        { rows: parseInt(rows), cols: parseInt(cols), mines: parseInt(mines) },
      rewardUrl: decrypted
    };
  } catch (e) {
    console.error("Failed to decode game config from URL hash:", e);
  }
  return null;
}
