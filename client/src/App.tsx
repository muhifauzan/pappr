import "./App.css";

import { useState } from "react";
import Editor from "./components/Editor";
import WordCounter from "./components/WordCounter";

function App() {
  const [wordCount, setWordCount] = useState(0);

  return (
    <div className="app">
      <header className="header">
        <h1>Document Editor</h1>
      </header>
      <main className="editor-container">
        <Editor onWordCountChange={setWordCount} />
        <div>
          <WordCounter count={wordCount} />
        </div>
      </main>
    </div>
  );
}

export default App;
