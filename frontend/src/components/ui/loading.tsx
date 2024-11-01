import { Loader2 } from 'lucide-react'

interface Props {
  loadingText?: string
}
export default function Loading({ loadingText }: Props) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      {loadingText && <span>{loadingText}</span>}
    </div>
  )
}
