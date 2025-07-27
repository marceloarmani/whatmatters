// Configuração da API Alpha Vantage
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// CONFIGURAÇÃO DAS APIS - CHAVE DO YOUTUBE ADICIONADA
const YOUTUBE_API_KEY = "AIzaSyD4Yvo1yTwoXH5bhC-Gp0g60xSpYIthP7c"; // Chave fornecida pelo usuário
const NEWS_API_KEY = ""; // Adicione sua chave da NewsAPI ou similar

// Valores de fallback atualizados (devem ser atualizados manualmente periodicamente)
const FALLBACK_VALUES = {
  bitcoin: { name: "Bitcoin", price: "$104,586.00", change: "-0.3%", positive: false },
  gold: { name: "Gold", price: "$3,433.47", change: "+1.60%", positive: true },
  silver: { name: "Silver", price: "$36.32", change: "+0.25%", positive: true },
  treasury: { name: "10-Year Treasury Yield", price: "4.46%", change: "+0.02%", positive: true },
  dollar: { name: "Dollar Index", price: "106.50", change: "+0.1%", positive: true },
  sp500: { name: "S&P 500", price: "5,950.00", change: "+0.3%", positive: true }
};

// Configuração dos canais de podcast do YouTube
const PODCAST_CHANNELS = [
  {
    title: 'Coin Stories Podcast',
    host: 'Natalie Brunell',
    description: 'Investing journalist and Bitcoin educator exploring the intersection of money, technology, and freedom through compelling stories and expert interviews.',
    youtubeUrl: 'https://www.youtube.com/@nataliebrunell',
    channelId: 'UCru3nlhzHrbgK21x0MdB_eg', // ID do canal da Natalie Brunell
    playlistId: 'UUru3nlhzHrbgK21x0MdB_eg' // Playlist de uploads da Natalie Brunell
  },
  {
    title: 'The Jack Mallers Show',
    host: 'Jack Mallers',
    description: 'CEO of Strike covering the biggest stories in Bitcoin, macroeconomics, financial markets, and the future of money with live weekly episodes.',
    youtubeUrl: 'https://www.youtube.com/@jackmallers9929',
    channelId: 'UCcn2uBP2TvT-z6jiCP-RhbA', // ID correto do canal do Jack Mallers
    playlistId: 'UUcn2uBP2TvT-z6jiCP-RhbA' // Playlist de uploads do Jack Mallers
  },
  {
    title: 'The Bitcoin Standard Podcast',
    host: 'Saifedean Ammous',
    description: 'Author of "The Bitcoin Standard" exploring Austrian economics, sound money principles, and Bitcoin\'s role in the future of monetary systems.',
    youtubeUrl: 'https://www.youtube.com/@saifedean',
    channelId: 'UCPsCJ1j0G45FnRGqJhCHLiA', // ID do canal do Saifedean Ammous
    playlistId: 'UUPsCJ1j0G45FnRGqJhCHLiA' // Playlist de uploads do Saifedean Ammous
  }
];

const quotes = [
  "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.",
  "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.",
  "The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "Banks must be trusted to hold our money and transfer it electronically, but they lend it out in waves of credit bubbles with barely a fraction in reserve.",
  "With e-currency based on cryptographic proof, without the need to trust a third party middleman, money can be secure and transactions effortless."
];

// --- FUNÇÕES PARA YOUTUBE API ---

// Função para buscar o último vídeo de um canal do YouTube
async function fetchLatestYouTubeVideo(channelId, playlistId) {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return null;
  }

  try {
    // Buscar o último vídeo da playlist de uploads do canal
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=1&order=date&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0].snippet;
      return {
        title: video.title,
        thumbnail: video.thumbnails.medium?.url || video.thumbnails.default?.url,
        publishedAt: video.publishedAt,
        videoId: video.resourceId.videoId,
        description: video.description
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar vídeo do YouTube:', error);
    return null;
  }
}

// Função para buscar estatísticas de um vídeo (views, likes, etc.)
async function fetchVideoStats(videoId) {
  if (!YOUTUBE_API_KEY || !videoId) {
    return null;
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].statistics;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar estatísticas do vídeo:', error);
    return null;
  }
}

// Função para formatar número de visualizações
function formatViewCount(viewCount) {
  const num = parseInt(viewCount);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Função para formatar data relativa
function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 dia atrás';
  } else if (diffDays < 7) {
    return `${diffDays} dias atrás`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 semana atrás' : `${weeks} semanas atrás`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 mês atrás' : `${months} meses atrás`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 ano atrás' : `${years} anos atrás`;
  }
}

// --- SISTEMA DE ATUALIZAÇÃO AUTOMÁTICA MELHORADO ---

// Cache local para evitar requisições desnecessárias
let podcastsCache = {
  data: null,
  lastUpdate: null,
  updateInterval: 30 * 60 * 1000 // 30 minutos
};

// Função para verificar se precisa atualizar os podcasts
function shouldUpdatePodcasts() {
  if (!podcastsCache.lastUpdate) return true;
  
  const now = Date.now();
  const timeSinceLastUpdate = now - podcastsCache.lastUpdate;
  
  return timeSinceLastUpdate >= podcastsCache.updateInterval;
}

// Função para salvar dados no cache local
function savePodcastsToCache(data) {
  podcastsCache.data = data;
  podcastsCache.lastUpdate = Date.now();
  
  // Salvar no localStorage para persistência entre sessões
  try {
    localStorage.setItem('podcastsCache', JSON.stringify(podcastsCache));
  } catch (error) {
    console.warn('Não foi possível salvar cache no localStorage:', error);
  }
}

// Função para carregar dados do cache local
function loadPodcastsFromCache() {
  try {
    const cached = localStorage.getItem('podcastsCache');
    if (cached) {
      const parsedCache = JSON.parse(cached);
      
      // Verificar se o cache não está muito antigo (máximo 2 horas)
      const maxCacheAge = 2 * 60 * 60 * 1000; // 2 horas
      const now = Date.now();
      
      if (parsedCache.lastUpdate && (now - parsedCache.lastUpdate) < maxCacheAge) {
        podcastsCache = parsedCache;
        return parsedCache.data;
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar cache do localStorage:', error);
  }
  
  return null;
}

// Função melhorada para carregar a seção de podcasts com cache
async function loadPodcastsSection() {
  const podcastsContainer = document.getElementById('bitcoin-podcasts');
  
  if (!podcastsContainer) {
    console.warn('Seção de podcasts não encontrada');
    return;
  }

  // Criar o HTML da seção se não existir
  if (!podcastsContainer.querySelector('.podcasts-grid')) {
    podcastsContainer.innerHTML = `
      <h2 class="section-header">Bitcoin podcasts</h2>
      <div class="podcasts-grid" id="podcasts-grid">
        <!-- Podcasts serão carregados aqui -->
      </div>
    `;
  }

  const podcastsGrid = document.getElementById('podcasts-grid');
  
  // Verificar se precisa atualizar ou se pode usar cache
  if (!shouldUpdatePodcasts() && podcastsCache.data) {
    console.log('Usando dados em cache para podcasts');
    renderPodcasts(podcastsCache.data);
    return;
  }

  // Mostrar indicador de carregamento
  podcastsGrid.innerHTML = `
    <div style="text-align: center; padding: 2rem; color: #666; grid-column: 1 / -1;">
      <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #f7931a; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin-right: 0.5rem;"></div>
      Atualizando podcasts...
    </div>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  const podcastsData = [];

  // Carregar cada podcast
  for (const podcast of PODCAST_CHANNELS) {
    try {
      console.log(`Buscando dados para ${podcast.title}...`);
      
      // Buscar o último vídeo do canal
      const latestVideo = await fetchLatestYouTubeVideo(podcast.channelId, podcast.playlistId);
      
      // Buscar estatísticas do vídeo se disponível
      let videoStats = null;
      if (latestVideo && latestVideo.videoId) {
        videoStats = await fetchVideoStats(latestVideo.videoId);
      }

      podcastsData.push({
        ...podcast,
        latestVideo,
        videoStats
      });
      
      // Pequeno delay entre as requisições para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Erro ao carregar podcast ${podcast.title}:`, error);
      
      // Adicionar dados de fallback em caso de erro
      podcastsData.push({
        ...podcast,
        latestVideo: null,
        videoStats: null,
        error: true
      });
    }
  }

  // Salvar no cache e renderizar
  savePodcastsToCache(podcastsData);
  renderPodcasts(podcastsData);
  
  console.log('Podcasts atualizados com sucesso!');
}

// Função para renderizar os podcasts na interface
function renderPodcasts(podcastsData) {
  const podcastsGrid = document.getElementById('podcasts-grid');
  
  if (!podcastsGrid) return;
  
  // Limpar conteúdo existente
  podcastsGrid.innerHTML = '';

  podcastsData.forEach(podcast => {
    const podcastElement = document.createElement('div');
    podcastElement.className = 'podcast-item';
    
    // Determinar a thumbnail a ser usada
    let thumbnailHtml = '';
    if (podcast.latestVideo && podcast.latestVideo.thumbnail) {
      thumbnailHtml = `<img src="${podcast.latestVideo.thumbnail}" alt="Thumbnail do último vídeo de ${podcast.title}" loading="lazy">`;
    } else {
      // Placeholder se não houver thumbnail
      thumbnailHtml = `
        <div class="podcast-thumbnail-placeholder">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          <span>${podcast.error ? 'Erro ao carregar' : 'Último vídeo'}</span>
        </div>
      `;
    }

    // Informações do último vídeo
    let latestVideoHtml = '';
    if (podcast.latestVideo && !podcast.error) {
      const viewsText = podcast.videoStats && podcast.videoStats.viewCount ? 
        `${formatViewCount(podcast.videoStats.viewCount)} visualizações` : 
        'Visualizações não disponíveis';
      
      latestVideoHtml = `
        <div class="podcast-latest-video">
          <div class="podcast-video-title">${podcast.latestVideo.title}</div>
          <div class="podcast-video-date">${formatRelativeDate(podcast.latestVideo.publishedAt)}</div>
          <div class="podcast-video-views">${viewsText}</div>
        </div>
      `;
    } else if (podcast.error) {
      latestVideoHtml = `
        <div class="podcast-latest-video" style="background: rgba(244, 67, 54, 0.1); border-left-color: #f44336;">
          <div class="podcast-video-title">Erro ao carregar último vídeo</div>
          <div class="podcast-video-date">Tente novamente mais tarde</div>
        </div>
      `;
    }

    podcastElement.innerHTML = `
      <div class="podcast-thumbnail">
        ${thumbnailHtml}
      </div>
      <div class="podcast-content">
        <div class="podcast-header">
          <div class="podcast-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <div class="podcast-info">
            <h3 class="podcast-title">${podcast.title}</h3>
            <p class="podcast-host">${podcast.host}</p>
          </div>
        </div>

        ${latestVideoHtml}
        <a href="${podcast.youtubeUrl}" target="_blank" class="podcast-link">
          Assistir no YouTube
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </a>
      </div>
    `;

    podcastsGrid.appendChild(podcastElement);
  });
}

// Função para verificar atualizações em segundo plano
async function checkForPodcastUpdates() {
  if (!shouldUpdatePodcasts()) {
    return;
  }
  
  console.log('Verificando atualizações de podcasts em segundo plano...');
  
  try {
    // Verificar apenas os IDs dos últimos vídeos para detectar mudanças
    const currentVideoIds = [];
    
    for (const podcast of PODCAST_CHANNELS) {
      try {
        const latestVideo = await fetchLatestYouTubeVideo(podcast.channelId, podcast.playlistId);
        if (latestVideo && latestVideo.videoId) {
          currentVideoIds.push(latestVideo.videoId);
        }
        
        // Delay entre requisições
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Erro ao verificar atualizações para ${podcast.title}:`, error);
      }
    }
    
    // Comparar com cache para detectar mudanças
    if (podcastsCache.data) {
      const cachedVideoIds = podcastsCache.data
        .filter(p => p.latestVideo && p.latestVideo.videoId)
        .map(p => p.latestVideo.videoId);
      
      const hasChanges = currentVideoIds.some(id => !cachedVideoIds.includes(id)) ||
                        cachedVideoIds.some(id => !currentVideoIds.includes(id));
      
      if (hasChanges) {
        console.log('Novos vídeos detectados! Atualizando seção de podcasts...');
        await loadPodcastsSection();
        
        // Notificar usuário sobre atualização (opcional)
        showUpdateNotification();
      } else {
        console.log('Nenhuma atualização de podcast detectada.');
        // Atualizar timestamp do cache mesmo sem mudanças
        podcastsCache.lastUpdate = Date.now();
        savePodcastsToCache(podcastsCache.data);
      }
    }
    
  } catch (error) {
    console.error('Erro ao verificar atualizações de podcasts:', error);
  }
}

// Função para mostrar notificação de atualização (opcional)
function showUpdateNotification() {
  // Criar notificação discreta
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f7931a;
    color: white;
    padding: 0.8rem 1.2rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  notification.textContent = 'Podcasts atualizados!';
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// --- FUNÇÕES PARA ALPHA VANTAGE API ---

// Função para buscar dados do Bitcoin
async function fetchBitcoinData() {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error('API limit reached or error');
    }
    
    const timeSeries = data['Time Series (Digital Currency Daily)'];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];
    
    const price = parseFloat(latestData['4a. close (USD)']);
    const previousPrice = parseFloat(Object.values(timeSeries)[1]['4a. close (USD)']);
    const change = ((price - previousPrice) / previousPrice * 100).toFixed(2);
    
    return {
      name: "Bitcoin",
      price: `$${price.toLocaleString()}`,
      change: `${change >= 0 ? '+' : ''}${change}%`,
      positive: change >= 0
    };
  } catch (error) {
    console.error('Erro ao buscar dados do Bitcoin:', error);
    return FALLBACK_VALUES.bitcoin;
  }
}

// Função para buscar dados do ouro
async function fetchGoldData() {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=GLD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error('API limit reached or error');
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];
    
    const price = parseFloat(latestData['4. close']);
    const previousPrice = parseFloat(Object.values(timeSeries)[1]['4. close']);
    const change = ((price - previousPrice) / previousPrice * 100).toFixed(2);
    
    return {
      name: "Gold",
      price: `$${(price * 18.5).toFixed(2)}`, // Aproximação para preço por onça
      change: `${change >= 0 ? '+' : ''}${change}%`,
      positive: change >= 0
    };
  } catch (error) {
    console.error('Erro ao buscar dados do ouro:', error);
    return FALLBACK_VALUES.gold;
  }
}

// Função para buscar dados da prata
async function fetchSilverData() {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=SLV&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error('API limit reached or error');
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];
    
    const price = parseFloat(latestData['4. close']);
    const previousPrice = parseFloat(Object.values(timeSeries)[1]['4. close']);
    const change = ((price - previousPrice) / previousPrice * 100).toFixed(2);
    
    return {
      name: "Silver",
      price: `$${(price * 1.6).toFixed(2)}`, // Aproximação para preço por onça
      change: `${change >= 0 ? '+' : ''}${change}%`,
      positive: change >= 0
    };
  } catch (error) {
    console.error('Erro ao buscar dados da prata:', error);
    return FALLBACK_VALUES.silver;
  }
}

// Função para buscar dados do Treasury
async function fetchTreasuryData() {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error('API limit reached or error');
    }
    
    const timeSeries = data['data'];
    const latestData = timeSeries[0];
    const previousData = timeSeries[1];
    
    const yield_current = parseFloat(latestData.value);
    const yield_previous = parseFloat(previousData.value);
    const change = (yield_current - yield_previous).toFixed(2);
    
    return {
      name: "10-Year Treasury Yield",
      price: `${yield_current.toFixed(2)}%`,
      change: `${change >= 0 ? '+' : ''}${change}%`,
      positive: change >= 0
    };
  } catch (error) {
    console.error('Erro ao buscar dados do Treasury:', error);
    return FALLBACK_VALUES.treasury;
  }
}

// Função para buscar dados do Dollar Index
async function fetchDollarIndexData() {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=FX_DAILY&from_symbol=USD&to_symbol=EUR&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error('API limit reached or error');
    }
    
    const timeSeries = data['Time Series FX (Daily)'];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];
    
    const rate = parseFloat(latestData['4. close']);
    const previousRate = parseFloat(Object.values(timeSeries)[1]['4. close']);
    const change = ((rate - previousRate) / previousRate * 100).toFixed(2);
    
    // Converter para índice aproximado (inverso da taxa EUR/USD * 100)
    const dollarIndex = (1 / rate * 100).toFixed(2);
    
    return {
      name: "Dollar Index",
      price: dollarIndex,
      change: `${change >= 0 ? '-' : '+'}${Math.abs(change)}%`, // Inverso porque é USD/EUR
      positive: change < 0 // Inverso porque queremos que USD forte seja positivo
    };
  } catch (error) {
    console.error('Erro ao buscar dados do Dollar Index:', error);
    return FALLBACK_VALUES.dollar;
  }
}

// Função para buscar dados do S&P 500
async function fetchSP500Data() {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message'] || data['Note']) {
      throw new Error('API limit reached or error');
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];
    
    const price = parseFloat(latestData['4. close']);
    const previousPrice = parseFloat(Object.values(timeSeries)[1]['4. close']);
    const change = ((price - previousPrice) / previousPrice * 100).toFixed(2);
    
    return {
      name: "S&P 500",
      price: `${(price * 10).toFixed(0)}`, // Aproximação para o índice real
      change: `${change >= 0 ? '+' : ''}${change}%`,
      positive: change >= 0
    };
  } catch (error) {
    console.error('Erro ao buscar dados do S&P 500:', error);
    return FALLBACK_VALUES.sp500;
  }
}

// Função principal para carregar todos os dados
async function loadAllData() {
  console.log('Carregando dados dos mercados...');
  
  // Carregar dados em paralelo
  const [bitcoin, gold, silver, treasury, dollar, sp500] = await Promise.all([
    fetchBitcoinData(),
    fetchGoldData(),
    fetchSilverData(),
    fetchTreasuryData(),
    fetchDollarIndexData(),
    fetchSP500Data()
  ]);
  
  // Atualizar a interface
  updateQuotesDisplay([bitcoin, gold, silver, treasury, dollar, sp500]);
  
  // Carregar seção de podcasts
  await loadPodcastsSection();
  
  console.log('Todos os dados carregados!');
}

// Função para atualizar a exibição das cotações
function updateQuotesDisplay(quotes) {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  quotesContainer.innerHTML = '';
  
  quotes.forEach(quote => {
    const quoteWrapper = document.createElement('div');
    quoteWrapper.className = 'quote-wrapper';
    
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    
    quoteElement.innerHTML = `
      <div class="quote-left">
        <strong>${quote.name}</strong>
        <span class="quote-price">${quote.price}</span>
        <span class="quote-change ${quote.positive ? 'positive' : 'negative'}">${quote.change}</span>
      </div>
    `;
    
    quoteWrapper.appendChild(quoteElement);
    quotesContainer.appendChild(quoteWrapper);
  });
}

// Função para mostrar/ocultar fontes
function toggleSources() {
  const sourcesDiv = document.getElementById('market-cap-sources');
  const button = document.getElementById('sources-toggle');
  
  if (sourcesDiv.style.display === 'none' || sourcesDiv.style.display === '') {
    sourcesDiv.style.display = 'block';
    button.textContent = 'Hide sources';
  } else {
    sourcesDiv.style.display = 'none';
    button.textContent = 'Show sources';
  }
}

// Função para rotacionar citações do Satoshi
function rotateSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  if (!quoteElement) return;
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteElement.textContent = `"${randomQuote}"`;
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  console.log('Página carregada, iniciando aplicação...');
  
  // Carregar dados do cache primeiro
  const cachedPodcasts = loadPodcastsFromCache();
  if (cachedPodcasts) {
    console.log('Carregando podcasts do cache...');
    renderPodcasts(cachedPodcasts);
  }
  
  // Carregar todos os dados
  loadAllData();
  
  // Configurar botão de fontes
  const sourcesButton = document.getElementById('sources-toggle');
  if (sourcesButton) {
    sourcesButton.addEventListener('click', toggleSources);
  }
  
  // Rotacionar citação do Satoshi a cada 30 segundos
  rotateSatoshiQuote();
  setInterval(rotateSatoshiQuote, 30000);
  
  // Verificar atualizações de podcasts a cada 5 minutos
  setInterval(checkForPodcastUpdates, 5 * 60 * 1000);
  
  console.log('Aplicação inicializada com sucesso!');
});

// Atualizar dados a cada 5 minutos
setInterval(loadAllData, 5 * 60 * 1000);

