import React from 'react';
import { Button } from 'react-bootstrap';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/google';
  };

  return (
    <Button 
      variant="danger" 
      className="w-100 mb-3"
      onClick={handleGoogleLogin}
    >
      <i className="bi bi-google me-2"></i>
      Accedi con Google
    </Button>
  );
};

export default GoogleLoginButton;