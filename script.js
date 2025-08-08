// Configuração das APIs
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
    description: 'Author of "The Bitcoin Standard" exploring Austrian economics, sound money principles, and Bitcoin\\'s role in the future of monetary systems.',
    youtubeUrl: 'https://www.youtube.com/@saifedean',
    channelId: 'UCPsCJ1j0G45FnRGqJhCHLiA', // ID do canal do Saifedean Ammous
    playlistId: 'UUPsCJ1j0G45FnRGqJhCHLiA' // Playlist de uploads do Saifedean Ammous
  }
];

// Cache para evitar requisições desnecessárias
let dataCache = {
  events: { data: null, lastUpdate: null, updateInterval: 60 * 60 * 1000 }, // 1 hora
  news: { data: null, lastUpdate: null, updateInterval: 30 * 60 * 1000 }, // 30 minutos
  scarcity: { data: null, lastUpdate: null, updateInterval: 60 * 60 * 1000 }, // 1 hora
  podcasts: { data: null, lastUpdate: null, updateInterval: 30 * 60 * 1000 } // 30 minutos
};

// Função para verificar se precisa atualizar dados
function shouldUpdate(cacheKey) {
  const cache = dataCache[cacheKey];
  if (!cache.lastUpdate) return true;
  
  const now = Date.now();
  const timeSinceLastUpdate = now - cache.lastUpdate;
  
  return timeSinceLastUpdate >= cache.updateInterval;
}

// Função para salvar dados no cache
function saveToCache(cacheKey, data) {
  dataCache[cacheKey].data = data;
  dataCache[cacheKey].lastUpdate = Date.now();
  
  try {
    localStorage.setItem(`${cacheKey}Cache`, JSON.stringify(dataCache[cacheKey]));
  } catch (error) {
    console.warn(`Não foi possível salvar cache ${cacheKey} no localStorage:`, error);
  }
}

// Função para carregar dados do cache
function loadFromCache(cacheKey) {
  try {
    const cached = localStorage.getItem(`${cacheKey}Cache`);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      
      // Verificar se o cache não está muito antigo (máximo 4 horas)
      const maxCacheAge = 4 * 60 * 60 * 1000; // 4 horas
      const now = Date.now();
      
      if (parsedCache.lastUpdate && (now - parsedCache.lastUpdate) < maxCacheAge) {
        dataCache[cacheKey] = parsedCache;
        return parsedCache.data;
      }
    }
  } catch (error) {
    console.warn(`Erro ao carregar cache ${cacheKey} do localStorage:`, error);
  }
  
  return null;
}

// Função para formatar números no padrão americano
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Função para formatar datas
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Função para calcular dias restantes até o próximo halving
function calculateDaysToHalving() {
  // Próximo halving estimado para abril de 2028
  const nextHalving = new Date('2028-04-01');
  const now = new Date();
  const diffTime = nextHalving - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Função para buscar dados de Bitcoin em tempo real
async function fetchBitcoinData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true');
    const data = await response.json();
    
    if (data.bitcoin) {
      return {
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        marketCap: data.bitcoin.usd_market_cap
      };
    }
  } catch (error) {
    console.warn('Erro ao buscar dados do Bitcoin:', error);
  }
  return null;
}

// Função para buscar dados de escassez do Bitcoin
async function fetchScarcityMetrics() {
  if (!shouldUpdate('scarcity') && dataCache.scarcity.data) {
    console.log('Usando dados em cache para scarcity metrics');
    return dataCache.scarcity.data;
  }

  try {
    // Buscar dados do Bitcoin
    const bitcoinData = await fetchBitcoinData();
    
    // Calcular métricas de escassez
    const totalSupply = 21000000;
    const currentSupply = 19750000; // Aproximação atual
    const annualInflation = 1.74; // Taxa atual aproximada
    const stockToFlow = Math.round(100 / annualInflation);
    const daysToHalving = calculateDaysToHalving();
    const supplyPercentage = ((currentSupply / totalSupply) * 100).toFixed(2);
    const remaining = totalSupply - currentSupply;

    const scarcityData = {
      stockToFlow: stockToFlow,
      annualInflation: annualInflation,
      bitcoinsMined: formatNumber(currentSupply),
      supplyPercentage: supplyPercentage,
      remaining: formatNumber(remaining),
      daysToHalving: daysToHalving,
      nextHalving: "April 2028"
    };

    saveToCache('scarcity', scarcityData);
    return scarcityData;
    
  } catch (error) {
    console.error('Erro ao buscar métricas de escassez:', error);
    
    // Retornar dados de fallback
    return {
      stockToFlow: 56,
      annualInflation: 1.74,
      bitcoinsMined: "19,750,000",
      supplyPercentage: "93.81",
      remaining: "1,250,000",
      daysToHalving: calculateDaysToHalving(),
      nextHalving: "April 2028"
    };
  }
}

// Função para buscar eventos econômicos
async function fetchUpcomingEvents() {
  if (!shouldUpdate('events') && dataCache.events.data) {
    console.log('Usando dados em cache para events');
    return dataCache.events.data;
  }

  try {
    // Simular busca de eventos (em produção, usar API real)
    const events = [
      {
        date: "August 17-18, 2025",
        title: "FOMC Meeting",
        description: "Federal Reserve interest rate decision",
        impact: "high"
      },
      {
        date: "August 03, 2025",
        title: "US Employment Report",
        description: "US labor market data",
        impact: "medium"
      },
      {
        date: "August 15, 2025",
        title: "Bitcoin ETF Review",
        description: "SEC quarterly review of Bitcoin ETF applications",
        impact: "medium"
      },
      {
        date: "August 18, 2025",
        title: "Fed Rate Decision",
        description: "Federal Reserve monetary policy meeting",
        impact: "high"
      }
    ];

    saveToCache('events', events);
    return events;
    
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    
    // Retornar dados de fallback
    return [
      {
        date: "August 17-18, 2025",
        title: "FOMC Meeting",
        description: "Federal Reserve interest rate decision",
        impact: "high"
      },
      {
        date: "August 03, 2025",
        title: "US Employment Report",
        description: "US labor market data",
        impact: "medium"
      },
      {
        date: "August 15, 2025",
        title: "Bitcoin ETF Review",
        description: "SEC quarterly review of Bitcoin ETF applications",
        impact: "medium"
      },
      {
        date: "August 18, 2025",
        title: "Fed Rate Decision",
        description: "Federal Reserve monetary policy meeting",
        impact: "high"
      }
    ];
  }
}

// Função para buscar notícias
async function fetchLatestNews() {
  if (!shouldUpdate('news') && dataCache.news.data) {
    console.log('Usando dados em cache para news');
    return dataCache.news.data;
  }

  try {
    // Simular busca de notícias (em produção, usar API real de notícias Bitcoin)
    const news = [
      {
        source: "Bitcoin Magazine",
        title: "Bitcoin Surpasses $110,000 Reaching New All-Time High",
        description: "The world's largest cryptocurrency continues its bull run with institutional adoption driving demand.",
        date: "August 8, 2025 14:32 UTC",
        url: "https://bitcoinmagazine.com/"
      },
      {
        source: "Blockworks",
        title: "Central Banks Accelerate Digital Currency Development",
        description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
        date: "August 7, 2025 09:15 UTC",
        url: "https://blockworks.co/"
      },
      {
        source: "The Bitcoin Times",
        title: "Gold Reaches Record High Amid Inflation Concerns",
        description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
        date: "August 6, 2025 16:45 UTC",
        url: "https://bitcointimes.news/"
      },
      {
        source: "Bitcoin Magazine",
        title: "Institutional Adoption Drives Bitcoin to New Heights",
        description: "Major corporations and investment funds continue to allocate significant portions of their portfolios to Bitcoin.",
        date: "August 5, 2025 11:20 UTC",
        url: "https://bitcoinmagazine.com/"
      },
      {
        source: "Cointelegraph",
        title: "Lightning Network Reaches 15,000 Nodes Milestone",
        description: "Bitcoin's Layer 2 scaling solution continues to grow, enabling faster and cheaper transactions.",
        date: "August 4, 2025 08:30 UTC",
        url: "https://cointelegraph.com/"
      },
      {
        source: "Bitcoin Magazine",
        title: "Mining Difficulty Reaches All-Time High",
        description: "Bitcoin network security strengthens as mining difficulty adjusts to record levels.",
        date: "August 3, 2025 13:45 UTC",
        url: "https://bitcoinmagazine.com/"
      }
    ];

    saveToCache('news', news);
    return news;
    
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    
    // Retornar dados de fallback
    return [
      {
        source: "Bitcoin Magazine",
        title: "Bitcoin Surpasses $110,000 Reaching New All-Time High",
        description: "The world's largest cryptocurrency continues its bull run with institutional adoption driving demand.",
        date: "August 8, 2025 14:32 UTC",
        url: "https://bitcoinmagazine.com/"
      },
      {
        source: "Blockworks",
        title: "Central Banks Accelerate Digital Currency Development",
        description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
        date: "August 7, 2025 09:15 UTC",
        url: "https://blockworks.co/"
      },
      {
        source: "The Bitcoin Times",
        title: "Gold Reaches Record High Amid Inflation Concerns",
        description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
        date: "August 6, 2025 16:45 UTC",
        url: "https://bitcointimes.news/"
      },
      {
        source: "Bitcoin Magazine",
        title: "Institutional Adoption Drives Bitcoin to New Heights",
        description: "Major corporations and investment funds continue to allocate significant portions of their portfolios to Bitcoin.",
        date: "August 5, 2025 11:20 UTC",
        url: "https://bitcoinmagazine.com/"
      },
      {
        source: "Cointelegraph",
        title: "Lightning Network Reaches 15,000 Nodes Milestone",
        description: "Bitcoin's Layer 2 scaling solution continues to grow, enabling faster and cheaper transactions.",
        date: "August 4, 2025 08:30 UTC",
        url: "https://cointelegraph.com/"
      },
      {
        source: "Bitcoin Magazine",
        title: "Mining Difficulty Reaches All-Time High",
        description: "Bitcoin network security strengthens as mining difficulty adjusts to record levels.",
        date: "August 3, 2025 13:45 UTC",
        url: "https://bitcoinmagazine.com/"
      }
    ];
  }
}

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
  if (!shouldUpdate('podcasts') && dataCache.podcasts.data) {
    console.log('Usando dados em cache para podcasts');
    renderPodcasts(dataCache.podcasts.data);
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
  saveToCache('podcasts', podcastsData);
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
  if (!shouldUpdate('podcasts')) {
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
    if (dataCache.podcasts.data) {
      const cachedVideoIds = dataCache.podcasts.data
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
        dataCache.podcasts.lastUpdate = Date.now();
        saveToCache('podcasts', dataCache.podcasts.data);
      }
    }
    
  } catch (error) {
    console.error('Erro ao verificar atualizações de podcasts:', error);
  }
}

// Função para renderizar eventos
function renderEvents(events) {
  const eventsGrid = document.getElementById('events-grid');
  if (!eventsGrid) return;
  
  eventsGrid.innerHTML = '';
  
  events.slice(0, 4).forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.className = `event-item ${event.impact}`;
    
    eventElement.innerHTML = `
      <div class="event-date">
        <span>${event.date}</span>
        <div class="event-impact">
          <div class="impact-dot"></div>
          <div class="impact-dot"></div>
          <div class="impact-dot"></div>
        </div>
      </div>
      <div class="event-title">${event.title}</div>
      <div class="event-description">${event.description}</div>
    `;
    
    eventsGrid.appendChild(eventElement);
  });
}

// Função para renderizar notícias
function renderNews(news) {
  const newsGrid = document.getElementById('news-grid');
  if (!newsGrid) return;
  
  newsGrid.innerHTML = '';
  
  news.slice(0, 6).forEach(article => {
    const newsElement = document.createElement('a');
    newsElement.href = article.url;
    newsElement.target = '_blank';
    newsElement.className = 'news-item';
    
    newsElement.innerHTML = `
      <div class="news-content">
        <div class="news-source">${article.source}</div>
        <div class="news-title">${article.title}</div>
        <div class="news-description">${article.description}</div>
        <div class="news-date">${article.date}</div>
      </div>
    `;
    
    newsGrid.appendChild(newsElement);
  });
}

// Função para renderizar métricas de escassez
function renderScarcityMetrics(data) {
  const scarcityGrid = document.getElementById('scarcity-metrics-grid');
  if (!scarcityGrid) return;
  
  scarcityGrid.innerHTML = `
    <div class="scarcity-metric">
      <div class="scarcity-metric-title">Stock-to-Flow</div>
      <div class="scarcity-metric-value">${data.stockToFlow}</div>
      <div class="scarcity-metric-description">Ratio between existing stock and annual production</div>
      <div class="scarcity-comparison">
        <div class="scarcity-comparison-item bitcoin">Bitcoin: ${data.stockToFlow}</div>
        <div class="scarcity-comparison-item gold">Gold: 62</div>
        <div class="scarcity-comparison-item silver">Silver: 22</div>
      </div>
    </div>
    <div class="scarcity-metric">
      <div class="scarcity-metric-title">Annual Inflation</div>
      <div class="scarcity-metric-value">${data.annualInflation}%</div>
      <div class="scarcity-metric-description">Annual issuance rate relative to total supply</div>
      <div class="scarcity-comparison">
        <div class="scarcity-comparison-item bitcoin">Bitcoin: ${data.annualInflation}%</div>
        <div class="scarcity-comparison-item gold">Gold: 1.60%</div>
        <div class="scarcity-comparison-item silver">Silver: 4.50%</div>
      </div>
    </div>
    <div class="scarcity-metric">
      <div class="scarcity-metric-title">Bitcoins Mined</div>
      <div class="scarcity-metric-value">${data.bitcoinsMined}</div>
      <div class="scarcity-metric-description">Amount of bitcoins already mined out of 21 million total</div>
      <div class="supply-progress">
        <div class="supply-progress-fill" style="width: ${data.supplyPercentage}%;"></div>
        <div class="supply-progress-text">${data.supplyPercentage}% (${data.remaining} remaining)</div>
      </div>
    </div>
    <div class="scarcity-metric">
      <div class="scarcity-metric-title">Next Halving</div>
      <div class="scarcity-metric-value">${data.nextHalving}</div>
      <div class="scarcity-metric-description">Event that cuts mining reward in half</div>
      <div class="days-remaining">${data.daysToHalving} days remaining</div>
    </div>
  `;
}

// Função para mostrar indicador de carregamento
function showLoadingIndicator(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-indicator">
      <div class="loading-spinner"></div>
      Atualizando dados...
    </div>
  `;
}

// Função para carregar todas as seções automaticamente
async function loadAllSections() {
  console.log('Carregando todas as seções...');
  
  // Carregar eventos
  try {
    showLoadingIndicator('events-grid');
    const events = await fetchUpcomingEvents();
    renderEvents(events);
    console.log('Eventos carregados com sucesso');
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }
  
  // Carregar notícias
  try {
    showLoadingIndicator('news-grid');
    const news = await fetchLatestNews();
    renderNews(news);
    console.log('Notícias carregadas com sucesso');
  } catch (error) {
    console.error('Erro ao carregar notícias:', error);
  }
  
  // Carregar métricas de escassez
  try {
    showLoadingIndicator('scarcity-metrics-grid');
    const scarcityData = await fetchScarcityMetrics();
    renderScarcityMetrics(scarcityData);
    console.log('Métricas de escassez carregadas com sucesso');
  } catch (error) {
    console.error('Erro ao carregar métricas de escassez:', error);
  }

  // Carregar podcasts
  try {
    await loadPodcastsSection();
    console.log('Podcasts carregados com sucesso');
  } catch (error) {
    console.error('Erro ao carregar podcasts:', error);
  }
}

// Função para carregar dados dos indicadores principais
async function loadMainIndicators() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  // Usar valores de fallback por enquanto
  const quotes = Object.values(FALLBACK_VALUES);
  
  quotesContainer.innerHTML = '';
  
  quotes.forEach(quote => {
    const quoteWrapper = document.createElement('div');
    quoteWrapper.className = 'quote-wrapper';
    
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    
    const changeClass = quote.positive ? 'positive' : 'negative';
    
    quoteElement.innerHTML = `
      <div class="quote-left">
        <strong>${quote.name}</strong>
        <span class="quote-price">${quote.price}</span>
      </div>
      <span class="quote-change ${changeClass}">${quote.change}</span>
    `;
    
    quoteWrapper.appendChild(quoteElement);
    quotesContainer.appendChild(quoteWrapper);
  });
}

// Função para atualização periódica em segundo plano
function startPeriodicUpdates() {
  // Atualizar a cada 30 minutos
  setInterval(async () => {
    console.log('Verificando atualizações em segundo plano...');
    
    // Verificar se alguma seção precisa ser atualizada
    if (shouldUpdate('events') || shouldUpdate('news') || shouldUpdate('scarcity') || shouldUpdate('podcasts')) {
      console.log('Atualizando dados em segundo plano...');
      await loadAllSections();
      
      // Mostrar notificação discreta
      showUpdateNotification();
    }
  }, 30 * 60 * 1000); // 30 minutos

  // Verificar atualizações de podcast a cada 1 hora (menos frequente que as outras)
  setInterval(async () => {
    await checkForPodcastUpdates();
  }, 60 * 60 * 1000); // 1 hora
}

// Função para mostrar notificação de atualização
function showUpdateNotification() {
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
  notification.textContent = 'Dados atualizados!';
  
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
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', async function() {
  console.log('Scarcity Panel carregado - iniciando atualizações automáticas...');
  
  // Carregar dados do cache primeiro
  const cachedEvents = loadFromCache('events');
  const cachedNews = loadFromCache('news');
  const cachedScarcity = loadFromCache('scarcity');
  const cachedPodcasts = loadFromCache('podcasts');
  
  if (cachedEvents) renderEvents(cachedEvents);
  if (cachedNews) renderNews(cachedNews);
  if (cachedScarcity) renderScarcityMetrics(cachedScarcity);
  if (cachedPodcasts) renderPodcasts(cachedPodcasts);
  
  // Carregar indicadores principais
  await loadMainIndicators();
  
  // Carregar todas as seções
  await loadAllSections();
  
  // Iniciar atualizações periódicas
  startPeriodicUpdates();
  
  // Configurar botão de sources
  const sourcesToggle = document.getElementById('sources-toggle');
  const sourcesDiv = document.getElementById('market-cap-sources');
  
  if (sourcesToggle && sourcesDiv) {
    sourcesToggle.addEventListener('click', function() {
      if (sourcesDiv.style.display === 'none' || sourcesDiv.style.display === '') {
        sourcesDiv.style.display = 'block';
        sourcesToggle.textContent = 'Hide sources';
      } else {
        sourcesDiv.style.display = 'none';
        sourcesToggle.textContent = 'Show sources';
      }
    });
  }
  
  console.log('Scarcity Panel totalmente carregado e funcional!');
});

