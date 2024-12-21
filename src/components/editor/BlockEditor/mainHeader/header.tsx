import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Download,
  MoreVertical,
  Clock,
  Share2,
  Settings,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useSearchParams } from "next/navigation";

interface DocumentHeaderProps {
  documentName?: string;
  userAvatar?: string;
  userName?: string;
  editor: any;
  versions: any[];
  isAutoVersioning: boolean;
  toggleVersioning: () => void;
  saveVersion: (description?: string) => void;
  openVersionModal: () => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  userAvatar = "/android-chrome-512x512.png",
  userName = "Utilisateur",
  editor,
  versions,
  isAutoVersioning,
  toggleVersioning,
  saveVersion,
  openVersionModal,
}) => {
  const params = useParams();
  const projectId = params.projectId as string;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectRef = doc(db, "projects", projectId);
        const projectSnapshot = await getDoc(projectRef);

        if (projectSnapshot.exists()) {
          const projectData = projectSnapshot.data() as Project;
          setProject(projectData);
        } else {
          console.log("Aucun projet trouvé avec cet ID");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du projet :", error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const [exportFormat, setExportFormat] = useState<string>("PDF");
  const [lastModified] = useState<Date>(new Date());
  const [versionDescription, setVersionDescription] = useState("");

  const exportFormats: string[] = ["PDF", "DOCX", "TXT", "HTML", "MARKDOWN"];

  const formatRelativeTime = (date: Date): string => {
    const diff = new Date().getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60)
      return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;

    return format(date, "PPpp", { locale: fr });
  };

  const handleSaveVersion = () => {
    if (versionDescription.trim()) {
      saveVersion(versionDescription);
      setVersionDescription("");
    }
  };

  return (
    <header className="flex w-[100vw] h-full flex-col p-3 border-b bg-white shadow-sm rounded-t-lg">
      {/* Top Row: Document Info and Main Actions */}
      <div className="flex sticky z-50 top-0 left-0 right-0 justify-between items-center mb-2">
        {/* Section Informations du Document */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-blue-500 text-white">
              {userName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {project?.title || projectId}
            </h1>
            <p className="text-xs text-gray-500">
              Modifié {formatRelativeTime(lastModified)}
            </p>
          </div>
        </div>

        {/* Section Actions */}
        <div className="flex items-center space-x-2">
          {/* Dropdown Exportation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-3">
                <Download className="mr-2 h-4 w-4" />
                Exporter ({exportFormat})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Formats d'exportation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {exportFormats.map((format) => (
                <DropdownMenuItem
                  key={format}
                  onSelect={() => setExportFormat(format)}
                  className="cursor-pointer"
                >
                  {format}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu Options Supplémentaires */}
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="p-2">
                <MoreVertical className="h-4 w-4" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  className="cursor-pointer"
                  onClick={openVersionModal}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Historique des versions
                </MenubarItem>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem className="cursor-pointer">
                      Par lien
                    </MenubarItem>
                    <MenubarItem className="cursor-pointer">
                      Par email
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      {/* Version Control Row */}
      <div className="flex justify-between items-center border-t pt-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="mr-2 text-sm">Versionnage Automatique:</label>
            <button
              onClick={toggleVersioning}
              className={`px-3 py-1 rounded text-sm ${
                isAutoVersioning
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {isAutoVersioning ? "Activé" : "Désactivé"}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Description de version"
              value={versionDescription}
              onChange={(e) => setVersionDescription(e.target.value)}
              className="border px-2 py-1 rounded text-sm w-60"
            />
            <Button
              onClick={handleSaveVersion}
              disabled={!versionDescription.trim()}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder Version
            </Button>
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={openVersionModal}>
          <Clock className="mr-2 h-4 w-4" />
          Historique des Versions
        </Button>
      </div>
    </header>
  );
};

export default DocumentHeader;
