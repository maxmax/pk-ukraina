import { observer, inject } from 'mobx-react';
import { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  ButtonGroup,
} from '@mui/material';
import Footer from '../../components/Footer';
import ModalDialog from '../../components/ModalDialog';
import StatementTable from './components/StatementTable';
import New from './components/StatementTable/New';

import { StatementStoreProps } from './types';

type StatementState = 'pending' | 'done' | 'error';
const PENDING: StatementState = 'pending';
const DONE: StatementState = 'done';
const ERROR: StatementState = 'error';

const centerStyles = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const gridStyles = { mt: 4, display: 'grid', alignItems: 'center', justifyContent: 'center' };

interface StatementProps {
  statementStore?: StatementStoreProps;
}

function Statement({ statementStore }: StatementProps) {
  if (!statementStore) {
    throw new Error('statementStore is required.'); // Обработка отсутствия statementStore
  }

  const {
    state,
    statementsData,
    statementData,
    getStatements,
    getStatement,
    deleteStatement,
    createStatement,
    updateStatement,
    notifications,
  } = statementStore;

  const [newDialog, setNewDialog] = useState(false);

  const setNew = useCallback(() => setNewDialog(true), [setNewDialog]);
  const getStatementsMemoized = useCallback(() => getStatements(), [getStatements, statementsData, state]);

  useEffect(() => {
    const currentState = state === DONE || state === ERROR;
    !currentState && getStatementsMemoized();
  }, [getStatementsMemoized, state]);

  useEffect(() => {
    if (notifications) {
      console.log('notifications:', notifications);
    }
  }, [notifications]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ m: 4 }}>
        <Typography variant="h6" component="h1" align="center" gutterBottom>
          {'Відомості про рух носія'}
        </Typography>
        <Box sx={{ ...centerStyles, m: 2 }}>
          <ButtonGroup variant="text" aria-label="text button group">
            <Button onClick={setNew}>{'Створити новий'}</Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ ...gridStyles }}>
          {!statementsData[0] && state === PENDING && <CircularProgress />}
          {statementsData[0] && state === DONE && (
            <StatementTable
              statements={statementsData}
              getStatement={getStatement}
              updateStatement={updateStatement}
              deleteStatement={deleteStatement}
              statementData={statementData}
            />
          )}
        </Box>
      </Box>
      <Footer />
      {newDialog && (
        <ModalDialog parentOpen={newDialog} setParentOpen={setNewDialog}>
          <New createStatement={createStatement} />
        </ModalDialog>
      )}
    </Container>
  );
}

export default inject('statementStore')(observer(Statement));
