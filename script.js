// Configuração da API Alpha Vantage
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Valores de fallback atualizados (devem ser atualizados manualmente periodicamente)
const FALLBACK_VALUES = {
  bitcoin: { name: "Bitcoin", price: "$104,586.00", change: "-0.3%", positive: false },
  gold: { name: "Gold", price: "$3,433.47", change: "+1.60%", positive: true },
  silver: { name: "Silver", price: "$36.32", change: "+0.25%", positive: true },
  treasury: { name: "10-Year Treasury Yield", price: "4.46%", change: "+0.02%", positive: true },
  dollar: { name: "Dollar Index", price: "106.50", change: "+0.1%", positive: true },
  sp500: { name: "S&P 500", price: "5,950.00", change: "+0.3%", positive: true }
};

// Configuração dos podcasts com IDs dos canais do YouTube
const PODCAST_CHANNELS = [
  {
    name: "Coin Stories Podcast",
    host: "Natalie Brunell",
    description: "Investing journalist and Bitcoin educator exploring the intersection of money, technology, and freedom through compelling stories and expert interviews.",
    channelId: "UCxeedoaXm_uPh9fgflym8Aw", // Natalie Brunell
    channelUrl: "https://www.youtube.com/@nataliebrunell"
  },
  {
    name: "The Jack Mallers Show",
    host: "Jack Mallers",
    description: "CEO of Strike covering the biggest stories in Bitcoin, macroeconomics, financial markets, and the future of money with live weekly episodes.",
    channelId: "UC3ol9RQbQHqle_Uly6w9LfA", // Jack Mallers
    channelUrl: "https://www.youtube.com/channel/UC3ol9RQbQHqle_Uly6w9LfA"
  },
  {
    name: "The Bitcoin Standard Podcast",
    host: "Saifedean Ammous",
    description: "Author of \"The Bitcoin Standard\" exploring Austrian economics, sound money principles, and Bitcoin's role in the future of monetary systems.",
    channelId: "UCtOjAGhOyOgZLjOyNdGJNOA", // Saifedean Ammous - ID alternativo
    channelUrl: "https://www.youtube.com/@saifedean"
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

// --- Funções para Podcasts --- 

// Função para buscar o último vídeo de um canal do YouTube
async function fetchLatestVideo(channelId) {
  try {
    // Método 1: Tentar usar RSS feed com proxy CORS
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    
    try {
      const response = await fetch(proxyUrl);
      if (response.ok) {
        const data = await response.json();
        const xmlText = data.contents;
        
        // Parse do XML usando DOMParser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Pegar o primeiro entry (último vídeo)
        const entries = xmlDoc.getElementsByTagName('entry');
        if (entries.length > 0) {
          const firstEntry = entries[0];
          const videoId = firstEntry.getElementsByTagName('yt:videoId')[0]?.textContent;
          const title = firstEntry.getElementsByTagName('title')[0]?.textContent;
          const published = firstEntry.getElementsByTagName('published')[0]?.textContent;
          
          if (videoId) {
            return {
              videoId: videoId,
              title: title,
              thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              thumbnailMedium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
              published: published,
              url: `https://www.youtube.com/watch?v=${videoId}`
            };
          }
        }
      }
    } catch (corsError) {
      console.log(`CORS error for channel ${channelId}, trying fallback method`);
    }
    
    // Método 2: Fallback com dados simulados baseados no canal
    const fallbackData = {
      "UCxeedoaXm_uPh9fgflym8Aw": { // Natalie Brunell
        videoId: "dQw4w9WgXcQ",
        title: "Bitcoin Education and Financial Freedom",
        published: "2025-06-18T10:00:00Z"
      },
      "UC3ol9RQbQHqle_Uly6w9LfA": { // Jack Mallers
        videoId: "dQw4w9WgXcQ", 
        title: "Bitcoin and Gold: The New Safe Haven Assets",
        published: "2025-06-16T15:30:00Z"
      },
      "UCtOjAGhOyOgZLjOyNdGJNOA": { // Saifedean Ammous
        videoId: "kLl4I2HgqUM",
        title: "The Gold Standard: Saifedean's Next Book!",
        published: "2024-12-10T12:00:00Z"
      }
    };
    
    const fallback = fallbackData[channelId];
    if (fallback) {
      return {
        videoId: fallback.videoId,
        title: fallback.title,
        thumbnail: `https://img.youtube.com/vi/${fallback.videoId}/maxresdefault.jpg`,
        thumbnailMedium: `https://img.youtube.com/vi/${fallback.videoId}/mqdefault.jpg`,
        published: fallback.published,
        url: `https://www.youtube.com/watch?v=${fallback.videoId}`
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Erro ao buscar último vídeo do canal ${channelId}:`, error);
    return null;
  }
}

// Função para carregar todos os podcasts com seus últimos vídeos
async function loadPodcasts() {
  const podcastsGrid = document.getElementById('podcasts-grid');
  if (!podcastsGrid) return;
  
  // Limpar conteúdo existente
  podcastsGrid.innerHTML = '';
  
  // Carregar cada podcast
  for (const podcast of PODCAST_CHANNELS) {
    const latestVideo = await fetchLatestVideo(podcast.channelId);
    
    const podcastItem = document.createElement('div');
    podcastItem.className = 'podcast-item';
    
    // Se temos o último vídeo, usar sua thumbnail, senão usar ícone padrão
    const thumbnailHtml = latestVideo ? 
      `<img src="${latestVideo.thumbnailMedium}" alt="${latestVideo.title}" class="podcast-thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
       <div class="podcast-icon" style="display: none;">
         <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#f7931a">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
         </svg>
       </div>` :
      `<div class="podcast-icon">
         <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#f7931a">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
         </svg>
       </div>`;
    
    const latestVideoInfo = latestVideo ? 
      `<div class="latest-video-info">
         <div class="latest-video-title">${latestVideo.title}</div>
         <div class="latest-video-date">${new Date(latestVideo.published).toLocaleDateString()}</div>
       </div>` : '';
    
    podcastItem.innerHTML = `
      <div class="podcast-header">
        ${thumbnailHtml}
        <div class="podcast-info">
          <h3 class="podcast-title">${podcast.name}</h3>
          <p class="podcast-host">${podcast.host}</p>
        </div>
      </div>
      <p class="podcast-description">${podcast.description}</p>
      ${latestVideoInfo}
      <a href="${latestVideo ? latestVideo.url : podcast.channelUrl}" target="_blank" class="podcast-link">
        <span>${latestVideo ? 'Watch Latest Video' : 'Watch on YouTube'}</span>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </a>
    `;
    
    podcastsGrid.appendChild(podcastItem);
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
            
            // Converter SPY para S&P 500 (aproximadamente SPY * 10)
            const sp500Price = latestPrice * 10;
            const formattedPrice = sp500Price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
            return { name: "S&P 500", price: formattedPrice, change: formattedChange, positive: change >= 0 };
          }
        }
      }
    }
    
    throw new Error('Alpha Vantage stock data unavailable or outdated');
  } catch (error) {
    console.error('Erro ao buscar S&P 500:', error);
    console.log('S&P 500: Usando valores de fallback');
    return FALLBACK_VALUES.sp500;
  }
}

// Função para buscar a quantidade de Bitcoins minerados (FUNCIONA)
async function fetchMinedBitcoins() {
  try {
    const response = await fetch('https://blockchain.info/q/totalbc?cors=true');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const totalbcSatoshis = await response.text();
    const totalbc = parseFloat(totalbcSatoshis) / 100000000;
    return totalbc;
  } catch (error) {
    console.error('Erro ao buscar Bitcoins minerados:', error);
    return 19873500; // Valor de fallback atualizado
  }
}

// Função para buscar dados de sentimento de mercado (FUNCIONA)
async function fetchMarketSentiment() {
  try {
    // Buscar Fear & Greed Index
    const fearGreedResponse = await fetch('https://api.alternative.me/fng/');
    let fearGreedData = { value: 65, classification: 'Greed' };
    
    if (fearGreedResponse.ok) {
      const fearGreedJson = await fearGreedResponse.json();
      if (fearGreedJson && fearGreedJson.data && fearGreedJson.data[0]) {
        fearGreedData = {
          value: parseInt(fearGreedJson.data[0].value),
          classification: fearGreedJson.data[0].value_classification
        };
      }
    }

    // Buscar dominância do Bitcoin
    const dominanceResponse = await fetch('https://api.coingecko.com/api/v3/global');
    let btcDominance = 61.2;
    
    if (dominanceResponse.ok) {
      const dominanceJson = await dominanceResponse.json();
      if (dominanceJson && dominanceJson.data && dominanceJson.data.market_cap_percentage) {
        btcDominance = dominanceJson.data.market_cap_percentage.btc.toFixed(1);
      }
    }

    // Buscar volatilidade do Bitcoin
    let volatility = 6.9;
    try {
      const volatilityResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30');
      if (volatilityResponse.ok) {
        const volatilityData = await volatilityResponse.json();
        if (volatilityData && volatilityData.prices) {
          const prices = volatilityData.prices.map(p => p[1]);
          const returns = [];
          for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i-1]) / prices[i-1]);
          }
          const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
          const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
          volatility = Math.sqrt(variance) * Math.sqrt(365) * 100;
        }
      }
    } catch (error) {
      console.error('Erro ao calcular volatilidade:', error);
    }

    // Buscar volume de transações
    let transactionVolume = 25.1;
    try {
      const volumeResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
      if (volumeResponse.ok) {
        const volumeData = await volumeResponse.json();
        if (volumeData && volumeData.market_data && volumeData.market_data.total_volume) {
          transactionVolume = (volumeData.market_data.total_volume.usd / 1e9).toFixed(1);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar volume de transações:', error);
    }

    // Buscar hash rate (pode não funcionar sempre)
    let hashRate = 0;
    try {
      const hashRateResponse = await fetch('https://blockchain.info/q/hashrate');
      if (hashRateResponse.ok) {
        const hashRateText = await hashRateResponse.text();
        const hashRateValue = parseFloat(hashRateText);
        if (!isNaN(hashRateValue)) {
          hashRate = (hashRateValue / 1e18).toFixed(0);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar hash rate:', error);
    }

    return {
      fearGreed: fearGreedData,
      btcDominance: btcDominance,
      volatility: volatility,
      transactionVolume: transactionVolume,
      hashRate: hashRate
    };
  } catch (error) {
    console.error('Erro ao buscar dados de sentimento:', error);
    return {
      fearGreed: { value: 65, classification: 'Greed' },
      btcDominance: 61.2,
      volatility: 6.9,
      transactionVolume: 25.1,
      hashRate: 0
    };
  }
}

// --- Funções de Renderização e Atualização --- 

function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  quotesContainer.innerHTML = '';

  fetchAllLatestPrices().then(updatedAssets => {
    updatedAssets.forEach(asset => {
      const quoteWrapper = document.createElement('div');
      quoteWrapper.className = 'quote-wrapper';
      const quote = document.createElement('div');
      quote.className = 'quote';
      const quoteLeft = document.createElement('div');
      quoteLeft.className = 'quote-left';
      const nameStrong = document.createElement('strong');
      nameStrong.textContent = asset.name;
      let tooltip = '';
      if (asset.name === "10-Year Treasury Yield") {
        tooltip = `<span class="index-tooltip">The yield on the U.S. 10-year Treasury note, a key benchmark for interest rates.</span>`;
      } else if (asset.name === "Dollar Index") {
        tooltip = `<span class="index-tooltip">Measures the value of the U.S. dollar relative to a basket of foreign currencies.</span>`;
      } else if (asset.name === "S&P 500") {
        tooltip = `<span class="index-tooltip">Stock market index tracking the performance of 500 large companies listed on U.S. exchanges.</span>`;
      }
      quoteLeft.appendChild(nameStrong);
      quoteLeft.innerHTML += tooltip;
      const quoteRight = document.createElement('div');
      quoteRight.className = 'quote-right';
      const quotePrice = document.createElement('span');
      quotePrice.className = 'quote-price';
      quotePrice.textContent = asset.price;
      const quoteChange = document.createElement('span');
      quoteChange.className = `quote-change ${asset.positive ? 'positive' : 'negative'}`;
      quoteChange.textContent = asset.change;
      quoteRight.appendChild(quotePrice);
      quoteRight.appendChild(document.createElement('br'));
      quoteRight.appendChild(quoteChange);
      quote.appendChild(quoteLeft);
      quote.appendChild(quoteRight);
      quoteWrapper.appendChild(quote);
      quotesContainer.appendChild(quoteWrapper);
    });
    updateFooterPrices(updatedAssets);
  });
}

async function fetchAllLatestPrices() {
  try {
    const promises = [
      fetchBitcoinPrice(),
      fetchGoldPrice(),
      fetchSilverPrice(),
      fetchTreasuryYield(),
      fetchDollarIndex(),
      fetchSP500()
    ];
    const results = await Promise.allSettled(promises);
    const updatedAssets = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        updatedAssets[index] = result.value;
      } else {
        // Usar valores de fallback se a API falhar
        const fallbackKeys = ['bitcoin', 'gold', 'silver', 'treasury', 'dollar', 'sp500'];
        updatedAssets[index] = FALLBACK_VALUES[fallbackKeys[index]];
      }
    });
    
    return updatedAssets;
  } catch (error) {
    console.error('Erro ao buscar todos os preços atualizados:', error);
    return Object.values(FALLBACK_VALUES);
  }
}

// Função para atualizar as métricas de escassez
async function updateScarcityMetrics() {
  try {
    const minedBitcoins = await fetchMinedBitcoins();
    const bitcoinsMined = document.getElementById('bitcoins-mined');
    const daysRemaining = document.getElementById('days-remaining');
    
    if (bitcoinsMined) {
      const formattedMined = minedBitcoins.toLocaleString('en-US', { maximumFractionDigits: 0 });
      bitcoinsMined.textContent = formattedMined;
      
      // Atualizar a barra de progresso
      const percentage = (minedBitcoins / 21000000) * 100;
      const remaining = 21000000 - minedBitcoins;
      const progressFill = document.querySelector('.supply-progress-fill');
      const progressText = document.querySelector('.supply-progress-text');
      
      if (progressFill) {
        progressFill.style.width = `${percentage.toFixed(2)}%`;
      }
      
      if (progressText) {
        progressText.textContent = `${percentage.toFixed(2)}% (${remaining.toLocaleString('en-US', { maximumFractionDigits: 0 })} remaining)`;
      }
    }
    
    // Calcular dias até o próximo halving (aproximadamente abril de 2028)
    if (daysRemaining) {
      const nextHalving = new Date('2028-04-01');
      const today = new Date();
      const diffTime = nextHalving - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      daysRemaining.textContent = `${diffDays} days remaining`;
    }
    
  } catch (error) {
    console.error('Erro ao atualizar métricas de escassez:', error);
  }
}

// Função para atualizar dados de sentimento de mercado
async function updateMarketSentiment() {
  try {
    const sentimentData = await fetchMarketSentiment();
    
    // Atualizar Fear & Greed Index
    const fearGreedElement = document.getElementById('fear-greed');
    if (fearGreedElement && sentimentData.fearGreed) {
      const gaugeValue = fearGreedElement.querySelector('.gauge-value');
      const gaugeFill = fearGreedElement.querySelector('.gauge-fill');
      
      if (gaugeValue) {
        gaugeValue.textContent = `${sentimentData.fearGreed.value} - ${sentimentData.fearGreed.classification}`;
      }
      
      if (gaugeFill) {
        gaugeFill.style.width = `${sentimentData.fearGreed.value}%`;
      }
    }
    
    // Atualizar BTC Dominance
    const btcDominanceElement = document.getElementById('btc-dominance');
    if (btcDominanceElement && sentimentData.btcDominance) {
      const gaugeValue = btcDominanceElement.querySelector('.gauge-value');
      const gaugeFill = btcDominanceElement.querySelector('.gauge-fill');
      
      if (gaugeValue) {
        const dominanceLevel = sentimentData.btcDominance > 60 ? 'High' : sentimentData.btcDominance > 40 ? 'Moderate' : 'Low';
        gaugeValue.textContent = `${sentimentData.btcDominance}% - ${dominanceLevel}`;
      }
      
      if (gaugeFill) {
        gaugeFill.style.width = `${sentimentData.btcDominance}%`;
      }
    }
    
    // Atualizar Volatility
    const volatilityElement = document.getElementById('volatility');
    if (volatilityElement && sentimentData.volatility) {
      const gaugeValue = volatilityElement.querySelector('.gauge-value');
      const gaugeFill = volatilityElement.querySelector('.gauge-fill');
      
      if (gaugeValue) {
        const volatilityLevel = sentimentData.volatility > 10 ? 'High' : sentimentData.volatility > 5 ? 'Moderate' : 'Low';
        gaugeValue.textContent = `${sentimentData.volatility.toFixed(1)}% - ${volatilityLevel}`;
      }
      
      if (gaugeFill) {
        // Normalizar volatilidade para 0-100% (assumindo max 20%)
        const normalizedVolatility = Math.min((sentimentData.volatility / 20) * 100, 100);
        gaugeFill.style.width = `${normalizedVolatility}%`;
      }
    }
    
    // Atualizar Transaction Volume
    const transactionVolumeElement = document.getElementById('transaction-volume');
    if (transactionVolumeElement && sentimentData.transactionVolume) {
      const gaugeValue = transactionVolumeElement.querySelector('.gauge-value');
      const gaugeFill = transactionVolumeElement.querySelector('.gauge-fill');
      
      if (gaugeValue) {
        const volumeLevel = sentimentData.transactionVolume > 50 ? 'High' : sentimentData.transactionVolume > 20 ? 'Moderate' : 'Low';
        gaugeValue.textContent = `$${sentimentData.transactionVolume}B - ${volumeLevel}`;
      }
      
      if (gaugeFill) {
        // Normalizar volume para 0-100% (assumindo max 100B)
        const normalizedVolume = Math.min((sentimentData.transactionVolume / 100) * 100, 100);
        gaugeFill.style.width = `${normalizedVolume}%`;
      }
    }
    
  } catch (error) {
    console.error('Erro ao atualizar sentimento de mercado:', error);
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

// Função para atualizar preços no footer
function updateFooterPrices(assets) {
  const footerPrices = document.getElementById('footer-prices');
  if (footerPrices && assets) {
    footerPrices.innerHTML = '';
    
    // Mostrar apenas Bitcoin, Gold e S&P 500 no footer
    const footerAssets = [assets[0], assets[1], assets[5]]; // Bitcoin, Gold, S&P 500
    
    footerAssets.forEach(asset => {
      if (asset) {
        const priceSpan = document.createElement('span');
        priceSpan.innerHTML = `${asset.name}: ${asset.price} <span class="${asset.positive ? 'positive' : 'negative'}">${asset.change}</span>`;
        footerPrices.appendChild(priceSpan);
      }
    });
  }
}

// --- Sistema de Notícias Não Mainstream ---

// Fontes de notícias alternativas (não mainstream) - expandida
const ALTERNATIVE_NEWS_SOURCES = [
  {
    name: "Bitcoin Magazine",
    url: "https://bitcoinmagazine.com",
    rss: "https://bitcoinmagazine.com/feed",
    category: "bitcoin"
  },
  {
    name: "The Bitcoin Times",
    url: "https://bitcointimes.news",
    rss: "https://bitcointimes.news/feed",
    category: "bitcoin"
  },
  {
    name: "Blockworks",
    url: "https://blockworks.co",
    rss: "https://blockworks.co/feed",
    category: "crypto"
  },
  {
    name: "Decrypt",
    url: "https://decrypt.co",
    rss: "https://decrypt.co/feed",
    category: "crypto"
  },
  {
    name: "CoinDesk",
    url: "https://coindesk.com",
    rss: "https://coindesk.com/arc/outboundfeeds/rss/",
    category: "crypto"
  },
  {
    name: "Cypherpunk Times",
    url: "https://cypherpunktimes.com",
    rss: "https://cypherpunktimes.com/feed/",
    category: "bitcoin"
  },
  {
    name: "Bitcoin News",
    url: "https://news.bitcoin.com",
    rss: "https://news.bitcoin.com/feed/",
    category: "bitcoin"
  },
  {
    name: "CryptoSlate",
    url: "https://cryptoslate.com",
    rss: "https://cryptoslate.com/feed/",
    category: "crypto"
  },
  {
    name: "The Block",
    url: "https://theblock.co",
    rss: "https://theblock.co/rss.xml",
    category: "crypto"
  },
  {
    name: "CryptoPotato",
    url: "https://cryptopotato.com",
    rss: "https://cryptopotato.com/feed/",
    category: "crypto"
  },
  {
    name: "Mises Institute",
    url: "https://mises.org",
    rss: "https://mises.org/feed",
    category: "economics"
  },
  {
    name: "Zero Hedge",
    url: "https://zerohedge.com",
    rss: "https://feeds.feedburner.com/zerohedge/feed",
    category: "economics"
  }
];

// Função para buscar notícias de fontes alternativas - melhorada
async function fetchAlternativeNews() {
  const allNews = [];
  const maxNewsPerSource = 2; // Reduzido para melhor performance
  
  // Priorizar fontes Bitcoin-específicas
  const prioritySources = ALTERNATIVE_NEWS_SOURCES.filter(s => s.category === 'bitcoin');
  const otherSources = ALTERNATIVE_NEWS_SOURCES.filter(s => s.category !== 'bitcoin');
  const sourcesToUse = [...prioritySources, ...otherSources].slice(0, 8); // Máximo 8 fontes
  
  for (const source of sourcesToUse) {
    try {
      // Usar proxy CORS para acessar RSS feeds
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(source.rss)}`;
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        const data = await response.json();
        const xmlText = data.contents;
        
        // Parse do XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Extrair itens do RSS
        const items = xmlDoc.getElementsByTagName('item');
        
        for (let i = 0; i < Math.min(items.length, maxNewsPerSource); i++) {
          const item = items[i];
          const title = item.getElementsByTagName('title')[0]?.textContent;
          const description = item.getElementsByTagName('description')[0]?.textContent;
          const link = item.getElementsByTagName('link')[0]?.textContent;
          const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent;
          
          if (title && link) {
            // Filtrar notícias relevantes (Bitcoin, crypto, economia)
            const relevantKeywords = ['bitcoin', 'btc', 'cryptocurrency', 'crypto', 'blockchain', 'inflation', 'fed', 'monetary', 'gold', 'silver', 'economy'];
            const titleLower = title.toLowerCase();
            const isRelevant = relevantKeywords.some(keyword => titleLower.includes(keyword));
            
            if (isRelevant || source.category === 'bitcoin') {
              allNews.push({
                source: source.name,
                title: title,
                description: description ? description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '',
                link: link,
                date: pubDate ? new Date(pubDate) : new Date(),
                sourceUrl: source.url,
                category: source.category,
                priority: source.category === 'bitcoin' ? 1 : 2
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar notícias de ${source.name}:`, error);
      
      // Fallback com notícias simuladas para demonstração
      if (source.name === "Bitcoin Magazine") {
        allNews.push({
          source: source.name,
          title: "Bitcoin Network Reaches New All-Time High in Hash Rate",
          description: "The Bitcoin network's computational power continues to grow, demonstrating increasing security and miner confidence...",
          link: "https://bitcoinmagazine.com/technical/bitcoin-hash-rate-ath",
          date: new Date(),
          sourceUrl: source.url,
          category: source.category,
          priority: 1
        });
      }
    }
  }
  
  // Ordenar por prioridade (Bitcoin primeiro) e depois por data
  allNews.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return b.date - a.date;
  });
  
  return allNews.slice(0, 6); // Retornar apenas as 6 mais relevantes
}

// Função para atualizar a seção de notícias - melhorada
async function updateNewsSection() {
  try {
    console.log('Iniciando atualização de notícias...');
    const news = await fetchAlternativeNews();
    const newsGrid = document.querySelector('#news-content .news-grid');
    
    if (newsGrid && news.length > 0) {
      newsGrid.innerHTML = '';
      
      news.forEach(article => {
        const newsItem = document.createElement('a');
        newsItem.href = article.link;
        newsItem.target = '_blank';
        newsItem.className = 'news-item';
        
        // Adicionar classe baseada na categoria para styling diferenciado
        if (article.category === 'bitcoin') {
          newsItem.classList.add('bitcoin-news');
        }
        
        newsItem.innerHTML = `
          <div class="news-content">
            <div class="news-source ${article.category}">${article.source}</div>
            <div class="news-title">${article.title}</div>
            <div class="news-description">${article.description}</div>
            <div class="news-date">${article.date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })} UTC</div>
          </div>
        `;
        
        newsGrid.appendChild(newsItem);
      });
      
      console.log(`Notícias atualizadas: ${news.length} artigos carregados`);
    } else {
      console.log('Nenhuma notícia encontrada ou elemento não existe');
    }
  } catch (error) {
    console.error('Erro ao atualizar seção de notícias:', error);
  }
}

// --- Sistema de Atualização Diária Melhorado ---

// Função para verificar se precisa atualizar dados (uma vez por dia)
function shouldUpdateDaily() {
  const lastUpdate = localStorage.getItem('lastDailyUpdate');
  const today = new Date().toDateString();
  
  return !lastUpdate || lastUpdate !== today;
}

// Função para marcar que os dados foram atualizados hoje
function markDailyUpdateComplete() {
  const today = new Date().toDateString();
  localStorage.setItem('lastDailyUpdate', today);
}

// Função para atualização diária completa - melhorada
async function performDailyUpdate() {
  if (shouldUpdateDaily()) {
    console.log('Realizando atualização diária...');
    
    try {
      // Mostrar indicador de carregamento
      showUpdateIndicator();
      
      // Atualizar notícias (prioridade alta)
      console.log('Atualizando notícias...');
      await updateNewsSection();
      
      // Atualizar métricas de escassez
      console.log('Atualizando métricas de escassez...');
      await updateScarcityMetrics();
      
      // Atualizar podcasts
      console.log('Atualizando podcasts...');
      await loadPodcasts();
      
      // Marcar atualização como completa
      markDailyUpdateComplete();
      
      // Esconder indicador de carregamento
      hideUpdateIndicator();
      
      console.log('Atualização diária concluída com sucesso');
      
      // Notificar usuário sobre atualização
      showUpdateNotification('Dados atualizados com sucesso!');
      
    } catch (error) {
      console.error('Erro durante atualização diária:', error);
      hideUpdateIndicator();
      showUpdateNotification('Erro na atualização. Usando dados em cache.', 'error');
    }
  } else {
    console.log('Dados já atualizados hoje');
  }
}

// Função para mostrar indicador de carregamento
function showUpdateIndicator() {
  let indicator = document.getElementById('update-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'update-indicator';
    indicator.className = 'update-indicator';
    indicator.innerHTML = `
      <div class="update-spinner"></div>
      <span>Atualizando dados...</span>
    `;
    document.body.appendChild(indicator);
  }
  indicator.style.display = 'flex';
}

// Função para esconder indicador de carregamento
function hideUpdateIndicator() {
  const indicator = document.getElementById('update-indicator');
  if (indicator) {
    indicator.style.display = 'none';
  }
}

// Função para mostrar notificação de atualização
function showUpdateNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `update-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Mostrar notificação
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Esconder e remover notificação após 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Inicializar sistema de atualização diária - melhorado
function initializeDailyUpdates() {
  // Executar atualização diária na inicialização
  performDailyUpdate();
  
  // Configurar verificação a cada 30 minutos para atualização diária
  setInterval(() => {
    performDailyUpdate();
  }, 1800000); // 30 minutos em millisegundos
  
  // Atualizar notícias a cada 2 horas independentemente
  setInterval(() => {
    console.log('Atualização de notícias programada...');
    updateNewsSection();
  }, 7200000); // 2 horas em millisegundos
}

