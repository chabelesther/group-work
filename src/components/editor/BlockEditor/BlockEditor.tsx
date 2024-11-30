"use client";
import { EditorContent } from "@tiptap/react";
import React, { useEffect, useRef } from "react";

import { LinkMenu } from "@/components/editor/menus";

import { useBlockEditor } from "@/hooks/useBlockEditor";

import "@/styles/index.css";

import { Sidebar } from "@/components/editor/Sidebar";
import ImageBlockMenu from "@/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/extensions/Table/menus";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import { useSidebar } from "@/hooks/useSidebar";
import * as Y from "yjs";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import DocumentHeader from "./mainHeader/header";
import { useAuth } from "@/context/authContext/auth";

export const BlockEditor = ({
  aiToken,
  convertToken,
  ydoc,
  provider,
}: {
  aiToken?: string;
  convertToken?: string;
  hasCollab: boolean;
  ydoc: Y.Doc;
  provider?: TiptapCollabProvider | null | undefined;
}) => {
  const { user } = useAuth();
  const menuContainerRef = useRef(null);
  const leftSidebar = useSidebar();
  const { editor, users, collabState } = useBlockEditor({
    aiToken,
    convertToken,
    ydoc,
    provider,
    userId: user?.uid,
    userName: user?.displayName,
    userImg: user?.photoURL,
  });
  console.log("extention", editor.extensionManager.extensions);
  useEffect(() => {
    return () => {
      if (editor) editor.destroy(); // Évite les multiples instances
    };
  }, [editor]);
  if (!editor || !users) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar
        isOpen={leftSidebar.isOpen}
        onClose={leftSidebar.close}
        editor={editor}
      />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <DocumentHeader />
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
        />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default BlockEditor;
