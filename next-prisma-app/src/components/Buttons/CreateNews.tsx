import { useUser } from 'src/utils/swr'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'
import CreateNewsForm from '../Forms/CreareNews'
import Modal from '../Modal'

export default function CreateNewsButton() {
  const { user } = useUser()

  const onClick = () => {
    toast('Authorization required', {
      type: 'warning'
    })
  }

  return user ? (
    <Modal
      triggerComponent={
        <Button variant='contained' sx={{ my: 2 }}>
          {'Create a new'}
        </Button>
      }
      modalContent={<CreateNewsForm />}
      size='M'
    />
  ) : (
    <Button variant='contained' sx={{ my: 2 }} onClick={onClick}>
      {'Create a new'}
    </Button>
  )
}
