'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';

interface DocumentEditorProps {
  project: any;
}

export default function DocumentEditor({ project }: DocumentEditorProps) {
  const { user } = useAuth();
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      'wss://demos.yjs.dev',
      project.id,
      ydoc
    );

    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
    };
  }, [project.id]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: provider?.doc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user?.displayName || 'Anonymous',
          color: '#' + Math.floor(Math.random()*16777215).toString(16),
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  return (
    <div className="p-8">
      <EditorContent editor={editor} />
    </div>
  );
}