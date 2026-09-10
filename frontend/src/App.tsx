import "./App.css";
import "../user_session/local_storage"
import { initialiseSession } from "../user_session/local_storage";


function App() {
  initialiseSession();

  return (
    <>
      <div>Frontend Test</div>
    </>
  );
}

export default App;
