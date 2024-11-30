import { useEffect, useState } from "react";
import { useEditor, useEditorState } from "@tiptap/react";
import type { AnyExtension, Editor } from "@tiptap/core";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { TiptapCollabProvider, WebSocketStatus } from "@hocuspocus/provider";
import type { Doc as YDoc } from "yjs";

import { ExtensionKit } from "@/extensions/extension-kit";
import { userColors } from "../lib/constants";
import { initialContent } from "@/lib/data/initialContent";
import { Ai } from "@/extensions/Ai";
import { AiImage, AiWriter } from "@/extensions";
// import { Export } from "@tiptap-pro/extension-export";
import { EditorUser } from "@/components/editor/BlockEditor/types";
import { randomElement } from "../lib/utils";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  aiToken,
  convertToken,
  ydoc,
  provider,
  userId,
  userImg,
  userName = "User",
}: {
  aiToken?: string;
  convertToken?: string;
  ydoc: YDoc;
  provider?: TiptapCollabProvider | null | undefined;
  userId?: string;
  userImg?: string;
  userName?: string;
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    provider ? WebSocketStatus.Connecting : WebSocketStatus.Disconnected
  );
  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: (ctx) => {
        if (provider && !provider.isSynced) {
          provider.on("synced", () => {
            setTimeout(() => {
              if (ctx.editor.isEmpty) {
                ctx.editor.commands.setContent(initialContent);
              }
            }, 0);
          });
        } else if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(initialContent);
          ctx.editor.commands.focus("start", { scrollIntoView: true });
        }
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }),
        provider
          ? Collaboration.configure({
              document: ydoc,
            })
          : undefined,
        provider
          ? CollaborationCursor.configure({
              provider,
              user: {
                name: userName,
                color: randomElement(userColors),
                photoURL: userImg,
              },
            })
          : undefined,
        aiToken
          ? AiWriter.configure({
              authorId: userId,
              authorName: userName,
            })
          : undefined,
        // Export.configure({
        //   appId: "x9lyj1vk",
        //   token:
        //     "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzI5MTI5MzYsIm5iZiI6MTczMjkxMjkzNiwiZXhwIjoxNzMyOTk5MzM2LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiJmMjk3MTc5Yy03MGNjLTRlYTEtYWZjNS1jMGYxMjNlZWIxY2MifQ.JjHfo0T3kO70etRqb9S-rSE16AGJ21Pa4dGy2PREj6M",
        // }),
        aiToken
          ? AiImage.configure({
              authorId: userId,
              authorName: userName,
            })
          : undefined,
        aiToken ? Ai.configure({ token: aiToken }) : undefined,
      ].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    [ydoc, provider]
  );
  const users = useEditorState({
    editor,
    selector: (ctx): (EditorUser & { initials: string })[] => {
      if (!ctx.editor?.storage.collaborationCursor?.users) {
        return [];
      }

      return ctx.editor.storage.collaborationCursor.users.map(
        (user: EditorUser) => {
          const names = user.name?.split(" ");
          const firstName = names?.[0];
          const lastName = names?.[names.length - 1];
          const initials = `${firstName?.[0] || "?"}${lastName?.[0] || "?"}`;

          return { ...user, initials: initials.length ? initials : "?" };
        }
      );
    },
  });

  useEffect(() => {
    provider?.on("status", (event: { status: WebSocketStatus }) => {
      setCollabState(event.status);
    });
  }, [provider]);

  window.editor = editor;

  return { editor, users, collabState };
};
