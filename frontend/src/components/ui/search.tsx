import { useState } from 'react'
import { Input } from './input'
import { Search as SearchIcon } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

interface Props {
  initialValue?: string
  onSearch: (value: string) => void
}

export default function Search(props: Props) {
  const [value, setValue] = useState(props.initialValue ?? '')

  const handleSearch = useDebouncedCallback((term: string) => {
    props.onSearch(term)
  }, 300)

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          handleSearch(e.target.value)
        }}
        className="pl-8"
      />
    </div>
  )
}
