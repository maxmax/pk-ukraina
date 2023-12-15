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
import { red } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'
import type { Statement } from '@prisma/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import FormFieldsWrapper from './Wrapper'
import statement from '@/pages/api/statement'

type Props = {
  closeModal?: () => void
}

export default function CreateStatementForm({ closeModal }: Props) {
    const theme = useTheme()
    const { user, accessToken } = useUser()
    const router = useRouter()
  
    const [errors, setErrors] = useState<{
      content?: number
    }>({})
  
    if (!user) return null
  
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
			console.log('KKKKKKKKKKK!!!!!!!');
      if (!user) return
      e.preventDefault()
      const formData = Object.fromEntries(
        new FormData(e.target as HTMLFormElement)
      ) as unknown as Pick<Statement, 'dateReceiving' | 'diskNumber' | 'outputName' | 'inputName' | 'deedNumber' | 'notes'>
      //if (formData.outputName.length < 50) {
      //  return setErrors({ content: formData.outputName.length })
      //}
  
      try {
        const response = await fetch('/api/statement', {
          method: 'POST',
          body: JSON.stringify(formData),
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
        <Typography variant='h4'>{'Створити заявку'}</Typography>
        <FormControl required>
          <InputLabel htmlFor='dateReceiving'>Дата отримання</InputLabel>
					{/*TODO: replace to mui datepicker*/}
          <Input
            sx={{ gap: theme.spacing(1) }}
            id='dateReceiving'
            type='text'
            name='dateReceiving'
            // inputProps={{
            //  minLength: 3
            // }}
          />
        </FormControl>
        <Grid container spacing={2}>
					<Grid item xs={6}>
						<FormControl required>
							<InputLabel htmlFor='diskNumber'>{'Номер жорсткого диску'}</InputLabel>
							<Input
							sx={{ gap: theme.spacing(1) }}
							id='diskNumber'
							type='text'
							name='diskNumber'
							inputProps={{
								minLength: 3
							}}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl required>
							<InputLabel htmlFor='outputName'>{'ПІБ та підпис працівника, що передав носій'}</InputLabel>
							<Input
							sx={{ gap: theme.spacing(1) }}
							id='outputName'
							type='text'
							name='outputName'
							inputProps={{
								minLength: 3
							}}
							/>
						</FormControl>
					</Grid>
        </Grid>
        <Grid container spacing={2}>
					<Grid item xs={6}>
						<FormControl required>
							<InputLabel htmlFor='inputName'>{'ПІБ та підпис працівника який отримав носій'}</InputLabel>
							<Input
							sx={{ gap: theme.spacing(1) }}
							id='inputName'
							type='text'
							name='inputName'
							inputProps={{
							minLength: 3
							}}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl required>
							<InputLabel htmlFor='deedNumber'>{'Номер Акту про знищення жорсткого диску'}</InputLabel>
							<Input
							sx={{ gap: theme.spacing(1) }}
							id='deedNumber'
							type='text'
							name='deedNumber'
							inputProps={{
								minLength: 3
							}}
							/>
						</FormControl>						
					</Grid>
					<Grid item xs={6}>
						<FormControl required>
							<InputLabel htmlFor='notes'>{'Примітки'}</InputLabel>
							<Input
							sx={{ gap: theme.spacing(1) }}
							id='notes'
							type='text'
							name='notes'
							inputProps={{
								minLength: 3
							}}
							/>
						</FormControl>						
					</Grid>
				</Grid>
        <Button type='submit' variant='contained' color='success'>
					{'Створити'}
        </Button>
      </FormFieldsWrapper>
    )
  }