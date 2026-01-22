import { Routes, Route, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Pages
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import GuidePage from '@/pages/GuidePage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ApplyPage from '@/pages/ApplyPage'
import MyPage from '@/pages/MyPage'
import AdminPage from '@/pages/AdminPage'

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminPage && <Header />}
      <main className={isAdminPage ? 'min-h-screen' : 'min-h-screen pt-20'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </>
  )
}

export default App
