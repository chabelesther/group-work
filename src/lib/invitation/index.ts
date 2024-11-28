// utils/invitations.ts
import { db } from "@/lib/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
export async function inviteCollaborator(
  email: string | string[],
  projectTitle: string,
  invitedBy: string,
  projectId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch("/api/emails/send-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collaborators: email,
        projectTitle,
        invitedBy,
        projectId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Échec de l'envoi de l'invitation");
    }

    return {
      success: true,
      message: `Invitation envoyée à ${email}`,
    };
  } catch (error) {
    console.error("Erreur lors de l'invitation :", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
// utils/invitations.ts

export async function createInvitation(
  projectId: string,
  collaboratorEmail: string,
  invitedBy: string,
  projectName: string
) {
  try {
    const invitationsCollection = collection(db, "invitations");
    const invitationRef = doc(invitationsCollection);
    const invitationId = invitationRef.id;

    const invitationData = {
      id: invitationId,
      projectId: projectId,
      collaboratorEmail: collaboratorEmail,
      invitedBy: invitedBy,
      projectName,
      status: "pending", // Statut initial de l'invitation
      createdAt: serverTimestamp(),
    };

    await setDoc(invitationRef, invitationData);

    console.log("Invitation créée avec succès:", invitationId);
  } catch (error) {
    console.error("Erreur lors de la création de l'invitation:", error);
    throw error; // Propager l'erreur pour la gérer au niveau de l'appelant
  }
}

export async function acceptInvitation(invitationId: string) {
  try {
    const invitationRef = doc(db, "invitations", invitationId);
    const invitationSnap = await getDoc(invitationRef);

    if (!invitationSnap.exists()) {
      throw new Error("Invitation non trouvée");
    }

    // Mettre à jour le statut de l'invitation à 'acceptée'
    await updateDoc(invitationRef, { status: "accepted" });

    // Ajouter le collaborateur au projet (à implémenter selon votre logique)
    const projectId = invitationSnap.data().projectId;
    const collaboratorEmail = invitationSnap.data().collaboratorEmail;
    await addCollaboratorToProject(projectId, collaboratorEmail);

    console.log("Invitation acceptée avec succès:", invitationId);
  } catch (error) {
    console.error("Erreur lors de l'acceptation de l'invitation:", error);
    throw error;
  }
}

// Fonction pour ajouter un collaborateur à un projet (à adapter à votre structure de données)
async function addCollaboratorToProject(
  projectId: string,
  collaboratorEmail: string
) {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, {
    collaborators: arrayUnion(collaboratorEmail),
  });
}

export async function getInvitationId(projectId: string, userEmail: string) {
  try {
    const invitationsCollection = collection(db, "invitations");

    // Créer une requête pour rechercher l'invitation
    const q = query(
      invitationsCollection,
      where("projectId", "==", projectId),
      where("collaboratorEmail", "==", userEmail)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // L'invitation a été trouvée
      const invitationDoc = querySnapshot.docs[0];
      return invitationDoc.id;
    } else {
      // Aucune invitation trouvée
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la recherche de l'invitation:", error);
    throw error;
  }
}

// lib/invitation.ts
export async function getInvitationDetails(
  projectId: string,
  userEmail: string
) {
  try {
    const invitationsCollection = collection(db, "invitations");
    const q = query(
      invitationsCollection,
      where("projectId", "==", projectId),
      where("collaboratorEmail", "==", userEmail)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const invitationDoc = querySnapshot.docs[0];
      const data = invitationDoc.data();
      return {
        projectName: data.projectName,
        invitedBy: data.invitedBy,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        rejectedAt: data.rejectedAt?.toDate(),
      };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails:", error);
    throw error;
  }
}

export async function rejectInvitation(projectId: string, userEmail: string) {
  try {
    const invitationsCollection = collection(db, "invitations");
    const q = query(
      invitationsCollection,
      where("projectId", "==", projectId),
      where("collaboratorEmail", "==", userEmail)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const invitationDoc = querySnapshot.docs[0];
      await updateDoc(invitationDoc.ref, {
        status: "rejected",
        rejectedAt: serverTimestamp(),
      });
    } else {
      throw new Error("Invitation non trouvée");
    }
  } catch (error) {
    console.error("Erreur lors du refus de l'invitation:", error);
    throw error;
  }
}

export async function reportInvitation(reportData: {
  projectId: string;
  reportedBy: string;
  reason: ReportReason;
  description?: string;
}) {
  try {
    const reportsCollection = collection(db, "invitationReports");
    await addDoc(reportsCollection, {
      ...reportData,
      reportedAt: serverTimestamp(),
      status: "pending",
    });
  } catch (error) {
    console.error("Erreur lors du signalement:", error);
    throw error;
  }
}
