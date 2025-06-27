// Configuração da API Alpha Vantage
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// CONFIGURAÇÃO DAS APIS - ADICIONE SUAS CHAVES AQUI
const YOUTUBE_API_KEY = "AIzaSyD4Yvo1yTwoXH5bhC-Gp0g60xSpYIthP7c"; // Adicione sua chave da YouTube Data API v3
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
    title: "Coin Stories Podcast",
    host: "Natalie Brunell",
    description: "Investing journalist and Bitcoin educator exploring the intersection of money, technology, and freedom through compelling stories and expert interviews.",
    youtubeUrl: "https://www.youtube.com/@NatalieBrunell",
    channelId: "UCxJ-T4p6iMHNyOZU8-8-wgQ", // ID do canal da Natalie Brunell
    playlistId: "UUxJ-T4p6iMHNyOZU8-8-wgQ" // ID da playlist de uploads
  },
  {
    title: "The Jack Mallers Show",
    host: "Jack Mallers",
    description: "CEO of Strike covering the biggest stories in Bitcoin, macroeconomics, financial markets, and the future of money with live weekly episodes.",
    youtubeUrl: "https://www.youtube.com/@JackMallers",
    channelId: "UC3ol9RQbQHqle_Uly6w9LfA", // ID do canal do Jack Mallers
    playlistId: "UU3ol9RQbQHqle_Uly6w9LfA"
  },
  {
    title: "The Bitcoin Standard Podcast",
    host: "Saifedean Ammous",
    description: "Author of \"The Bitcoin Standard\" exploring Austrian economics, sound money principles, and Bitcoin's role in the future of monetary systems.",
    youtubeUrl: "https://www.youtube.com/@saifedean",
    channelId: "UCmvjlQyul9m6KwJZsQBZTpQ", // ID do canal do Saifedean
    playlistId: "UUmvjlQyul9m6KwJZsQBZTpQ"
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

// --- NOVAS FUNÇÕES PARA YOUTUBE API ---

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

// --- NOVAS FUNÇÕES PARA NOTÍCIAS AUTOMÁTICAS ---

// Função para buscar notícias de Bitcoin e criptomoedas
async function fetchCryptoNews() {
  // Fallback de notícias caso a API não esteja configurada
  const fallbackNews = [
    {
      source: "Bitcoin Magazine",
      title: "Bitcoin Surpasses $100,000 for First Time in History",
      description: "The world's largest cryptocurrency has reached a new all-time high, breaking the psychological barrier of $100,000.",
      publishedAt: new Date().toISOString(),
      url: "https://bitcoinmagazine.com/",
      urlToImage: null
    },
    {
      source: "Blockworks",
      title: "Central Banks Accelerate Digital Currency Development",
      description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      url: "https://blockworks.co/",
      urlToImage: null
    },
    {
      source: "The Bitcoin Times",
      title: "Gold Reaches Record High Amid Inflation Concerns",
      description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://bitcointimes.news/",
      urlToImage: null
    },
    {
      source: "Bitcoin Magazine",
      title: "Institutional Adoption Drives Bitcoin to New Heights",
      description: "Major corporations and investment funds continue to allocate significant portions of their portfolios to Bitcoin.",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://bitcoinmagazine.com/",
      urlToImage: null
    },
    {
      source: "Cointelegraph",
      title: "Lightning Network Reaches 10,000 Nodes Milestone",
      description: "Bitcoin's Layer 2 scaling solution continues to grow, enabling faster and cheaper transactions.",
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://cointelegraph.com/",
      urlToImage: null
    },
    {
      source: "Decrypt",
      title: "Mining Difficulty Adjustment Signals Network Strength",
      description: "Bitcoin's mining difficulty reaches new all-time high, demonstrating the network's robust security.",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://decrypt.co/",
      urlToImage: null
    }
  ];

  if (!NEWS_API_KEY) {
    console.warn('News API key not configured, using fallback news');
    return fallbackNews;
  }

  try {
    // Exemplo usando NewsAPI (você pode substituir por outra API de notícias)
    const url = `https://newsapi.org/v2/everything?q=bitcoin OR cryptocurrency OR blockchain&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.articles && data.articles.length > 0) {
      return data.articles.map(article => ({
        source: article.source.name,
        title: article.title,
        description: article.description,
        publishedAt: article.publishedAt,
        url: article.url,
        urlToImage: article.urlToImage
      }));
    }
    
    return fallbackNews;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return fallbackNews;
  }
}

// --- Funções de busca de dados com APIs confiáveis ---

// Função para buscar o preço do Bitcoin usando CoinGecko API (FUNCIONA)
async function fetchBitcoinPrice() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.bitcoin) {
      const price = data.bitcoin.usd;
      const change = data.bitcoin.usd_24h_change;
      const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Bitcoin", price: formattedPrice, change: formattedChange, positive: change >= 0 };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar preço do Bitcoin:', error);
    return FALLBACK_VALUES.bitcoin;
  }
}

// Função para buscar preços de metais usando múltiplas fontes
async function fetchGoldPrice() {
  try {
    // Tentativa 1: Usar uma API alternativa (simulada - na prática você precisaria de uma API real)
    // Por enquanto, retorna valores de fallback atualizados
    console.log('Gold API: Usando valores de fallback (APIs gratuitas não disponíveis)');
    return FALLBACK_VALUES.gold;
  } catch (error) {
    console.error('Erro ao buscar preço do Ouro:', error);
    return FALLBACK_VALUES.gold;
  }
}

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

            // Conve
(Content truncated due to size limit. Use line ranges to read in chunks)
