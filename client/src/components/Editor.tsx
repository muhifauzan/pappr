import "../styles/Editor.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import EditorMenuBar from "./EditorMenuBar";
import { useCallback, useEffect } from "react";

interface EditorProps {
  onWordCountChange: (wordCount: number) => void;
}

const Editor = ({ onWordCountChange }: EditorProps) => {
  const updateWordCount = useCallback(
    (text: string) => {
      const wordCount = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      onWordCountChange(wordCount);
    },
    [onWordCountChange],
  );

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "<p>Write your essay here...</p>",
    onUpdate: ({ editor }) => {
      updateWordCount(editor.getText());
    },
  });

  useEffect(() => {
    if (editor) {
      updateWordCount(editor.getText());
    }
  }, [editor, updateWordCount]);

  return (
    <div className="editor-wrapper">
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />;
    </div>
  );
};

export default Editor;
