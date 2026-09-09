import { checkWord, getColorCode, wordOfTheDay } from './services.ts';



interface ApiResponse {
  status?: number;
  message?: string;
  error?: string;
  color_code?: string;
}
export async function gameLogic(w: string): Promise<ApiResponse> {
  const word: string = w.toLowerCase().trim();

  if (word && word.length === 5) {
    const apiResponse = checkWord(word);

    if (apiResponse) {
      const colorCode = getColorCode(word, wordOfTheDay); // vezi observația de mai jos
      return { color_code: colorCode };
    } else {
      return { message: "Nu exista acest cuvant" };
    }
  } else {
    return {
      error: "Înserează un cuvânt de 5 litere",
      status: 400,
    };
  }
}