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
import ModalDialog from '../../components/ModalDialog';
import StatementTable from './components/StatementTable';
import New from './components/StatementTable/New';

import { StatementStoreProps } from './types';

interface StatementProps {
  statementStore: StatementStoreProps;
}

function Statement({ statementStore }: StatementProps) {

  const {
    state,
    statementsData,
    statementData,
    getStatements,
    getStatement,
    deleteStatement,
    createStatement,
    updateStatement,
    notifications
  } = statementStore;

  const [newDialog, setNewDialog] = useState(false);

  const setNew = () => setNewDialog(true);
  
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 2 }}>
          <ButtonGroup variant="text" aria-label="text button group">
            <Button onClick={() => setNew()}>{'Створити новий'}</Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ mt: 4, display: 'grid', alignItems: 'center', justifyContent: 'center' }}>
          {!statementsData[0] && state === "pending" && ( <CircularProgress /> )}
          {statementsData[0] && state === "done" &&
            <StatementTable 
              statements={statementsData} 
              getStatement={getStatement}
              updateStatement={updateStatement}
              deleteStatement={deleteStatement}
              statementData={statementData}
            />
          }
        </Box>
      </Box>
      <Footer />
      {newDialog &&
        <ModalDialog parentOpen={newDialog} setParentOpen={setNewDialog}>
          <New createStatement={createStatement} />
        </ModalDialog>
      }
    </Container>
  );
}

export default inject("statementStore")(observer(Statement));
