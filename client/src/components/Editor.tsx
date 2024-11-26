import { useCallback, useEffect, useRef, useState } from "react";
import { Step } from "@tiptap/pm/transform";
import { collab, receiveTransaction, sendableSteps } from "@tiptap/pm/collab";
import { EditorState } from "@tiptap/pm/state";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import { usePhoenixChannel } from "../utilities/usePhoenixChannel";
import EditorMenuBar from "./EditorMenuBar";

interface EditorProps {
  onContentChange: (content: string) => void;
}

interface EditorSocketPayload {
  version: number;
  steps: any[];
  client_id: number;
  client_ids: number[];
}

interface SocketErrorPayload {
  reason: string;
}

const EditorView = ({ onContentChange }: EditorProps) => {
  const [version, setVersion] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const clientID = useRef<number>(Math.floor(Math.random() * 0xffffffff));
  const channel = useRef<any>(null);
  const [phoenixChannel] = usePhoenixChannel("editor:main");

  const editor = useEditor({
    extensions: [StarterKit.configure({ history: false }), Underline],
    onCreate: ({ editor }) => {
      const newState = editor.state.reconfigure({
        plugins: [...editor.state.plugins, collab({ version })],
      });

      editor.view.updateState(newState);
    },
    onUpdate: ({ editor, transaction }) => {
      if (transaction.docChanged) {
        onContentChange(editor.getText());
        submitSteps(editor.state);
      }
    },
    content: "<p>Write your essay here...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-lg focus:outline-none max-w-none",
      },
    },
  });

  useEffect(() => {
    if (phoenixChannel) {
      channel.current = phoenixChannel;
      setConnectionStatus("connected");
    } else {
      setConnectionStatus("disconnected");
    }
  }, [phoenixChannel]);

  useEffect(() => {
    if (!channel.current || !editor) return;

    const handleNewSteps = ({
      version,
      steps,
      client_ids: clientIDs,
    }: EditorSocketPayload) => {
      console.log("Got new_steps", version, steps, clientIDs);

      const transaction = receiveTransaction(
        editor.state,
        steps.map((step) => Step.fromJSON(editor.schema, step)),
        clientIDs,
      );

      setVersion(version);
      editor.view.dispatch(transaction);
    };

    const handleError = (error: SocketErrorPayload) => {
      console.log("Got Channel error", error);
      if (error.reason === "version_mismatch") {
        channel.current.push("get_steps", { version });
      }
    };

    channel.current.on("new_steps", handleNewSteps);
    channel.current.on("error", handleError);

    return () => {
      channel.current?.off("new_steps", handleNewSteps);
      channel.current?.off("error", handleError);
    };
  }, [editor, version]);

  const submitSteps = useCallback((state: EditorState) => {
    const sendable = sendableSteps(state);

    if (sendable && sendable.steps.length > 0) {
      channel.current.push("submit_steps", {
        version: sendable.version,
        steps: sendable.steps.map((step) => step.toJSON()),
        client_id: clientID.current,
      });
    }
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <EditorMenuBar editor={editor} />
        <div
          className={`px-3 py-1 rounded-full ${
            connectionStatus === "connected"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {connectionStatus}
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[500px] p-4 border rounded-lg bg-white"
      />
    </div>
  );
};

export default EditorView;
