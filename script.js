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
    youtubeUrl: 'https://www.youtube.com/@JackMallers',
    channelId: 'UCb_gE9b-b2s_fN0_g0b0b0g', // Exemplo de ID de canal (manter o original se estiver funcionando)
    playlistId: 'UUb_gE9b-b2s_fN0_g0b0b0g' // Exemplo de ID de playlist (manter o original se estiver funcionando)
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

  // CORREÇÃO: Ordenar podcasts por data de publicação do último vídeo (mais recente primeiro)
  podcastsData.sort((a, b) => {
    // Se um dos podcasts não tem vídeo ou tem erro, colocar no final
    if (!a.latestVideo || a.error) return 1;
    if (!b.latestVideo || b.error) return -1;
    
    // Ordenar por data de publicação (mais recente primeiro)
    const dateA = new Date(a.latestVideo.publishedAt);
    const dateB = new Date(b.latestVideo.publishedAt);
    
    return dateB - dateA; // Ordem decrescente (mais recente primeiro)
  });

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
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// --- INICIALIZAÇÃO E CONFIGURAÇÃO ---

// Função principal de inicialização
async function initializeApp() {
  console.log('Inicializando aplicação...');
  
  // Carregar dados em cache primeiro (se disponível)
  const cachedData = loadPodcastsFromCache();
  if (cachedData) {
    console.log('Carregando dados em cache...');
    renderPodcasts(cachedData);
  }
  
  // Carregar seção de podcasts (atualizar se necessário)
  await loadPodcastsSection();
  
  // Configurar verificação automática de atualizações a cada 30 minutos
  setInterval(checkForPodcastUpdates, 30 * 60 * 1000);
  
  console.log('Aplicação inicializada com sucesso!');
}

// Aguardar carregamento do DOM antes de inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

