import { getConnecterUser, triggerNotConnected } from "../lib/session.js";
import { db } from '@vercel/postgres';

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

        // Extraire les données du corps de la requête
        const { receiver_id, content, receiver_type } = await request.body;

        console.log("Received data:", { receiver_id, content, receiver_type });

        if (!receiver_id || !content || !receiver_type) {
            return new Response(
                JSON.stringify({ error: "Receiver ID, content, and receiver type are required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Vérifier si le destinataire existe
        const receiverResult = await db.sql`
            SELECT user_id 
            FROM users 
            WHERE user_id = ${receiver_id};
        `;

        if (receiverResult.rowCount === 0) {
            console.log("Receiver not found.");
            return new Response(
                JSON.stringify({ error: "Receiver not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Sauvegarder le message dans la base de données
        const result = await db.sql`
            INSERT INTO messages (sender_id, sender_name, receiver_id, content, receiver_type)
            VALUES (${user.id}, ${user.username}, ${receiver_id}, ${content}, ${receiver_type})
            RETURNING *;
        `;

        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
          });
    
          const publishResponse = await beamsClient.publishToUsers(
            ["ac7a25a9-bcc5-4fba-8a3d-d42acda26949"],
            {
              web: {
                notification: {
                  title: user.username,
                  body: content,
                  ico: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
                  deep_link: `http://localhost:3000/home/inbox/${user.id}`,
                },
                data: {
                },
              },
            }
          );

        if (result.rowCount === 0) {
            console.log("Failed to save the message.");
            return new Response(
                JSON.stringify({ error: "Message could not be saved." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        console.log("Message saved:", result.rows[0]);
        return new Response(
            JSON.stringify({ data: result.rows[0] }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error in /api/envoyerMessage:", error);
        return new Response(
            JSON.stringify({ error: "An error occurred while saving the message.", details: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
