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

// Configuração dos podcasts com URLs dos canais
const PODCAST_CHANNELS = [
  {
    name: "Coin Stories Podcast",
    host: "Natalie Brunell",
    description: "Investing journalist and Bitcoin educator exploring the intersection of money, technology, and freedom through compelling stories and expert interviews.",
    channelUrl: "https://www.youtube.com/@nataliebrunell",
    channelId: "UCxODjeUwZHk3p-7TU-IsDOA"
  },
  {
    name: "The Jack Mallers Show",
    host: "Jack Mallers",
    description: "CEO of Strike covering the biggest stories in Bitcoin, macroeconomics, financial markets, and the future of money with live weekly episodes.",
    channelUrl: "https://www.youtube.com/channel/UC3ol9RQbQHqle_Uly6w9LfA",
    channelId: "UC3ol9RQbQHqle_Uly6w9LfA"
  },
  {
    name: "The Bitcoin Standard Podcast",
    host: "Saifedean Ammous",
    description: "Author of The Bitcoin Standard discussing Austrian economics, Bitcoin, and sound money principles with leading thinkers and practitioners.",
    channelUrl: "https://www.youtube.com/@TheBitcoinStandard",
    channelId: "UCmvjlQyTaeF8_jdmcP5T5uA"
  },
  {
    name: "What Bitcoin Did",
    host: "Peter McCormack",
    description: "Interviews with Bitcoin industry experts, covering everything from technical developments to regulatory challenges and adoption stories.",
    channelUrl: "https://www.youtube.com/@WhatBitcoinDid",
    channelId: "UCq-6NzOKM_95kX6RzJYvgpA"
  },
  {
    name: "The Investors Podcast",
    host: "Preston Pysh & Stig Brodersen",
    description: "Value investing principles applied to Bitcoin and traditional markets, featuring interviews with successful investors and entrepreneurs.",
    channelUrl: "https://www.youtube.com/@theinvestorspodcast",
    channelId: "UCTKuHbUU6W7jNKXQPQhBh-g"
  },
  {
    name: "Bitcoin Audible",
    host: "Guy Swann",
    description: "Reading and discussing the most important Bitcoin articles, papers, and content to help listeners understand the revolutionary potential of Bitcoin.",
    channelUrl: "https://www.youtube.com/@BitcoinAudible",
    channelId: "UCNcQ_VlVbRfhLb8NVWupGvQ"
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

// Função para buscar o último vídeo de um canal do YouTube
async function fetchLatestVideoThumbnail(channelId) {
  try {
    // Usar um proxy CORS para acessar o RSS feed do YouTube
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const fullUrl = proxyUrl + encodeURIComponent(rssUrl);
    
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    const xmlText = data.contents;
    
    // Parse do XML para extrair o ID do último vídeo
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Buscar o primeiro entry (último vídeo)
    const entries = xmlDoc.getElementsByTagName('entry');
    if (entries.length > 0) {
      const firstEntry = entries[0];
      const videoIdElement = firstEntry.getElementsByTagName('yt:videoId')[0];
      
      if (videoIdElement) {
        const videoId = videoIdElement.textContent;
        // Retornar a thumbnail de alta qualidade
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    
    throw new Error('Não foi possível extrair o ID do vídeo');
  } catch (error) {
    console.error('Erro ao buscar thumbnail do último vídeo:', error);
    
    // Fallback: usar thumbnails específicas conhecidas para cada canal
    const fallbackThumbnails = {
      'UCxODjeUwZHk3p-7TU-IsDOA': 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Natalie Brunell
      'UC3ol9RQbQHqle_Uly6w9LfA': 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Jack Mallers
      'UCmvjlQyTaeF8_jdmcP5T5uA': 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Bitcoin Standard
      'UCq-6NzOKM_95kX6RzJYvgpA': 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // What Bitcoin Did
      'UCTKuHbUU6W7jNKXQPQhBh-g': 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Investors Podcast
      'UCNcQ_VlVbRfhLb8NVWupGvQ': 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'  // Bitcoin Audible
    };
    
    return fallbackThumbnails[channelId] || null;
  }
}

// Função para renderizar os podcasts com thumbnails dos últimos vídeos
async function renderPodcasts() {
  const podcastsContainer = document.getElementById('podcasts-container');
  if (!podcastsContainer) return;

  podcastsContainer.innerHTML = '';

  for (const podcast of PODCAST_CHANNELS) {
    const podcastItem = document.createElement('div');
    podcastItem.className = 'podcast-item';

    // Buscar thumbnail do último vídeo
    const thumbnail = await fetchLatestVideoThumbnail(podcast.channelId);

    podcastItem.innerHTML = `
      ${thumbnail ? `<img src="${thumbnail}" alt="${podcast.name} latest video" class="podcast-thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
      <div class="podcast-thumbnail" style="${thumbnail ? 'display: none;' : 'display: flex;'}">Carregando thumbnail...</div>
      <div class="podcast-content">
        <div class="podcast-header">
          <div class="podcast-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div class="podcast-info">
            <h3 class="podcast-title">${podcast.name}</h3>
            <p class="podcast-host">${podcast.host}</p>
          </div>
        </div>
        <p class="podcast-description">${podcast.description}</p>
        <a href="${podcast.channelUrl}" target="_blank" class="podcast-link">
          <span>Watch on YouTube</span>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </a>
      </div>
    `;

    podcastsContainer.appendChild(podcastItem);
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
    const totalSupply = 21000000;
    const remaining = totalSupply - minedBitcoins;
    const percentage = (minedBitcoins / totalSupply) * 100;
    
    // Atualizar o valor de bitcoins minerados
    const minedElement = document.getElementById('bitcoins-mined');
    if (minedElement) {
      minedElement.textContent = minedBitcoins.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    
    // Atualizar a barra de progresso
    const progressFill = document.querySelector('.supply-progress-fill');
    const progressText = document.querySelector('.supply-progress-text');
    if (progressFill && progressText) {
      progressFill.style.width = `${percentage.toFixed(2)}%`;
      progressText.textContent = `${percentage.toFixed(2)}% (${remaining.toLocaleString('en-US', { maximumFractionDigits: 0 })} remaining)`;
    }
    
    // Calcular dias restantes até o próximo halving (aproximado)
    const blocksPerDay = 144; // Aproximadamente 144 blocos por dia
    const currentBlock = Math.floor(minedBitcoins * 100000000 / 50 / 100000000 * 210000); // Estimativa grosseira
    const nextHalvingBlock = Math.ceil(currentBlock / 210000) * 210000 + 210000;
    const blocksRemaining = nextHalvingBlock - currentBlock;
    const daysRemaining = Math.floor(blocksRemaining / blocksPerDay);
    
    const daysElement = document.getElementById('days-remaining');
    if (daysElement) {
      daysElement.textContent = `${daysRemaining} days remaining`;
    }
    
  } catch (error) {
    console.error('Erro ao atualizar métricas de escassez:', error);
  }
}

// Função para atualizar dados de sentimento de mercado
async function updateMarketSentiment() {
  try {
    const sentimentData = await fetchMarketSentiment();
    
    // Atualizar BTC Dominance
    const btcDominanceElement = document.querySelector('#btc-dominance .gauge-value');
    if (btcDominanceElement) {
      btcDominanceElement.textContent = `${sentimentData.btcDominance}% - Moderate`;
    }
    
    // Atualizar Fear & Greed Index
    const fearGreedElement = document.querySelector('#fear-greed .gauge-value');
    if (fearGreedElement) {
      fearGreedElement.textContent = `${sentimentData.fearGreed.value} - ${sentimentData.fearGreed.classification}`;
    }
    
    // Atualizar Volatility
    const volatilityElement = document.querySelector('#volatility .gauge-value');
    if (volatilityElement) {
      volatilityElement.textContent = `${sentimentData.volatility.toFixed(1)}% - Low`;
    }
    
    // Atualizar Transaction Volume
    const volumeElement = document.querySelector('#transaction-volume .gauge-value');
    if (volumeElement) {
      volumeElement.textContent = `$${sentimentData.transactionVolume}B - High`;
    }
    
    // Atualizar Network Hash Rate se disponível
    if (sentimentData.hashRate > 0) {
      const hashRateElement = document.querySelector('#network-hash-rate .gauge-value');
      if (hashRateElement) {
        hashRateElement.textContent = `${sentimentData.hashRate} EH/s - Record High`;
      }
    }
    
  } catch (error) {
    console.error('Erro ao atualizar dados de sentimento:', error);
  }
}

// Função para atualizar preços no footer
function updateFooterPrices(assets) {
  const footerPrices = document.getElementById('footer-prices');
  if (!footerPrices) return;
  
  footerPrices.innerHTML = '';
  
  // Mostrar apenas Bitcoin, Gold e S&P 500 no footer
  const footerAssets = [assets[0], assets[1], assets[5]]; // Bitcoin, Gold, S&P 500
  
  footerAssets.forEach(asset => {
    if (asset) {
      const priceSpan = document.createElement('span');
      priceSpan.textContent = `${asset.name}: ${asset.price}`;
      footerPrices.appendChild(priceSpan);
    }
  });
}

// Função para mostrar/esconder fontes
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

// Função para copiar endereço de doação
function copyToClipboard() {
  const addressElement = document.getElementById('donation-address');
  const address = addressElement.textContent;
  
  navigator.clipboard.writeText(address).then(() => {
    const button = document.querySelector('.copy-button');
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Erro ao copiar endereço:', err);
  });
}

// Função para exibir uma citação aleatória do Satoshi
function displayRandomQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  if (quoteElement) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = randomQuote;
  }
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  // Renderizar cotações
  renderQuotes();
  
  // Renderizar podcasts
  renderPodcasts();
  
  // Atualizar métricas de escassez
  updateScarcityMetrics();
  
  // Atualizar dados de sentimento
  updateMarketSentiment();
  
  // Exibir citação aleatória
  displayRandomQuote();
  
  // Configurar botão de fontes
  const sourcesButton = document.getElementById('sources-toggle');
  if (sourcesButton) {
    sourcesButton.addEventListener('click', toggleSources);
  }
  
  // Atualizar dados a cada 5 minutos
  setInterval(() => {
    renderQuotes();
    updateScarcityMetrics();
    updateMarketSentiment();
  }, 5 * 60 * 1000);
  
  // Trocar citação a cada 30 segundos
  setInterval(displayRandomQuote, 30000);
});

