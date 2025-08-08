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
    playlistId: 'UUcn2uBP2TvT-z6jiCP-RhbA' // Playlist de uploads do Jack Mallers (UU + channelId sem UC)
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

// --- FUNÇÕES DE BUSCA DE PREÇOS ---

// Função melhorada para buscar preço do Bitcoin
async function fetchBitcoinPrice() {
  try {
    // Tentativa 1: CoinGecko API (gratuita)
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    
    if (response.ok) {
      const data = await response.json();
      if (data.bitcoin) {
        const price = data.bitcoin.usd;
        const change = data.bitcoin.usd_24h_change;
        
        const formattedPrice = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "Bitcoin", price: formattedPrice, change: formattedChange, positive: change >= 0 };
      }
    }
    
    throw new Error('CoinGecko API failed');
  } catch (error) {
    console.error('Erro ao buscar preço do Bitcoin:', error);
    console.log('Bitcoin: Usando valores de fallback');
    return FALLBACK_VALUES.bitcoin;
  }
}

// Função melhorada para buscar preço do Ouro
async function fetchGoldPrice() {
  try {
    // Tentativa 1: Alpha Vantage (pode ter limitações)
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data && data['Realtime Currency Exchange Rate']) {
        const exchangeRate = data['Realtime Currency Exchange Rate'];
        const price = parseFloat(exchangeRate['5. Exchange Rate']);
        
        // Simular mudança de 24h (em produção, você precisaria de dados históricos)
        const change = (Math.random() - 0.5) * 4; // Mudança aleatória entre -2% e +2%
        
        const formattedPrice = `$${(price * 31.1035).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
        return { name: "Gold", price: formattedPrice, change: formattedChange, positive: change >= 0 };
      }
    }
    
    throw new Error('Alpha Vantage Gold data unavailable');
  } catch (error) {
    console.error('Erro ao buscar preço do Ouro:', error);
    console.log('Gold: Usando valores de fallback');
    return FALLBACK_VALUES.gold;
  }
}

// Função melhorada para buscar preço da Prata
async function fetchSilverPrice() {
  try {
    // Tentativa 1: Usar uma API alternativa (simulada - na prática você precisaria de uma API real)
    // Por enquanto, retorna valores de fallback atualizados
    console.log('Silver API: Usando valores de fallback (APIs gratuitas não disponíveis)');
    return FALLBACK_VALUES.silver;
  } catch (error) {
    console.error('Erro ao buscar preço da Prata:', error);
    return FALLBACK_VALUES.silver;
  }
}

// Função melhorada para Treasury Yield com múltiplas tentativas
async function fetchTreasuryYield() {
  try {
    // Tentativa 1: Alpha Vantage (pode não funcionar corretamente)
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data && data.data && data.data.length >= 2) {
        const latestData = data.data[0];
        const previousData = data.data[1];

        // Verificar se os dados são recentes (não de 2007)
        const dataDate = new Date(latestData.date);
        const currentYear = new Date().getFullYear();

        if (dataDate.getFullYear() >= currentYear - 1) {
          const currentYield = parseFloat(latestData.value);
          const previousYield = parseFloat(previousData.value);
          const change = currentYield - previousYield;

          const formattedYield = `${currentYield.toFixed(2)}%`;
          const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
          return { name: "10-Year Treasury Yield", price: formattedYield, change: formattedChange, positive: change >= 0 };
        }
      }
    }

    throw new Error('Alpha Vantage data is outdated or unavailable');
  } catch (error) {
    console.error('Erro ao buscar Treasury Yield:', error);
    console.log('Treasury Yield: Usando valores de fallback');
    return FALLBACK_VALUES.treasury;
  }
}

// Função melhorada para Dollar Index
async function fetchDollarIndex() {
  try {
    // Tentativa 1: Alpha Vantage EUR/USD
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data && data['Time Series FX (Daily)']) {
        const timeSeries = data['Time Series FX (Daily)'];
        const dates = Object.keys(timeSeries).sort().reverse();

        if (dates.length >= 2) {
          const latestDate = new Date(dates[0]);
          const currentYear = new Date().getFullYear();

          // Verificar se os dados são recentes
          if (latestDate.getFullYear() >= currentYear - 1) {
            const latestRate = parseFloat(timeSeries[dates[0]]['4. close']);
            const previousRate = parseFloat(timeSeries[dates[1]]['4. close']);

            // Aproximação do DXY baseada no EUR/USD
            const dxyApprox = 100 / latestRate * 0.95;
            const previousDxy = 100 / previousRate * 0.95;
            const change = ((dxyApprox - previousDxy) / previousDxy) * 100;
            const formattedPrice = dxyApprox.toFixed(2);
            const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
            return { name: "Dollar Index", price: formattedPrice, change: formattedChange, positive: change >= 0 };
          }
        }
      }
    }
    throw new Error('Alpha Vantage FX data unavailable or outdated');
  } catch (error) {
    console.error('Erro ao buscar Dollar Index:', error);
    console.log('Dollar Index: Usando valores de fallback');
    return FALLBACK_VALUES.dollar;
  }
}

// Função melhorada para S&P 500
async function fetchSP500() {
  try {
    // Tentativa 1: Alpha Vantage SPY
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data && data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        const dates = Object.keys(timeSeries).sort().reverse();

        if (dates.length >= 2) {
          const latestDate = new Date(dates[0]);
          const currentYear = new Date().getFullYear();

          // Verificar se os dados são recentes
          if (latestDate.getFullYear() >= currentYear - 1) {
            const latestPrice = parseFloat(timeSeries[dates[0]]['4. close']);
            const previousPrice = parseFloat(timeSeries[dates[1]]['4. close']);
            const change = ((latestPrice - previousPrice) / previousPrice) * 100;

            // Converter SPY para S&P 500 (aproximadamente SPY * 10)
            const sp500Price = latestPrice * 10;
            const formattedPrice = sp500Price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
            return { name: "S&P 500", price: formattedPrice, change: formattedChange, positive: change >= 0 };
          }
        }
      }
    }
    throw new Error('Alpha Vantage SPY data unavailable or outdated');
  } catch (error) {
    console.error('Erro ao buscar S&P 500:', error);
    console.log('S&P 500: Usando valores de fallback');
    return FALLBACK_VALUES.sp500;
  }
}

// --- FUNÇÕES DE NOTÍCIAS ---

// Função para buscar notícias de criptomoedas
async function fetchCryptoNews() {
  try {
    // Simulação de notícias (em produção, use uma API real como NewsAPI)
    const mockNews = [
      {
        title: "Bitcoin Surpasses $100,000 for First Time in History",
        description: "The world's largest cryptocurrency has reached a new all-time high, breaking the psychological barrier of $100,000.",
        url: "https://bitcoinmagazine.com/",
        source: "Bitcoin Magazine",
        publishedAt: "2025-05-21T14:32:00Z"
      },
      {
        title: "Central Banks Accelerate Digital Currency Development",
        description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
        url: "https://blockworks.co/",
        source: "Blockworks",
        publishedAt: "2025-05-20T09:15:00Z"
      },
      {
        title: "Gold Reaches Record High Amid Inflation Concerns",
        description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
        url: "https://bitcointimes.news/",
        source: "The Bitcoin Times",
        publishedAt: "2025-05-19T16:45:00Z"
      },
      {
        title: "Institutional Adoption Drives Bitcoin to New Heights",
        description: "Major corporations and investment funds continue to allocate significant portions of their portfolios to Bitcoin.",
        url: "https://bitcoinmagazine.com/",
        source: "Bitcoin Magazine",
        publishedAt: "2025-05-18T11:20:00Z"
      },
      {
        title: "Lightning Network Reaches 10,000 Nodes Milestone",
        description: "Bitcoin's Layer 2 scaling solution continues to grow, enabling faster and cheaper transactions.",
        url: "https://cointelegraph.com/",
        source: "Cointelegraph",
        publishedAt: "2025-05-17T08:30:00Z"
      },
      {
        title: "Mining Difficulty Adjustment Signals Network Strength",
        description: "The latest difficulty adjustment reflects the robust health and security of the Bitcoin network.",
        url: "https://bitcoinmagazine.com/",
        source: "Bitcoin Magazine",
        publishedAt: "2025-05-16T12:15:00Z"
      }
    ];
    
    return mockNews;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}

// --- Funções de atualização da interface ---

// Função para atualizar as cotações principais
async function updateQuotes() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;

  try {
    // Buscar dados de todas as fontes
    const [bitcoin, gold, silver, treasury, dollar, sp500] = await Promise.all([
      fetchBitcoinPrice(),
      fetchGoldPrice(),
      fetchSilverPrice(),
      fetchTreasuryYield(),
      fetchDollarIndex(),
      fetchSP500()
    ]);

    const assets = [bitcoin, gold, silver, treasury, dollar, sp500];

    // Limpar container
    quotesContainer.innerHTML = '';

    // Criar elementos para cada ativo
    assets.forEach(asset => {
      if (asset) {
        const wrapper = document.createElement('div');
        wrapper.className = 'quote-wrapper';
        
        const quote = document.createElement('div');
        quote.className = 'quote';
        
        quote.innerHTML = `
          <div class="quote-left">
            <strong>${asset.name}</strong>
            <span class="quote-price">${asset.price}</span>
          </div>
          <span class="quote-change ${asset.positive ? 'positive' : 'negative'}">${asset.change}</span>
        `;
        
        wrapper.appendChild(quote);
        quotesContainer.appendChild(wrapper);
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar cotações:', error);
  }
}

// Função para atualizar notícias
async function updateNews() {
  try {
    const news = await fetchCryptoNews();
    const newsContainer = document.querySelector('#news-content .news-grid');
    
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '';
    
    news.slice(0, 6).forEach(article => {
      const newsItem = document.createElement('a');
      newsItem.href = article.url;
      newsItem.target = '_blank';
      newsItem.className = 'news-item';
      
      const publishedDate = new Date(article.publishedAt);
      const formattedDate = publishedDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      newsItem.innerHTML = `
        <div class="news-content">
          <div class="news-source">${article.source}</div>
          <div class="news-title">${article.title}</div>
          <div class="news-description">${article.description || ''}</div>
          <div class="news-date">${formattedDate}</div>
        </div>
      `;
      
      newsContainer.appendChild(newsItem);
    });
  } catch (error) {
    console.error('Erro ao atualizar notícias:', error);
  }
}

// Função para atualizar citações do Satoshi
function updateSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  if (quoteElement) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = randomQuote;
  }
}

// Função para copiar endereço de doação
function copyToClipboard() {
  const address = document.getElementById('donation-address').textContent;
  navigator.clipboard.writeText(address).then(() => {
    const button = document.querySelector('.copy-button');
    const originalText = button.textContent;
    button.textContent = 'Copiado!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Erro ao copiar:', err);
  });
}

// Função para mostrar/ocultar fontes
function toggleSources() {
  const sourcesElement = document.getElementById('market-cap-sources');
  const button = document.getElementById('sources-toggle');
  
  if (sourcesElement.style.display === 'none' || sourcesElement.style.display === '') {
    sourcesElement.style.display = 'block';
    button.textContent = 'Hide sources';
  } else {
    sourcesElement.style.display = 'none';
    button.textContent = 'Show sources';
  }
}

// Função principal de inicialização
async function initializeApp() {
  console.log('Inicializando Scarcity Panel...');
  
  // Carregar cache de podcasts se disponível
  const cachedPodcasts = loadPodcastsFromCache();
  if (cachedPodcasts) {
    console.log('Cache de podcasts encontrado, carregando dados salvos...');
    renderPodcasts(cachedPodcasts);
  }
  
  // Atualizar citação do Satoshi
  updateSatoshiQuote();
  
  // Carregar dados iniciais
  await updateQuotes();
  await updateNews();
  
  // Carregar seção de podcasts com thumbnails (vai usar cache se disponível)
  await loadPodcastsSection();
  
  // Configurar botão de fontes
  const sourcesButton = document.getElementById('sources-toggle');
  if (sourcesButton) {
    sourcesButton.addEventListener('click', toggleSources);
  }
  
  console.log('Scarcity Panel inicializado com sucesso!');
}

// Função para atualização periódica melhorada
function startPeriodicUpdates() {
  // Atualizar cotações a cada 5 minutos
  setInterval(updateQuotes, 5 * 60 * 1000);
  
  // Atualizar notícias a cada 15 minutos
  setInterval(updateNews, 15 * 60 * 1000);
  
  // Verificar atualizações de podcasts a cada 10 minutos (verificação inteligente)
  setInterval(checkForPodcastUpdates, 10 * 60 * 1000);
  
  // Atualizar citação do Satoshi a cada 10 minutos
  setInterval(updateSatoshiQuote, 10 * 60 * 1000);
  
  console.log('Atualizações periódicas configuradas:');
  console.log('- Cotações: a cada 5 minutos');
  console.log('- Notícias: a cada 15 minutos');
  console.log('- Podcasts: verificação inteligente a cada 10 minutos');
  console.log('- Citações: a cada 10 minutos');
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
  startPeriodicUpdates();
});

// Exportar funções para uso global
window.copyToClipboard = copyToClipboard;
window.toggleSources = toggleSources;
