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
            console.log('HA SEKHT HA RDA ANA TOKEN W EXT ID KAYN ' + userExternalId);

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
                  console.log("Initializing Beams for user:", userExternalId);
                    await beamsClient.start();
                    await beamsClient.addDeviceInterest('global'); // Optionnel
                    await beamsClient.setUserId(userExternalId, beamsTokenProvider);
                    console.log("Push notifications initialized for user:", userExternalId);

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
