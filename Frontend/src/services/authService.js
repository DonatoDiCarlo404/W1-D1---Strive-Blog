const API_URL = 'http://localhost:3001';

export const authService = {
    async register(userData) {
        const response = await fetch(`${API_URL}/authors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/authors/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    async getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/authors/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    return null;
                }
                throw new Error('Errore nel recupero dati utente');
            }

            return await response.json();
        } catch (error) {
            console.error('Errore getCurrentUser:', error);
            return null;
        }
    },

    logout() {
        localStorage.removeItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};
