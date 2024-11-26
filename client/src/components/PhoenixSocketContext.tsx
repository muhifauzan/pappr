import { useEffect, useState } from "react";
import { Socket } from "phoenix";

import { PhoenixSocketContext } from "../utilities/usePhoenixSocket";

interface PhoenixSocketProviderProps {
  children: React.ReactNode;
}

export const PhoenixSocketProvider = ({
  children,
}: PhoenixSocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = new Socket("ws://localhost:4000/socket", {
      logger: (kind, msg, data) => {
        console.log(`Socket ${kind}: ${msg}`, data);
      },
    });

    socket.connect();

    setSocket(socket);

    return () => {
      if (socket.isConnected()) {
        socket.disconnect();
      }
    };
  }, []);

  if (!socket) return null;

  return (
    <PhoenixSocketContext.Provider value={{ socket }}>
      {children}
    </PhoenixSocketContext.Provider>
  );
};
