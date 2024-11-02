import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function HomePage() {
  const { logout } = useAuth()
  return (
    <div>
      <h1>Homepage</h1>
      <Button variant="destructive" onClick={logout}>
        Logout
      </Button>
    </div>
  )
}
