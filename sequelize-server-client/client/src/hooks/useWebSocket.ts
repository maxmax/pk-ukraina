import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useWebSocket = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8080');

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};

export default useWebSocket;
