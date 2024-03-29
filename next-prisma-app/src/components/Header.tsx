import { AppBar } from '@mui/material'
import DesktopMenu from './Menu/Desktop'
import MobileMenu from './Menu/Mobile'

export type PageLinks = { title: string; href: string }[]

const PAGE_LINKS = [
  { title: 'Home', href: '/' },
  { title: 'News', href: '/news' },
  { title: 'Statement', href: '/statement' },
]

export default function Header() {
  return (
    <AppBar position='relative'>
      <DesktopMenu links={PAGE_LINKS} />
      <MobileMenu links={PAGE_LINKS} />
    </AppBar>
  )
}
