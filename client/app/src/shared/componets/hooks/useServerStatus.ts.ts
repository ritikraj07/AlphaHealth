import { API_BASE_URL } from "@/app/src/config/constants";
import { useEffect, useRef, useState } from "react";

type ServerStatus = "checking" | "online" | "offline";

export const useServerStatus = () => {
  const [status, setStatus] = useState<ServerStatus>("checking");
  const lastStatus = useRef<ServerStatus>("checking");

  const SERVER_URL = `${API_BASE_URL}/health`;

  const checkServer = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(SERVER_URL, { signal: controller.signal, method: "HEAD" });
      clearTimeout(timeout);

      if (res.ok && lastStatus.current !== "online") {
        lastStatus.current = "online";
        setStatus("online");
      }
    } catch {
      if (lastStatus.current !== "offline") {
        lastStatus.current = "offline";
        setStatus("offline");
      }
    }
  };

  useEffect(() => {
    checkServer();
    const interval = setInterval(checkServer, 15000); // ⬅ slower
    return () => clearInterval(interval);
  }, []);

  return status;
};




// export const useServerStatus = () => {
//   const [status, setStatus] = useState<ServerStatus>("checking");

//   const SERVER_URL = "https://alphahealth.onrender.com/";

//   const checkServer = async () => {
//     try {
//       const controller = new AbortController();
//       setTimeout(() => controller.abort(), 8000); // timeout protection

//       const res = await fetch(SERVER_URL, { signal: controller.signal });
//       if (res.ok) {
//         setStatus("online");
//       } else {
//         setStatus("offline");
//       }
//     } catch {
//       setStatus("offline");
//     }
//   };

//   useEffect(() => {
//     checkServer();
//     const interval = setInterval(checkServer, 8000); // auto retry
//     return () => clearInterval(interval);
//   }, []);

//   return status;
// };
