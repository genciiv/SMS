export function letterToNumeric(letter) {
  const map = { A: 10, B: 9, C: 8, D: 7, E: 6, F: 5 }; // 4=deshtim i forte, por për letra F=5
  return map[letter] ?? null;
}

export function numericToLetter(num) {
  if (num >= 9.5) return "A";
  if (num >= 8.5) return "B";
  if (num >= 7.5) return "C";
  if (num >= 6.5) return "D";
  if (num >= 5.5) return "E";
  return "F";
}
