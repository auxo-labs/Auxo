/**
 * Simple client-side key obfuscation/deobfuscation utility (SEC-08).
 * Protects developer API keys from raw plain-text storage scraping.
 */

const SALT = "auX0_sEcReT_kEy_2026";

/**
 * Encodes an API key using XOR and Base64 to prevent plain-text scraping.
 * @param key - The raw API key string.
 * @returns Base64 encoded obfuscated string.
 */
export function obfuscateKey(key: string): string {
  if (!key) return "";
  try {
    const xorChars = Array.from(key).map((char, index) => {
      const saltChar = SALT.charCodeAt(index % SALT.length);
      return String.fromCharCode(char.charCodeAt(0) ^ saltChar);
    });
    return btoa(unescape(encodeURIComponent(xorChars.join(""))));
  } catch {
    return btoa(unescape(encodeURIComponent(key)));
  }
}

/**
 * Decodes an obfuscated API key back to its raw string representation.
 * @param obfuscated - The Base64 encoded obfuscated key.
 * @returns The original plain-text API key.
 */
export function deobfuscateKey(obfuscated: string): string {
  if (!obfuscated) return "";
  try {
    const decoded = decodeURIComponent(escape(atob(obfuscated)));
    const original = Array.from(decoded).map((char, index) => {
      const saltChar = SALT.charCodeAt(index % SALT.length);
      return String.fromCharCode(char.charCodeAt(0) ^ saltChar);
    }).join("");
    return original;
  } catch {
    // If decoding fails, return the string as-is (handles legacy plain text keys)
    return obfuscated;
  }
}
