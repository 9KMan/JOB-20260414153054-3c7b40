import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Assessment from './pages/Assessment'
import Insights from './pages/Insights'
import Payment from './pages/Payment'
import Feedback from './pages/Feedback'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="insights/:id" element={<Insights />} />
        <Route path="payment/:insightId" element={<Payment />} />
        <Route path="feedback/:insightId" element={<Feedback />} />
      </Route>
    </Routes>
  )
}

export default App
