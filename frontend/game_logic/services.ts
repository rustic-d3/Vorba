
import { validWords } from "./cuvinte.ts"
const words = new Set(validWords)

import axiosInstance from '../api/axiosInstance.ts';

export async function getWordOfTheDay(): Promise<string> {
  const { data } = await axiosInstance.get('/words-operations/words/get-wod/');
  return data.word_of_the_day.toLowerCase();
}

let wordOfTheDay: string;

try {
  wordOfTheDay = await getWordOfTheDay();
} catch (err) {
  console.error('Nu am putut încărca cuvântul zilei:', err);
  wordOfTheDay = '';
}

export { wordOfTheDay };

export function checkWord(word: string): boolean {
  return words.has(word);
}
export function getColorCode(word: string, wordOfTheDay: string): string {
  const result: string[] = new Array(word.length).fill('r');
  const letterCounts: Record<string, number> = {};

  for (const letter of wordOfTheDay) {
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }

  for (let i = 0; i < word.length; i++) {
    if (word[i] === wordOfTheDay[i]) {
      result[i] = 'g';
      letterCounts[word[i]] -= 1;
    }
  }

  for (let i = 0; i < word.length; i++) {
    if (result[i] === 'g') {
      continue;
    }
    const letter = word[i];
    if ((letterCounts[letter] || 0) > 0) {
      result[i] = 'y';
      letterCounts[letter] -= 1;
    }
  }

  return result.join('');
}