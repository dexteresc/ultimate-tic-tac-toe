import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import UltimateBoard, { Player } from "./UltimateBoard";

function App() {
  const [size, setSize] = useState(3);

  return (
    <div className="App">
      <header className="App-header">
        {/* Add input for size */}
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
        />
      </header>
      <main>
        <UltimateBoard size={size} />
      </main>
    </div>
  );
}

export default App;
