import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default App
