// Configuração da API Alpha Vantage
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

const assets = [
  { name: "Bitcoin", price: "$107,016.57", change: "+2.4%", positive: true },
  { name: "Gold", price: "$3,323.10", change: "+0.8%", positive: true },
  { name: "Silver", price: "$33.69", change: "-0.3%", positive: false },
  { name: "10-Year Treasury Yield", price: "4.38%", change: "+0.05%", positive: true },
  { name: "Dollar Index", price: "103.42", change: "-0.2%", positive: false },
  { name: "S&P 500", price: "5,218.24", change: "+0.7%", positive: true }
];

const quotes = [
  "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.",
  "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.",
  "The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "Banks must be trusted to hold our money and transfer it electronically, but they lend it out in waves of credit bubbles with barely a fraction in reserve.",
  "With e-currency based on cryptographic proof, without the need to trust a third party middleman, money can be secure and transactions effortless."
];

// --- Funções de busca de dados com APIs reais --- 

// Função para buscar o preço do Bitcoin usando CoinGecko API (gratuita)
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
    return { name: "Bitcoin", price: "$107,016.57", change: "+2.4%", positive: true };
  }
}

// Função para buscar o preço do Ouro usando Metals API (gratuita)
async function fetchGoldPrice() {
  try {
    const response = await fetch('https://api.metals.live/v1/spot/gold');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const price = data[0].price;
      const yesterdayResponse = await fetch('https://api.metals.live/v1/spot/gold/24h');
      let change = 0;
      let positive = true;
      if (yesterdayResponse.ok) {
        const yesterdayData = await yesterdayResponse.json();
        if (yesterdayData && yesterdayData.length > 0) {
          const oldestPrice = yesterdayData[0].price;
          change = ((price - oldestPrice) / oldestPrice) * 100;
          positive = change >= 0;
        }
      }
      const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Gold", price: formattedPrice, change: formattedChange, positive: positive };
    }
    throw new Error('Resposta inválida da API de Ouro');
  } catch (error) {
    console.error('Erro ao buscar preço do Ouro:', error);
    return { name: "Gold", price: "$3,323.10", change: "+0.8%", positive: true };
  }
}

// Função para buscar o preço da Prata usando Metals API (gratuita)
async function fetchSilverPrice() {
  try {
    const response = await fetch('https://api.metals.live/v1/spot/silver');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const price = data[0].price;
      const yesterdayResponse = await fetch('https://api.metals.live/v1/spot/silver/24h');
      let change = 0;
      let positive = true;
      if (yesterdayResponse.ok) {
        const yesterdayData = await yesterdayResponse.json();
        if (yesterdayData && yesterdayData.length > 0) {
          const oldestPrice = yesterdayData[0].price;
          change = ((price - oldestPrice) / oldestPrice) * 100;
          positive = change >= 0;
        }
      }
      const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Silver", price: formattedPrice, change: formattedChange, positive: positive };
    }
    throw new Error('Resposta inválida da API de Prata');
  } catch (error) {
    console.error('Erro ao buscar preço da Prata:', error);
    return { name: "Silver", price: "$33.69", change: "-0.3%", positive: false };
  }
}

// Função para buscar o rendimento do Treasury de 10 anos usando Alpha Vantage
async function fetchTreasuryYield() {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data.data && data.data.length >= 2) {
      const latestData = data.data[0];
      const previousData = data.data[1];
      const currentYield = parseFloat(latestData.value);
      const previousYield = parseFloat(previousData.value);
      const change = currentYield - previousYield;
      
      const formattedYield = `${currentYield.toFixed(2)}%`;
      const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
      return { name: "10-Year Treasury Yield", price: formattedYield, change: formattedChange, positive: change >= 0 };
    }
    throw new Error('Dados insuficientes da API Treasury');
  } catch (error) {
    console.error('Erro ao buscar Treasury Yield:', error);
    return { name: "10-Year Treasury Yield", price: "4.38%", change: "+0.05%", positive: true };
  }
}

// Função para buscar o Dollar Index usando Alpha Vantage (FX)
async function fetchDollarIndex() {
  try {
    // Usando EUR/USD como proxy para calcular o Dollar Index
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data['Time Series FX (Daily)']) {
      const timeSeries = data['Time Series FX (Daily)'];
      const dates = Object.keys(timeSeries).sort().reverse();
      if (dates.length >= 2) {
        const latestRate = parseFloat(timeSeries[dates[0]]['4. close']);
        const previousRate = parseFloat(timeSeries[dates[1]]['4. close']);
        
        // Aproximação do DXY baseada no EUR/USD (inversamente correlacionado)
        const dxyApprox = 100 / latestRate * 0.95; // Fator de ajuste aproximado
        const previousDxy = 100 / previousRate * 0.95;
        const change = ((dxyApprox - previousDxy) / previousDxy) * 100;
        
        const formattedPrice = dxyApprox.toFixed(2);
        const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
        return { name: "Dollar Index", price: formattedPrice, change: formattedChange, positive: change >= 0 };
      }
    }
    throw new Error('Dados insuficientes da API FX');
  } catch (error) {
    console.error('Erro ao buscar Dollar Index:', error);
    return { name: "Dollar Index", price: "103.42", change: "-0.2%", positive: false };
  }
}

// Função para buscar o S&P 500 usando Alpha Vantage
async function fetchSP500() {
  try {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).sort().reverse();
      if (dates.length >= 2) {
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
    throw new Error('Dados insuficientes da API S&P 500');
  } catch (error) {
    console.error('Erro ao buscar S&P 500:', error);
    return { name: "S&P 500", price: "5,218.24", change: "+0.7%", positive: true };
  }
}

// Função para buscar a quantidade de Bitcoins minerados
async function fetchMinedBitcoins() {
  try {
    const response = await fetch('https://blockchain.info/q/totalbc?cors=true');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const totalbcSatoshis = await response.text();
    const totalbc = parseFloat(totalbcSatoshis) / 100000000; // Converter de satoshis para BTC
    return totalbc;
  } catch (error) {
    console.error('Erro ao buscar Bitcoins minerados:', error);
    return 19368750; // Retorna o valor antigo em caso de erro
  }
}

// Função para buscar dados de sentimento de mercado usando múltiplas APIs
async function fetchMarketSentiment() {
  try {
    // Buscar Fear & Greed Index usando API alternativa
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

    // Buscar dominância do Bitcoin usando CoinGecko
    const dominanceResponse = await fetch('https://api.coingecko.com/api/v3/global');
    let btcDominance = 52;
    
    if (dominanceResponse.ok) {
      const dominanceJson = await dominanceResponse.json();
      if (dominanceJson && dominanceJson.data && dominanceJson.data.market_cap_percentage) {
        btcDominance = dominanceJson.data.market_cap_percentage.btc.toFixed(1);
      }
    }

    // Buscar dados de volatilidade do Bitcoin
    let volatility = 3.8;
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
          volatility = Math.sqrt(variance) * Math.sqrt(365) * 100; // Anualizada
        }
      }
    } catch (error) {
      console.error('Erro ao calcular volatilidade:', error);
    }

    // Buscar volume de transações do Bitcoin
    let transactionVolume = 78.5;
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

    // Buscar hash rate da rede Bitcoin
    let hashRate = 512;
    try {
      const hashRateResponse = await fetch('https://blockchain.info/q/hashrate');
      if (hashRateResponse.ok) {
        const hashRateText = await hashRateResponse.text();
        const hashRateValue = parseFloat(hashRateText);
        if (!isNaN(hashRateValue)) {
          hashRate = (hashRateValue / 1e18).toFixed(0); // Converter para EH/s
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
      btcDominance: 52,
      volatility: 3.8,
      transactionVolume: 78.5,
      hashRate: 512
    };
  }
}

// --- Funções de Renderização e Atualização --- 

// Função para renderizar os indicadores principais (cotações)
function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  quotesContainer.innerHTML = ''; // Limpar antes de adicionar

  fetchAllLatestPrices().then(updatedAssets => {
    const assetsToRender = updatedAssets || assets; // Usa atualizado ou fallback
    assetsToRender.forEach(asset => {
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
    updateFooterPrices(assetsToRender);
  });
}

// Função para buscar todos os preços atualizados
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
    const updatedAssets = [...assets]; // Começa com os valores padrão
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        updatedAssets[index] = result.value;
      }
    });
    return updatedAssets;
  } catch (error) {
    console.error('Erro ao buscar todos os preços atualizados:', error);
    return assets; // Retorna o array original em caso de erro
  }
}

// Função para atualizar as métricas de escassez (Bitcoins Minerados)
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
      console.error('Erro ao atualizar métricas de escassez (Bitcoins Minerados):', error);
      // Mantém os valores estáticos do HTML em caso de erro
    }
  }
}

// Função para atualizar a contagem regressiva do Halving
function updateHalvingCountdown() {
  const daysRemainingElement = document.getElementById('days-remaining');
  const nextHalvingDateElement = document.querySelector('#scarcity-metrics .scarcity-metric:nth-child(4) .scarcity-metric-value'); // Seleciona o elemento da data
  if (!daysRemainingElement || !nextHalvingDateElement) return;

  // Data estimada do próximo halving: 26 de Março de 2028, 00:00:00 UTC
  // Fontes: Swan Bitcoin, Bitbo, CoinGecko (estimativas variam ligeiramente, usando 26 de Março)
  const halvingDate = new Date(Date.UTC(2028, 2, 26, 0, 0, 0)); // Mês é 0-indexado (2 = Março)
  const now = new Date();
  const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

  const diffTime = halvingDate - nowUtc;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 0) {
    daysRemainingElement.textContent = `${diffDays} days remaining`;
    // Atualiza também a data exibida para refletir a estimativa usada
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
        gaugeValue.textContent = `${sentimentData.hashRate} EH/s - Record High`;
        gaugeFill.style.width = `${Math.min((sentimentData.hashRate / 600) * 100, 100)}%`;
      }
    }

    // Atualizar Market Cap do Bitcoin usando dados do CoinGecko
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

// Função para atualizar os preços no rodapé
function updateFooterPrices(currentAssets) {
  const footerPrices = document.getElementById('footer-prices');
  if (!footerPrices) return;
  footerPrices.innerHTML = ''; // Limpar antes de adicionar
  currentAssets.forEach(asset => {
    const priceItem = document.createElement('span');
    priceItem.className = 'footer-price-item';
    priceItem.innerHTML = `<strong>${asset.name}:</strong> ${asset.price} <span class="${asset.positive ? 'positive' : 'negative'}">(${asset.change})</span>`;
    footerPrices.appendChild(priceItem);
  });
}

// Função para atualizar a capitalização de mercado global
async function updateGlobalMarketCap() {
  try {
    // Buscar dados globais de criptomoedas
    const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
    let bitcoinMarketCap = 2.3; // Valor padrão em trilhões
    let totalCryptoMarketCap = 3.5; // Valor padrão em trilhões
    
    if (globalResponse.ok) {
      const globalData = await globalResponse.json();
      if (globalData && globalData.data) {
        bitcoinMarketCap = globalData.data.market_cap_percentage.btc * globalData.data.total_market_cap.usd / 100 / 1e12;
        totalCryptoMarketCap = globalData.data.total_market_cap.usd / 1e12;
      }
    }

    // Atualizar o valor do Bitcoin na visualização
    const bitcoinMarketCapItem = document.querySelector('.market-cap-item:last-child');
    if (bitcoinMarketCapItem) {
      const valueElement = bitcoinMarketCapItem.querySelector('.market-cap-item-value');
      const fillElement = bitcoinMarketCapItem.querySelector('.market-cap-item-fill');
      const percentageElement = bitcoinMarketCapItem.querySelector('.market-cap-item-percentage');
      
      if (valueElement && fillElement && percentageElement) {
        const formattedValue = `$${bitcoinMarketCap.toFixed(1)}T`;
        valueElement.textContent = formattedValue;
        
        // Calcular nova porcentagem baseada no total estimado de $690.7T
        const totalGlobalAssets = 690.7;
        const newPercentage = (bitcoinMarketCap / totalGlobalAssets) * 100;
        fillElement.style.width = `${newPercentage.toFixed(1)}%`;
        percentageElement.textContent = `${newPercentage.toFixed(1)}%`;
      }
    }

    // Atualizar o total de capitalização se necessário
    const totalMarketCapElement = document.getElementById('total-market-cap');
    if (totalMarketCapElement) {
      // Manter o valor total fixo, mas poderia ser atualizado com dados mais precisos
      totalMarketCapElement.textContent = '$690.7T';
    }

  } catch (error) {
    console.error('Erro ao atualizar capitalização de mercado global:', error);
  }
}

// Função para atualizar notícias automaticamente (placeholder para futuras implementações)
async function updateLatestNews() {
  try {
    // Esta função pode ser expandida no futuro para buscar notícias reais
    // Por enquanto, mantém as notícias estáticas do HTML
    console.log('Função de atualização de notícias - placeholder para implementação futura');
  } catch (error) {
    console.error('Erro ao atualizar notícias:', error);
  }
}

// Função para alternar a visibilidade das fontes
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

// --- Inicialização --- 

document.addEventListener('DOMContentLoaded', () => {
  renderQuotes(); // Renderiza cotações iniciais
  updateScarcityMetrics(); // Atualiza métricas de escassez iniciais (Bitcoins)
  updateHalvingCountdown(); // Atualiza contagem regressiva do Halving inicial
  updateMarketSentiment(); // Atualiza sentimento de mercado inicial
  updateGlobalMarketCap(); // Atualiza capitalização de mercado global inicial

  // Atualiza as cotações a cada 5 minutos (300000 ms)
  setInterval(renderQuotes, 300000);
  
  // Atualiza a quantidade de bitcoins minerados a cada 10 minutos (600000 ms)
  setInterval(updateScarcityMetrics, 600000);

  // Atualiza a contagem regressiva do Halving a cada hora (3600000 ms)
  setInterval(updateHalvingCountdown, 3600000);

  // Atualiza o sentimento de mercado a cada 15 minutos (900000 ms)
  setInterval(updateMarketSentiment, 900000);

  // Atualiza a capitalização de mercado global a cada 30 minutos (1800000 ms)
  setInterval(updateGlobalMarketCap, 1800000);

  // Adiciona listener para o botão de fontes
  const sourcesButton = document.getElementById('sources-toggle');
  if (sourcesButton) {
    sourcesButton.addEventListener('click', toggleSources);
  }
});

