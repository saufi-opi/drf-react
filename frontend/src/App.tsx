import { useState } from 'react'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div>
      <h1>Django Rest Framework + React + ShadCN</h1>
      <p>Count: {count}</p>
      <Button
        onClick={() => {
          setCount((prev) => prev + 1)
        }}
      >
        Click Me
      </Button>
    </div>
  )
}

export default App
