// ===== ЭЛЕМЕНТЫ =====
const numDiceEl   = document.getElementById('numDice');
const seedInputEl = document.getElementById('seedInput');
const rollBtn     = document.getElementById('rollBtn');
const resetBtn    = document.getElementById('resetBtn');
const resultEl    = document.getElementById('diceResult');
const imagesEl    = document.getElementById('diceImages');
const freqRow     = document.getElementById('freqRow'); // <tr> с 7 <td> (1..6 и Σ)

// ===== ПРОСТОЙ SEEDED RNG =====
// Преобразуем строку-талисман в целое число (seed)
function stringToSeed(str) {
  let s = 0;
  for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0;
  return s >>> 0;
}
// Линейный конгруэнтный генератор: число в [0,1)
function makeSeededRandom(seed) {
  let x = seed >>> 0;
  return function () {
    x = (1664525 * x + 1013904223) >>> 0;
    return x / 4294967296;
  };
}
// Возвращает функцию rng(): если талисман пуст — Math.random
function getRng() {
  const seedText = seedInputEl.value.trim();
  if (!seedText) return Math.random;
  const seed = stringToSeed(seedText) || 1; // избегаем 0
  const rnd = makeSeededRandom(seed);
  return () => rnd();
}

// Случайное целое из [1..6]
function rollD6(rng) {
  return Math.floor(rng() * 6) + 1;
}

// ===== ОСНОВНОЕ ДЕЙСТВИЕ =====
function rollDice() {
  const n = Math.max(1, parseInt(numDiceEl.value, 10) || 1);
  const rng = getRng();

  const values = [];
  const counts = [0, 0, 0, 0, 0, 0]; // частоты 1..6
  const imgs = [];

  for (let i = 0; i < n; i++) {
    const v = rollD6(rng);     // строго 1..6
    values.push(v);
    counts[v - 1]++;
    imgs.push(`<img src="Icons/dice${v}.png" alt="d${v}">`);
  }

  resultEl.textContent = `Результаты: ${values.join(', ')}`;
  imagesEl.innerHTML = imgs.join('');
  updateFrequencyTable(counts);
}

// Обновляем 7 ячеек: 6 значений + сумма
function updateFrequencyTable(counts) {
  const tds = freqRow.querySelectorAll('td');
  let sum = 0;
  for (let i = 0; i < 6; i++) {
    tds[i].textContent = counts[i];
    sum += counts[i];
  }
  tds[6].textContent = sum; // Σ
}

// Полный сброс формы и вывода
function resetAll() {
  numDiceEl.value = 1;
  seedInputEl.value = '';
  resultEl.textContent = '';
  imagesEl.innerHTML = '';
  updateFrequencyTable([0, 0, 0, 0, 0, 0]);
}

// ===== ПРЕСЕТЫ И ГОРЯЧИЕ КЛАВИШИ =====
function applyPresetAndRoll(n) {
  numDiceEl.value = n;
  rollDice();
}

// Кнопки
rollBtn.addEventListener('click', rollDice);
resetBtn.addEventListener('click', resetAll);
document.querySelectorAll('button.preset').forEach(btn => {
  btn.addEventListener('click', () => applyPresetAndRoll(parseInt(btn.dataset.preset, 10)));
});

// Alt+1/2/4/8 — быстрые пресеты
document.addEventListener('keydown', (e) => {
  if (!e.altKey) return;
  const map = { '1': 1, '2': 2, '4': 4, '8': 8 };
  const n = map[e.key];
  if (n) { e.preventDefault(); applyPresetAndRoll(n); }
});

// Экспортируем под старые inline-обработчики (если вдруг остались в HTML)
window.rollDice = rollDice;
window.reset = resetAll;