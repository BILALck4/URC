import { getConnecterUser, triggerNotConnected } from "../lib/session.js";
import { db } from "@vercel/postgres";
import PushNotifications from "@pusher/push-notifications-server";

export default async (request) => {
  try {
    console.log("Handling /api/envoyerMessage request...");

    // Vérifier l'utilisateur connecté
    const user = await getConnecterUser(request);

    if (!user) {
      console.log("User not authenticated.");
      return triggerNotConnected();
    }

    // Vérifier le corps de la requête
    let body;
    try {
      if (typeof request.body === "string") {
        body = JSON.parse(request.body);
      } else {
        body = request.body;
      }
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { receiver_id, content, receiver_type } = body;

    if (!receiver_id || !content || !receiver_type) {
      return new Response(
        JSON.stringify({
          error: "Receiver ID, content, and receiver type are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Received data:", { receiver_id, content, receiver_type });

    // Vérifier si le destinataire existe
    const receiverQuery = await db.sql`
      SELECT external_id 
      FROM users 
      WHERE user_id = ${receiver_id};
    `;

    if (receiverQuery.rowCount === 0) {
      console.log("Receiver not found.");
      return new Response(
        JSON.stringify({ error: "Receiver not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const receiverExternalId = receiverQuery.rows[0].external_id;

    // Sauvegarder le message dans la base de données
    const result = await db.sql`
      INSERT INTO messages (sender_id, sender_name, receiver_id, content, receiver_type)
      VALUES (${user.id}, ${user.username}, ${user.id}, ${content}, ${receiver_type})
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      console.log("Failed to save the message.");
      return new Response(
        JSON.stringify({ error: "Message could not be saved." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const savedMessage = result.rows[0];

    // Envoyer une notification push au destinataire
    const beamsClient = new PushNotifications({
      instanceId: '2382f17c-6b81-4d80-a56d-3e4f56018ecf',
      secretKey: 'B49DB50EEF6255473EB6978A0CF10F0D5EE547BCB9295F807A6C1566A9D9E385',
    });

    await beamsClient.publishToUsers([receiverExternalId], {
      web: {
        notification: {
          title: `New message from ${user.username}`,
          body: content,
          icon: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
        },
      },
    });

    console.log("Push notification sent to:", receiverExternalId);

    return new Response(
      JSON.stringify({ data: savedMessage }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in /api/envoyerMessage:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing the request.",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
