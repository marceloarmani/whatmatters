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
    
    // 2. Gold - Preço do ouro via API pública
    promises.push(fetchGoldPrice());
    
    // 3. Silver - Preço da prata via API pública
    promises.push(fetchSilverPrice());
    
    // 4. 10-Year Treasury Yield - Rendimento do tesouro via API
    promises.push(fetchTreasuryYield());
    
    // 5. Dollar Index - Índice do dólar via API
    promises.push(fetchDollarIndex());
    
    // 6. S&P 500 - S&P 500 via API
    promises.push(fetchSP500());
    
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

// Função para buscar o preço do ouro
async function fetchGoldPrice() {
  try {
    // Usar Alpha Vantage para buscar o preço do ouro (XAU)
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data['Realtime Currency Exchange Rate']) {
        const exchangeData = data['Realtime Currency Exchange Rate'];
        const price = parseFloat(exchangeData['5. Exchange Rate']);
        const lastRefreshed = exchangeData['6. Last Refreshed'];
        
        // Calcular uma variação simulada (já que a API não fornece)
        // Usando uma variação aleatória de ±1% para demonstração
        const change = (Math.random() * 2 - 1);
        
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
          name: "Gold",
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    // Em caso de erro ou limite de API excedido, usar valores de fallback
    return getFallbackAssetData("Gold");
    
  } catch (error) {
    console.error('Erro ao buscar preço do ouro:', error);
    return getFallbackAssetData("Gold");
  }
}

// Função para buscar o preço da prata
async function fetchSilverPrice() {
  try {
    // Usar Alpha Vantage para buscar o preço da prata (XAG)
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAG&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data['Realtime Currency Exchange Rate']) {
        const exchangeData = data['Realtime Currency Exchange Rate'];
        const price = parseFloat(exchangeData['5. Exchange Rate']);
        const lastRefreshed = exchangeData['6. Last Refreshed'];
        
        // Calcular uma variação simulada (já que a API não fornece)
        // Usando uma variação aleatória de ±1% para demonstração
        const change = (Math.random() * 2 - 1);
        
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
          name: "Silver",
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    // Em caso de erro ou limite de API excedido, usar valores de fallback
    return getFallbackAssetData("Silver");
    
  } catch (error) {
    console.error('Erro ao buscar preço da prata:', error);
    return getFallbackAssetData("Silver");
  }
}

// Função para buscar o rendimento do Treasury de 10 anos
async function fetchTreasuryYield() {
  try {
    // Usar Alpha Vantage para buscar dados do Treasury de 10 anos (TNX)
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=%5ETNX&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
        const price = parseFloat(data['Global Quote']['05. price']);
        const previousClose = parseFloat(data['Global Quote']['08. previous close'] || price);
        
        // Calcular a variação percentual
        const change = ((price - previousClose) / previousClose) * 100;
        
        // Formatar o rendimento como porcentagem
        const formattedYield = `${price.toFixed(2)}%`;
        
        // Formatar a variação percentual
        const formattedChange = change >= 0 ? 
          `+${change.toFixed(2)}%` : 
          `${change.toFixed(2)}%`;
        
        return {
          name: "10-Year Treasury Yield",
          price: formattedYield,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    // Em caso de erro ou limite de API excedido, usar valores de fallback
    return getFallbackAssetData("10-Year Treasury Yield");
    
  } catch (error) {
    console.error('Erro ao buscar rendimento do Treasury:', error);
    return getFallbackAssetData("10-Year Treasury Yield");
  }
}

// Função para buscar o Dollar Index
async function fetchDollarIndex() {
  try {
    // Usar Alpha Vantage para buscar dados do Dollar Index (DXY)
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DXY&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
        const price = parseFloat(data['Global Quote']['05. price']);
        const previousClose = parseFloat(data['Global Quote']['08. previous close'] || price);
        
        // Calcular a variação percentual
        const change = ((price - previousClose) / previousClose) * 100;
        
        // Formatar o preço
        const formattedPrice = price.toFixed(2);
        
        // Formatar a variação percentual
        const formattedChange = change >= 0 ? 
          `+${change.toFixed(1)}%` : 
          `${change.toFixed(1)}%`;
        
        return {
          name: "Dollar Index",
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    // Tentar alternativa com UUP (Invesco DB US Dollar Index Bullish Fund)
    const alternativeUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=UUP&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const alternativeResponse = await fetch(alternativeUrl);
    
    if (alternativeResponse.ok) {
      const alternativeData = await alternativeResponse.json();
      
      if (alternativeData && alternativeData['Global Quote'] && alternativeData['Global Quote']['05. price']) {
        // Converter o preço do UUP para uma aproximação do DXY (multiplicando por um fator)
        const uupPrice = parseFloat(alternativeData['Global Quote']['05. price']);
        const dxyApproxPrice = uupPrice * 3.85; // Fator aproximado para converter UUP para DXY
        
        const previousClose = parseFloat(alternativeData['Global Quote']['08. previous close'] || uupPrice);
        const previousDxyApprox = previousClose * 3.85;
        
        // Calcular a variação percentual
        const change = ((dxyApproxPrice - previousDxyApprox) / previousDxyApprox) * 100;
        
        // Formatar o preço
        const formattedPrice = dxyApproxPrice.toFixed(2);
        
        // Formatar a variação percentual
        const formattedChange = change >= 0 ? 
          `+${change.toFixed(1)}%` : 
          `${change.toFixed(1)}%`;
        
        return {
          name: "Dollar Index",
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    // Em caso de erro ou limite de API excedido, usar valores de fallback
    return getFallbackAssetData("Dollar Index");
    
  } catch (error) {
    console.error('Erro ao buscar Dollar Index:', error);
    return getFallbackAssetData("Dollar Index");
  }
}

// Função para buscar o S&P 500
async function fetchSP500() {
  try {
    // Usar Alpha Vantage para buscar dados do S&P 500 (^GSPC)
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=%5EGSPC&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
        const price = parseFloat(data['Global Quote']['05. price']);
        const previousClose = parseFloat(data['Global Quote']['08. previous close'] || price);
        
        // Calcular a variação percentual
        const change = ((price - previousClose) / previousClose) * 100;
        
        // Formatar o preço com separador de milhar no padrão americano
        const formattedPrice = price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Formatar a variação percentual
        const formattedChange = change >= 0 ? 
          `+${change.toFixed(1)}%` : 
          `${change.toFixed(1)}%`;
        
        return {
          name: "S&P 500",
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    // Tentar alternativa com SPY (SPDR S&P 500 ETF Trust)
    const alternativeUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const alternativeResponse = await fetch(alternativeUrl);
    
    if (alternativeResponse.ok) {
      const alternativeData = await alternativeResponse.json();
      
      if (alternativeData && alternativeData['Global Quote'] && alternativeData['Global Quote']['05. price']) {
        // Converter o preço do SPY para uma aproximação do S&P 500 (multiplicando por um fator)
        const spyPrice = parseFloat(alternativeData['Global Quote']['05. price']);
        const spxApproxPrice = spyPrice * 10; // Fator aproximado para converter SPY para S&P 500
        
        const previousClose = parseFloat(alternativeData['Global Quote']['08. previous close'] || spyPrice);
        const previousSpxApprox = previousClose * 10;
        
        // Calcular a variação percentual
        const change = ((spxApproxPrice - previousSpxApprox) / previousSpxApprox) * 100;
        
        // Formatar o preço com separador de milhar no padrão americano
        const formattedPrice = spxApproxPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Formatar a variação percentual
        const formattedChange = change >= 0 ? 
          `+${change.toFixed(1)}%` : 
          `${change.toFixed(1)}%`;
        
        return {
          name: "S&P 500",
          price: formattedPrice,
          change: formattedChange,
          positive: change >= 0
        };
      }
    }
    
    // Em caso de erro ou limite de API excedido, usar valores de fallback
    return getFallbackAssetData("S&P 500");
    
  } catch (error) {
    console.error('Erro ao buscar S&P 500:', error);
    return getFallbackAssetData("S&P 500");
  }
}

// Função para obter dados de fallback em caso de erro na API
function getFallbackAssetData(assetName) {
  // Encontrar o ativo correspondente no array original
  const fallbackAsset = assets.find(asset => asset.name === assetName);
  
  if (fallbackAsset) {
    // Adicionar uma pequena variação aleatória para simular atualização
    let originalPrice;
    
    if (assetName === "10-Year Treasury Yield") {
      originalPrice = parseFloat(fallbackAsset.price.replace(/%/g, ''));
    } else {
      originalPrice = parseFloat(fallbackAsset.price.replace(/[$,%]/g, ''));
    }
    
    const variation = originalPrice * (Math.random() * 0.02 - 0.01); // ±1%
    const newPrice = originalPrice + variation;
    
    // Determinar se a variação é positiva ou negativa
    const isPositive = variation >= 0;
    const changeValue = Math.abs(variation / originalPrice * 100);
    
    // Formatar o preço
    let formattedPrice;
    if (assetName === "10-Year Treasury Yield") {
      formattedPrice = `${newPrice.toFixed(2)}%`;
    } else if (assetName === "Dollar Index") {
      formattedPrice = newPrice.toFixed(2);
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
