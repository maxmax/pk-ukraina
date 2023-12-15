import { useUser } from 'src/utils/swr'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'
import CreateStatementForm from '../Forms/CreareStatement'
import Modal from '../Modal'

export default function CreateStatementButton() {
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
          {'Створити нову заявку'}
        </Button>
      }
      modalContent={<CreateStatementForm />}
      size='M'
    />
  ) : (
    <Button variant='contained' sx={{ my: 2 }} onClick={onClick}>
      {'Створити нову заявку'}
    </Button>
  )
}