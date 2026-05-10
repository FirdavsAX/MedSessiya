function parseMoodleFormat(text) {
  const questions = [];
  const questionBlocks = text.matchAll(/(?:^|\n)\s*#\s*([\s\S]*?)\s*\{([\s\S]*?)\}/g);

  for (const match of questionBlocks) {
    const question = match[1].replace(/\s+/g, ' ').trim();
    const options = match[2]
      .split(/(?=~%[-\d.,]+%)/)
      .map(optionText => optionText.trim())
      .filter(Boolean)
      .map(optionText => {
        const optionMatch = optionText.match(/^~%([-\d.,]+)%\s*([\s\S]*?)\s*$/);
        if (!optionMatch) return null;

        const weight = Number.parseFloat(optionMatch[1].replace(',', '.'));
        const text = optionMatch[2].replace(/\s+/g, ' ').trim();
        if (!text || Number.isNaN(weight)) return null;

        return { text, isCorrect: weight > 0 };
      })
      .filter(Boolean);

    if (question && options.length > 0) {
      questions.push({ question, options });
    }
  }

  return questions;
}

function parseLegacyFormat(text) {
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

/**
 * Gistologiya savollari ikki formatni qo'llab-quvvatlaydi:
 *
 *   # Savol matni
 *   {~%100%to'g'ri javob
 *   ~%0%noto'g'ri javob}
 *
 * va eski format:
 *   ##Savol matni
 *   +to'g'ri javob
 *   -noto'g'ri javob
 */
export function parseGistologiya(text) {
  const moodleQuestions = parseMoodleFormat(text);
  return moodleQuestions.length > 0 ? moodleQuestions : parseLegacyFormat(text);
}
