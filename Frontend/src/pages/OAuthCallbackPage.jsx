import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Salva il token
      localStorage.setItem('token', token);
      // Redirect alla home
      navigate('/');
    } else {
      // In caso di errore, torna al login
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Autenticazione in corso...</span>
      </div>
    </div>
  );
};

export default OAuthCallback;