import { useEffect, useState, useCallback } from 'react';
import { observer, inject } from 'mobx-react';
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
import Notification from '../../components/Notification';
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
    throw new Error('statementStore is required.');
  }

  const {
    state,
    page,
    pageSize,
    statementData,
    statementsDataPagination,
    getStatementsPagination,
    getStatement,
    deleteStatement,
    createStatement,
    updateStatement,
    notifications,
    setNotifications,
  } = statementStore;

  const [newDialog, setNewDialog] = useState(false);

  const setNew = useCallback(() => setNewDialog(true), [setNewDialog]);

  useEffect(() => {
    const shouldExecuteEffect = state !== DONE && state !== ERROR;

    if (shouldExecuteEffect && !statementsDataPagination) {
      getStatementsPagination(page, pageSize);
    }
  }, [getStatementsPagination, statementsDataPagination, state, page, pageSize]);
  
  return (
    <Container maxWidth="lg">
      {!!notifications &&
        <Notification
          notifications={notifications}
          setNotifications={setNotifications}
        />
      }
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
          {!statementsDataPagination && state === PENDING && <CircularProgress />}
          {statementsDataPagination && state === DONE && (
            <StatementTable
              getStatement={getStatement}
              updateStatement={updateStatement}
              deleteStatement={deleteStatement}
              statementData={statementData}
              statementsDataPagination={statementsDataPagination}
              getStatementsPagination={getStatementsPagination}
            />
          )}
        </Box>
      </Box>
      <Footer />
      {newDialog && (
        <ModalDialog parentOpen={newDialog} setParentOpen={setNewDialog}>
          <New createStatement={createStatement} setParentOpen={setNewDialog} />
        </ModalDialog>
      )}
    </Container>
  );
}

export default inject('statementStore')(observer(Statement));
