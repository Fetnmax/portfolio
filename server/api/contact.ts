import { defineEventHandler, readBody } from "h3";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les données du formulaire depuis la requête
    const body = await readBody<ContactForm>(event);

    // Valider les données requises
    if (!body.name || !body.email || !body.message) {
      return {
        success: false,
        message: "Tous les champs sont requis",
      };
    }

    // URL du webhook Discord (à remplacer par ton URL)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("URL du webhook Discord non définie");
      return {
        success: false,
        message: "Erreur de configuration du serveur",
      };
    }

    // Créer le message pour Discord
    const discordMessage = {
      embeds: [
        {
          title: "📬 Nouveau message de contact",
          color: 0x00bfff,
          fields: [
            {
              name: "Nom",
              value: body.name,
              inline: true,
            },
            {
              name: "Email",
              value: body.email,
              inline: true,
            },
            {
              name: "Message",
              value: body.message,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Envoyer le message au webhook Discord
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      throw new Error(`Erreur Discord: ${response.statusText}`);
    }

    return {
      success: true,
      message: "Message envoyé avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de l'envoi du message",
    };
  }
});
