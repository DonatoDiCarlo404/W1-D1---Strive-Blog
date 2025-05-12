import React from 'react';
import { Button } from 'react-bootstrap';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "https://strive-blog-2iak.onrender.com/auth/google";
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