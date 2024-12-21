import React, { useState, useEffect, useCallback } from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { watchPreviewContent } from "@tiptap-pro/extension-collaboration-history";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ExtensionKit from "@/extensions/extension-kit";
import StarterKit from "@tiptap/starter-kit";

// Types définies plus précisément
interface Version {
  version: number;
  name?: string;
  date?: string;
  content?: any;
}

interface Provider {
  sendStateless: (message: string) => void;
}

interface VersionModalProps {
  isOpen: boolean;
  versions: Version[];
  currentVersion: number | null;
  provider?: Provider;
  onClose: () => void;
  onRevert: (versionId: number, versionData?: Version) => void;
}

export const VersionModal: React.FC<VersionModalProps> = ({
  isOpen,
  versions,
  currentVersion,
  provider,
  onClose,
  onRevert,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  // Utilisation de useCallback pour optimiser la stabilité de la fonction
  const previewEditor = useEditor({
    extensions: [StarterKit],
    editable: false,
    content: "",
  });

  // Premier useEffect pour initialiser la version sélectionnée
  useEffect(() => {
    if (isOpen && versions.length > 0) {
      const latestVersion = versions[versions.length - 1];
      setSelectedVersion(latestVersion.version);
    }
  }, [isOpen, versions]);

  // Deuxième useEffect pour gérer le préchargement du contenu
  useEffect(() => {
    if (!isOpen || !provider || !selectedVersion || !previewEditor) return;

    let unbind: (() => void) | null = null;

    const loadPreview = async () => {
      try {
        provider.sendStateless(
          JSON.stringify({
            action: "version.preview",
            version: selectedVersion,
          })
        );

        // Utiliser une fonction qui gère le déchargement
        unbind = watchPreviewContent(provider, (content) => {
          previewEditor.commands.setContent(content);
        });
      } catch (error) {
        console.error("Error previewing version:", error);
      }
    };

    loadPreview();

    // Nettoyage propre
    return () => {
      if (unbind) unbind();
    };
  }, [isOpen, provider, selectedVersion, previewEditor]);

  // Utiliser useCallback pour stabiliser les gestionnaires
  const handleVersionSelect = useCallback((version: number) => {
    setSelectedVersion(version);
  }, []);

  const handleRevert = useCallback(() => {
    if (!selectedVersion) return;

    const versionData = versions.find((v) => v.version === selectedVersion);
    const confirmed = window.confirm(
      "Are you sure you want to restore this version? Unsaved changes will be lost."
    );

    if (confirmed) {
      onRevert(selectedVersion, versionData);
      onClose();
    }
  }, [selectedVersion, versions, onRevert, onClose]);

  const reversedVersions = [...versions].reverse();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[1300px] h-[700px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Select a version to preview or restore it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full">
          {/* Sidebar for Version History */}
          <ScrollArea className="w-1/3 border-r pr-4">
            {reversedVersions.map((version) => (
              <Card
                key={version.version}
                className={`mb-2 cursor-pointer ${
                  selectedVersion === version.version ? "bg-muted" : ""
                }`}
                onClick={() => handleVersionSelect(version.version)}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{version.name || `Version ${version.version}`}</span>
                    <span className="text-sm text-muted-foreground">
                      {version.date
                        ? new Date(version.date).toLocaleString()
                        : ""}
                    </span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </ScrollArea>

          {/* Main Content Area */}
          <div className="w-2/3 pl-4 flex flex-col">
            <div className="flex-grow overflow-y-auto border rounded p-4">
              {previewEditor ? (
                <EditorContent editor={previewEditor} />
              ) : (
                <p className="text-muted-foreground">No preview available</p>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2"></div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="primary"
            onClick={handleRevert}
            disabled={selectedVersion === currentVersion}
          >
            Restore Version
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
