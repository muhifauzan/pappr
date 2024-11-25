import {
  useEditor,
  EditorProvider,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [StarterKit];

const content = "<p>Hello World!</p>";

const Editor = () => {
  const editor = useEditor({
    extensions,
    content,
  });

  return (
    <EditorProvider extensions={extensions} content={content}>
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  );
};

export default Editor;
