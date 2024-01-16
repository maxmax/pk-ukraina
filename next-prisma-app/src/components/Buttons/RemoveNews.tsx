import { useUser } from 'src/utils/swr'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Button, IconButton } from '@mui/material'
import { useRouter } from 'next/router'

type Props = {
  newsId: string
  authorId: string
  icon?: boolean
}

export default function RemoveNewsButton({
  newsId,
	authorId,
  icon = true
}: Props) {
  const router = useRouter()
  const { user, accessToken } = useUser()

  if (!user || user.id !== authorId) return null

  const removeNews = async () => {
    try {
      await fetch(`/api/news?id=${newsId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      router.push('/news')
    } catch (e: unknown) {
      console.error(e)
    }
  }

  return icon ? (
    <IconButton onClick={removeNews} color='error'>
      <DeleteOutlineIcon />
    </IconButton>
  ) : (
    <Button variant='contained' color='error' onClick={removeNews}>
      Remove
    </Button>
  )
}
