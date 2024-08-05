import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { ToastContainer } from 'react-toastify'
import Profile from './pages/Profile'
import Questions from './pages/Questions'
import Quizzes from './pages/Quizzes'
import Header from './pages/components/Header'
import AttemptQuiz from './pages/AttemptQuiz'
import AllQuizzes from './pages/AllQuizzes'
import NotFound from './pages/components/NotFound'
import Logout from './pages/auth/Logout'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/add-questions/:id' element={<Questions />} />
        <Route path='/quizzes' element={<AllQuizzes />} />
        <Route path='/quiz/:id' element={<Quizzes />} />
        <Route path='/attempt/:id' element={<AttemptQuiz />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
