// src/containers/AppMessage/index.tsx
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Container, Typography } from '@mui/material';

const AppMessage: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [webSocketMessages, setWebSocketMessages] = useState<string[]>([]);
  const [apiMessages, setApiMessages] = useState<string>('');

  useEffect(() => {
    // Initialize WebSocket on the client
    const socket = io('ws://localhost:8080', {
      withCredentials: true,
    });
    setSocket(socket);

    // Example: Listen for messages from the server
    socket.on('message', (data: string) => {
      console.log('Received message from server:', data);
      // Update WebSocket messages state
      setWebSocketMessages((prevMessages) => [...prevMessages, data]);
    });

    // Example: Listen for messages broadcasted from the server to all clients
    socket.on('serverMessage', (data: string) => {
      console.log('Received broadcasted message from server:', data);
      // Update WebSocket messages state
      setWebSocketMessages((prevMessages) => [...prevMessages, data]);
      // Update API messages state
      // setApiMessages((prevMessages) => [...prevMessages, data]);
    });

    // Example: Listen for messages sent through API
    socket.on('apiMessage', (data: { messages: string }) => {
      console.log('Received message from API:', data.messages);
      // Update API messages state
      setApiMessages(data.messages);
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
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h6" component="h1" align="left" gutterBottom>
        {'Messages'}
      </Typography>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>

      <div>
        <h2>WebSocket Messages:</h2>
        {webSocketMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <div>
        <h2>API Messages:</h2>
        {apiMessages && apiMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </Container>
  );
};

export default AppMessage;
