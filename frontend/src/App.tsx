import "./App.css";
import "../user_session/local_storage"
import { initialiseSession } from "../user_session/local_storage";
import "../game_logic/game_logic"
import { gameLogic } from "../game_logic/game_logic";
import { useState } from "react";

function App() {
  initialiseSession();
  function sendWord(word:string){
    gameLogic(word).then(result => console.log("RESULT:", result));
  }
  

  const [currentWord, setCurrentWord] = useState<string>('');
  return (
    <>
      <input type="text" onChange={e=>setCurrentWord(e.target.value)}/>
      <button onClick={()=>sendWord(currentWord)} >click</button>
    </>
  );
}

export default App;
