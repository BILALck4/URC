import { Client, TokenProvider } from "@pusher/push-notifications-web";

export const configureBeams = async (client: Client, externalId: string, token: string) => {
    try {
        const currentUserId = await client.getUserId();
        if (currentUserId === externalId) {
            return;
        }

        const tokenProvider = new TokenProvider({
            url: "/api/beams",
            headers: {
                    Authorization: `Bearer ${token}`,
            },
        });

        console.log("ha tokenprovider",tokenProvider)

        client.start()
            .then(() => {client.addDeviceInterest('global'); console.log("befoooooore");
            })
            .then(() => {client.setUserId(externalId, tokenProvider); console.log("attttt");
            })
            .then(() => {
                client.getDeviceId().then(deviceId => console.log("Push id : " + deviceId));
                console.log("afteeeeer");
            })
            .catch(console.error);

    } catch (error) {
        console.error("Pusher Beams configuration failed:", error);
    }
};