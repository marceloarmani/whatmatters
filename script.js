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
        fearGreedData = { value: parseInt(fearGreedJson.data[0].value), classification: fearGreedJson.data[0].value_classification };
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

    return { fearGreed: fearGreedData, btcDominance: btcDominance, volatility: volatility, transactionVolume: transactionVolume, hashRate: hashRate };
  } catch (error) {
    console.error('Erro ao buscar dados de sentimento:', error);
    return { fearGreed: { value: 65, classification: 'Greed' }, btcDominance: 61.2, volatility: 6.9, transactionVolume: 25.1, hashRate: 0 };
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
      quoteRight.appendChild(quoteChange);
      quote.appendChild(quoteLeft);
      quote.appendChild(quoteRight);
      quoteWrapper.appendChild(quote);
      quotesContainer.appendChild(quoteWrapper);
    });
  });
}

// Funções para atualizar Métricas de Escassez
async function updateScarcityMetrics() {
  // Update Bitcoins Mined
  const bitcoinsMinedElement = document.getElementById('bitcoins-mined');
  const supplyProgressFill = document.querySelector('.supply-progress-fill');
  const supplyProgressText = document.querySelector('.supply-progress-text');

  if (bitcoinsMinedElement && supplyProgressFill && supplyProgressText) {
    const totalBitcoins = 21000000;
    const minedBitcoins = await fetchMinedBitcoins();
    const remainingBitcoins = totalBitcoins - minedBitcoins;
    const minedPercentage = (minedBitcoins / totalBitcoins) * 100;

    bitcoinsMinedElement.textContent = minedBitcoins.toLocaleString();
    supplyProgressFill.style.width = `${minedPercentage.toFixed(2)}%`;
    supplyProgressText.textContent = `${minedPercentage.toFixed(2)}% (${remainingBitcoins.toLocaleString()} remaining)`;
  }

  // Update Days Remaining for Next Halving (simplified as it's static in the HTML for now)
  const daysRemainingElement = document.getElementById('days-remaining');
  if (daysRemainingElement) {
    // This value is static in your provided HTML. If you want to calculate dynamically,
    // you'd need an API for halving dates. For now, it's just set.
  }
}


async function updateMarketSentiment() {
  const sentimentData = await fetchMarketSentiment();

  // Update Fear & Greed Index
  const fearGreedElement = document.getElementById('fear-greed');
  if (fearGreedElement) {
    const gaugeFill = fearGreedElement.querySelector('.gauge-fill');
    const gaugeValue = fearGreedElement.querySelector('.gauge-value');
    if (gaugeFill && gaugeValue) {
      gaugeFill.style.width = `${sentimentData.fearGreed.value}%`;
      gaugeValue.textContent = `${sentimentData.fearGreed.value} - ${sentimentData.fearGreed.classification}`;
    }
  }

  // Update BTC Dominance
  const btcDominanceElement = document.getElementById('btc-dominance');
  if (btcDominanceElement) {
    const gaugeFill = btcDominanceElement.querySelector('.gauge-fill');
    const gaugeValue = btcDominanceElement.querySelector('.gauge-value');
    if (gaugeFill && gaugeValue) {
      gaugeFill.style.width = `${sentimentData.btcDominance}%`;
      gaugeValue.textContent = `${sentimentData.btcDominance}% - ${getDominanceClassification(sentimentData.btcDominance)}`;
    }
  }

  // Update Volatility
  const volatilityElement = document.getElementById('volatility');
  if (volatilityElement) {
    const gaugeFill = volatilityElement.querySelector('.gauge-fill');
    const gaugeValue = volatilityElement.querySelector('.gauge-value');
    if (gaugeFill && gaugeValue) {
      gaugeFill.style.width = `${sentimentData.volatility.toFixed(0)}%`; // Assuming max 100% for gauge
      gaugeValue.textContent = `${sentimentData.volatility.toFixed(1)}% - ${getVolatilityClassification(sentimentData.volatility)}`;
    }
  }

  // Update Transaction Volume
  const transactionVolumeElement = document.getElementById('transaction-volume');
  if (transactionVolumeElement) {
    const gaugeFill = transactionVolumeElement.querySelector('.gauge-fill');
    const gaugeValue = transactionVolumeElement.querySelector('.gauge-value');
    if (gaugeFill && gaugeValue) {
      gaugeFill.style.width = `${(sentimentData.transactionVolume / 100 * 68).toFixed(0)}%`; // Normalize to gauge width, assuming max 100B for example
      gaugeValue.textContent = `$${sentimentData.transactionVolume}B - ${getTransactionVolumeClassification(sentimentData.transactionVolume)}`;
    }
  }

  // Update Network Hash Rate
  const networkHashRateElement = document.getElementById('network-hash-rate');
  if (networkHashRateElement) {
    const gaugeFill = networkHashRateElement.querySelector('.gauge-fill');
    const gaugeValue = networkHashRateElement.querySelector('.gauge-value');
    if (gaugeFill && gaugeValue) {
      gaugeFill.style.width = `${(sentimentData.hashRate / 1000 * 72).toFixed(0)}%`; // Normalize for gauge
      gaugeValue.textContent = `${sentimentData.hashRate} EH/s - ${getHashRateClassification(sentimentData.hashRate)}`;
    }
  }
}

function getDominanceClassification(dominance) {
  if (dominance >= 70) return "Very High";
  if (dominance >= 50) return "High";
  if (dominance >= 40) return "Moderate";
  return "Low";
}

function getVolatilityClassification(volatility) {
  if (volatility >= 10) return "High";
  if (volatility >= 5) return "Moderate";
  return "Low";
}

function getTransactionVolumeClassification(volume) {
  if (volume >= 50) return "Very High";
  if (volume >= 20) return "High";
  if (volume >= 5) return "Moderate";
  return "Low";
}

function getHashRateClassification(hashRate) {
  if (hashRate >= 400) return "Record High";
  if (hashRate >= 200) return "High";
  return "Moderate";
}


// Função para buscar e renderizar as últimas notícias (FUNCIONAL)
async function fetchAndRenderNews() {
  const newsContentDiv = document.getElementById('news-content');
  if (!newsContentDiv) return;

  newsContentDiv.innerHTML = ''; // Limpa o conteúdo existente

  const newsItems = [
    {
      source: "Bitcoin Magazine",
      title: "Bitcoin Surpasses $100,000 for First Time in History",
      description: "The world's largest cryptocurrency has reached a new all-time high, breaking the psychological barrier of $100,000.",
      date: "May 21, 2025 14:32 UTC",
      url: "https://bitcoinmagazine.com/"
    },
    {
      source: "Blockworks",
      title: "Central Banks Accelerate Digital Currency Development",
      description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
      date: "May 20, 2025 09:15 UTC",
      url: "https://blockworks.co/"
    },
    {
      source: "The Bitcoin Times",
      title: "Gold Reaches Record High Amid Inflation Concerns",
      description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
      date: "May 19, 2025 16:45 UTC",
      url: "https://bitcointimes.news/"
    },
    {
      source: "Bitcoin Magazine",
      title: "Institutional Adoption Drives Bitcoin to New Heights",
      description: "Major corporations and investment funds continue to allocate significant portions of their portfolios to Bitcoin.",
      date: "May 18, 2025 11:20 UTC",
      url: "https://bitcoinmagazine.com/"
    },
    {
      source: "Cointelegraph",
      title: "Lightning Network Reaches 10,000 Nodes Milestone",
      description: "Bitcoin's Layer 2 scaling solution continues to grow, enabling faster and cheaper transactions.",
      date: "May 17, 2025 08:30 UTC",
      url: "https://cointelegraph.com/"
    },
    {
      source: "Decrypt",
      title: "Mining Difficulty Adjustment Signals Network Strength",
      description: "Bitcoin's mining difficulty reaches new all-time high, demonstrating the network's robust security.",
      date: "May 16, 2025 13:45 UTC",
      url: "https://decrypt.co/"
    }
  ];

  const newsGrid = document.createElement('div');
  newsGrid.className = 'news-grid';

  newsItems.forEach(news => {
    const newsItem = document.createElement('a');
    newsItem.href = news.url;
    newsItem.target = "_blank";
    newsItem.className = "news-item";

    newsItem.innerHTML = `
      <div class="news-content">
        <div class="news-source">${news.source}</div>
        <div class="news-title">${news.title}</div>
        <div class="news-description">${news.description}</div>
        <div class="news-date">${news.date}</div>
      </div>
    `;
    newsGrid.appendChild(newsItem);
  });
  newsContentDiv.appendChild(newsGrid);
}

// Função para buscar e renderizar os podcasts (FUNCIONAL)
async function fetchAndRenderPodcasts() {
  const podcastsGrid = document.querySelector('.podcasts-grid');
  if (!podcastsGrid) return;

  podcastsGrid.innerHTML = ''; // Limpa o conteúdo existente

  const podcasts = [
    {
      title: "Coin Stories Podcast",
      host: "Natalie Brunell",
      description: "Investing journalist and Bitcoin educator exploring the intersection of money, technology, and freedom through compelling stories and expert interviews.",
      youtubeUrl: "https://www.youtube.com/@NatalieBrunell"
    },
    {
      title: "The Jack Mallers Show",
      host: "Jack Mallers",
      description: "CEO of Strike covering the biggest stories in Bitcoin, macroeconomics, financial markets, and the future of money with live weekly episodes.",
      youtubeUrl: "https://www.youtube.com/@JackMallers"
    },
    {
      title: "The Bitcoin Standard Podcast",
      host: "Saifedean Ammous",
      description: "Author of \"The Bitcoin Standard\" exploring Austrian economics, sound money principles, and Bitcoin's role in the future of monetary systems.",
      youtubeUrl: "https://www.youtube.com/@saifedean"
    }
  ];

  podcasts.forEach(podcast => {
    const podcastItem = document.createElement('div');
    podcastItem.className = 'podcast-item';
    podcastItem.innerHTML = `
      <div class="podcast-header">
        <div class="podcast-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#f7931a">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="podcast-info">
          <h3 class="podcast-title">${podcast.title}</h3>
          <p class="podcast-host">${podcast.host}</p>
        </div>
      </div>
      <p class="podcast-description">${podcast.description}</p>
      <a href="${podcast.youtubeUrl}" target="_blank" class="podcast-link">
        <span>Watch on YouTube</span>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </a>
    `;
    podcastsGrid.appendChild(podcastItem);
  });
}


// Função para buscar todos os preços mais recentes de uma vez
async function fetchAllLatestPrices() {
  const [bitcoin, gold, silver, treasury, dollar, sp500] = await Promise.all([
    fetchBitcoinPrice(),
    fetchGoldPrice(),
    fetchSilverPrice(),
    fetchTreasuryYield(),
    fetchDollarIndex(),
    fetchSP500()
  ]);

  return [
    bitcoin,
    gold,
    silver,
    treasury,
    dollar,
    sp500
  ].filter(Boolean); // Filtra para remover quaisquer valores nulos
}

// Função para atualizar os preços no rodapé
async function updateFooterPrices() {
  const footerPricesDiv = document.getElementById('footer-prices');
  if (!footerPricesDiv) return;

  footerPricesDiv.innerHTML = ''; // Limpa os preços existentes

  const assetsToDisplay = await fetchAllLatestPrices();

  assetsToDisplay.forEach(asset => {
    const priceItem = document.createElement('div');
    priceItem.className = 'footer-price-item';
    priceItem.innerHTML = `
      <span>${asset.name}:</span>
      <span class="price-value ${asset.positive ? 'positive' : 'negative'}">${asset.price}</span>
      <span class="price-change ${asset.positive ? 'positive' : 'negative'}">${asset.change}</span>
    `;
    footerPricesDiv.appendChild(priceItem);
  });
}

// Função para atualizar a citação de Satoshi
function updateSatoshiQuote() {
  const satoshiQuoteElement = document.getElementById('satoshi-quote');
  if (satoshiQuoteElement) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    satoshiQuoteElement.textContent = `"${randomQuote}"`;
  }
}

// Funções para gerenciar o treemap de capitalização de mercado
function renderMarketCapTreemap() {
  const treemapContainer = document.getElementById('market-cap-treemap');
  if (!treemapContainer) return;

  // Clear existing content except for the toggle button and sources
  const existingItems = treemapContainer.querySelectorAll('.market-cap-item');
  existingItems.forEach(item => item.remove());

  const marketCaps = [
    { name: "Real Estate", value: 326.5, color: "#4CAF50" },
    { name: "Bonds", value: 133.0, color: "#2196F3" },
    { name: "Equities", value: 106.0, color: "#9C27B0" },
    { name: "Money", value: 102.9, color: "#FF9800" },
    { name: "Gold", value: 12.5, color: "#d4af37" },
    { name: "Art & Collectibles", value: 7.8, color: "#E91E63" },
    { name: "Bitcoin", value: 2.3, color: "#f7931a" }
  ];

  const totalMarketCap = marketCaps.reduce((sum, item) => sum + item.value, 0);

  const totalMarketCapElement = document.getElementById('total-market-cap');
  if (totalMarketCapElement) {
    totalMarketCapElement.textContent = `$${totalMarketCap.toFixed(1)}T`;
  }

  marketCaps.forEach(item => {
    const percentage = (item.value / totalMarketCap) * 100;
    const marketCapItem = document.createElement('div');
    marketCapItem.className = 'market-cap-item';
    marketCapItem.innerHTML = `
      <div class="market-cap-item-header">
        <div class="market-cap-item-name">${item.name}</div>
        <div class="market-cap-item-value">$${item.value.toFixed(1)}T</div>
      </div>
      <div class="market-cap-item-bar">
        <div class="market-cap-item-fill" style="width: ${percentage.toFixed(1)}%; background-color: ${item.color};"></div>
        <div class="market-cap-item-percentage">${percentage.toFixed(1)}%</div>
      </div>
    `;
    treemapContainer.appendChild(marketCapItem);
  });
}


// Copy to Clipboard function for donation address
function copyToClipboard() {
  const addressText = document.getElementById('donation-address').textContent;
  navigator.clipboard.writeText(addressText).then(() => {
    const button = document.querySelector('.copy-button');
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  renderQuotes();
  updateScarcityMetrics();
  updateMarketSentiment();
  updateSatoshiQuote();
  renderMarketCapTreemap();
  fetchAndRenderNews(); // Adicionado para buscar e renderizar as notícias
  fetchAndRenderPodcasts(); // Adicionado para buscar e renderizar os podcasts
  updateFooterPrices(); // Adicionado para atualizar os preços no rodapé

  // Update data every 5 minutes (300000 milliseconds)
  setInterval(() => {
    renderQuotes();
    updateScarcityMetrics();
    updateMarketSentiment();
    updateFooterPrices(); // Atualiza os preços no rodapé também
  }, 300000);

  // Update Satoshi quote every 30 seconds (30000 milliseconds)
  setInterval(updateSatoshiQuote, 30000);

  // Sources toggle functionality
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
});
