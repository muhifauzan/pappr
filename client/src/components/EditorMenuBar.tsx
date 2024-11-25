interface EditorMenuBarProps {
  editor: any | null;
}
const EditorMenuBar = ({ editor }: EditorMenuBarProps) => {
  if (!editor) return null;

  const ButtonClass = "px-3 py-1 rounded hover:bg-gray-100";
  const ActiveButtonClass = "px-3 py-1 rounded bg-gray-200";

  return (
    <div className="flex gap-2 p-2 mb-2 border rounded-lg bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? ActiveButtonClass : ButtonClass}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? ActiveButtonClass : ButtonClass}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline") ? ActiveButtonClass : ButtonClass
        }
      >
        underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? ActiveButtonClass : ButtonClass}
      >
        strike
      </button>
    </div>
  );
};

export default EditorMenuBar;
