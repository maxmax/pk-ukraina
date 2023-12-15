import * as React from "react";
// import EditServicesButton from 'src/components/Buttons/EditServices'
// import RemoveServicesButton from 'src/components/Buttons/RemoveServices'
import CustomHead from 'src/components/CustomHead'
// import GeoPoint from 'src/components/GeoPoint'
import prisma from 'src/utils/prisma'
import { useUser } from 'src/utils/swr'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
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
} from '@mui/material'

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic';

export default function StatementPage({
  statement
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUser()
  const isServicesBelongsToUser = user && user.id === statement.authorId

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
                  <Typography variant='body2'>{'Назад'}</Typography>
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
                    <span>{'Дата отримання'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.dateReceiving}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Номер жорсткого диску'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.diskNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'ПІБ та підпис працівника, що передав носій'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.outputName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'ПІБ та підпис працівника який отримав носій'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.inputName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Номер Акту про знищення жорсткого диску'}</span>
                  </TableCell>
                  <TableCell>
                    {statement.deedNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ borderRight: 1, borderColor: 'grey.300' }}>
                    <span>{'Примітки'}</span>
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
              {/*isServicesBelongsToUser && (
                <>
                  <EditServicesButton statement={statement} icon={false} />
                  <RemoveServicesButton
                    servicesId={statement.id}
                    authorId={statement.authorId}
                    icon={false}
                  />
                </>
              )*/}
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
