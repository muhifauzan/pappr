import { useState } from "react";
import Editor from "./components/Editor";
import WordCounter from "./components/WordCounter";

function App() {
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Document Editor
          </h1>
        </div>
      </header>
      <main className="msx-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <Editor onContentChange={setContent} />
        </div>
        <div className="mt-4">
          <WordCounter content={content} />
        </div>
      </main>
    </div>
  );
}

export default App;
