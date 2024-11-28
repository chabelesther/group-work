// /api/emails/send-invite.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

// Schéma de validation robuste
const InvitationSchema = z.object({
  collaborators: z.array(z.string().email("Adresse email invalide")),
  projectId: z.string().min(1, "L'identifiant du projet est requis"),
  invitedBy: z.string().min(1, "Le nom de l'invitant est requis"),
  projectTitle: z.string().min(1, "Le titre du projet est requis"),
});

const resend = new Resend(process.env.RESEND_KEY);

export async function POST(request: Request) {
  try {
    // Récupération et validation des données
    const data = await request.json();
    console.log(data);
    const validatedData = InvitationSchema.parse(data);

    // Création du HTML d'invitation
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Invitation à collaborer</h2>
          <p>Bonjour,</p>
          <p>${validatedData.invitedBy} vous invite à collaborer sur le projet "${validatedData.projectTitle}".</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/join/${validatedData.projectId}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px;">
            Rejoindre le projet
          </a>
        </div>
      </body>
      </html>
    `;

    // Envoi des emails
    const result = await resend.emails.send({
      from: "Doc Collab <invitation@afripromoteur.com>",
      to: validatedData.collaborators,
      subject: `Invitation à collaborer sur ${validatedData.projectTitle}`,
      html: emailHtml,
    });

    console.log("Résultat de l'envoi d'email:", result);

    return NextResponse.json({
      success: true,
      result,
      sentTo: validatedData.collaborators.length,
    });
  } catch (error) {
    console.error("Erreur détaillée lors de l'envoi de l'email:", error);

    // Gestion des erreurs de validation
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Données d'invitation invalides",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Gestion des autres erreurs
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue s'est produite",
      },
      { status: 500 }
    );
  }
}
