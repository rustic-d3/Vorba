import "./App.css";
import { useStorage } from "../user_session/local_storage";
import { useEffect } from "react";

function App() {
  const [sessionId, setSessionId] = useStorage("session_id");
  const [rowIndex, setRowIndex] = useStorage("row_index");
  const [gameStatus, setGameStatus] = useStorage("game_status");
  const [guessList, setGuessList] = useStorage("guess_list");
  
  useEffect(() => {
    setSessionId("oadsfj;asdjlsdfas");
  }, []);

  return (
    <>
      <div>Frontend Test</div>
    </>
  );
}

export default App;
