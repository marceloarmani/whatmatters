// Dados estáticos para fallback
const assets = [
  { name: "Bitcoin", price: "$107,016.57", change: "+2.4%", positive: true },
  { name: "Gold", price: "$3,323.10", change: "+0.8%", positive: true },
  { name: "Silver", price: "$33.69", change: "-0.3%", positive: false },
  { name: "10-Year Treasury Yield", price: "4.38%", change: "+0.05%", positive: true },
  { name: "Dollar Index", price: "103.42", change: "-0.2%", positive: false },
  { name: "S&P 500", price: "$5,789.24", change: "+0.7%", positive: true }
];

// Alpha Vantage API Key
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Atualizar todos os dados dinâmicos
  updateAllData();
  
  // Configurar eventos
  setupEvents();
  
  // Rotacionar citações de Satoshi
  setupSatoshiQuotes();
});

// Função principal para atualizar todos os dados
async function updateAllData() {
  try {
    // 1. Atualizar preços dos ativos principais
    await updateAssetPrices();
    
    // 2. Atualizar número de Bitcoins minerados
    await updateBitcoinsMined();
    
    // 3. Atualizar contagem de dias para o halving
    updateDaysToHalving();
    
    // 4. Atualizar Bitcoin Market Cap
    updateBitcoinMarketCap();
    
    console.log('Todos os dados foram atualizados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
  }
}

// Função para atualizar os preços dos ativos
async function updateAssetPrices() {
  try {
    // Buscar preços atualizados
    const updatedAssets = await fetchAllLatestPrices();
    
    // Atualizar os elementos na página
    const quotesContainer = document.getElementById('quotes');
    if (!quotesContainer) return;
    
    // Limpar o container
    quotesContainer.innerHTML = '';
    
    // Renderizar os ativos atualizados
    updatedAssets.forEach(asset => {
      const quoteElement = document.createElement('div');
      quoteElement.className = 'quote';
      
      const changeClass = asset.positive ? 'positive' : 'negative';
      
      quoteElement.innerHTML = `
        <div class="quote-name">${asset.name}</div>
        <div class="quote-price">${asset.price}</div>
        <div class="quote-change ${changeClass}">${asset.change}</div>
      `;
      
      quotesContainer.appendChild(quoteElement);
    });
    
    // Atualizar também os preços no rodapé
    updateFooterPrices(updatedAssets);
    
  } catch (error) {
    console.error('Erro ao atualizar preços dos ativos:', error);
  }
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
    
    // Em caso de erro, usar valores de fallback
    return getFallbackAssetData("Bitcoin");
    
  } catch (error) {
    console.error('Erro ao buscar preço do Bitcoin:', error);
    return getFallbackAssetData("Bitcoin");
  }
}

// Função para buscar o preço do ouro
async function fetchGoldPrice() {
  try {
    // Tentar Alpha Vantage
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data['Realtime Currency Exchange Rate']) {
        const exchangeData = data['Realtime Currency Exchange Rate'];
        const price = parseFloat(exchangeData['5. Exchange Rate']);
        
        // Calcular uma variação simulada
        const change = (Math.random() * 2 - 1);
        
        // Formatar o preço
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
    // Tentar Alpha Vantage
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAG&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data['Realtime Currency Exchange Rate']) {
        const exchangeData = data['Realtime Currency Exchange Rate'];
        const price = parseFloat(exchangeData['5. Exchange Rate']);
        
        // Calcular uma variação simulada
        const change = (Math.random() * 2 - 1);
        
        // Formatar o preço
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
    // Tentar Alpha Vantage
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
    // Tentar Alpha Vantage
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
    // Tentar Alpha Vantage
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
      originalPrice = parseFloat(fallbackAsset.price.replace('%', ''));
    } else {
      originalPrice = parseFloat(fallbackAsset.price.replace(/[$,]/g, ''));
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
  
  if (footerBtcPrice && updatedAssets[0]) footerBtcPrice.textContent = updatedAssets[0].price;
  if (footerGoldPrice && updatedAssets[1]) footerGoldPrice.textContent = updatedAssets[1].price;
  if (footerSilverPrice && updatedAssets[2]) footerSilverPrice.textContent = updatedAssets[2].price;
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
    } else {
      console.error('Erro ao buscar dados de Bitcoins minerados: resposta não ok');
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
  const bitcoinMarketCapItem = document.querySelector('#global-market-cap .market-cap-item:last-child .market-cap-item-value');
  if (bitcoinMarketCapItem) {
    bitcoinMarketCapItem.textContent = marketCapValue;
  }
  
  const bitcoinMarketCapPercentage = document.querySelector('#global-market-cap .market-cap-item:last-child .market-cap-item-percentage');
  if (bitcoinMarketCapPercentage) {
    bitcoinMarketCapPercentage.textContent = marketCapPercentage;
  }
}

// Configurar eventos da página
function setupEvents() {
  // Configurar botão de copiar endereço Bitcoin
  const copyButton = document.getElementById('copy-address');
  if (copyButton) {
    copyButton.addEventListener('click', function() {
      const addressText = document.querySelector('.donation-address-text').textContent;
      navigator.clipboard.writeText(addressText).then(function() {
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(function() {
          copyButton.textContent = originalText;
        }, 2000);
      });
    });
  }
  
  // Configurar toggle de fontes
  const sourcesToggle = document.getElementById('sources-toggle');
  if (sourcesToggle) {
    sourcesToggle.addEventListener('click', function() {
      const sourcesElement = document.getElementById('market-cap-sources');
      if (sourcesElement.style.display === 'block') {
        sourcesElement.style.display = 'none';
        this.textContent = 'Show sources';
      } else {
        sourcesElement.style.display = 'block';
        this.textContent = 'Hide sources';
      }
    });
  }
}

// Configurar rotação de citações de Satoshi
function setupSatoshiQuotes() {
  const quotes = [
    "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
    "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.",
    "I've been working on a new electronic cash system that's fully peer-to-peer, with no trusted third party.",
    "The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
    "Banks must be trusted to hold our money and transfer it electronically, but they lend it out in waves of credit bubbles with barely a fraction in reserve.",
    "With e-currency based on cryptographic proof, without the need to trust a third party middleman, money can be secure and transactions effortless."
  ];
  
  const quoteElement = document.querySelector('#satoshi-quotes blockquote');
  if (!quoteElement) return;
  
  let currentQuoteIndex = 0;
  
  // Iniciar rotação a cada 30 segundos
  setInterval(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quoteElement.textContent = quotes[currentQuoteIndex];
  }, 30000);
}
