import { useState, useEffect } from "react";
import { usePhoenixSocket } from "./usePhoenixSocket";

export const usePhoenixChannel = (channelName: string) => {
  const [channel, setChannel] = useState<any>(null);
  const { socket } = usePhoenixSocket();

  useEffect(() => {
    if (!socket) return;

    const phoenixChannel = socket.channel(channelName);

    phoenixChannel.join().receive("ok", () => {
      setChannel(phoenixChannel);
    });

    return () => {
      phoenixChannel.leave();
    };
  }, [channelName, socket]);

  return [channel];
};
