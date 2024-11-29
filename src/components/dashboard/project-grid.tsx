"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { FileEdit, Share2, Trash2, FolderOpen } from "lucide-react";
import { useAuth } from "@/context/authContext/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  owner: string;
  collaborators: string[];
  updatedAt: Date;
}

export default function ProjectGrid() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const projectsQuery = query(
          collection(db, "projects"),
          where("owner.uid", "==", user.uid),
          orderBy("updatedAt", "desc")
        );

        const querySnapshot = await getDocs(projectsQuery);
        const projectsData = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Project)
        );

        setProjects(projectsData);
      } catch (error) {
        toast.error("Impossible de charger les projets", {
          description:
            "Une erreur s'est produite lors de la récupération des projets.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;

    try {
      await deleteDoc(doc(db, "projects", deleteProjectId));

      setProjects(projects.filter((p) => p.id !== deleteProjectId));

      toast.success("Projet supprimé", {
        description: "Le projet a été supprimé avec succès.",
      });

      setDeleteProjectId(null);
    } catch (error) {
      toast.error("Erreur de suppression", {
        description: "Impossible de supprimer le projet. Veuillez réessayer.",
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <FolderOpen className="h-16 w-16  mb-4" />
        <h2 className="text-xl font-semibold  mb-2">
          Aucun projet pour le moment
        </h2>
        <p className="text-gray-500 mb-4 text-center">
          Commencez par créer votre premier projet en cliquant sur le bouton ci
          haut
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={cn(
                  "hover:shadow-lg transition-all duration-300 ease-in-out",
                  "border-transparent hover:border-primary/20 dark:hover:border-primary/30",
                  "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                <CardHeader>
                  <CardTitle className="truncate">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                    {project.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {project.collaborators.length} collaborateur(s)
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/project/${project.id}`)}
                  >
                    <FileEdit className="h-4 w-4 mr-2" />
                    Éditer
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        /* Logique de partage */
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteProjectId(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={!!deleteProjectId}
        onOpenChange={() => setDeleteProjectId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProjectId(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
