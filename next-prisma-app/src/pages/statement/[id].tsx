import * as React from "react";
import dayjs from 'dayjs';
import EditStatementButton from 'src/components/Buttons/EditStatement';
import RemoveStatementButton from 'src/components/Buttons/RemoveStatement';
import CustomHead from 'src/components/CustomHead';
import prisma from 'src/utils/prisma';
import { useUser } from 'src/utils/swr';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';

export default function StatementPage({
  statement
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUser()
  const isStatementBelongsToUser = user && user.id === statement.authorId

  return (
    <>
      <CustomHead title={statement.dateReceiving} description={statement.dateReceiving.slice(0, 10)} />
      <Box py={2}>
        <Card>
          <CardHeader
            avatar={<Avatar src={statement.author.avatarUrl || '/img/user.png'} />}
            action={
              <Link href='/statement'>
                <Button aria-label='return to about page'>
                  <ArrowBackIosNewIcon fontSize='small' />
                  <Typography variant='body2'>{'Back'}</Typography>
                </Button>
              </Link>
            }
            title={statement.dateReceiving}
            subheader={statement.author.username}
          />
          <CardContent>
            <Table size="small" aria-label="a dense table" sx={{ border: 1, borderColor: 'grey.300' }}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Date of receipt'}</span>
                  </TableCell>
                  <TableCell>
                    {dayjs(statement.dateReceiving).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Hard disk drive number'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.diskNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Full name and signature of the employee transferring'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.outputName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Full name and signature of the employee receiving'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.inputName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Number of the Act on the destruction of the hard disk drive'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.deedNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Notes'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.notes}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardActions>
            <Box display='flex' justifyContent='flex-end' gap={2} width='100%'>
              {isStatementBelongsToUser && (
                <>
                  <EditStatementButton statement={statement} icon={false} />
                  <RemoveStatementButton
                    statementId={statement.id}
                    authorId={statement.authorId}
                    icon={false}
                  />
                </>
              )}
            </Box>
          </CardActions>
        </Card>
      </Box>
    </>
  )
}

export async function getServerSideProps({
  params
}: GetServerSidePropsContext<{ id: string }>) {
  try {
    const statement = await prisma.statement.findUnique({
      where: {
        id: params?.id
      },
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
    if (!statement) {
      return {
        notFound: true
      }
    }
    return {
      props: {
        statement: {
          ...statement,
          createdAt: new Date(statement.createdAt).toLocaleDateString()
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}
