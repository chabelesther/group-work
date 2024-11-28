"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle } from "lucide-react";
import DashboardSidebar from "./dashboard-sidebar";
import ProjectGrid from "./project-grid";
import NewProjectModal from "./new-project-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/authContext/auth";
import { cn } from "@/lib/utils";

// Composant de chargement
const ProjectGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <Card key={index} className="animate-pulse p-6">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
      </Card>
    ))}
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Redirection ou gestion si pas d'utilisateur
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-xl font-semibold text-gray-600">
            Veuillez vous connecter pour accéder au tableau de bord
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex max-sm:flex-col justify-between items-center mb-8"
          >
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-4 sm:mb-0">
              Mes Projets
            </h1>
            <Button
              variant="default"
              size="lg"
              onClick={() => setIsNewProjectModalOpen(true)}
              className={cn(
                "flex items-center gap-2 w-full sm:w-auto text-xl",
                "transition-all duration-300 ease-in-out",
                "hover:scale-105 hover:shadow-lg"
              )}
            >
              <PlusCircle className="w-8 h-8 mr-2" />
              Nouveau Projet
            </Button>
          </motion.div>

          <Suspense fallback={<ProjectGridSkeleton />}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ProjectGrid />
            </motion.div>
          </Suspense>
        </div>
      </main>

      <AnimatePresence>
        {isNewProjectModalOpen && (
          <NewProjectModal
            open={isNewProjectModalOpen}
            onOpenChange={setIsNewProjectModalOpen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
