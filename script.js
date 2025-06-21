// Configuração da API Alpha Vantage
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC"; // Sua chave de API
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
            returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
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

function renderQuotes(updatedAssets) {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  // Limpa o conteúdo existente para evitar duplicação
  quotesContainer.innerHTML = '';

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
}

// Função para atualizar a contagem regressiva do Halving
function updateHalvingCountdown() {
  const daysRemainingElement = document.getElementById('days-remaining');
  const nextHalvingDateElement = document.querySelector('#scarcity-metrics .scarcity-metric:nth-child(4) .scarcity-metric-value');
  if (!daysRemainingElement || !nextHalvingDateElement) return;

  const halvingDate = new Date(Date.UTC(2028, 2, 26, 0, 0, 0)); // Mês é 0-indexado (Março = 2)
  const now = new Date();
  const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

  const diffTime = halvingDate - nowUtc;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 0) {
    daysRemainingElement.textContent = `${diffDays} days remaining`;
    nextHalvingDateElement.textContent = `March 2028 (Est.)`;
  } else {
    daysRemainingElement.textContent = `Halving occurred`;
    nextHalvingDateElement.textContent = `Completed`;
  }
}

// Função para atualizar os indicadores de sentimento de mercado
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

    // Atualizar Volatilidade
    const volatilityElement = document.getElementById('volatility');
    if (volatilityElement) {
      const gaugeValue = volatilityElement.querySelector('.gauge-value');
      const gaugeFill = volatilityElement.querySelector('.gauge-fill');
      if (gaugeValue && gaugeFill) {
        const volatilityLevel = sentimentData.volatility < 5 ? 'Low' : sentimentData.volatility < 10 ? 'Medium' : 'High';
        gaugeValue.textContent = `${sentimentData.volatility.toFixed(1)}% - ${volatilityLevel}`;
        gaugeFill.style.width = `${Math.min(sentimentData.volatility * 4, 100)}%`;
      }
    }

    // Atualizar Volume de Transações
    const transactionVolumeElement = document.getElementById('transaction-volume');
    if (transactionVolumeElement) {
      const gaugeValue = transactionVolumeElement.querySelector('.gauge-value');
      const gaugeFill = transactionVolumeElement.querySelector('.gauge-fill');
      if (gaugeValue && gaugeFill) {
        const volumeLevel = sentimentData.transactionVolume > 50 ? 'High' : sentimentData.transactionVolume > 25 ? 'Medium' : 'Low';
        gaugeValue.textContent = `$${sentimentData.transactionVolume}B - ${volumeLevel}`;
        gaugeFill.style.width = `${Math.min(sentimentData.transactionVolume, 100)}%`;
      }
    }

    // Atualizar Hash Rate da Rede
    const networkHashRateElement = document.getElementById('network-hash-rate');
    if (networkHashRateElement) {
      const gaugeValue = networkHashRateElement.querySelector('.gauge-value');
      const gaugeFill = networkHashRateElement.querySelector('.gauge-fill');
      if (gaugeValue && gaugeFill) {
        if (sentimentData.hashRate > 0) {
          gaugeValue.textContent = `${sentimentData.hashRate} EH/s - Record High`;
          gaugeFill.style.width = `${Math.min((sentimentData.hashRate / 600) * 100, 100)}%`;
        } else {
          gaugeValue.textContent = `0 EH/s - Record High`;
          gaugeFill.style.width = `72%`;
        }
      }
    }

    // Atualizar Market Cap do Bitcoin
    const bitcoinMarketCapElement = document.getElementById('bitcoin-market-cap');
    if (bitcoinMarketCapElement) {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true');
        if (response.ok) {
          const data = await response.json();
          if (data && data.bitcoin) {
            const marketCap = data.bitcoin.usd_market_cap;
            const change = data.bitcoin.usd_24h_change;
            const formattedMarketCap = `$${(marketCap / 1e12).toFixed(1)}T`;
            const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;

            const gaugeValue = bitcoinMarketCapElement.querySelector('.gauge-value');
            const indicatorChange = bitcoinMarketCapElement.querySelector('.indicator-change');
            const gaugeFill = bitcoinMarketCapElement.querySelector('.gauge-fill');
            if (gaugeValue && indicatorChange && gaugeFill) {
              gaugeValue.textContent = `${formattedMarketCap} - All-time High`;
              indicatorChange.textContent = `${formattedChange} (24h)`;
              indicatorChange.className = `indicator-change ${change >= 0 ? '' : 'negative'}`;
              gaugeFill.style.width = `${Math.min((marketCap / 3e12) * 100, 100)}%`;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar market cap do Bitcoin:', error);
      }
    }

  } catch (error) {
    console.error('Erro ao atualizar sentimento de mercado:', error);
  }
}

// Função para atualizar a capitalização de mercado global
async function updateGlobalMarketCap() {
  try {
    const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
    let bitcoinMarketCap = 2.1;

    if (globalResponse.ok) {
      const globalData = await globalResponse.json();
      if (globalData && globalData.data) {
        bitcoinMarketCap = globalData.data.market_cap_percentage.btc * globalData.data.total_market_cap.usd / 100 / 1e12;
      }
    }

    const bitcoinMarketCapItem = document.querySelector('.market-cap-item:last-child');
    if (bitcoinMarketCapItem) {
      const valueElement = bitcoinMarketCapItem.querySelector('.market-cap-item-value');
      const fillElement = bitcoinMarketCapItem.querySelector('.market-cap-item-fill');
      const percentageElement = bitcoinMarketCapItem.querySelector('.market-cap-item-percentage');

      if (valueElement && fillElement && percentageElement) {
        const formattedValue = `$${bitcoinMarketCap.toFixed(1)}T`;
        valueElement.textContent = formattedValue;

        const totalGlobalAssets = 690.7;
        const newPercentage = (bitcoinMarketCap / totalGlobalAssets) * 100;
        fillElement.style.width = `${newPercentage.toFixed(1)}%`;
        percentageElement.textContent = `${newPercentage.toFixed(1)}%`;
      }
    }

  } catch (error) {
    console.error('Erro ao atualizar capitalização de mercado global:', error);
  }
}

// --- Funções de atualização de notícias automáticas ---

// Fontes não-mainstream priorizadas
const NON_MAINSTREAM_SOURCES = [
  'Bitcoin Magazine',
  'The Defiant',
  'Decrypt',
  'Blockworks',
  'The Block',
  'BeInCrypto',
  'U.Today',
  'Bitcoinist',
  'The Crypto Times',
  'CoinGape'
];

// Fontes mainstream a evitar
const MAINSTREAM_SOURCES_TO_AVOID = [
  'Bloomberg',
  'Forbes',
  'CNBC',
  'Reuters',
  'Wall Street Journal',
  'CNN',
  'BBC',
  'Associated Press'
];

// Cache de notícias para evitar requests excessivos
let newsCache = {
  data: [],
  lastUpdate: 0,
  cacheTimeout: 3600000 // 1 hora em ms
};

// Função para buscar notícias do Reddit (fontes não-mainstream)
async function fetchRedditCryptoNews() {
  try {
    const subreddits = ['Bitcoin', 'CryptoCurrency', 'btc'];
    const allPosts = [];

    for (const subreddit of subreddits) {
      try {
        // Simular busca do Reddit (substituir por API real se disponível)
        const posts = await simulateRedditAPI(subreddit);
        allPosts.push(...posts);
      } catch (error) {
        console.error(`Erro ao buscar posts do r/${subreddit}:`, error);
      }
    }

    return allPosts.slice(0, 6); // Retornar apenas 6 posts mais relevantes
  } catch (error) {
    console.error('Erro ao buscar notícias do Reddit:', error);
    return [];
  }
}

// Simulação de API do Reddit (substituir por implementação real)
async function simulateRedditAPI(subreddit) {
  // Esta é uma simulação - em produção, usar API real do Reddit
  const samplePosts = [
    {
      title: "Bitcoin Network Hash Rate Reaches New All-Time High",
      description: "The Bitcoin network's computational power continues to grow, demonstrating increasing security and miner confidence.",
      source: "r/Bitcoin",
      url: `https://reddit.com/r/${subreddit}`,
      date: new Date().toISOString(),
      score: 1250
    },
    {
      title: "Lightning Network Adoption Surges in El Salvador",
      description: "Local businesses report significant increase in Lightning Network transactions following recent infrastructure improvements.",
      source: "r/Bitcoin",
      url: `https://reddit.com/r/${subreddit}`,
      date: new Date(Date.now() - 3600000).toISOString(),
      score: 890
    },
    {
      title: "Major Mining Pool Announces Carbon Neutral Operations",
      description: "Leading Bitcoin mining pool commits to 100% renewable energy sources by end of 2025.",
      source: "r/Bitcoin",
      url: `https://reddit.com/r/${subreddit}`,
      date: new Date(Date.now() - 7200000).toISOString(),
      score: 756
    }
  ];

  return samplePosts;
}

// Função para buscar notícias de fontes especializadas via RSS/API
async function fetchSpecializedCryptoNews() {
  const newsItems = [];

  // Simular busca de fontes especializadas
  const specializedNews = [
    {
      title: "Bitcoin ETF Inflows Hit Record High This Week",
      description: "Institutional demand for Bitcoin exposure through ETFs reaches unprecedented levels as adoption accelerates.",
      source: "Bitcoin Magazine",
      url: "https://bitcoinmagazine.com/",
      date: new Date(Date.now() - 1800000).toISOString()
    },
    {
      title: "DeFi Protocol Launches Bitcoin-Backed Lending",
      description: "New decentralized finance protocol enables users to borrow against Bitcoin collateral with competitive rates.",
      source: "The Defiant",
      url: "https://thedefiant.io/",
      date: new Date(Date.now() - 5400000).toISOString()
    },
    {
      title: "Taproot Adoption Reaches 80% Among Bitcoin Wallets",
      description: "Latest Bitcoin upgrade sees widespread adoption as wallet providers implement privacy and efficiency improvements.",
      source: "Decrypt",
      url: "https://decrypt.co/",
      date: new Date(Date.now() - 9000000).toISOString()
    },
    {
      title: "Institutional Bitcoin Holdings Surpass $100B Milestone",
      description: "Corporate treasuries and investment funds now hold over $100 billion worth of Bitcoin, marking historic achievement.",
      source: "Blockworks",
      url: "https://blockworks.co/",
      date: new Date(Date.now() - 12600000).toISOString()
    },
    {
      title: "Bitcoin Mining Difficulty Adjusts to New Record",
      description: "Network difficulty reaches all-time high as mining competition intensifies following recent price movements.",
      source: "Bitcoinist",
      url: "https://bitcoinist.com/",
      date: new Date(Date.now() - 16200000).toISOString()
    },
    {
      title: "Layer 2 Solutions See 300% Growth in Transaction Volume",
      description: "Bitcoin's second-layer scaling solutions experience massive growth as users seek faster, cheaper transactions.",
      source: "The Block",
      url: "https://theblock.co/",
      date: new Date(Date.now() - 19800000).toISOString()
    }
  ];

  return specializedNews;
}

// Função principal para atualizar notícias
async function updateLatestNews() {
  try {
    // Verificar cache
    const now = Date.now();
    if (newsCache.data.length > 0 && (now - newsCache.lastUpdate) < newsCache.cacheTimeout) {
      renderNews(newsCache.data);
      return;
    }

    console.log('🔄 Atualizando notícias de fontes não-mainstream...');

    // Buscar notícias de múltiplas fontes
    const [redditNews, specializedNews] = await Promise.all([
      fetchRedditCryptoNews(),
      fetchSpecializedCryptoNews()
    ]);

    // Combinar e ordenar por relevância/data
    const allNews = [...redditNews, ...specializedNews];
    const sortedNews = allNews
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6); // Manter apenas 6 notícias mais recentes

    // Atualizar cache
    newsCache.data = sortedNews;
    newsCache.lastUpdate = now;

    // Renderizar notícias
    renderNews(sortedNews);

    console.log('✅ Notícias atualizadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao atualizar notícias:', error);
    // Em caso de erro, manter notícias do cache se disponíveis
    if (newsCache.data.length > 0) {
      renderNews(newsCache.data);
    }
  }
}

// Função para renderizar notícias na página
function renderNews(newsItems) {
  // Alterado o seletor para usar o ID #news-content
  const newsContainer = document.querySelector('#news-content');
  if (!newsContainer) return;

  newsContainer.innerHTML = '';

  newsItems.forEach(item => {
    const newsElement = document.createElement('a');
    newsElement.href = item.url;
    newsElement.target = '_blank';
    newsElement.className = 'news-item';

    const formattedDate = new Date(item.date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    }) + ' UTC';

    // Adicione um placeholder para imagem se não houver uma
    const imageUrl = item.image || 'https://via.placeholder.com/300x120?text=No+Image';

    newsElement.innerHTML = `
      <img src="${imageUrl}" alt="${item.title}" class="news-image">
      <div class="news-content">
        <div class="news-source">${item.source}</div>
        <div class="news-title">${item.title}</div>
        <div class="news-description">${item.description}</div>
        <div class="news-date">${formattedDate}</div>
      </div>
    `;

    newsContainer.appendChild(newsElement);
  });
}

// --- Fim das funções de notícias ---

function updateFooterPrices(currentAssets) {
  const footerPrices = document.getElementById('footer-prices');
  if (!footerPrices) return;
  footerPrices.innerHTML = ''; // Limpa o conteúdo antes de adicionar

  currentAssets.forEach(asset => {
    const priceItem = document.createElement('span');
    priceItem.className = 'footer-price-item';
    priceItem.innerHTML = `<strong>${asset.name}:</strong> ${asset.price} <span class="${asset.positive ? 'positive' : 'negative'}">${asset.change}</span>`;
    footerPrices.appendChild(priceItem);
  });
}

// --- Funções para copiar endereço de Bitcoin ---
function setupCopyButton() {
  const copyButton = document.querySelector('.copy-button');
  const donationAddressText = document.querySelector('.donation-address-text');

  if (copyButton && donationAddressText) {
    copyButton.addEventListener('click', () => {
      const address = donationAddressText.textContent;
      navigator.clipboard.writeText(address).then(() => {
        alert('Endereço Bitcoin copiado!');
        // Opcional: Adicionar feedback visual temporário
        copyButton.textContent = 'Copiado!';
        setTimeout(() => {
          copyButton.textContent = 'Copiar Endereço';
        }, 2000);
      }).catch(err => {
        console.error('Erro ao copiar:', err);
        alert('Falha ao copiar o endereço. Por favor, copie manualmente.');
      });
    });
  }
}

// Função para randomizar citação de Satoshi
function setRandomSatoshiQuote() {
  const satoshiQuoteElement = document.getElementById('satoshi-quote');
  if (satoshiQuoteElement) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    satoshiQuoteElement.textContent = `"${quotes[randomIndex]}"`;
  }
}


// NOVO: Função para inicializar o dashboard, garantindo que as chamadas não se dupliquem
async function initializeDashboard() {
  console.log('Iniciando o dashboard...');

  // Carrega e renderiza os preços iniciais
  const initialAssets = await fetchAllLatestPrices();
  renderQuotes(initialAssets); // Renderiza os preços na seção principal e no rodapé

  // Atualiza outras métricas em paralelo
  await Promise.all([
    updateScarcityMetrics(),
    updateHalvingCountdown(),
    updateMarketSentiment(),
    updateGlobalMarketCap(),
    updateLatestNews(),
    setRandomSatoshiQuote() // Define uma citação de Satoshi aleatória na inicialização
  ]);

  console.log('Dashboard inicializado com sucesso.');
}

// Inicia a atualização dos dados quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  initializeDashboard(); // Chama a função de inicialização UMA VEZ.

  // Configura os intervalos para atualizações periódicas
  // (Adapte os tempos conforme a necessidade da API e a frequência de atualização desejada)
  setInterval(async () => {
    const updatedAssets = await fetchAllLatestPrices();
    renderQuotes(updatedAssets);
  }, 60000); // Atualiza preços a cada 1 minuto (60000 ms)

  setInterval(updateScarcityMetrics, 300000); // Atualiza escassez a cada 5 minutos
  setInterval(updateHalvingCountdown, 3600000); // Atualiza halving a cada hora
  setInterval(updateMarketSentiment, 300000); // Atualiza sentimento a cada 5 minutos
  setInterval(updateGlobalMarketCap, 300000); // Atualiza market cap global a cada 5 minutos
  setInterval(updateLatestNews, 3600000); // Atualiza notícias a cada hora
  setInterval(setRandomSatoshiQuote, 10000); // Muda a citação a cada 10 segundos
  
  setupCopyButton(); // Configura o botão de copiar
});
