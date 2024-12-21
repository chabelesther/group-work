"use client";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext/auth";
import DotLoader from "react-spinners/DotLoader";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const { user } = useAuth();
  const router = useRouter();
  const projectId = params.projectId;
  const [accessStatus, setAccessStatus] = useState<
    "checking" | "allowed" | "denied" | "error"
  >("checking");

  useEffect(() => {
    const checkProjectAccess = async () => {
      if (!user) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      try {
        const projectRef = doc(db, "projects", projectId);
        const projectDoc = await getDoc(projectRef);

        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          const collaborators = projectData?.collaborators || [];

          if (collaborators.includes(user.email)) {
            setAccessStatus("allowed");
          } else {
            setAccessStatus("denied");
          }
        } else {
          setAccessStatus("error");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'accès :", error);
        setAccessStatus("error");
      }
    };

    checkProjectAccess();
  }, [user, projectId, router]);

  const AccessDeniedComponent = () => (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Accès refusé</h2>
      <p className="mb-4">
        Vous n&apos;avez pas la permission d&apos;accéder à ce projet.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Retour à l&apos;accueil
      </button>
    </div>
  );

  const LoadingComponent = () => (
    <div className="flex items-center flex-wrap justify-center h-screen gap-8 max-sm:gap-4">
      <p> Vérification de l&apos;accès...</p>
      <DotLoader
        size={60}
        loading={true}
        color="#4A90E2"
        aria-label="Chargement"
      />
    </div>
  );

  const ErrorComponent = () => (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Erreur</h2>
      <p className="mb-4">
        Une erreur est survenue lors de la vérification de l&apos;accès.
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Retour à l&apos;accueil
      </button>
    </div>
  );

  switch (accessStatus) {
    case "checking":
      return <LoadingComponent />;
    case "denied":
      return <AccessDeniedComponent />;
    case "error":
      return <ErrorComponent />;
    case "allowed":
      return <>{children}</>;
    default:
      return null;
  }
}
