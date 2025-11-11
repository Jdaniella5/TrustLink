import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import VerificationFlow from './pages/VerificationFlow'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/verify" element={<VerificationFlow />} />
        {/* Add other routes here */}
        {/* Example: <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  )
}

export default App