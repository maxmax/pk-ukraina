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
import type { Statement } from '@prisma/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import FormFieldsWrapper from './Wrapper'

type Props = {
  closeModal?: () => void
  statement: Omit<Statement, 'createdAt' | 'updatedAt'> & {
    createdAt: string
  }
}

export default function EditStatementForm({ closeModal, statement }: Props) {

	const [dataValue, setDataValue] = useState<Dayjs | null>(dayjs(statement.dateReceiving));

  const theme = useTheme()
  const { user, accessToken } = useUser()
  const router = useRouter()

  const [errors, setErrors] = useState<{
    content?: number
  }>({})

  if (!user || user.id !== statement.authorId) return null

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    ) as unknown as Pick<Statement, 'dateReceiving' | 'diskNumber' | 'outputName' | 'inputName' | 'deedNumber' | 'notes'> & {
      statementId: string
    }

    // if (formData.content.length < 50) {
    //  return setErrors({ content: formData.content.length })
    // }

    try {
      const response = await fetch('/api/statement', {
        method: 'PUT',
        body: JSON.stringify({
					...formData,
					dateReceiving: dataValue.$d
				}),
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw response
      }

      const statement = await response.json()

      router.push(`/statement/${statement.id}`)

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
      <Typography variant='h4'>{'Edit'}</Typography>
      <input type='hidden' name='statementId' defaultValue={statement.id} />
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					label={'Date of receipt'}
					value={dataValue}
					format="DD/MM/YYYY"
					onChange={(newValue) => setDataValue(newValue)}
				/>
			</LocalizationProvider>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<FormControl required>
						<InputLabel htmlFor='diskNumber'>{'Hard disk drive number'}</InputLabel>
						<Input
							sx={{ gap: theme.spacing(1) }}
							id='diskNumber'
							type='text'
							name='diskNumber'
							inputProps={{
								minLength: 3
							}}
							defaultValue={statement.diskNumber}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl required>
						<InputLabel htmlFor='outputName'>{'Full name and signature of the employee transferring'}</InputLabel>
						<Input
							sx={{ gap: theme.spacing(1) }}
							id='outputName'
							type='text'
							name='outputName'
							inputProps={{
								minLength: 3
							}}
							defaultValue={statement.outputName}
						/>
					</FormControl>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<FormControl required>
						<InputLabel htmlFor='inputName'>{'Full name and signature of the employee receiving'}</InputLabel>
						<Input
							sx={{ gap: theme.spacing(1) }}
							id='inputName'
							type='text'
							name='inputName'
							inputProps={{
								minLength: 3
							}}
							defaultValue={statement.inputName}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl required>
						<InputLabel htmlFor='deedNumber'>{'Number of the Act on the destruction of the hard disk drive'}</InputLabel>
						<Input
							sx={{ gap: theme.spacing(1) }}
							id='deedNumber'
							type='text'
							name='deedNumber'
							inputProps={{
								minLength: 3
							}}
							defaultValue={statement.deedNumber}
						/>
					</FormControl>
				</Grid>
				<Grid item xs={6}>
					<FormControl required>
						<InputLabel htmlFor='notes'>{'Notes'}</InputLabel>
						<Input
							sx={{ gap: theme.spacing(1) }}
							id='notes'
							type='text'
							name='notes'
							inputProps={{
								minLength: 3
							}}
							defaultValue={statement.notes}
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
