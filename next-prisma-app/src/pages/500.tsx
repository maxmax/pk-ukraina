import CustomHead from 'src/components/CustomHead'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'

export default function Custom500() {
  return (
    <>
      <CustomHead title='500 Error Page' description='This is 500 Error Page' />
      <Typography variant='h4' textAlign='center' mt={2} mb={4}>
        Server error occurred
      </Typography>
    </>
  )
}