import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import ModalDialog from '../../../../components/ModalDialog';
import Edit from './Edit';

import { StatementProps, StatementDataPagination } from '../../types';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const tableStyles = {
  minWidth: 650,
};

type StatementsProps = {
  statements: StatementProps[];
  getStatement: Function;
  updateStatement: Function;
  deleteStatement: Function;
  statementData: StatementProps;
  statementsDataPagination: StatementDataPagination;
  getStatementsPagination: Function;
};

const StatementTable: React.FC<StatementsProps> = ({
  statements,
  getStatement,
  updateStatement,
  deleteStatement,
  statementData,
  statementsDataPagination,
  getStatementsPagination
}) => {
  const [page, setPage] = useState(statementsDataPagination.currentPage - 1);
  const [rowsPerPage, setRowsPerPage] = useState(statementsDataPagination.pageSize);
  const [detailDialog, setDetailDialog] = useState(false);

  useEffect(() => {
    statementData && setDetailDialog(true);
  }, [statementData, setDetailDialog]);

  const setEdit = (id: number) => getStatement(id);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    updateGetStatementsPagination(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pageSize = +event.target.value;
    setRowsPerPage(pageSize);
    setPage(0);
    updateGetStatementsPagination(0, pageSize);
  };

  const updateGetStatementsPagination = (page: number, pageSize: number) => {
    getStatementsPagination(page + 1, pageSize);
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={tableStyles} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">{'Дата отримання'}</TableCell>
              <TableCell align="center">{'Номер жорсткого диску'}</TableCell>
              <TableCell align="center">{'ПІБ та підпис працівника, що передав носій'}</TableCell>
              <TableCell align="center">{'ПІБ та підпис працівника який отримав носій'}</TableCell>
              <TableCell align="center">{'Номер Акту про знищення жорсткого диску'}</TableCell>
              <TableCell align="center">{'Примітки'}</TableCell>
              <TableCell align="center">{'-/-'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statementsDataPagination.statements.map((row) => (
              <StyledTableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {dayjs(row.dateReceiving).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="center">{row.diskNumber}</TableCell>
                <TableCell align="center">{row.outputName}</TableCell>
                <TableCell align="center">{row.inputName}</TableCell>
                <TableCell align="center">{row.deedNumber}</TableCell>
                <TableCell align="center">{row.notes}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => setEdit(row.id)} aria-label="settings" size="small">
                    <SettingsIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ mt: 4 }}
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={statementsDataPagination.totalItems}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage={'Рядків на сторінці:'}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {detailDialog && (
        <ModalDialog parentOpen={detailDialog} setParentOpen={setDetailDialog}>
          <Edit
            statementData={statementData}
            updateStatement={updateStatement}
            deleteStatement={deleteStatement}
          />
        </ModalDialog>
      )}
    </Box>
  );
};

export default StatementTable;
