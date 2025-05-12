import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import GoogleLoginButton from '../components/LoginButtonComponent';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(credentials);
            navigate('/'); // Redirect alla homepage dopo il login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Accedi</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <GoogleLoginButton />
                    <div className="text-center my-3">
                        <span className="text-muted">oppure</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={credentials.email}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    email: e.target.value
                                })}
                                required
                            />
                            </div>
                        <div className="mb-3">
                            <label className="form-label">Password:</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({
                                        ...credentials,
                                        password: e.target.value
                                    })}
                                    required
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Nascondi" : "Mostra"}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Accedi
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p>Non hai un account? <Link to="/register">Registrati qui</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
