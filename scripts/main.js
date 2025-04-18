const CONFIG = {
    defaultEngine: 'bing',
    engines: {
        bing: query => {
            const sanitized = `${query.replace(/[<>"']/g, '')} -site:csdn.net`;
            return `https://www.bing.com/search?q=${encodeURIComponent(sanitized)}`;
        },
        baidu: query => {
            const sanitized = `${query.replace(/[<>"']/g, '')} -site:csdn.net`;
            return `https://www.baidu.com/s?wd=${encodeURIComponent(sanitized)}`;
        }
    },
    quickLinks: [
        { name: 'Github', url: 'https://github.com' },
        { name: 'deepseek', url: 'https://chat.deepseek.com/' },
        { name: 'cnblogs', url: 'https://www.cnblogs.com/' },
        { name: 'Mi', url: 'https://account.xiaomi.com/' },
        { name: 'Bing', url: 'https://bing.com' }
    ]
};

function initSearch() {
    const performSearch = () => {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        try {
            const searchURL = CONFIG.engines[CONFIG.defaultEngine](query);
            const newWindow = window.open('', '_blank');
            newWindow.opener = null;
            newWindow.location.href = searchURL;
        } catch (e) {
            window.open(searchURL, '_blank', 'noopener,noreferrer');
        }
    };

    document.getElementById('searchButton').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') performSearch();
    });
}

function initQuickLinks() {
    const container = document.getElementById('quickLinks');
    container.innerHTML = '';

    CONFIG.quickLinks.forEach(link => {
        const domain = new URL(link.url).hostname;
        const iconUrl = `${link.url}/favicon.ico`;
        
        const linkEl = document.createElement('a');
        linkEl.className = 'quicklink';
        linkEl.href = link.url;
        linkEl.target = '_blank';
        linkEl.rel = 'noopener';
        
        linkEl.innerHTML = `
            <img src="${iconUrl}" alt="${link.name}" 
                 onerror="this.src='https://github.com/FamMcao/homePageBrowser/icons/quickError.png'">
            <span>${link.name}</span>
        `;
        
        container.appendChild(linkEl);
    });
}

function initEngineSwitch() {
    const selector = document.getElementById('engineSelect');
    const updateSelectorStyle = () => {
        selector.style.backgroundColor = selector.value === 'bing' 
            ? 'rgba(0, 180, 216, 0.1)' 
            : 'rgba(255, 193, 7, 0.1)';
    };

    const savedEngine = localStorage.getItem('searchEngine');
    if(savedEngine) {
        CONFIG.defaultEngine = savedEngine;
        selector.value = savedEngine;
    }
    updateSelectorStyle();

    selector.addEventListener('change', (e) => {
        CONFIG.defaultEngine = e.target.value;
        localStorage.setItem('searchEngine', e.target.value);
        updateSelectorStyle();
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initQuickLinks();
    initEngineSwitch();
});
