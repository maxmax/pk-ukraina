import prisma from 'src/utils/prisma';
import dayjs from 'dayjs';
import { useUser } from 'src/utils/swr';
import CustomHead from 'src/components/CustomHead';
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
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next'

export default function NewsPage({
  article
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUser();
  const isNewsBelongsToUser = user && user.id === article.authorId;

  return (
    <>
      <CustomHead title={article.title} description={article.excerpt.slice(0, 10)} />
      <Box py={2}>
        <Card>
          <CardHeader
            avatar={<Avatar src={article.author.avatarUrl || '/img/user.png'} />}
            action={
              <Link href='/news'>
                <Button aria-label='return to about page'>
                  <ArrowBackIosNewIcon fontSize='small' />
                  <Typography variant='body2'>{'Back'}</Typography>
                </Button>
              </Link>
            }
            title={dayjs(article.date).format('DD/MM/YYYY')}
            subheader={article.author.username}
          />
          <CardContent>
            <Typography variant="h1">
              {article.title}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {dayjs(article.date).format('DD/MM/YYYY')}
            </Typography>
            <Image
              component="img"
              src={article.img}
              width={233}
              height={300}
              alt={article.title}
            />
            <Typography variant="body1" sx={{ mt: 3 }} gutterBottom>
              {article.content}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export async function getServerSideProps({
  params
}: GetServerSidePropsContext<{ id: string }>) {
  try {
    const article = await prisma.news.findUnique({
      where: {
        id: params?.id
      },
      select: {
        id: true,
        date: true,
        title: true,
        excerpt: true,
        content: true,
        img: true,
        author: true,
        authorId: true,
        createdAt: true
      }
    })
    if (!article) {
      return {
        notFound: true
      }
    }
    return {
      props: {
        article: {
          ...article,
          createdAt: new Date(article.createdAt).toLocaleDateString()
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}
