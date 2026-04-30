/**
 * gistalogiya.txt format:
 *   1 ta javobli          ← bo'lim sarlavhasi (ixtiyoriy)
 *   ##Savol matni
 *   +to'g'ri javob
 *   -noto'g'ri javob
 */
export function parseGistologiya(text) {
  const lines = text.split('\n');
  const questions = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (current && current.options.length > 0) {
        questions.push(current);
        current = null;
      }
      continue;
    }

    // "N ta javobli" — bo'lim sarlavhasi, o'tkazib yuboriladi
    if (/^\d+\s+ta\s+javobli/i.test(line)) continue;

    if (line.startsWith('##')) {
      if (current && current.options.length > 0) {
        questions.push(current);
      }
      current = { question: line.slice(2).trim(), options: [] };

    } else if (line.startsWith('+') && current) {
      const text = line.slice(1).trim();
      if (text) current.options.push({ text, isCorrect: true });

    } else if (line.startsWith('-') && current) {
      const text = line.slice(1).trim();
      if (text) current.options.push({ text, isCorrect: false });
    }
  }

  if (current && current.options.length > 0) {
    questions.push(current);
  }

  return questions;
}
