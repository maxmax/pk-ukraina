import React, { useEffect, useState } from "react";
import {
  Container,
  Typography
} from '@mui/material';
import useWebSocket from '../../hooks/useWebSocket';
// import useStatements from '../../hooks/useStatements';

const WebSocketComponent: React.FC = () => {
  const socket = useWebSocket();
  // const statementsData = useStatements(1, 10);
  const [statements, setStatements] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Subscribe to events from the server
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('message', (data) => {
      console.log(`Received message from server: ${data}`);
    });

    // Listen for changes in statements from the server
    socket.on('statementChange', (changeData) => {
      console.log('Received statement change:', changeData);

      // Update the statement based on the received change data
      if (changeData.action === 'create') {
        setStatements((prevStatements) => [...prevStatements, changeData.statement]);
      } else if (changeData.action === 'update') {
        setStatements((prevStatements) =>
          prevStatements.map((statement) =>
            statement.id === changeData.statementId ? changeData.statement : statement
          )
        );
      } else if (changeData.action === 'delete') {
        setStatements((prevStatements) =>
          prevStatements.filter((statement) => statement.id !== changeData.statementId)
        );
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Cleanup of resources when disassembling a component
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container maxWidth="lg" sx={{mt: 5}}>
      <Typography variant="h6" component="h1" align="center" gutterBottom>
        {'WebSocket Component'}
      </Typography>
      <ul>
        {statements.map((statement) => (
          <li key={statement.id}>
            <div>
              {statement.dateReceiving}
            </div>
            <div>
              {statement.diskNumber}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default WebSocketComponent;
