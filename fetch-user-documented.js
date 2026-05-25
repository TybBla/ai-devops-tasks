/**
 * Pobiera dane użytkownika z zewnętrznego API i mapuje je na uproszczony obiekt.
 *
 * W przypadku błędu HTTP, sieci lub parsowania JSON funkcja loguje błąd
 * i zwraca `null` zamiast rzucać wyjątek dalej.
 *
 * @async
 * @param {string|number} userId - Identyfikator użytkownika w API.
 * @returns {Promise<UserData|null>} Obiekt z danymi użytkownika lub `null` przy błędzie.
 *
 * @typedef {Object} UserData
 * @property {string} name - Imię i nazwisko użytkownika.
 * @property {string} email - Adres e-mail użytkownika.
 * @property {Date} lastLogin - Data ostatniego logowania (z pola `lastLoginTimestamp` API).
 *
 * @example
 * const user = await fetchUserData(42);
 * if (user) {
 *   console.log(user.name, user.lastLogin);
 * }
 *
 * @throws {Error} Wewnętrznie przy `!response.ok` — przechwytywane w `.catch`, wynik to `null`.
 */
function fetchUserData(userId) {
  return fetch(`https://api.example.com/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      return {
        name: data.name,
        email: data.email,
        lastLogin: new Date(data.lastLoginTimestamp)
      };
    })
    .catch(error => {
      console.error('Fetch error:', error);
      return null;
    });
}

module.exports = { fetchUserData };
