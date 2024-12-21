"use client";

import { useEffect, useState } from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/authContext/auth";

interface PageProps {
  params: {
    projectId: string;
  };
}

export default function ChatPage({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  console.log(params);
  // Mock current user - In a real app, this would come from your auth system
  const { user } = useAuth();
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, "projects", params.projectId));

        if (!projectDoc.exists()) {
          setError("Project not found");
          return;
        }

        const projectData = projectDoc.data() as Project;

        // Check if current user is a collaborator
        if (!projectData.collaborators.includes(user!.email)) {
          setError(
            `Vous n'avez pas accès à cette discussion ${projectData.id},  cu :${user?.email}`
          );
          return;
        }

        setProject(projectData);
      } catch (err) {
        setError("Error loading project");
        console.error(err);
      }
    };

    fetchProject();
  }, [user?.email, params.projectId, user]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">{error}</h1>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chargement...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2 md:py-8 justify-center items-center">
      <h1 className="text-xl p-2 max-sm:text-2xl font-bold mb-4 md:mb-6 lg:ml-32">
        {project.title} -Discussion de Group
      </h1>
      <ChatContainer projectId={params.projectId} currentUser={user} />
    </div>
  );
}
