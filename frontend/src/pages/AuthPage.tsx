import SigninForm from '@/components/forms/SigninForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated && !auth.loading) navigate('/', { replace: true })
  }, [auth, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <SigninForm />
        </CardContent>
      </Card>
    </div>
  )
}
