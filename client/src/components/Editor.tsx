import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import EditorMenuBar from "./EditorMenuBar";
import { useCallback, useEffect } from "react";

interface EditorProps {
  onContentChange: (content: string) => void;
}

const Editor = ({ onContentChange }: EditorProps) => {
  const setContent = useCallback(
    (text: string) => {
      onContentChange(text);
    },
    [onContentChange],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-lg focus:outline-none max-w-none",
      },
    },
    content: "<p>Write your essay here...</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getText());
    },
  });

  useEffect(() => {
    if (editor) {
      setContent(editor.getText());
    }
  }, [editor, setContent]);

  return (
    <div className="w-full h-full">
      <EditorMenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[500px] p-4 border rounded-lg bg-white"
      />
    </div>
  );
};

export default Editor;
