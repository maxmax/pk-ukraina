import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Container, Typography } from '@mui/material';

const AppMessage: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Initialize WebSocket on the client
    const socket = io('http://localhost:8080', {
      withCredentials: true,
      extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true"
      }
    });
    setSocket(socket);

    // Example: Listen for messages from the server
    socket.on('message', (data: string) => {
      console.log('Received message from server:', data);
    });

    // Example: Listen for messages broadcasted from the server to all clients
    socket.on('serverMessage', (data: string) => {
      console.log('Received broadcasted message from server:', data);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      // Example: Send a message to the server
      socket.emit('clientMessage', message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{mt: 5}}>
      <Typography variant="h6" component="h1" align="left" gutterBottom>
        {'Messages'}
      </Typography>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>
    </Container>
  );
};

export default AppMessage;
