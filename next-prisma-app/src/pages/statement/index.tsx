import { useEffect, useState } from "react";
import Animate from 'src/components/AnimateIn'
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import CreateStatementButton from 'src/components/Buttons/CreateStatement'
import CustomHead from 'src/components/CustomHead'
import prisma from 'src/utils/prisma'
import { 
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from '@mui/material'
import Link from 'next/link'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  }
}));

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next'

// dynamic page component
export default function Statement({
  statement
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <CustomHead title='Statement Page' description='This is Statement Page' />
      <CreateStatementButton />
      <Divider />
      <Typography variant='h4' textAlign='center' py={2}>
        {'Відомості про рух носія'}
      </Typography>
      {statement?.length ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                {statement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <StyledTableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {dayjs(row?.dateReceiving).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell align="center">{row.diskNumber}</TableCell>
                    <TableCell align="center">{row.outputName}</TableCell>
                    <TableCell align="center">{row.inputName}</TableCell>
                    <TableCell align="center">{row.deedNumber}</TableCell>
                    <TableCell align="center">{row.notes}</TableCell>
                    <TableCell align="center">
                      <Link href={`statement/${row.id}`}>
                        <Button>
                          <Typography variant='body2'>{'Більше'}</Typography>
                          <ArrowForwardIosIcon fontSize='small' />
                        </Button>
                      </Link>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{mt: 4, mb: 4}}
            rowsPerPageOptions={[6, 10, 25, 100]}
            component="div"
            count={statement.length}
            rowsPerPage={rowsPerPage}
            labelRowsPerPage={'Рядків на сторінці:'}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Typography align="center" mt={2}>{'Заяви ще немає'}</Typography>
      )}
    </>
  )
}

// server rendering function
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const statement = await prisma.statement.findMany({
      select: {
        id: true,
        dateReceiving: true,
        diskNumber: true,
        outputName: true,
        inputName: true,
        deedNumber: true,
        notes: true,
        author: true,
        authorId: true,
        createdAt: true
      }
    })
    return {
      props: {
        statement: statement.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleDateString()
        }))
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        statement: []
      }
    }
  }
}