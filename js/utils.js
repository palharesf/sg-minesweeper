// Helper functions for URL parameter parsing and encoding/decoding game configurations

/**
 * Encodes game configuration and reward URL into a URL hash string.
 * @param {object} config - Game configuration (rows, cols, mines).
 * @param {string} rewardUrl - The URL to be revealed upon winning.
 * @returns {string} The encoded URL hash string.
 */
export function encodeGameConfig(config, rewardUrl) {
  const data = {
    rows: config.rows,
    cols: config.cols,
    mines: config.mines,
    reward: rewardUrl,
  };
  return btoa(JSON.stringify(data)); // Base64 encode the JSON string
}

/**
 * Decodes a URL hash string into game configuration and reward URL.
 * @param {string} hash - The URL hash string (e.g., window.location.hash).
 * @returns {object|null} An object containing config and rewardUrl, or null if invalid.
 */
export function decodeGameConfig(hash) {
  if (!hash || hash.length < 2) return null;
  try {
    const encodedData = hash.substring(1); // Remove '#'
    const decodedString = atob(encodedData); // Base64 decode
    const data = JSON.parse(decodedString);
    if (data && data.rows && data.cols && data.mines && data.reward) {
      return {
        config: { rows: data.rows, cols: data.cols, mines: data.mines },
        rewardUrl: data.reward,
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
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}