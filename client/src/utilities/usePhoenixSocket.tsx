import { createContext, useContext } from "react";
import { Socket } from "phoenix";

interface PhoenixSocketContexType {
  socket: Socket | null;
}

export const PhoenixSocketContext = createContext<PhoenixSocketContexType>({
  socket: null,
});

export const usePhoenixSocket = () => useContext(PhoenixSocketContext);
