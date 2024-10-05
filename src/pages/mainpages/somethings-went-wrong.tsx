import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function ErrorPage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Something Went Wrong'
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-extrabold text-primary">Oops! Something Went Wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We're sorry, but it seems like there was an error. Don't worry, it's not your fault!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={handleRefresh} className="flex items-center justify-center">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Refresh Page
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="flex items-center justify-center">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Go to Homepage
          </Button>
        </div>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        If the problem persists, please contact our support team.
      </p>
    </div>
  )
}