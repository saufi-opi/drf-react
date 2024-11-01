import SigninForm from '@/components/forms/SigninForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function AuthPage() {
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
