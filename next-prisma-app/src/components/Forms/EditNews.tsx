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
import { useState } from 'react'
import FormFieldsWrapper from './Wrapper'

type Props = {
  closeModal?: () => void
  news: Omit<News, 'createdAt' | 'updatedAt'> & {
    createdAt: string
  }
}

export default function EditNewsForm({ closeModal, news }: Props) {

	const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(news.date));

  const theme = useTheme()
  const { user, accessToken } = useUser()
  const router = useRouter()

  const [errors, setErrors] = useState<{
    content?: number
  }>({})

  if (!user || user.id !== news.authorId) return null

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    ) as unknown as Pick<News, 'date' | 'title' | 'excerpt' | 'content' | 'img'> & {
      newsId: string
    }

    try {
      const response = await fetch('/api/news', {
        method: 'PUT',
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
      <Typography variant='h4'>{'Edit Article'}</Typography>
      <input type='hidden' name='newsId' defaultValue={news.id} />
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					label={'Date'}
					value={dateValue}
					format="DD/MM/YYYY"
					onChange={(newValue) => setDateValue(newValue)}
				/>
			</LocalizationProvider>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<FormControl fullWidth required>
						<InputLabel htmlFor='title'>{'Title'}</InputLabel>
						<Input
							sx={{ gap: theme.spacing(1) }}
							id='title'
							type='text'
							name='title'
							inputProps={{
								minLength: 3
							}}
							defaultValue={news.title}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<FormControl fullWidth required>
						<InputLabel htmlFor='img'>{'Image url'}</InputLabel>
						<Input
							sx={{ gap: theme.spacing(1) }}
							id='img'
							type='text'
							name='img'
							inputProps={{
								minLength: 3
							}}
							defaultValue={news.img}
						/>
					</FormControl>
				</Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel htmlFor='excerpt'>{'Excerpt'}</InputLabel>
            <Input
              sx={{ gap: theme.spacing(1) }}
              id='excerpt'
              type='text'
              name='excerpt'
              inputProps={{
                minLength: 3
              }}
              defaultValue={news.excerpt}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel htmlFor='content'>{'Content'}</InputLabel>
            <Input
              sx={{ gap: theme.spacing(1) }}
              id='content'
              type='text'
              name='content'
              inputProps={{
                minLength: 3
              }}
              defaultValue={news.content}
            />
          </FormControl>
        </Grid>
			</Grid>
      <Button type='submit' variant='contained' color='success'>
        {'Update'}
      </Button>
    </FormFieldsWrapper>
  )
}
