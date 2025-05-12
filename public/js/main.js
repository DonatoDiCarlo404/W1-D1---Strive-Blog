let currentPage = 1;
const limit = 3;

async function fetchPosts(page = 1, searchTitle = '') {
    try {
        let url = `http://localhost:3001/blogPosts?page=${page}&limit=${limit}`;
        if (searchTitle) {
            url = `http://localhost:3001/blogPosts?title=${searchTitle}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nel caricamento dei post:', error);
        return null;
    }
}


function createPostCard(post) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${post.cover}" class="card-img-top" alt="${post.title}">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">Categoria: ${post.category}</p>
                    <p class="card-text">Tempo di lettura: ${post.readTime.value} ${post.readTime.unit}</p>
                    <p class="card-text">Autore: ${post.author}</p>
                </div>
            </div>
        </div>
    `;
}

async function displayPosts(searchTitle = '') {
    const container = document.getElementById('posts-container');
    container.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';

    const data = await fetchPosts(currentPage, searchTitle);
    if (!data) {
        container.innerHTML = '<div class="alert alert-danger">Errore nel caricamento dei post</div>';
        return;
    }

    if (data.posts.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Nessun post trovato</div>';
        return;
    }

    container.innerHTML = data.posts.map(post => createPostCard(post)).join('');
    
    // Aggiorna paginazione solo se non stiamo cercando
    if (!searchTitle) {
        document.getElementById('pageInfo').textContent = `Pagina ${data.currentPage} di ${data.totalPages}`;
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage === data.totalPages;
    }
}

// Event Listeners per i bottoni di paginazione
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPosts();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    displayPosts();
});

// Event Listeners per la ricerca
document.getElementById('searchButton').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm) {
        displayPosts(searchTerm);
    }
});

document.getElementById('resetButton').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    currentPage = 1;
    displayPosts();
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = e.target.value.trim();
        if (searchTerm) {
            displayPosts(searchTerm);
        }
    }
});

// Carica i post all'avvio della pagina
displayPosts();