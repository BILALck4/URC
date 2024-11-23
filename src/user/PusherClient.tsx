import { useEffect } from "react";
import { Client } from "@pusher/push-notifications-web";
import { configureBeams } from "../config/beamsConfig";

export const beamsClient = new Client({
  instanceId: "2382f17c-6b81-4d80-a56d-3e4f56018ecf",
});
interface PusherClientProps {
  children: React.ReactNode;
}
const PusherClient = ({ children }: PusherClientProps) => {
  useEffect(() => {
    const sessionToken = sessionStorage.getItem("token");
    const sessionExternalId = sessionStorage.getItem("externalId") || "-1";

    if (sessionToken && sessionExternalId !== "-1") {
      configureBeams(beamsClient, sessionExternalId, sessionToken);
      console.log("hihi")
    } else {
      console.warn("Token or External ID is missing");
    }
  }, []);

  return <div>{children}</div>;
};

export default PusherClient;