// src/utils/randomization.js
function getRandomElements(arr, num) {
  // This shuffles the array and picks a specific number of items randomly.
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

module.exports = {
  getRandomElements,
};