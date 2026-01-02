import { useEffect, useState } from "react";

type ServerStatus = "checking" | "online" | "offline";

export const useServerStatus = () => {
  const [status, setStatus] = useState<ServerStatus>("checking");

  const SERVER_URL = "https://alphahealth.onrender.com/";

  const checkServer = async () => {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 8000); // timeout protection

      const res = await fetch(SERVER_URL, { signal: controller.signal });
      if (res.ok) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch {
      setStatus("offline");
    }
  };

  useEffect(() => {
    checkServer();
    const interval = setInterval(checkServer, 8000); // auto retry
    return () => clearInterval(interval);
  }, []);

  return status;
};
