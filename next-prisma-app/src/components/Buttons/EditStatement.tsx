import { useUser } from 'src/utils/swr'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import { Button, IconButton } from '@mui/material'
import type { Statement } from '@prisma/client'
import EditStatementForm from '../Forms/EditStatement'
import Modal from '../Modal'

type Props = {
  statement: Omit<Statement, 'createdAt' | 'updatedAt'> & {
    createdAt: string
  }
  icon?: boolean
}

export default function EditStatementButton({ statement, icon = true }: Props) {
  const { user } = useUser()

  if (!user || user.id !== statement.authorId) return null

  return (
    <Modal
      triggerComponent={
        icon ? (
          <IconButton color='info'>
            <DriveFileRenameOutlineIcon />
          </IconButton>
        ) : (
          <Button variant='contained' color='info'>
            {'Редагувати'}
          </Button>
        )
      }
      modalContent={<EditStatementForm statement={statement} />}
      size='M'
    />
  )
}