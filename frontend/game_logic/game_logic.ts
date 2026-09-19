import { checkWord, getColorCode, wordOfTheDay } from "./services.ts";
import { validateSession } from "../user_session/local_storage.ts";
interface ApiResponse {
  status?: number;
  message?: string;
  error?: string;
  color_code?: string;
  statistics?: any;
}
export async function gameLogic(w: string): Promise<ApiResponse> {
  //local storage data
  const game_status = window.localStorage.getItem("game_status");
  const guess_list = window.localStorage.getItem("guess_list");
  const row_index = window.localStorage.getItem("row_index") || "0";
  // general word logic

  const word: string = w.toLowerCase().trim();
  if (game_status == "lose") {
    const statistics_data = await validateSession();
    return { message: "Ai pierdut!", statistics: statistics_data };
  } else if (game_status == "win") {
    const statistics_data = await validateSession();
    return { message: "Ai câștigat!", statistics: statistics_data };
  }

  if (word && word.length === 5) {
    const apiResponse = checkWord(word);

    if (apiResponse) {
      let wordsList = guess_list ? JSON.parse(guess_list) : [];
      wordsList.push(word);
      window.localStorage.setItem("guess_list", JSON.stringify(wordsList));
      const colorCode = getColorCode(word, wordOfTheDay);
      //Guessing the word case
      if (colorCode == "ggggg") {
        window.localStorage.setItem("game_status", JSON.stringify("win"));
        const new_row_index = parseInt(row_index) + 1;
        window.localStorage.setItem("row_index", new_row_index.toString());
        if (new_row_index <= 6) {
          window.localStorage.setItem("game_status", JSON.stringify("win"));
          const statistics_data = await validateSession();
          return { message: "Felicitări! Ai câștigat!", statistics: statistics_data };
        }
      }
      const new_row_index = parseInt(row_index) + 1;
      window.localStorage.setItem("row_index", new_row_index.toString());
      if (new_row_index >= 6) {
        window.localStorage.setItem("game_status", JSON.stringify("lose"));
        const statistics_data = await validateSession();
        
        return { message: "Ai pierdut!", statistics: statistics_data };
      }

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
