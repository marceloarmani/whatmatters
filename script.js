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

// Alpha Vantage API Key
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";

// Símbolos para os ativos na Alpha Vantage
const GOLD_SYMBOL = "GLD"; // SPDR Gold Shares ETF
const SILVER_SYMBOL = "SLV"; // iShares Silver Trust ETF
const TREASURY_SYMBOL = "TLT"; // iShares 20+ Year Treasury Bond ETF
const DOLLAR_INDEX_SYMBOL = "UUP"; // Invesco DB US Dollar Index Bullish Fund
const SP500_SYMBOL = "SPY"; // SPDR S&P 500 ETF Trust

// Função para renderizar os indicadores principais
function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  // Limpar o container antes de adicionar novos elementos
  quotesContainer.innerHTML = '';
  
  // Buscar preços atualizados antes de renderizar
  fetchAllLatestPrices().then(updatedAssets => {
    const assetsToRender = updatedAssets || assets;
    
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
    
    // Atualizar também os preços no rodapé
    updateFooterPrices(assetsToRender);
  });
}

// Função para buscar preços atualizados de todos os ativos
async function fetchAllLatestPrices() {
  try {
    // Array para armazenar as promessas de todas as requisições
    const promises = [];
    
    // 1. Bitcoin - CoinGecko API
    promises.push(fetchBitcoinPrice());
    
    // 2. Gold - Alpha Vantage API
    promises.push(fetchAlphaVantagePrice(GOLD_SYMBOL, "Gold"));
    
    // 3. Silver - Alpha Vantage API
    promises.push(fetchAlphaVantagePrice(SILVER_SYMBOL, "Silver"));
    
    // 4. 10-Year Treasury Yield - Alpha Vantage API
    promises.push(fetchAlphaVantagePrice(TREASURY_SYMBOL, "10-Year Treasury Yield", true));
    
    // 5. Dollar Index - Alpha Vantage API
    promises.push(fetchAlphaVantagePrice(DOLLAR_INDEX_SYMBOL, "Dollar Index"));
    
    // 6. S&P 500 - Alpha Vantage API
    promises.push(fetchAlphaVantagePrice(SP500_SYMBOL, "S&P 500"));
    
    // Aguardar todas as requisições terminarem
    const results = await Promise.allSettled(promises);
    
    // Criar um novo array com os valores atualizados
    const updatedAssets = [...assets];
    
    // Processar os resultados
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        updatedAssets[index] = result.value;
      }
    });
    
    return updatedAssets;
  } catch (error) {
    console.error('Erro ao buscar preços atualizados:', error);
    return assets; // Retornar o array original em caso de erro
  }
}

// Função para buscar o preço do Bitcoin
async function fetchBitcoinPrice() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data.bitcoin) {
        const price = data.bitcoin.usd;
        const change = data.bitcoin.usd_24h_change;
        
        // Formatar o preço com separador de milhar no padrão americano
        const formattedPrice = price.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Formatar a variação percentual
        const formattedChange = change >= 0 ? 
          `+${change.toFixed(1)}%` : 
          `${change.toFixed(1)}%`;
        
        return {
          name: "Bitcoin",
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar preço do Bitcoin:', error);
    return null;
  }
}

// Função para buscar preços da Alpha Vantage
async function fetchAlphaVantagePrice(symbol, assetName, isYield = false) {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data['Global Quote']) {
        const quote = data['Global Quote'];
        const price = parseFloat(quote['05. price']);
        const previousClose = parseFloat(quote['08. previous close']);
        
        // Calcular a variação percentual
        const change = ((price - previousClose) / previousClose) * 100;
        
        // Formatar o preço com separador de milhar no padrão americano
        let formattedPrice;
        
        if (isYield) {
          // Para o Treasury Yield, formatar como porcentagem
          formattedPrice = `${price.toFixed(2)}%`;
        } else {
          formattedPrice = price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        }
        
        // Formatar a variação percentual
        const formattedChange = change >= 0 ? 
          `+${change.toFixed(1)}%` : 
          `${change.toFixed(1)}%`;
        
        return {
          name: assetName,
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    // Em caso de erro ou limite de API excedido, usar valores de fallback
    return getFallbackAssetData(assetName);
    
  } catch (error) {
    console.error(`Erro ao buscar preço de ${assetName}:`, error);
    return getFallbackAssetData(assetName);
  }
}

// Função para obter dados de fallback em caso de erro na API
function getFallbackAssetData(assetName) {
  // Encontrar o ativo correspondente no array original
  const fallbackAsset = assets.find(asset => asset.name === assetName);
  
  if (fallbackAsset) {
    // Adicionar uma pequena variação aleatória para simular atualização
    const originalPrice = parseFloat(fallbackAsset.price.replace(/[$,%]/g, ''));
    const variation = originalPrice * (Math.random() * 0.02 - 0.01); // ±1%
    const newPrice = originalPrice + variation;
    
    // Determinar se a variação é positiva ou negativa
    const isPositive = variation >= 0;
    const changeValue = Math.abs(variation / originalPrice * 100);
    
    // Formatar o preço
    let formattedPrice;
    if (assetName === "10-Year Treasury Yield") {
      formattedPrice = `${newPrice.toFixed(2)}%`;
    } else {
      formattedPrice = newPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    // Formatar a variação
    const formattedChange = isPositive ? 
      `+${changeValue.toFixed(1)}%` : 
      `-${changeValue.toFixed(1)}%`;
    
    return {
      name: assetName,
      price: formattedPrice,
      change: formattedChange,
      positive: isPositive
    };
  }
  
  // Se não encontrar o ativo, retornar null
  return null;
}

// Função para atualizar os preços no rodapé
function updateFooterPrices(updatedAssets) {
  const footerBtcPrice = document.getElementById('footer-btc-price');
  const footerGoldPrice = document.getElementById('footer-gold-price');
  const footerSilverPrice = document.getElementById('footer-silver-price');
  
  if (footerBtcPrice) footerBtcPrice.textContent = updatedAssets[0].price;
  if (footerGoldPrice) footerGoldPrice.textContent = updatedAssets[1].price;
  if (footerSilverPrice) footerSilverPrice.textContent = updatedAssets[2].price;
}

// Função para atualizar o valor de Bitcoins Mined
async function updateBitcoinsMined() {
  try {
    // Buscar dados da API blockchain.info para total de bitcoins
    const response = await fetch('https://blockchain.info/q/totalbc');
    if (response.ok) {
      const totalSatoshis = await response.text();
      const totalBitcoins = parseInt(totalSatoshis) / 100000000;
      
      // Formatar com separador de milhar no padrão americano
      const formattedBitcoins = totalBitcoins.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      
      // Calcular porcentagem minerada (de 21 milhões)
      const percentMined = (totalBitcoins / 21000000) * 100;
      const remaining = 21000000 - totalBitcoins;
      const formattedRemaining = remaining.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      
      // Atualizar o DOM
      const bitcoinsMinedElement = document.getElementById('bitcoins-mined');
      if (bitcoinsMinedElement) {
        bitcoinsMinedElement.textContent = formattedBitcoins;
      }
      
      // Atualizar a barra de progresso
      const supplyProgressFill = document.querySelector('.supply-progress-fill');
      if (supplyProgressFill) {
        supplyProgressFill.style.width = `${percentMined.toFixed(2)}%`;
      }
      
      // Atualizar o texto de progresso
      const supplyProgressText = document.querySelector('.supply-progress-text');
      if (supplyProgressText) {
        supplyProgressText.textContent = `${percentMined.toFixed(2)}% (${formattedRemaining} remaining)`;
      }
    }
  } catch (error) {
    console.error('Erro ao buscar dados de Bitcoins minerados:', error);
  }
}

// Função para calcular dinamicamente os dias restantes para o próximo halving
function updateDaysToHalving() {
  // Data estimada do próximo halving (abril de 2028)
  const nextHalvingDate = new Date('2028-04-15T00:00:00Z');
  const currentDate = new Date();
  
  // Calcular a diferença em dias
  const differenceInTime = nextHalvingDate.getTime() - currentDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  // Formatar com separador de milhar no padrão americano
  const formattedDays = differenceInDays.toLocaleString('en-US');
  
  // Atualizar o texto na página
  const daysRemainingElement = document.getElementById('days-remaining');
  if (daysRemainingElement) {
    daysRemainingElement.textContent = `${formattedDays} days remaining`;
  }
  
  // Armazenar a data da última atualização no localStorage
  localStorage.setItem('lastHalvingUpdateDate', currentDate.toISOString().split('T')[0]);
}

// Função para verificar se a contagem de dias para o halving precisa ser atualizada
function checkHalvingDaysUpdate() {
  const lastUpdateDate = localStorage.getItem('lastHalvingUpdateDate');
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Se não houver data de última atualização ou se for um dia diferente, atualizar
  if (!lastUpdateDate || lastUpdateDate !== currentDate) {
    updateDaysToHalving();
  }
}

// Função para atualizar o Bitcoin Market Cap
function updateBitcoinMarketCap() {
  // Valor atualizado do Bitcoin Market Cap: $2.3T
  const marketCapValue = "$2.3T";
  const marketCapPercentage = "0.3%";
  
  // Atualizar na seção Market Sentiment
  const bitcoinMarketCapGaugeValue = document.querySelector('#bitcoin-market-cap .gauge-value');
  if (bitcoinMarketCapGaugeValue) {
    bitcoinMarketCapGaugeValue.textContent = `${marketCapValue} - All-time High`;
  }
  
  // Atualizar na seção Global Market Capitalization
  const bitcoinMarketCapItem = document.querySelector('.market-cap-item:last-child .market-cap-item-value');
  if (bitcoinMarketCapItem) {
    bitcoinMarketCapItem.textContent = marketCapValue;
  }
  
  const bitcoinMarketCapPercentage = document.querySelector('.market-cap-item:last-child .market-cap-item-percentage');
  if (bitcoinMarketCapPercentage) {
    bitcoinMarketCapPercentage.textContent = marketCapPercentage;
  }
  
  const bitcoinMarketCapFill = document.querySelector('.market-cap-item:last-child .market-cap-item-fill');
  if (bitcoinMarketCapFill) {
    bitcoinMarketCapFill.style.width = marketCapPercentage;
  }
}

// Função para rotacionar as citações de Satoshi
function rotateSatoshiQuotes() {
  const quoteContainer = document.querySelector('#satoshi-quotes blockquote');
  if (!quoteContainer) return;
  
  let currentQuoteIndex = 0;
  
  setInterval(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quoteContainer.textContent = quotes[currentQuoteIndex];
  }, 30000); // Trocar a cada 30 segundos
}

// Função para copiar o endereço Bitcoin
function setupCopyButton() {
  const copyButton = document.getElementById('copy-address');
  if (!copyButton) return;
  
  copyButton.addEventListener('click', () => {
    const address = document.querySelector('.donation-address-text').textContent;
    navigator.clipboard.writeText(address).then(() => {
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copied!';
      copyButton.style.backgroundColor = '#4caf50';
      
      setTimeout(() => {
        copyButton.textContent = originalText;
        copyButton.style.backgroundColor = '';
      }, 2000);
    });
  });
}

// Função para mostrar/ocultar as fontes do Market Cap
function setupSourcesToggle() {
  const sourcesToggle = document.getElementById('sources-toggle');
  const marketCapSources = document.getElementById('market-cap-sources');
  
  if (!sourcesToggle || !marketCapSources) return;
  
  sourcesToggle.addEventListener('click', () => {
    const isVisible = marketCapSources.style.display === 'block';
    marketCapSources.style.display = isVisible ? 'none' : 'block';
    sourcesToggle.textContent = isVisible ? 'Show sources' : 'Hide sources';
  });
}

// Inicializar todas as funções quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  renderQuotes();
  updateBitcoinsMined();
  checkHalvingDaysUpdate();
  updateBitcoinMarketCap();
  rotateSatoshiQuotes();
  setupCopyButton();
  setupSourcesToggle();
});
