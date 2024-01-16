import CustomHead from 'src/components/CustomHead';
import prisma from 'src/utils/prisma';
import {
  Divider,
  Typography,
  Container,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import Link from 'next/link';
import CreateNewsButton from 'src/components/Buttons/CreateNews'

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next';

export default function News({
  news
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <>
      <CustomHead title='News' description='Site News' />
      <CreateNewsButton />
      <Divider />
      <Container maxWidth="lg" sx={{ mb: 5 }}>
        <Typography variant="h1">
          News
        </Typography>
        <Divider />
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {news.map((row) => (
            <Grid item xs={4} key={row.id}>
              <Card>
                <CardMedia
                  sx={{ height: 260 }}
                  image={row.img}
                  title={row.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {row.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {row.excerpt}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href={`news/${row.id}`}>
                    <Button size="small">Learn More</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const news = await prisma.news.findMany({
      select: {
        id: true,
        date: true,
        title: true,
        excerpt: true,
        img: true,
      }
    })
    return {
      props: {
        news: news.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleDateString()
        }))
      }
    }
  } catch (e) {
    console.log(e)
    return {
      props: {
        news: []
      }
    }
  }
}
