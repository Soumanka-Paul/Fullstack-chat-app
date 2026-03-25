import React, { useEffect } from 'react'
import NavBar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './Store/useAuthStore'
import { useThemeStore } from './Store/useThemeStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);

  if (isCheckingAuth) return (
    <div className='flex items-center justify-center h-screen' data-theme={theme}>
      <Loader className='size-10 animate-spin text-primary' />
    </div>
  );
console.log("authUser:", authUser);
console.log("isCheckingAuth:", isCheckingAuth);
console.log("theme:", theme);
  return (
    <div data-theme={theme}>
      <NavBar />
      <Routes>
        {/* Protected Routes */}
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/signin' />} />
        <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to='/signin' />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/signin' />} />

        {/* Public Routes */}
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/signin' element={!authUser ? <SignInPage /> : <Navigate to='/' />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App