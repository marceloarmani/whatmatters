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

const quotes = [
  "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.",
  "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.",
  "The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "Banks must be trusted to hold our money and transfer it electronically, but they lend it out in waves of credit bubbles with barely a fraction in reserve.",
  "With e-currency based on cryptographic proof, without the need to trust a third party middleman, money can be secure and transactions effortless."
];

// Configuração dos canais de podcast do YouTube
const PODCAST_CHANNELS = [
  {
    id: 'podcast-1',
    name: 'Coin Stories Podcast',
    host: 'Natalie Brunell',
    description: 'Investing journalist and Bitcoin educator exploring the intersection of money, technology, and freedom through compelling stories and expert interviews.',
    channelId: 'UCxODjeUwZHk3p-7TU-IsDOA',
    youtubeUrl: 'https://www.youtube.com/@nataliebrunell',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxODjeUwZHk3p-7TU-IsDOA'
  },
  {
    id: 'podcast-2',
    name: 'The Jack Mallers Show',
    host: 'Jack Mallers',
    description: 'CEO of Strike covering the biggest stories in Bitcoin, macroeconomics, financial markets, and the future of money with live weekly episodes.',
    channelId: 'UC3ol9RQbQHqle_Uly6w9LfA',
    youtubeUrl: 'https://www.youtube.com/channel/UC3ol9RQbQHqle_Uly6w9LfA',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3ol9RQbQHqle_Uly6w9LfA'
  },
  {
    id: 'podcast-3',
    name: 'The Bitcoin Standard Podcast',
    host: 'Saifedean Ammous',
    description: 'Author of "The Bitcoin Standard" exploring Austrian economics, sound money principles, and Bitcoin\'s role in the future of monetary systems.',
    channelId: 'UCmvjlpMSYVeO-i_OfHJyNkA',
    youtubeUrl: 'https://www.youtube.com/@saifedean',
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCmvjlpMSYVeO-i_OfHJyNkA'
  }
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

// Função para buscar vídeo mais recente de um canal do YouTube via RSS
async function fetchLatestVideoFromChannel(channel) {
  try {
    // Usar um proxy CORS para acessar o RSS feed do YouTube
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const rssUrl = encodeURIComponent(channel.rssUrl);
    const response = await fetch(`${proxyUrl}${rssUrl}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
    
    // Buscar o primeiro item (vídeo mais recente)
    const entries = xmlDoc.getElementsByTagName('entry');
    if (entries.length > 0) {
      const firstEntry = entries[0];
      
      // Extrair informações do vídeo
      const title = firstEntry.getElementsByTagName('title')[0]?.textContent || 'Título não disponível';
      const link = firstEntry.getElementsByTagName('link')[0]?.getAttribute('href') || channel.youtubeUrl;
      const published = firstEntry.getElementsByTagName('published')[0]?.textContent || '';
      
      // Extrair thumbnail do vídeo
      const mediaGroup = firstEntry.getElementsByTagName('media:group')[0];
      let thumbnail = '';
      if (mediaGroup) {
        const mediaThumbnails = mediaGroup.getElementsByTagName('media:thumbnail');
        if (mediaThumbnails.length > 0) {
          // Pegar a thumbnail de melhor qualidade (geralmente a última)
          thumbnail = mediaThumbnails[mediaThumbnails.length - 1].getAttribute('url');
        }
      }
      
      // Se não encontrou thumbnail no RSS, extrair ID do vídeo e construir URL da thumbnail
      if (!thumbnail && link) {
        const videoIdMatch = link.match(/watch\?v=([^&]+)/);
        if (videoIdMatch) {
          const videoId = videoIdMatch[1];
          thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
      
      return {
        title: title,
        link: link,
        thumbnail: thumbnail,
        published: published,
        channelName: channel.name
      };
    }
    
    throw new Error('Nenhum vídeo encontrado no feed RSS');
    
  } catch (error) {
    console.error(`Erro ao buscar vídeo mais recente do canal ${channel.name}:`, error);
    
    // Retornar dados de fallback
    return {
      title: `Último vídeo de ${channel.name}`,
      link: channel.youtubeUrl,
      thumbnail: '',
      published: '',
      channelName: channel.name
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
  const minedElement = document.getElementById('bitcoins-mined');
  const progressFillElement = document.querySelector('.supply-progress-fill');
  const progressTextElement = document.querySelector('.supply-progress-text');
  const totalPossibleBitcoins = 21000000;

  if (minedElement && progressFillElement && progressTextElement) {
    try {
      const minedBitcoins = await fetchMinedBitcoins();
      const formattedMinedBitcoins = minedBitcoins.toLocaleString('en-US', { maximumFractionDigits: 0 });
      minedElement.textContent = formattedMinedBitcoins;

      const percentageMined = (minedBitcoins / totalPossibleBitcoins) * 100;
      const remainingBitcoins = totalPossibleBitcoins - minedBitcoins;
      const formattedRemaining = remainingBitcoins.toLocaleString('en-US', { maximumFractionDigits: 0 });

      progressFillElement.style.width = `${percentageMined.toFixed(2)}%`;
      progressTextElement.textContent = `${percentageMined.toFixed(2)}% (${formattedRemaining} remaining)`;
    } catch (error) {
      console.error('Erro ao atualizar métricas de escassez:', error);
    }
  }

  // Atualizar contagem regressiva para o próximo halving
  const daysRemainingElement = document.getElementById('days-remaining');
  if (daysRemainingElement) {
    const nextHalvingDate = new Date('2028-04-01');
    const currentDate = new Date();
    const timeDifference = nextHalvingDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
    daysRemainingElement.textContent = `${daysRemaining} days remaining`;
  }
}

// Função para atualizar dados de sentimento de mercado
async function updateMarketSentiment() {
  try {
    const sentimentData = await fetchMarketSentiment();
    
    // Atualizar Fear & Greed Index
    const fearGreedElement = document.getElementById('fear-greed');
    if (fearGreedElement) {
      const gaugeValue = fearGreedElement.querySelector('.gauge-value');
      const gaugeFill = fearGreedElement.querySelector('.gauge-fill');
      if (gaugeValue && gaugeFill) {
        gaugeValue.textContent = `${sentimentData.fearGreed.value} - ${sentimentData.fearGreed.classification}`;
        gaugeFill.style.width = `${sentimentData.fearGreed.value}%`;
      }
    }
    
    // Atualizar BTC Dominance
    const btcDominanceElement = document.getElementById('btc-dominance');
    if (btcDominanceElement) {
      const gaugeValue = btcDominanceElement.querySelector('.gauge-value');
      const gaugeFill = btcDominanceElement.querySelector('.gauge-fill');
      if (gaugeValue && gaugeFill) {
        gaugeValue.textContent = `${sentimentData.btcDominance}% - Moderate`;
        gaugeFill.style.width = `${sentimentData.btcDominance}%`;
      }
    }
    
    // Atualizar Volatility
    const volatilityElement = document.getElementById('volatility');
    if (volatilityElement) {
      const gaugeValue = volatilityElement.querySelector('.gauge-value');
      const gaugeFill = volatilityElement.querySelector('.gauge-fill');
      if (gaugeValue && gaugeFill) {
        const volatilityLevel = sentimentData.volatility < 5 ? 'Low' : sentimentData.volatility < 10 ? 'Medium' : 'High';
        gaugeValue.textContent = `${sentimentData.volatility.toFixed(1)}% - ${volatilityLevel}`;
        gaugeFill.style.width = `${Math.min(sentimentData.volatility * 5, 100)}%`;
      }
    }
    
    // Atualizar Transaction Volume
    const transactionVolumeElement = document.getElementById('transaction-volume');
    if (transactionVolumeElement) {
      const gaugeValue = transactionVolumeElement.querySelector('.gauge-value');
      const gaugeFill = transactionVolumeElement.querySelector('.gauge-fill');
      if (gaugeValue && gaugeFill) {
        const volumeLevel = sentimentData.transactionVolume > 50 ? 'High' : sentimentData.transactionVolume > 20 ? 'Medium' : 'Low';
        gaugeValue.textContent = `$${sentimentData.transactionVolume}B - ${volumeLevel}`;
        gaugeFill.style.width = `${Math.min(sentimentData.transactionVolume * 2, 100)}%`;
      }
    }
    
    // Atualizar Network Hash Rate
    const hashRateElement = document.getElementById('network-hash-rate');
    if (hashRateElement && sentimentData.hashRate > 0) {
      const gaugeValue = hashRateElement.querySelector('.gauge-value');
      const gaugeFill = hashRateElement.querySelector('.gauge-fill');
      if (gaugeValue && gaugeFill) {
        gaugeValue.textContent = `${sentimentData.hashRate} EH/s - Record High`;
        gaugeFill.style.width = '72%';
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
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex];
  }
}

// Função para carregar thumbnails dos podcasts do YouTube
async function loadPodcastThumbnails() {
  console.log('Carregando thumbnails dos podcasts...');
  
  for (const channel of PODCAST_CHANNELS) {
    try {
      console.log(`Buscando vídeo mais recente do canal: ${channel.name}`);
      const latestVideo = await fetchLatestVideoFromChannel(channel);
      
      // Atualizar a thumbnail e link do podcast
      const thumbnailElement = document.getElementById(`${channel.id}-thumbnail`);
      const linkElement = document.querySelector(`#${channel.id}-link`);
      
      if (thumbnailElement && latestVideo.thumbnail) {
        // Substituir o placeholder pela thumbnail real
        const placeholder = thumbnailElement.querySelector('.podcast-placeholder');
        if (placeholder) {
          const img = document.createElement('img');
          img.src = latestVideo.thumbnail;
          img.alt = latestVideo.title;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '0';
          
          // Adicionar evento de erro para fallback
          img.onerror = function() {
            console.log(`Erro ao carregar thumbnail para ${channel.name}, mantendo placeholder`);
            this.style.display = 'none';
          };
          
          thumbnailElement.innerHTML = '';
          thumbnailElement.appendChild(img);
        }
      }
      
      // Atualizar o link para o vídeo mais recente
      if (linkElement && latestVideo.link) {
        linkElement.href = latestVideo.link;
        linkElement.title = latestVideo.title;
      }
      
      console.log(`✓ Thumbnail carregada para ${channel.name}: ${latestVideo.title}`);
      
    } catch (error) {
      console.error(`Erro ao carregar thumbnail para ${channel.name}:`, error);
    }
  }
}

function toggleSources() {
  const sourcesDiv = document.getElementById('market-cap-sources');
  const toggleButton = document.getElementById('sources-toggle');
  if (sourcesDiv && toggleButton) {
    if (sourcesDiv.style.display === 'none' || sourcesDiv.style.display === '') {
      sourcesDiv.style.display = 'block';
      toggleButton.textContent = 'Hide sources';
    } else {
      sourcesDiv.style.display = 'none';
      toggleButton.textContent = 'Show sources';
    }
  }
}

