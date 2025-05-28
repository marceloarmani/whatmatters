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

// --- Funções de busca de dados --- 

// Chave API Alpha Vantage
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";

// Função para buscar o preço do Bitcoin via Alpha Vantage
async function fetchBitcoinPrice() {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data['Realtime Currency Exchange Rate']) {
      const exchangeData = data['Realtime Currency Exchange Rate'];
      const price = parseFloat(exchangeData['5. Exchange Rate']);
      
      // Buscar dados de 24h atrás para calcular a variação
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Tentar obter a variação de preço das últimas 24h
      let change = 0;
      try {
        const dailyResponse = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          if (dailyData && dailyData['Time Series (Digital Currency Daily)']) {
            const timeSeriesData = dailyData['Time Series (Digital Currency Daily)'];
            const dates = Object.keys(timeSeriesData).sort().reverse();
            if (dates.length >= 2) {
              const todayClose = parseFloat(timeSeriesData[dates[0]]['4a. close (USD)']);
              const yesterdayClose = parseFloat(timeSeriesData[dates[1]]['4a. close (USD)']);
              change = ((todayClose - yesterdayClose) / yesterdayClose) * 100;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar variação do Bitcoin:', error);
        // Fallback para variação estimada
        change = ((price - price * 0.98) / (price * 0.98)) * 100;
      }
      
      const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Bitcoin", price: formattedPrice, change: formattedChange, positive: change >= 0 };
    }
    throw new Error('Resposta inválida da API Alpha Vantage para Bitcoin');
  } catch (error) {
    console.error('Erro ao buscar preço do Bitcoin:', error);
    // Tentar API alternativa (CoinGecko) se Alpha Vantage falhar
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
    } catch (backupError) {
      console.error('Erro na API de backup para Bitcoin:', backupError);
    }
    // Fallback para valor estático se ambas as APIs falharem
    return { name: "Bitcoin", price: "$107,016.57", change: "+2.4%", positive: true };
  }
}

// Função para buscar o preço do Ouro via Alpha Vantage
async function fetchGoldPrice() {
  try {
    // Alpha Vantage usa XAU como símbolo para ouro
    const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data['Realtime Currency Exchange Rate']) {
      const exchangeData = data['Realtime Currency Exchange Rate'];
      const price = parseFloat(exchangeData['5. Exchange Rate']);
      
      // Buscar dados históricos para calcular a variação
      let change = 0;
      try {
        const dailyResponse = await fetch(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=XAU&to_symbol=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          if (dailyData && dailyData['Time Series FX (Daily)']) {
            const timeSeriesData = dailyData['Time Series FX (Daily)'];
            const dates = Object.keys(timeSeriesData).sort().reverse();
            if (dates.length >= 2) {
              const todayClose = parseFloat(timeSeriesData[dates[0]]['4. close']);
              const yesterdayClose = parseFloat(timeSeriesData[dates[1]]['4. close']);
              change = ((todayClose - yesterdayClose) / yesterdayClose) * 100;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar variação do Ouro:', error);
        // Fallback para variação estimada
        change = ((price - price * 0.99) / (price * 0.99)) * 100;
      }
      
      const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Gold", price: formattedPrice, change: formattedChange, positive: change >= 0 };
    }
    throw new Error('Resposta inválida da API Alpha Vantage para Ouro');
  } catch (error) {
    console.error('Erro ao buscar preço do Ouro:', error);
    // Tentar API alternativa (metals.live) se Alpha Vantage falhar
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
    } catch (backupError) {
      console.error('Erro na API de backup para Ouro:', backupError);
    }
    // Fallback para valor estático se ambas as APIs falharem
    return { name: "Gold", price: "$3,323.10", change: "+0.8%", positive: true };
  }
}

// Função para buscar o preço da Prata via Alpha Vantage
async function fetchSilverPrice() {
  try {
    // Alpha Vantage usa XAG como símbolo para prata
    const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAG&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data['Realtime Currency Exchange Rate']) {
      const exchangeData = data['Realtime Currency Exchange Rate'];
      const price = parseFloat(exchangeData['5. Exchange Rate']);
      
      // Buscar dados históricos para calcular a variação
      let change = 0;
      try {
        const dailyResponse = await fetch(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=XAG&to_symbol=USD&apikey=${ALPHA_VANTAGE_API_KEY}`);
        if (dailyResponse.ok) {
          const dailyData = await dailyResponse.json();
          if (dailyData && dailyData['Time Series FX (Daily)']) {
            const timeSeriesData = dailyData['Time Series FX (Daily)'];
            const dates = Object.keys(timeSeriesData).sort().reverse();
            if (dates.length >= 2) {
              const todayClose = parseFloat(timeSeriesData[dates[0]]['4. close']);
              const yesterdayClose = parseFloat(timeSeriesData[dates[1]]['4. close']);
              change = ((todayClose - yesterdayClose) / yesterdayClose) * 100;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar variação da Prata:', error);
        // Fallback para variação estimada
        change = ((price - price * 0.99) / (price * 0.99)) * 100;
      }
      
      const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
      return { name: "Silver", price: formattedPrice, change: formattedChange, positive: change >= 0 };
    }
    throw new Error('Resposta inválida da API Alpha Vantage para Prata');
  } catch (error) {
    console.error('Erro ao buscar preço da Prata:', error);
    // Tentar API alternativa (metals.live) se Alpha Vantage falhar
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
    } catch (backupError) {
      console.error('Erro na API de backup para Prata:', backupError);
    }
    // Fallback para valor estático se ambas as APIs falharem
    return { name: "Silver", price: "$33.69", change: "-0.3%", positive: false };
  }
}

// Função para buscar o rendimento do Treasury de 10 anos via Alpha Vantage
async function fetchTreasuryYield() {
  try {
    // Alpha Vantage usa o símbolo TNX para o rendimento do Treasury de 10 anos
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TNX&apikey=${ALPHA_VANTAGE_API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      // O valor retornado é multiplicado por 10, então precisamos dividir por 10
      const yield_value = parseFloat(data['Global Quote']['05. price']) / 10;
      const change_percent = parseFloat(data['Global Quote']['10. change percent'].replace('%', '')) / 10;
      
      const formattedYield = `${yield_value.toFixed(2)}%`;
      const formattedChange = change_percent >= 0 ? `+${change_percent.toFixed(2)}%` : `${change_percent.toFixed(2)}%`;
      return { name: "10-Year Treasury Yield", price: formattedYield, change: formattedChange, positive: change_percent >= 0 };
    }
    throw new Error('Resposta inválida da API Alpha Vantage para Treasury Yield');
  } catch (error) {
    console.error('Erro ao buscar rendimento do Treasury:', error);
    // Fallback para valor estático
    const yield_value = 4.51; // Valor exemplo de maio 2025
    const change = 0.03; // Variação exemplo
    const formattedYield = `${yield_value.toFixed(2)}%`;
    const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
    return { name: "10-Year Treasury Yield", price: formattedYield, change: formattedChange, positive: change >= 0 };
  }
}

// Função para buscar o Dollar Index via Alpha Vantage
async function fetchDollarIndex() {
  try {
    // Alpha Vantage usa o símbolo DXY para o Dollar Index
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DXY&apikey=${ALPHA_VANTAGE_API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']);
      const change_percent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));
      
      const formattedPrice = price.toFixed(2);
      const formattedChange = change_percent >= 0 ? `+${change_percent.toFixed(1)}%` : `${change_percent.toFixed(1)}%`;
      return { name: "Dollar Index", price: formattedPrice, change: formattedChange, positive: change_percent >= 0 };
    }
    throw new Error('Resposta inválida da API Alpha Vantage para Dollar Index');
  } catch (error) {
    console.error('Erro ao buscar Dollar Index:', error);
    // Fallback para valor estático
    const price = 99.11; // Valor exemplo de maio 2025
    const change = -0.85; // Variação exemplo
    const formattedPrice = price.toFixed(2);
    const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    return { name: "Dollar Index", price: formattedPrice, change: formattedChange, positive: change >= 0 };
  }
}

// Função para buscar o S&P 500 via Alpha Vantage
async function fetchSP500() {
  try {
    // Alpha Vantage usa o símbolo SPX para o S&P 500
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPX&apikey=${ALPHA_VANTAGE_API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']);
      const change_percent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));
      
      const formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const formattedChange = change_percent >= 0 ? `+${change_percent.toFixed(1)}%` : `${change_percent.toFixed(1)}%`;
      return { name: "S&P 500", price: formattedPrice, change: formattedChange, positive: change_percent >= 0 };
    }
    throw new Error('Resposta inválida da API Alpha Vantage para S&P 500');
  } catch (error) {
    console.error('Erro ao buscar S&P 500:', error);
    // Fallback para valor estático
    const price = 5802.82; // Valor exemplo de maio 2025
    const change = -0.67; // Variação exemplo
    const formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    return { name: "S&P 500", price: formattedPrice, change: formattedChange, positive: change >= 0 };
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

// Função para buscar o número atual de blocos na blockchain do Bitcoin
async function fetchBitcoinBlockCount() {
  try {
    const response = await fetch('https://blockchain.info/q/getblockcount?cors=true');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blockCount = await response.text();
    return parseInt(blockCount);
  } catch (error) {
    console.error('Erro ao buscar contagem de blocos Bitcoin:', error);
    return 840000; // Valor aproximado para maio de 2025 como fallback
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

// Função para atualizar as métricas de escassez (Bitcoins Minerados e Blocos)
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

      // Adicionar contagem de blocos ao título da métrica
      const blockCount = await fetchBitcoinBlockCount();
      const bitcoinsTitleElement = document.querySelector('#scarcity-metrics .scarcity-metric:nth-child(3) .scarcity-metric-title');
      if (bitcoinsTitleElement) {
        bitcoinsTitleElement.textContent = `Bitcoins Mined (Block ${blockCount.toLocaleString('en-US')})`;
      }

    } catch (error) {
      console.error('Erro ao atualizar métricas de escassez (Bitcoins Minerados):', error);
      // Mantém os valores estáticos do HTML em caso de erro
    }
  }
}

// Função para atualizar a contagem regressiva do Halving
async function updateHalvingCountdown() {
  const daysRemainingElement = document.getElementById('days-remaining');
  const nextHalvingDateElement = document.querySelector('#scarcity-metrics .scarcity-metric:nth-child(4) .scarcity-metric-value'); // Seleciona o elemento da data
  if (!daysRemainingElement || !nextHalvingDateElement) return;

  try {
    // Buscar o número atual de blocos
    const currentBlock = await fetchBitcoinBlockCount();
    
    // Calcular o próximo halving (a cada 210.000 blocos)
    const blockInterval = 210000;
    const nextHalvingBlock = Math.ceil(currentBlock / blockInterval) * blockInterval;
    const blocksRemaining = nextHalvingBlock - currentBlock;
    
    // Estimar a data com base na média de 10 minutos por bloco
    const minutesPerBlock = 10;
    const minutesRemaining = blocksRemaining * minutesPerBlock;
    const daysRemaining = Math.floor(minutesRemaining / (60 * 24));
    
    // Calcular a data estimada do halving
    const now = new Date();
    const halvingDate = new Date(now.getTime() + (minutesRemaining * 60 * 1000));
    const halvingMonth = halvingDate.toLocaleString('en-US', { month: 'long' });
    const halvingYear = halvingDate.getFullYear();
    
    if (daysRemaining >= 0) {
      daysRemainingElement.textContent = `${daysRemaining.toLocaleString('en-US')} days remaining (${blocksRemaining.toLocaleString('en-US')} blocks)`;
      nextHalvingDateElement.textContent = `${halvingMonth} ${halvingYear} (Est.)`;
    } else {
      daysRemainingElement.textContent = `Halving occurred`;
      nextHalvingDateElement.textContent = `Completed`;
    }
  } catch (error) {
    console.error('Erro ao atualizar contagem regressiva do Halving:', error);
    
    // Fallback para estimativa fixa se a API falhar
    // Data estimada do próximo halving: 26 de Março de 2028, 00:00:00 UTC
    const halvingDate = new Date(Date.UTC(2028, 2, 26, 0, 0, 0)); // Mês é 0-indexado (2 = Março)
    const now = new Date();
    const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    const diffTime = halvingDate - nowUtc;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) {
      daysRemainingElement.textContent = `${diffDays.toLocaleString('en-US')} days remaining`;
      nextHalvingDateElement.textContent = `March 2028 (Est.)`;
    } else {
      daysRemainingElement.textContent = `Halving occurred`;
      nextHalvingDateElement.textContent = `Completed`;
    }
  }
}

// Eventos para a agenda
const events = [
  {
    date: new Date(2025, 4, 27), // 27 de maio de 2025
    endDate: new Date(2025, 4, 29), // 29 de maio de 2025
    title: "Bitcoin 2025 Conference",
    description: "Largest annual Bitcoin event in Miami",
    impact: "medium"
  },
  {
    date: new Date(2025, 5, 11), // 11 de junho de 2025
    title: "US Inflation Report",
    description: "Consumer Price Index (CPI) release",
    impact: "high"
  },
  {
    date: new Date(2025, 5, 17), // 17 de junho de 2025
    endDate: new Date(2025, 5, 18), // 18 de junho de 2025
    title: "FOMC Meeting",
    description: "Federal Reserve interest rate decision",
    impact: "high"
  },
  {
    date: new Date(2025, 6, 3), // 3 de julho de 2025
    title: "US Employment Report",
    description: "US labor market data",
    impact: "medium"
  }
];

// Função para renderizar eventos ordenados por data
function renderEvents() {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;
  
  // Ordenar eventos por proximidade da data
  const sortedEvents = [...events].sort((a, b) => a.date - b.date);
  
  // Criar grid para os eventos
  const eventsGrid = document.createElement('div');
  eventsGrid.className = 'events-grid';
  
  // Adicionar eventos ordenados
  sortedEvents.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${event.impact}`;
    
    const eventDate = document.createElement('div');
    eventDate.className = 'event-date';
    
    // Formatar a data do evento
    let dateSpan = document.createElement('span');
    if (event.endDate) {
      const options = { month: 'long', day: 'numeric' };
      const startFormatted = event.date.toLocaleDateString('en-US', options);
      const endFormatted = event.endDate.toLocaleDateString('en-US', options);
      dateSpan.textContent = `${startFormatted}-${event.endDate.getDate()}, ${event.date.getFullYear()}`;
    } else {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      dateSpan.textContent = event.date.toLocaleDateString('en-US', options);
    }
    
    eventDate.appendChild(dateSpan);
    
    // Adicionar indicador de impacto
    const eventImpact = document.createElement('div');
    eventImpact.className = 'event-impact';
    for (let i = 0; i < 3; i++) {
      const impactDot = document.createElement('div');
      impactDot.className = 'impact-dot';
      eventImpact.appendChild(impactDot);
    }
    eventDate.appendChild(eventImpact);
    
    const eventTitle = document.createElement('div');
    eventTitle.className = 'event-title';
    eventTitle.textContent = event.title;
    
    const eventDescription = document.createElement('div');
    eventDescription.className = 'event-description';
    eventDescription.textContent = event.description;
    
    eventItem.appendChild(eventDate);
    eventItem.appendChild(eventTitle);
    eventItem.appendChild(eventDescription);
    
    eventsGrid.appendChild(eventItem);
  });
  
  // Limpar e adicionar a nova grid
  eventsContainer.innerHTML = '';
  eventsContainer.appendChild(eventsGrid);
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
  renderEvents(); // Renderiza eventos ordenados por data

  // Atualiza as cotações a cada 1 minuto (60000 ms)
  setInterval(renderQuotes, 60000);
  
  // Atualiza a quantidade de bitcoins minerados e contagem de blocos a cada 2 minutos (120000 ms)
  setInterval(updateScarcityMetrics, 120000);

  // Atualiza a contagem regressiva do Halving a cada 10 minutos (600000 ms)
  setInterval(updateHalvingCountdown, 600000);

  // Adiciona listener para o botão de fontes
  const sourcesButton = document.getElementById('sources-toggle');
  if (sourcesButton) {
    sourcesButton.addEventListener('click', toggleSources);
  }
});
