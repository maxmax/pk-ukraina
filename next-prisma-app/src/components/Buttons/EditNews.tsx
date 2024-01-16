import { useUser } from 'src/utils/swr'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import { Button, IconButton } from '@mui/material'
import type { News } from '@prisma/client'
import EditNewsForm from '../Forms/EditNews'
import Modal from '../Modal'

type Props = {
  news: Omit<News, 'createdAt' | 'updatedAt'> & {
    createdAt: string
  }
  icon?: boolean
}

export default function EditNewsButton({ news, icon = true }: Props) {
  const { user } = useUser()

  if (!user || user.id !== news.authorId) return null

  return (
    <Modal
      triggerComponent={
        icon ? (
          <IconButton color='info'>
            <DriveFileRenameOutlineIcon />
          </IconButton>
        ) : (
          <Button variant='contained' color='info'>
            {'Edit'}
          </Button>
        )
      }
      modalContent={<EditNewsForm news={news} />}
      size='M'
    />
  )
}
