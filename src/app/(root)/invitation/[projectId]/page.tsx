// pages/invitation/[projectId].tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle, Flag } from "lucide-react";
import {
  acceptInvitation,
  rejectInvitation,
  reportInvitation,
  getInvitationDetails,
} from "@/lib/invitation";
import DotLoader from "react-spinners/DotLoader";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function InvitationConfirmationPage({
  params,
}: {
  params: { projectId: string };
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invitationStatus, setInvitationStatus] =
    useState<InvitationStatus | null>(null);
  const [invitationDetails, setInvitationDetails] = useState<{
    projectName: string;
    invitedBy: string;
    status: string;
    createdAt: string | Date;
    rejectedAt?: Date;
  } | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason>("spam");
  const [reportDescription, setReportDescription] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  useEffect(() => {
    const fetchInvitationDetails = async () => {
      if (!user) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      try {
        const details = await getInvitationDetails(
          params.projectId,
          user.email!
        );
        if (details) {
          setInvitationStatus(details.status);
          setInvitationDetails(details);
          setLoading(false);
        } else {
          setInvitationStatus("notFound");
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de l'invitation:",
          error
        );
        setInvitationStatus("error");
        setLoading(false);
      }
    };

    fetchInvitationDetails();
  }, [params.projectId, user, router]);

  const handleAcceptInvitation = async () => {
    setLoading(true);
    try {
      await acceptInvitation(params.projectId);
      setInvitationStatus("accepted");
      setTimeout(() => {
        router.push(`/project/${params.projectId}`);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'invitation:", error);
      setInvitationStatus("error");
      setLoading(false);
    }
  };

  const handleRejectInvitation = async () => {
    setLoading(true);
    try {
      await rejectInvitation(params.projectId, user!.email!);
      setInvitationStatus("rejected");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors du refus de l'invitation:", error);
      setInvitationStatus("error");
      setLoading(false);
    }
  };

  // Report invitation
  const handleReportInvitation = async () => {
    try {
      await reportInvitation({
        projectId: params.projectId,
        reportedBy: user!.email!,
        reason: reportReason,
        description: reportDescription,
      });
      setShowReportDialog(false);
      // Gérer le signalement (toast de succès)
    } catch (error) {
      console.error("Erreur lors du signalement:", error);
      // Gérer l'erreur (toast d'erreur)
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center">
          <DotLoader
            size={100}
            loading={true}
            color="#4A90E2"
            aria-label="Chargement"
          />
          <p className="mt-4 text-lg text-gray-600">
            Vérification de l&apos;invitation...
          </p>
        </div>
      );
    }

    switch (invitationStatus) {
      case "accepted":
        return (
          <div className="text-center">
            <Check className="text-green-500 h-16 w-16 mx-auto mb-4" />
            <p className="text-xl font-semibold">
              Invitation acceptée avec succès !
            </p>
            <p className="text-gray-600 mt-2">
              Vous allez être redirigé vers le projet{" "}
              {invitationDetails?.projectName}
            </p>
          </div>
        );
      case "rejected":
        return (
          <div className="text-center text-red-700">
            <X className="text-red-500 h-16 w-16 mx-auto mb-4" />
            <p className="text-xl font-semibold">Invitation refusée</p>
            <p>
              L&apos;invitation a été refusée le{" "}
              <span>
                {invitationDetails?.rejectedAt
                  ? new Date(invitationDetails?.rejectedAt).toLocaleDateString()
                  : ""}
              </span>
            </p>
            <p
              onClick={() => router.push("/")}
              className="text-gray-600 mt-2 underline"
            >
              Vous allez être redirigé vers le tableau de bord
            </p>
          </div>
        );
      case "notFound":
        return (
          <div className="text-center">
            <AlertTriangle className="text-yellow-500 h-16 w-16 mx-auto mb-4" />
            <p className="text-xl font-semibold">Invitation introuvable</p>
            <p className="text-gray-600 mt-2">
              Veuillez vérifier le lien ou contacter l&apos;administrateur
            </p>
          </div>
        );
      case "error":
        return (
          <div className="text-center">
            <X className="text-red-500 h-16 w-16 mx-auto mb-4" />
            <p className="text-xl font-semibold">Erreur de traitement</p>
            <p className="text-gray-600 mt-2">
              Une erreur est survenue. Veuillez réessayer.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Retour au tableau de bord
            </Button>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <div className="mb-4">
              <p className="text-xl font-semibold">
                Invitation au projet {invitationDetails?.projectName}
              </p>
              <p className="text-gray-600 mt-2">
                Invité par : {invitationDetails?.invitedBy}
              </p>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                onClick={handleAcceptInvitation}
                className="bg-green-500 hover:bg-green-600"
              >
                <Check className="mr-2" /> Accepter
              </Button>
              <Button onClick={handleRejectInvitation} variant="destructive">
                <X className="mr-2" /> Refuser
              </Button>
              <Dialog
                open={showReportDialog}
                onOpenChange={setShowReportDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Flag className="mr-2" /> Signaler
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Signaler cette invitation</DialogTitle>
                    <DialogDescription>
                      Aidez-nous à comprendre pourquoi vous signalez cette
                      invitation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="spam"
                        name="reportReason"
                        value="spam"
                        checked={reportReason === "spam"}
                        onChange={() => setReportReason("spam")}
                      />
                      <label htmlFor="spam">Spam</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="inappropriate"
                        name="reportReason"
                        value="inappropriate"
                        checked={reportReason === "inappropriate"}
                        onChange={() => setReportReason("inappropriate")}
                      />
                      <label htmlFor="inappropriate">Contenu inapproprié</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="other"
                        name="reportReason"
                        value="other"
                        checked={reportReason === "other"}
                        onChange={() => setReportReason("other")}
                      />
                      <label htmlFor="other">Autre</label>
                    </div>
                    <Textarea
                      placeholder="Description détaillée (optionnel)"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleReportInvitation}>
                      Envoyer le signalement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Card className="w-[500px] shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Confirmation d&apos;invitation
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
