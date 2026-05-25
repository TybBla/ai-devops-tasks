/**
 * Walidacja adresu IPv4 (każdy oktet 0–255).
 */
const IPV4_REGEX =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Sprawdza, czy podany łańcuch jest poprawnym adresem IPv4.
 * @param {string} ip - Adres do sprawdzenia
 * @returns {boolean}
 */
function isValidIPv4(ip) {
  if (typeof ip !== 'string') {
    return false;
  }
  return IPV4_REGEX.test(ip.trim());
}

module.exports = { isValidIPv4, IPV4_REGEX };
