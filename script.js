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

// Função para buscar o preço do Bitcoin
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
    // Fallback para valor estático se a API falhar
    return { name: "Bitcoin", price: "$107,016.57", change: "+2.4%", positive: true };
  }
}

// Função para buscar o preço do Ouro
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
    // Fallback para valor estático se a API falhar
    return { name: "Gold", price: "$3,323.10", change: "+0.8%", positive: true };
  }
}

// Função para buscar o preço da Prata
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
    // Fallback para valor estático se a API falhar
    return { name: "Silver", price: "$33.69", change: "-0.3%", positive: false };
  }
}

// Função para buscar o rendimento do Treasury de 10 anos (usando fallback)
async function fetchTreasuryYield() {
  // API FRED requer chave, usando fallback com valores mais recentes
  const yield_value = 4.51; // Valor exemplo de maio 2025
  const change = 0.03; // Variação exemplo
  const formattedYield = `${yield_value.toFixed(2)}%`;
  const formattedChange = change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  return { name: "10-Year Treasury Yield", price: formattedYield, change: formattedChange, positive: change >= 0 };
}

// Função para buscar o Dollar Index (usando fallback)
async function fetchDollarIndex() {
  // API requer chave, usando fallback com valores mais recentes
  const price = 99.11; // Valor exemplo de maio 2025
  const change = -0.85; // Variação exemplo
  const formattedPrice = price.toFixed(2);
  const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  return { name: "Dollar Index", price: formattedPrice, change: formattedChange, positive: change >= 0 };
}

// Função para buscar o S&P 500 (usando fallback)
async function fetchSP500() {
  // API requer chave, usando fallback com valores mais recentes
  const price = 5802.82; // Valor exemplo de maio 2025
  const change = -0.67; // Variação exemplo
  const formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedChange = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  return { name: "S&P 500", price: formattedPrice, change: formattedChange, positive: change >= 0 };
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

  // Atualiza as cotações a cada 5 minutos (300000 ms)
  setInterval(renderQuotes, 300000);
  
  // Atualiza a quantidade de bitcoins minerados a cada 10 minutos (600000 ms)
  setInterval(updateScarcityMetrics, 600000);

  // Atualiza a contagem regressiva do Halving a cada hora (3600000 ms)
  setInterval(updateHalvingCountdown, 3600000);

  // Adiciona listener para o botão de fontes
  const sourcesButton = document.getElementById('sources-toggle');
  if (sourcesButton) {
    sourcesButton.addEventListener('click', toggleSources);
  }
});
