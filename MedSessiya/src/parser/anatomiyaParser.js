/**
 * anatomiya.txt format:
 *   ? Savol matni
 *   + to'g'ri javob
 *   - noto'g'ri javob
 *   ? (bo'sh ajratuvchi)
 */
export function parseAnatomy(text) {
  const lines = text.split('\n');
  const questions = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith('?')) {
      const questionText = line.slice(1).trim();

      // bo'sh "?" — ajratuvchi
      if (!questionText) {
        if (current && current.options.length > 0) {
          questions.push(current);
          current = null;
        }
        continue;
      }

      // yangi savol
      if (current && current.options.length > 0) {
        questions.push(current);
      }
      current = { question: questionText, options: [] };

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
