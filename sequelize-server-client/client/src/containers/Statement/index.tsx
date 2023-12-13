import { observer, inject } from 'mobx-react';
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  ButtonGroup
} from '@mui/material';
import Footer from '../../components/Footer';
import StatementTable from './components/StatementTable';

import { StatementStoreProps } from './types';

interface StatementProps {
  statementStore: StatementStoreProps;
}

function Statement({ statementStore }: StatementProps) {

  const {
    state,
    statementsData,
    getStatements,
    getStatement,
    deleteStatement,
    createStatement,
    updateStatement,
    notifications
  } = statementStore;

  // this to hook
  useEffect(() => {
    const currentState = state === "done" || state === "error";
    !currentState && getStatements();
  }, [statementsData, getStatements, state]);

  if (!!notifications) {
    console.log('notifications:', notifications)
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ m: 4 }}>
        <Typography variant="h6" component="h1" align="center" gutterBottom>
          {'Відомості про рух носія'}
        </Typography>
        <Box sx={{ mt: 4, display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
          {!statementsData[0] && state === "pending" && ( <CircularProgress /> )}
          {statementsData[0] && state === "done" &&
            <StatementTable statements={statementsData} />
          }
        </Box>
      </Box>
      <Footer />
    </Container>
  );
}

export default inject("statementStore")(observer(Statement));
