import CustomHead from 'src/components/CustomHead'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'

export default function Custom404() {
  return (
    <>
      <CustomHead title='404 Error Page' description='This is 404 Error Page' />
      <Typography variant='h4' textAlign='center' mt={2} mb={4}>
        Page not found
      </Typography>
    </>
  )
}