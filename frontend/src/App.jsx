import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import DotsBackground from './components/DotsBackground'
import Home from './pages/Home'
import MyLinks from './pages/MyLinks'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/links" element={<MyLinks />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <DotsBackground />
    </>
  )
}

export default App
