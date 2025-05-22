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

// Função para renderizar os indicadores principais
function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  // Limpar o container antes de adicionar novos elementos
  quotesContainer.innerHTML = '';
  
  // Buscar preços atualizados antes de renderizar
  fetchLatestPrices().then(updatedAssets => {
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
        tooltip = `<span class="index-tooltip">?<span class="tooltip-text">The yield on the U.S. 10-year Treasury note, a key benchmark for interest rates.</span></span>`;
      } else if (asset.name === "Dollar Index") {
        tooltip = `<span class="index-tooltip">?<span class="tooltip-text">Measures the value of the U.S. dollar relative to a basket of foreign currencies.</span></span>`;
      } else if (asset.name === "S&P 500") {
        tooltip = `<span class="index-tooltip">?<span class="tooltip-text">Stock market index tracking the performance of 500 large companies listed on U.S. exchanges.</span></span>`;
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

// Função para buscar preços atualizados de uma API
async function fetchLatestPrices() {
  try {
    // Tentar buscar o preço do Bitcoin da API CoinGecko
    const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    
    if (btcResponse.ok) {
      const btcData = await btcResponse.json();
      
      if (btcData && btcData.bitcoin) {
        const btcPrice = btcData.bitcoin.usd;
        const btcChange = btcData.bitcoin.usd_24h_change;
        
        // Formatar o preço com separador de milhar no padrão americano
        const formattedPrice = btcPrice.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Formatar a variação percentual
        const formattedChange = btcChange >= 0 ? 
          `+${btcChange.toFixed(1)}%` : 
          `${btcChange.toFixed(1)}%`;
        
        // Atualizar o array de assets com o novo preço do Bitcoin
        const updatedAssets = [...assets];
        updatedAssets[0] = {
          name: "Bitcoin",
          price: formattedPrice,
          change: formattedChange,
          positive: btcChange >= 0
        };
        
        return updatedAssets;
      }
    }
    
    // Se falhar, retornar o array original
    return assets;
  } catch (error) {
    console.error('Erro ao buscar preços atualizados:', error);
    return assets; // Retornar o array original em caso de erro
  }
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
    // Buscar dados da API blockchain.info
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
  
  // Atualizar o texto na página
  const daysRemainingElement = document.querySelector('.days-remaining');
  if (daysRemainingElement) {
    daysRemainingElement.textContent = `${differenceInDays.toLocaleString('en-US')} days remaining`;
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
  updateDaysToHalving();
  updateBitcoinMarketCap();
  rotateSatoshiQuotes();
  setupCopyButton();
  setupSourcesToggle();
});
