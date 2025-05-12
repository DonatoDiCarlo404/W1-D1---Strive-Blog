import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }) {
    // Se non c'è il token, reindirizza al login
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    // Se c'è il token, mostra il contenuto protetto
    return children;
}