import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function RegisterPage() {
    const [userData, setUserData] = useState({
        nome: '',
        cognome: '',
        email: '',
        password: '',
        dataDiNascita: '',
        avatar: 'https://placeholder.com/150'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.register(userData);
            navigate('/login'); // Redirect al login dopo la registrazione
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Registrazione</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nome:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userData.nome}
                                onChange={(e) => setUserData({
                                    ...userData,
                                    nome: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Cognome:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={userData.cognome}
                                onChange={(e) => setUserData({
                                    ...userData,
                                    cognome: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                value={userData.email}
                                onChange={(e) => setUserData({
                                    ...userData,
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
                                    value={userData.password}
                                    onChange={(e) => setUserData({
                                        ...userData,
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
                        <div className="mb-3">
                            <label className="form-label">Data di Nascita:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={userData.dataDiNascita}
                                onChange={(e) => setUserData({
                                    ...userData,
                                    dataDiNascita: e.target.value
                                })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Registrati
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p>Hai già un account? <Link to="/login">Accedi qui</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}