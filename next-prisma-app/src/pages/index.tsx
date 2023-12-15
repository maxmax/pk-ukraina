import Animate, { SLIDE_DIRECTION } from 'src/components/AnimateIn'
import CustomHead from 'src/components/CustomHead'
import Slider from 'src/components/Slider'
import type { Blocks } from 'src/types'
import { useUser } from 'src/utils/swr'
import { Box, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default function Home({
  data
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { blocks } = data
  const { user } = useUser()

  return (
    <>
      <CustomHead title='Home Page' description='This is Home Page' />
      <Typography variant='h4' textAlign='center' py={2}>
        {'Ласкаво просимо'}, {user ? user.username || user.email : 'незнайомець'}
      </Typography>
      <Box my={2}>Test</Box>
    </>
  )
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  let data = {
    blocks: [] as Blocks
  }

  const dataPath = join(process.cwd(), 'public/data/home.json')

  try {
    const dataJson = await readFile(dataPath, 'utf-8')
    if (dataJson) {
      data = JSON.parse(dataJson)
    }
  } catch (e) {
    console.error(e)
  }

  return {
    props: {
      data
    }
  }
}