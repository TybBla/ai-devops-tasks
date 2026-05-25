/**
 * Znajduje pary z sumą targetSum w jednym przejściu (hash mapa).
 *
 * @param {number[]} arr
 * @param {number} targetSum
 * @returns {number[][]}
 */
function findPairs(arr, targetSum) {
  const pairs = [];
  const seen = new Map(); // wartość -> liczba wystąpień

  for (const num of arr) {
    const complement = targetSum - num;
    const count = seen.get(complement) || 0;

    for (let k = 0; k < count; k++) {
      pairs.push([complement, num]);
    }

    seen.set(num, (seen.get(num) || 0) + 1);
  }

  return pairs;
}

module.exports = { findPairs };
