// app.js - Código completo e funcional
class TouristTerminal {
    constructor() {
        this.currentLanguage = 'pt';
        this.currentScreen = 'welcome';
        this.data = null;
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        this.initializeApp();
    }

    async initializeApp() {
        await this.loadData();
        this.setupEventListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        
        console.log('✅ Terminal turístico inicializado!');
    }

    async loadData() {
        try {
            // Tenta carregar dados do arquivo data.json
            const response = await fetch('data.json');
            if (response.ok) {
                this.data = await response.json();
            } else {
                throw new Error('Arquivo data.json não encontrado');
            }
        } catch (error) {
            console.warn('Usando dados de fallback:', error);
            // Dados de exemplo caso o arquivo não exista
            this.data = {
                events: [
                    {
                        id: 1,
                        title: "Festival Cultural de São Paulo",
                        date: "2024-12-15",
                        desc: "Grande festival com música, dança e gastronomia típica no Parque Ibirapuera.",
                        address: "Parque Ibirapuera - Av. Pedro Álvares Cabral, s/n",
                        phone: "(11) 5574-5045"
                    },
                    {
                        id: 2,
                        title: "Feira de Artesanato Paulista",
                        date: "2024-12-20",
                        desc: "Feira com artesanato local e comidas típicas no Centro Histórico.",
                        address: "Praça da Sé - Centro, São Paulo",
                        phone: "(11) 3105-2678"
                    }
                ],
                tourism: [
                    {
                        id: 10,
                        title: "MASP - Museu de Arte de São Paulo",
                        desc: "Importante museu de arte com acervo diversificado na Avenida Paulista.",
                        address: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
                        phone: "(11) 3149-5959",
                        price: "R$ 50,00 (entrada)"
                    },
                    {
                        id: 11,
                        title: "Parque Ibirapuera",
                        desc: "Principal parque urbano de São Paulo com lagos, museus e áreas de lazer.",
                        address: "Av. Pedro Álvares Cabral - Vila Mariana, São Paulo - SP",
                        phone: "(11) 5574-5045",
                        price: "Gratuito"
                    }
                ],
                hotels: [
                    {
                        id: 20,
                        title: "Hotel Unique",
                        desc: "Hotel 5 estrelas com arquitetura única e vista panorâmica.",
                        address: "Av. Brigadeiro Luís Antônio, 4700 - Jardim Paulista",
                        phone: "(11) 3055-4710",
                        price: "R$ 800-1200/noite"
                    },
                    {
                        id: 21,
                        title: "Pousada dos Artistas",
                        desc: "Pousada charmosa no centro histórico com café da manhã incluso.",
                        address: "Rua do Carmo, 100 - Centro, São Paulo",
                        phone: "(11) 3106-8999",
                        price: "R$ 200-350/noite"
                    }
                ],
                restaurants: [
                    {
                        id: 30,
                        title: "Figueira Rubaiyat",
                        desc: "Restaurante sofisticado sob uma figueira centenária.",
                        address: "Rua Haddock Lobo, 1738 - Jardins, São Paulo",
                        phone: "(11) 3087-1399",
                        price: "R$ 150-300/pessoa"
                    },
                    {
                        id: 31,
                        title: "Mercado Municipal",
                        desc: "Mercado histórico com variedade de alimentos e lanches típicos.",
                        address: "R. da Cantareira, 306 - Centro, São Paulo",
                        phone: "(11) 3313-3365",
                        price: "R$ 30-80/pessoa"
                    }
                ]
            };
        }
    }

    setupEventListeners() {
        // Botões de idioma
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentLanguage = e.target.dataset.lang;
                this.applyLanguage();
                this.showScreen('menu');
            });
        });

        // Botões do menu
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.target.dataset.screen;
                if (['events', 'tourism', 'hotels', 'restaurants'].includes(screen)) {
                    this.showList(screen);
                } else if (screen === 'map') {
                    this.showScreen('map');
                }
            });
        });

        // Botões voltar
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showScreen('menu');
            });
        });

        // Pesquisa
        const searchInput = document.getElementById('searchInput');
        const voiceBtn = document.getElementById('voiceBtn');

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.doSearch(searchInput.value);
            }
        });

        voiceBtn.addEventListener('click', () => {
            this.startVoiceSearch();
        });

        // Ações de detalhes
        document.getElementById('emailLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.sendByEmail();
        });

        document.getElementById('routeBtn').addEventListener('click', () => {
            this.showRoute();
        });

        document.getElementById('favoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });
    }

    updateClock() {
        const now = new Date();
        const clockEl = document.getElementById('clock');
        clockEl.textContent = now.toLocaleTimeString('pt-BR') + ' - ' + now.toLocaleDateString('pt-BR');
    }

    applyLanguage() {
        const translations = {
            pt: {
                welcome: "Bem-vindo ao Guia Turístico SP",
                menu: "Menu Principal",
                searchPlaceholder: "Pesquisar pontos turísticos...",
                events: "Eventos",
                tourism: "Pontos Turísticos", 
                hotels: "Hospedagem",
                restaurants: "Restaurantes",
                transport: "Transporte",
                map: "Mapa"
            },
            en: {
                welcome: "Welcome to SP Tourist Guide", 
                menu: "Main Menu",
                searchPlaceholder: "Search tourist attractions...",
                events: "Events",
                tourism: "Tourist Attractions",
                hotels: "Accommodation", 
                restaurants: "Restaurants",
                transport: "Transport",
                map: "Map"
            },
            es: {
                welcome: "Bienvenido a la Guía Turística SP",
                menu: "Menú Principal",
                searchPlaceholder: "Buscar atracciones turísticas...",
                events: "Eventos",
                tourism: "Atracciones Turísticas",
                hotels: "Alojamiento",
                restaurants: "Restaurantes", 
                transport: "Transporte",
                map: "Mapa"
            }
        };

        const t = translations[this.currentLanguage];

        document.getElementById('greeting').textContent = t.welcome;
        document.getElementById('menu-title').textContent = t.menu;
        document.getElementById('searchInput').placeholder = t.searchPlaceholder;

        // Atualizar textos dos botões do menu
        const menuButtons = document.querySelectorAll('.menu-btn');
        menuButtons[0].textContent = `📅 ${t.events}`;
        menuButtons[1].textContent = `🏛️ ${t.tourism}`;
        menuButtons[2].textContent = `🏨 ${t.hotels}`;
        menuButtons[3].textContent = `🍽️ ${t.restaurants}`;
        menuButtons[4].textContent = `🚇 ${t.transport}`;
        menuButtons[5].textContent = `🗺️ ${t.map}`;
    }

    showScreen(screenName) {
        // Esconder todas as telas
        document.querySelectorAll('main > section').forEach(section => {
            section.classList.add('hidden');
        });

        // Mostrar tela específica
        document.getElementById(screenName).classList.remove('hidden');
        this.currentScreen = screenName;

        // Focar no search input quando for para o menu
        if (screenName === 'menu') {
            document.getElementById('searchInput').value = '';
            document.getElementById('searchInput').focus();
        }
    }

    showList(category) {
        const categoryNames = {
            events: 'Eventos',
            tourism: 'Pontos Turísticos',
            hotels: 'Hospedagem', 
            restaurants: 'Restaurantes'
        };

        const title = categoryNames[category];
        document.getElementById('results-title').textContent = title;

        const items = this.data[category] || [];
        const listEl = document.getElementById('results-list');
        
        listEl.innerHTML = '';

        if (items.length === 0) {
            listEl.innerHTML = '<div class="item"><p>Nenhum resultado encontrado.</p></div>';
        } else {
            items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item';
                itemEl.innerHTML = `
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                    ${item.date ? `<small><strong>Data:</strong> ${this.formatDate(item.date)}</small>` : ''}
                    ${item.price ? `<small><strong>Preço:</strong> ${item.price}</small>` : ''}
                `;
                
                itemEl.addEventListener('click', () => {
                    this.showDetail(category, item.id);
                });

                listEl.appendChild(itemEl);
            });
        }

        this.showScreen('results');
    }

    showDetail(category, itemId) {
        const items = this.data[category];
        const item = items.find(i => i.id === itemId);

        if (!item) return;

        document.getElementById('detail-title').textContent = item.title;
        
        const contentEl = document.getElementById('detail-content');
        contentEl.innerHTML = `
            <div>
                <strong>Descrição:</strong>
                <p>${item.desc}</p>
            </div>
            ${item.address ? `
            <div>
                <strong>Endereço:</strong>
                <p>${item.address}</p>
            </div>
            ` : ''}
            ${item.phone ? `
            <div>
                <strong>Telefone:</strong>
                <p>${item.phone}</p>
            </div>
            ` : ''}
            ${item.date ? `
            <div>
                <strong>Data:</strong>
                <p>${this.formatDate(item.date)}</p>
            </div>
            ` : ''}
            ${item.price ? `
            <div>
                <strong>Preço:</strong>
                <p>${item.price}</p>
            </div>
            ` : ''}
        `;

        // Armazenar item atual para ações
        this.currentItem = item;

        this.showScreen('detail');
    }

    doSearch(query) {
        if (!query.trim()) return;

        const results = [];
        const searchTerm = query.toLowerCase();

        // Buscar em todas as categorias
        ['events', 'tourism', 'hotels', 'restaurants'].forEach(category => {
            (this.data[category] || []).forEach(item => {
                const searchText = (item.title + ' ' + item.desc + ' ' + (item.address || '')).toLowerCase();
                if (searchText.includes(searchTerm)) {
                    results.push({
                        ...item,
                        category: category
                    });
                }
            });
        });

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        document.getElementById('results-title').textContent = `Resultados para: "${query}"`;
        
        const listEl = document.getElementById('results-list');
        listEl.innerHTML = '';

        if (results.length === 0) {
            listEl.innerHTML = '<div class="item"><p>Nenhum resultado encontrado para sua busca.</p></div>';
        } else {
            results.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item';
                itemEl.innerHTML = `
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                    <small><strong>Categoria:</strong> ${this.getCategoryName(item.category)}</small>
                `;
                
                itemEl.addEventListener('click', () => {
                    this.showDetail(item.category, item.id);
                });

                listEl.appendChild(itemEl);
            });
        }

        this.showScreen('results');
    }

    getCategoryName(category) {
        const names = {
            events: 'Eventos',
            tourism: 'Ponto Turístico',
            hotels: 'Hospedagem',
            restaurants: 'Restaurante'
        };
        return names[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    startVoiceSearch() {
        alert('🔊 Funcionalidade de pesquisa por voz seria implementada aqui!\n\nEm um navegador com suporte, isso ativaria o reconhecimento de voz.');
        
        // Simulação de voz para demonstração
        setTimeout(() => {
            const demoQueries = ['pontos turísticos', 'hotéis centro', 'restaurantes japoneses', 'eventos hoje'];
            const randomQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)];
            
            document.getElementById('searchInput').value = randomQuery;
            this.doSearch(randomQuery);
        }, 1000);
    }

    sendByEmail() {
        if (!this.currentItem) return;
        
        const subject = `Informações: ${this.currentItem.title}`;
        const body = `
Informações do ponto turístico:

Nome: ${this.currentItem.title}
Descrição: ${this.currentItem.desc}
${this.currentItem.address ? `Endereço: ${this.currentItem.address}` : ''}
${this.currentItem.phone ? `Telefone: ${this.currentItem.phone}` : ''}
${this.currentItem.date ? `Data: ${this.formatDate(this.currentItem.date)}` : ''}
${this.currentItem.price ? `Preço: ${this.currentItem.price}` : ''}

Enviado do Terminal de Consulta Turística de São Paulo.
        `.trim();

        alert(`📧 E-mail simulado:\n\nAssunto: ${subject}\n\nCorpo:\n${body}\n\nEm produção, isso abriria o cliente de e-mail padrão.`);
    }

    showRoute() {
        if (!this.currentItem || !this.currentItem.address) return;
        
        alert(`🗺️ Rota para: ${this.currentItem.title}\n\nEndereço: ${this.currentItem.address}\n\nEm produção, isso integraria com Google Maps ou Apple Maps.`);
    }

    toggleFavorite() {
        if (!this.currentItem) return;

        const favoriteIndex = this.favorites.findIndex(fav => 
            fav.id === this.currentItem.id && fav.category === this.currentItem.category
        );

        if (favoriteIndex > -1) {
            // Remover dos favoritos
            this.favorites.splice(favoriteIndex, 1);
            alert('❌ Removido dos favoritos!');
        } else {
            // Adicionar aos favoritos
            this.favorites.push({
                ...this.currentItem,
                category: this.currentItem.category
            });
            alert('⭐ Adicionado aos favoritos!');
        }

        // Salvar no localStorage
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
}

// 📄 data.json (DADOS DE EXEMPLO)
const dataJson = {
    "events": [
        {
            "id": 1,
            "title": "Festival Cultural de São Paulo",
            "date": "2024-12-15",
            "desc": "Grande festival com música, dança e gastronomia típica no Parque Ibirapuera.",
            "address": "Parque Ibirapuera - Av. Pedro Álvares Cabral, s/n",
            "phone": "(11) 5574-5045"
        },
        {
            "id": 2, 
            "title": "Feira de Artesanato Paulista",
            "date": "2024-12-20",
            "desc": "Feira com artesanato local e comidas típicas no Centro Histórico.",
            "address": "Praça da Sé - Centro, São Paulo",
            "phone": "(11) 3105-2678"
        }
    ],
    "tourism": [
        {
            "id": 10,
            "title": "MASP - Museu de Arte de São Paulo",
            "desc": "Importante museu de arte com acervo diversificado na Avenida Paulista.",
            "address": "Av. Paulista, 1578 - Bela Vista, São Paulo - SP", 
            "phone": "(11) 3149-5959",
            "price": "R$ 50,00 (entrada)"
        },
        {
            "id": 11,
            "title": "Parque Ibirapuera",
            "desc": "Principal parque urbano de São Paulo com lagos, museus e áreas de lazer.",
            "address": "Av. Pedro Álvares Cabral - Vila Mariana, São Paulo - SP",
            "phone": "(11) 5574-5045", 
            "price": "Gratuito"
        }
    ],
    "hotels": [
        {
            "id": 20,
            "title": "Hotel Unique",
            "desc": "Hotel 5 estrelas com arquitetura única e vista panorâmica.",
            "address": "Av. Brigadeiro Luís Antônio, 4700 - Jardim Paulista",
            "phone": "(11) 3055-4710",
            "price": "R$ 800-1200/noite"
        },
        {
            "id": 21,
            "title": "Pousada dos Artistas", 
            "desc": "Pousada charmosa no centro histórico com café da manhã incluso.",
            "address": "Rua do Carmo, 100 - Centro, São Paulo",
            "phone": "(11) 3106-8999",
            "price": "R$ 200-350/noite"
        }
    ],
    "restaurants": [
        {
            "id": 30,
            "title": "Figueira Rubaiyat",
            "desc": "Restaurante sofisticado sob uma figueira centenária.",
            "address": "Rua Haddock Lobo, 1738 - Jardins, São Paulo",
            "phone": "(11) 3087-1399", 
            "price": "R$ 150-300/pessoa"
        },
        {
            "id": 31,
            "title": "Mercado Municipal",
            "desc": "Mercado histórico com variedade de alimentos e lanches típicos.",
            "address": "R. da Cantareira, 306 - Centro, São Paulo",
            "phone": "(11) 3313-3365",
            "price": "R$ 30-80/pessoa"
        }
    ]
};

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new TouristTerminal();
});

// Para salvar como data.json, use este conteúdo:
console.log('💡 Para criar o arquivo data.json, copie o objeto dataJson acima para um arquivo chamado data.json');