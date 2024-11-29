import { EditorInfo } from "./EditorInfo";
import { EditorUser } from "../types";
import { WebSocketStatus } from "@hocuspocus/provider";
import { Toolbar } from "../../ui/Toolbar";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { Icon } from "../../ui/Icon";
import { useCallback, useState } from "react";

export type EditorHeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  editor: Editor;
  collabState: WebSocketStatus;
  users: EditorUser[];
};

export const EditorHeader = ({
  editor,
  collabState,
  users,
  isSidebarOpen,
  toggleSidebar,
}: EditorHeaderProps) => {
  const { characters, words } = useEditorState({
    editor,
    selector: (ctx): { characters: number; words: number } => {
      const { characters, words } = ctx.editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      };
      return { characters: characters(), words: words() };
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const createExport = useCallback(
    (format) => () => {
      setIsLoading(true);

      editor
        .chain()
        .export({
          format,
          onExport(context) {
            context.download();
            setIsLoading(false);
          },
        })
        .run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
      <div className="flex flex-row gap-x-1.5 items-center">
        <div className="control-group">
          <div className="button-group">
            <button
              disabled={editor.isEmpty}
              className=" cursor-pointer"
              onClick={createExport("docx")}
            >
              Export to Word
            </button>
            <button disabled={editor.isEmpty} onClick={createExport("odt")}>
              Export to ODT
            </button>
            <button disabled={editor.isEmpty} onClick={createExport("md")}>
              Export to Markdown
            </button>
            <button disabled={editor.isEmpty} onClick={createExport("gfm")}>
              Export to GitHub Flavoured Markdown
            </button>
          </div>
          {isLoading && (
            <div className="hint purple-spinner">Processing...</div>
          )}
        </div>
        <div className="flex items-center gap-x-1.5">
          <Toolbar.Button
            tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleSidebar}
            active={isSidebarOpen}
            className={isSidebarOpen ? "bg-transparent" : ""}
          >
            <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
          </Toolbar.Button>
        </div>
      </div>
      <EditorInfo
        characters={characters}
        words={words}
        collabState={collabState}
        users={users}
      />
    </div>
  );
};
