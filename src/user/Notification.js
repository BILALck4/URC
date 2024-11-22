import React, { useEffect } from 'react';
import { Client, TokenProvider } from "@pusher/push-notifications-web";

console.log("Notifications component loaded");

const beamsClient = new Client({
    instanceId: '2382f17c-6b81-4d80-a56d-3e4f56018ecf',
});

const Notifications = ({ children }) => {
    useEffect(() => {
        const initializePushNotifications = async () => {
            const token = sessionStorage.getItem('token');
            const userExternalId = sessionStorage.getItem('externalId');
            
            if (!token || !userExternalId) {
                console.error('Token or External ID is missing!');
                return;
            }

            const beamsTokenProvider = new TokenProvider({
                url: "/api/beams",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            try {
                // Vérifiez si un utilisateur est déjà configuré
                const currentUserId = await beamsClient.getUserId().catch(() => null);

                // Si l'utilisateur actuel est différent, réinitialisez Beams
                if (currentUserId && currentUserId !== userExternalId) {
                    console.log(`Stopping Beams for user: ${currentUserId}`);
                    await beamsClient.stop(); // Réinitialisation du client
                }

                // Démarrez Beams et configurez l'utilisateur s'il n'est pas déjà configuré
                if (!currentUserId) {
                    console.log("Initializing Beams for user:", userExternalId);
                    await beamsClient.start();
                    await beamsClient.addDeviceInterest('global'); // Optionnel
                    await beamsClient.setUserId(userExternalId, beamsTokenProvider);
                    console.log("Push notifications initialized for user:", userExternalId);
                } else {
                    console.log(`Beams already initialized for user: ${currentUserId}`);
                }
            } catch (error) {
                console.error("Erreur d'initialisation des notifications push:", error);
            }
        };

        initializePushNotifications();
    }, []); // Pas de dépendances pour éviter plusieurs initialisations

    return (
        <>
            {children}
        </>
    );
};

export default Notifications;
