import "./App.css";
import { useStorage, validSession } from "../user_session/local_storage";
import { useEffect } from "react";

function App() {
  const [sessionId, setSessionId] = useStorage("session_id");
  const [sessionDate, setSessionDate] = useStorage("current_date");
  const [gameStatus, setGameStatus] = useStorage("game_status");
  const [currentRowIndex, setCurrentRowIndex] = useStorage("row_index");
  const [guessList, setGuessList] = useStorage("guess_list");

  useEffect(() => {
    const myDate = new Date();
    
    if (!sessionId || !validSession(sessionDate) ) {
      const randomStr = window.crypto.randomUUID();
      setSessionId(randomStr);
      setSessionDate(myDate.toISOString());
      setGameStatus("in_progress");
      setCurrentRowIndex("0");
      setGuessList("[]");

    }
  }, [sessionId, setSessionId, setSessionDate, setGameStatus, setCurrentRowIndex, setGuessList]);

  return (
    <>
      <div>Frontend Test</div>
    </>
  );
}

export default App;
