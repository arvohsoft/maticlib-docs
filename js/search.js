// ==================== Search Functionality ====================
const searchInput = document.getElementById('search-input');

// Search index (simplified - in production, use a proper search library like Lunr.js)
const searchIndex = [
    { title: 'Getting Started', url: 'pages/getstarted/sample.html', keywords: 'start quick example' },
    { title: 'Installation', url: 'pages/getstarted/installation.html', keywords: 'install pip setup' },
    { title: 'Google GenAI Client', url: 'pages/docs/llm/clients/google-genai.html', keywords: 'gemini google llm api' },
    { title: 'Mistral Client', url: 'pages/docs/llm/clients/mistral.html', keywords: 'mistral llm api' },
    { title: 'MaticGraph', url: 'pages/docs/graph/maticgraph.html', keywords: 'graph workflow state agent' },
    { title: 'Messages', url: 'pages/docs/messages.html', keywords: 'message system human ai' }
];

// Keyboard shortcut (Ctrl+K or Cmd+K)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput?.focus();
    }
});

// Search functionality
let searchTimeout;
searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
        hideSearchResults();
        return;
    }
    
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 300);
});

function performSearch(query) {
    const results = searchIndex.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.keywords.toLowerCase().includes(query)
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    // Remove existing results
    let resultsContainer = document.querySelector('.search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        searchInput.parentElement.appendChild(resultsContainer);
        
        // Style the results container
        resultsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 8px;
            background-color: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
        `;
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div style="padding: 16px; color: var(--text-secondary);">No results found</div>';
    } else {
        resultsContainer.innerHTML = results.map(result => `
            <a href="${result.url}" class="search-result-item" style="
                display: block;
                padding: 12px 16px;
                color: var(--text-primary);
                text-decoration: none;
                border-bottom: 1px solid var(--border-color);
                transition: background-color 0.2s;
            ">
                <div style="font-weight: 600; margin-bottom: 4px;">${result.title}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">${result.url}</div>
            </a>
        `).join('');
        
        // Add hover effect
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
            });
            item.addEventListener('mouseleave', (e) => {
                e.target.style.backgroundColor = 'transparent';
            });
        });
    }
}

function hideSearchResults() {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
        resultsContainer.remove();
    }
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        hideSearchResults();
    }
});