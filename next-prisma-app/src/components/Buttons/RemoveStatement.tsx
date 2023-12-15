import { useUser } from 'src/utils/swr'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Button, IconButton } from '@mui/material'
import { useRouter } from 'next/router'

type Props = {
  statementId: string
  authorId: string
  icon?: boolean
}

export default function RemoveStatementButton({
  statementId,
	authorId,
  icon = true
}: Props) {
  const router = useRouter()
  const { user, accessToken } = useUser()

  if (!user || user.id !== authorId) return null

  const removeStatement = async () => {
    try {
      await fetch(`/api/statement?id=${statementId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      router.push('/statement')
    } catch (e: unknown) {
      console.error(e)
    }
  }

  return icon ? (
    <IconButton onClick={removeStatement} color='error'>
      <DeleteOutlineIcon />
    </IconButton>
  ) : (
    <Button variant='contained' color='error' onClick={removeStatement}>
      Remove
    </Button>
  )
}