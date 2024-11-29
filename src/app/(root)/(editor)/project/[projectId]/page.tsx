"use client";

import { TiptapCollabProvider } from "@hocuspocus/provider";
import "iframe-resizer/js/iframeResizer.contentWindow";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Doc as YDoc } from "yjs";

import { BlockEditor } from "@/components/editor/BlockEditor";
import { createPortal } from "react-dom";
import { Surface } from "@/components/editor/ui/Surface";
import { Toolbar } from "@/components/editor/ui/Toolbar";
import { Icon } from "@/components/editor/ui/Icon";
import { useDarkmode } from "@/hooks/useDarkmode";

export default function Document({
  params,
}: {
  params: { projectId: string };
}) {
  const { isDarkMode, darkMode, lightMode } = useDarkmode();
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const [collabToken, setCollabToken] = useState<string | null | undefined>();
  const [aiToken, setAiToken] = useState<string | null | undefined>(null);
  const [convertToken, setConvertToken] = useState<string | null | undefined>();
  const searchParams = useSearchParams();

  const hasCollab =
    parseInt(searchParams?.get("noCollab") as string) !== 1 &&
    collabToken !== null;

  const { projectId } = params;

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      try {
        const response = await fetch("/api/editor/collaboration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            "No collaboration token provided, please set TIPTAP_COLLAB_SECRET in your environment"
          );
        }
        const data = await response.json();

        const { token } = data;

        // set state when the data received
        setCollabToken(token);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
        setCollabToken(null);
        return;
      }
    };

    dataFetch();
  }, []);

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      try {
        const response = await fetch("/api/editor/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            "No CONVERT token provided, please set TIPTAP_CONVERT_SECRET in your environment"
          );
        }
        const data = await response.json();

        const { token } = data;

        // set state when the data received
        setConvertToken(token);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
        }
        setConvertToken(null);
        return;
      }
    };

    dataFetch();
  }, []);
  // useEffect(() => {
  //   // fetch data
  //   const dataFetch = async () => {
  //     try {
  //       const response = await fetch("/api/editor/ai", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(
  //           "No AI token provided, please set TIPTAP_AI_SECRET in your environment"
  //         );
  //       }
  //       const data = await response.json();

  //       const { token } = data;

  //       // set state when the data received
  //       setAiToken(token);
  //     } catch (e) {
  //       if (e instanceof Error) {
  //         console.error(e.message);
  //       }
  //       setAiToken(null);
  //       return;
  //     }
  //   };

  //   dataFetch();
  // }, []);

  const ydoc = useMemo(() => new YDoc(), []);

  useLayoutEffect(() => {
    if (hasCollab && collabToken) {
      setProvider(
        new TiptapCollabProvider({
          name: `${process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX}${projectId}`,
          appId: process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID ?? "",
          token: collabToken,
          document: ydoc,
        })
      );
    }
  }, [setProvider, collabToken, ydoc, projectId, hasCollab]);

  if (
    (hasCollab && !provider) ||
    aiToken === undefined ||
    collabToken === undefined
  )
    return;

  const DarkModeSwitcher = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
      <Toolbar.Button onClick={lightMode} active={!isDarkMode}>
        <Icon name="Sun" />
      </Toolbar.Button>
      <Toolbar.Button onClick={darkMode} active={isDarkMode}>
        <Icon name="Moon" />
      </Toolbar.Button>
    </Surface>,
    document.body
  );

  return (
    <>
      {DarkModeSwitcher}
      <BlockEditor
        aiToken={aiToken ?? undefined}
        convertToken={convertToken ?? undefined}
        hasCollab={hasCollab}
        ydoc={ydoc}
        provider={provider}
      />
    </>
  );
}
