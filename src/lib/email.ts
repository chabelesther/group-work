import { Resend } from "resend";
import { z } from "zod";

// Schéma de validation robuste pour les données d'invitation
const InvitationSchema = z.object({
  to: z.string().email("L'adresse e-mail est invalide"),
  projectTitle: z.string().min(1, "Le titre du projet est requis"),
  invitedBy: z.string().min(1, "Le nom de l'invitant est requis"),
  projectId: z.string().min(1, "L'identifiant du projet est requis"),
});

// Configuration sécurisée de l'API Resend
const resend = new Resend(process.env.RESEND_API_KEY, {
  retry: {
    attempts: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 5000,
  },
});

// Interface typée pour l'envoi d'invitation
interface InvitationEmailParams {
  to: string;
  projectTitle: string;
  invitedBy: string;
  projectId: string;
}

// Service complet de gestion des invitations par e-mail
export class InvitationEmailService {
  /**
   * Envoie un e-mail d'invitation professionnel et sécurisé
   * @param params Paramètres de l'invitation
   * @returns Confirmation de l'envoi ou gestion des erreurs
   */
  static async sendInvitation(params: InvitationEmailParams): Promise<void> {
    try {
      // Validation des données d'entrée
      const validatedParams = InvitationSchema.parse(params);

      // Construction d'un e-mail HTML responsive et élégante
      const emailHtml = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .invitation-container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #f9f9f9; 
              border-radius: 8px; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .invitation-header { 
              background-color: #4a90e2; 
              color: white; 
              padding: 15px; 
              text-align: center; 
              border-radius: 8px 8px 0 0;
            }
            .invitation-body { padding: 20px; }
            .cta-button {
              display: block;
              width: 200px;
              margin: 20px auto;
              padding: 12px 20px;
              background-color: #4a90e2;
              color: white;
              text-align: center;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="invitation-container">
            <div class="invitation-header">
              <h2>Invitation à collaborer</h2>
            </div>
            <div class="invitation-body">
              <p>Bonjour,</p>
              <p>${validatedParams.invitedBy} vous a invité(e) à collaborer sur le projet "<strong>${validatedParams.projectTitle}</strong>".</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/join/${validatedParams.projectId}" class="cta-button">Rejoindre le projet</a>
              <p>Si vous ne reconnaissez pas cette invitation, vous pouvez ignorer cet e-mail.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Envoi de l'e-mail avec des configurations avancées
      const { error } = await resend.emails.send({
        from: "DocCollab <notifications@doccollab.com>",
        to: [validatedParams.to],
        subject: `Invitation à collaborer sur ${validatedParams.projectTitle}`,
        html: emailHtml,
        headers: {
          "X-Entity-Ref-ID": validatedParams.projectId,
        },
      });

      if (error) {
        throw new Error(`Échec de l'envoi de l'e-mail : ${error.message}`);
      }
    } catch (error) {
      // Gestion centralisée des erreurs avec logging avancé
      console.error("Erreur lors de l'envoi de l'invitation :", error);

      if (error instanceof z.ZodError) {
        // Gestion spécifique des erreurs de validation
        throw new Error(
          `Données d'invitation invalides : ${error.errors[0].message}`
        );
      }

      throw error;
    }
  }
}
