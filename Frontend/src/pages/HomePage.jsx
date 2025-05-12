import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(3);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserAndPosts = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setCurrentUser(userData);
                await fetchPosts();
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
    };
        loadUserAndPosts();
    }, []);


    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3001/blogPosts', {
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            
            if (!response.ok) throw new Error('Errore nel caricamento dei post');
            
            const data = await response.json();
            setPosts(Array.isArray(data) ? data : data.posts || []);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Indici dei post da mostrare
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Cambia pagina
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) return <div className="text-center mt-5">Caricamento...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Blog Posts</h1>
                    {currentUser && (
                        <p className="text-muted">
                            Benvenuto, {currentUser.nome} {currentUser.cognome}
                        </p>
                    )}
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                    Logout
                </button>
            </div>

            <div className="row">
                {currentPosts.map(post => (
                    <div key={post._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            {post.cover && (
                                <img 
                                    src={post.cover} 
                                    className="card-img-top" 
                                    alt={post.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.category}</p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        Tempo di lettura: {post.readTime.value} {post.readTime.unit}
                                    </small>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginazione */}
            <div className="d-flex justify-content-center mt-4">
                <nav>
                    <ul className="pagination">
                        {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}