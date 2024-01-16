import { useUser } from 'src/utils/swr'
import { CssVarsProvider } from '@mui/joy/styles'
import Textarea from '@mui/joy/Textarea'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
  Grid
} from '@mui/material'

import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { red } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import type { News } from '@prisma/client'
import { useRouter } from 'next/router'
import { useState, useEffect, ChangeEvent } from 'react'
import FormFieldsWrapper from './Wrapper'
import news from '@/pages/api/news'

type Props = {
  closeModal?: () => void
}

export default function CreateNewsForm({ closeModal }: Props) {

		const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(new Date()));

		const theme = useTheme()
    const { user, accessToken } = useUser()
    const router = useRouter()

    const [errors, setErrors] = useState<{
      content?: number
    }>({})

    if (!user) return null

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
      if (!user) return
      e.preventDefault()
      const formData = Object.fromEntries(
        new FormData(e.target as HTMLFormElement)
      ) as unknown as Pick<News, 'date' | 'title' | 'excerpt' | 'content' | 'img'>

      try {
        const response = await fetch('/api/news', {
          method: 'POST',
          body: JSON.stringify({
						...formData,
						date: dateValue.$d
					}),
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          throw response
        }

        const news = await response.json()

        router.push(`/news/${news.id}`)

        if (closeModal) {
          closeModal()
        }
      } catch (e) {
        console.error(e)
      }
    }

    const onInput = () => {
      if (Object.keys(errors).length) {
        setErrors({ content: undefined })
      }
    }

    return (
      <FormFieldsWrapper handleSubmit={handleSubmit}>
        <Typography variant='h4'>{'Create'}</Typography>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						label={'News date'}
						value={dateValue}
						format="DD/MM/YYYY"
						onChange={(newValue) => setDateValue(newValue)}
					/>
				</LocalizationProvider>
        <Grid container spacing={2}>
					<Grid item xs={12}>
						<FormControl required fullWidth>
							<InputLabel htmlFor='title'>{'Title'}</InputLabel>
							<Input
							sx={{ gap: theme.spacing(1) }}
							id='title'
							type='text'
							name='title'
							inputProps={{
								minLength: 3
							}}
							/>
						</FormControl>
					</Grid>
          <Grid item xs={12}>
            <FormControl required fullWidth>
              <InputLabel htmlFor='title'>{'Image url'}</InputLabel>
              <Input
              sx={{ gap: theme.spacing(1) }}
              id='img'
              type='text'
              name='img'
              inputProps={{
                minLength: 3
              }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl required fullWidth>
              <InputLabel htmlFor='title'>{'Excerpt'}</InputLabel>
              <Input
              sx={{ gap: theme.spacing(1) }}
              id='excerpt'
              type='text'
              name='excerpt'
              inputProps={{
                minLength: 3
              }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl required fullWidth>
              <InputLabel htmlFor='title'>{'Content'}</InputLabel>
              <Input
              sx={{ gap: theme.spacing(1) }}
              id='content'
              type='text'
              name='content'
              inputProps={{
                minLength: 3
              }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Button type='submit' variant='contained' color='success'>
					{'Create'}
        </Button>
      </FormFieldsWrapper>
    )
  }
