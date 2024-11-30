import React, { useState } from "react";
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
import { Download, MoreVertical, Clock, Share2, Settings } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HeaderProps {
  documentName?: string;
  userAvatar?: string;
  userName?: string;
}

const DocumentHeader: React.FC<HeaderProps> = ({
  documentName = "Document sans titre",
  userName = "Utilisateur",
}) => {
  const [exportFormat, setExportFormat] = useState<string>("PDF");
  const [lastModified] = useState<Date>(new Date());

  const exportFormats: string[] = ["PDF", "DOCX", "TXT", "HTML", "MARKDOWN"];

  const formatRelativeTime = (date: Date): string => {
    const diff = new Date().getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60)
      return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;

    return format(date, "PPpp", { locale: fr });
  };

  return (
    <header className="flex justify-between items-center  max-h-16 p-3 border-b bg-white shadow-sm rounded-t-lg">
      {/* Section Informations du Document */}
      <div className="flex items-center space-x-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={"/android-chrome-512x512.png"} alt="logo" />
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
            {documentName}
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
            <DropdownMenuLabel>Formats d&apos;exportation</DropdownMenuLabel>
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
        {/* TODO : set historique functionnality  */}
        <Button variant="outline" size="sm" className="px-3">
          <Clock className="mr-2 h-4 w-4" />
          Historique des versions
        </Button>

        {/* Menu Options Supplémentaires */}
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="p-2">
              <MoreVertical className="h-4 w-4" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem className="cursor-pointer">Par lien</MenubarItem>
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
    </header>
  );
};

export default DocumentHeader;
