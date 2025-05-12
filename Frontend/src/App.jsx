import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRouteComponent';
import 'bootstrap/dist/css/bootstrap.min.css'
import OAuthCallback from './pages/OAuthCallbackPage';
import OAuthSuccess from './components/OAuthSuccessComponent';

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
