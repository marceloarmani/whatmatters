// Chave da API Alpha Vantage fornecida pelo usuário
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";

// Array inicial com estrutura, será preenchido com dados reais
const initialAssets = [
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

// Função para formatar número como moeda USD
function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Função para formatar variação percentual
function formatPercentageChange(change) {
    const changeNum = parseFloat(change);
    return `${changeNum >= 0 ? '+' : ''}${changeNum.toFixed(1)}%`;
}

// Função para formatar variação absoluta (para Treasury Yield)
function formatAbsoluteChange(change) {
    const changeNum = parseFloat(change);
    return `${changeNum >= 0 ? '+' : ''}${changeNum.toFixed(2)}%`; // Mantém formato original ex: +0.05%
}

// Função para renderizar os indicadores principais
function renderQuotes(assetsToRender) {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;

  quotesContainer.innerHTML = ''; // Limpar container

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
      tooltip = `<span class="index-tooltip">The yield on the U.S. 10-year Treasury note, a key benchmark for interest rates. (Source: Alpha Vantage)</span>`;
    } else if (asset.name === "Dollar Index") {
      tooltip = `<span class="index-tooltip">Measures the value of the U.S. dollar relative to a basket of foreign currencies (Proxy: UUP ETF). (Source: Alpha Vantage)</span>`;
    } else if (asset.name === "S&P 500") {
      tooltip = `<span class="index-tooltip">Stock market index tracking the performance of 500 large companies listed on U.S. exchanges (Proxy: SPY ETF). (Source: Alpha Vantage)</span>`;
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

  // Atualizar também os preços no rodapé
  updateFooterPrices(assetsToRender);
}

// Função para buscar preços atualizados de todos os ativos
async function fetchAllLatestPrices() {
  console.log("Buscando preços atualizados...");
  try {
    const promises = [
      fetchBitcoinPrice(),
      fetchGoldPrice(),
      fetchSilverPrice(),
      fetchTreasuryYield(),
      fetchDollarIndexProxy(), // Usando proxy UUP
      fetchSP500Proxy() // Usando proxy SPY
    ];

    const results = await Promise.allSettled(promises);

    // Criar um novo array com os valores atualizados
    const updatedAssets = [...initialAssets]; // Começa com valores iniciais

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        // Atualiza o ativo correspondente no array
        updatedAssets[index] = { 
          ...updatedAssets[index], // Mantém os valores iniciais
          ...result.value // Sobrescreve com os novos valores, se disponíveis
        };
      } else {
        console.error(`Erro ao buscar ${initialAssets[index].name}:`, 
          result.reason ? result.reason : 'Valor não retornado');
        // Mantém os valores iniciais se a busca falhar
      }
    });

    console.log("Preços atualizados:", updatedAssets);
    return updatedAssets;

  } catch (error) {
    console.error('Erro geral ao buscar preços atualizados:', error);
    return initialAssets; // Retorna os valores iniciais em caso de erro geral
  }
}

// --- Funções de busca individuais --- //

// 1. Bitcoin - CoinGecko API
async function fetchBitcoinPrice() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data && data.bitcoin) {
      const price = data.bitcoin.usd;
      const change = data.bitcoin.usd_24h_change;
      return {
        price: formatCurrency(price),
        change: formatPercentageChange(change),
        positive: change >= 0
      };
    }
    throw new Error('Dados inválidos da API CoinGecko');
  } catch (error) {
    console.error('Erro ao buscar preço do Bitcoin:', error);
    // Não retorna null para garantir que sempre temos um valor
    return null;
  }
}

// 2. Gold - Alpha Vantage API (usando GLD ETF como proxy)
async function fetchGoldPrice() {
  try {
    // Usar Alpha Vantage para GLD ETF como proxy para o preço do ouro
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GLD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']) * 10; // Aproximação: 1 GLD ≈ 1/10 oz de ouro
      const changePercent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));

      return {
        price: formatCurrency(price),
        change: formatPercentageChange(changePercent),
        positive: changePercent >= 0
      };
    }
    throw new Error('Dados inválidos da API Alpha Vantage para GLD');
  } catch (error) {
    console.error('Erro ao buscar preço do Ouro:', error);
    // Não retorna null para garantir que sempre temos um valor
    return null;
  }
}

// 3. Silver - Alpha Vantage API (usando SLV ETF como proxy)
async function fetchSilverPrice() {
  try {
    // Usar Alpha Vantage para SLV ETF como proxy para o preço da prata
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SLV&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']) * 1.5; // Aproximação: 1 SLV ≈ 1.5 oz de prata
      const changePercent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));

      return {
        price: formatCurrency(price),
        change: formatPercentageChange(changePercent),
        positive: changePercent >= 0
      };
    }
    throw new Error('Dados inválidos da API Alpha Vantage para SLV');
  } catch (error) {
    console.error('Erro ao buscar preço da Prata:', error);
    // Não retorna null para garantir que sempre temos um valor
    return null;
  }
}

// 4. 10-Year Treasury Yield - Alpha Vantage API
async function fetchTreasuryYield() {
  try {
    const url = `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data && data.data && data.data.length >= 2) {
      const latestYield = parseFloat(data.data[0].value);
      const previousYield = parseFloat(data.data[1].value);
      const change = latestYield - previousYield; // Variação absoluta em pontos percentuais

      return {
        price: `${latestYield.toFixed(2)}%`,
        change: formatAbsoluteChange(change),
        positive: change >= 0
      };
    }
    throw new Error('Dados insuficientes da API Alpha Vantage para Treasury Yield');
  } catch (error) {
    console.error('Erro ao buscar rendimento do Treasury (Alpha Vantage):', error);
    // Não retorna null para garantir que sempre temos um valor
    return null;
  }
}

// 5. Dollar Index (Proxy UUP ETF) - Alpha Vantage API
async function fetchDollarIndexProxy() {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=UUP&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']) * 4; // Aproximação: UUP * 4 ≈ DXY
      const changePercent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));

      return {
        // Retorna o preço do ETF UUP, não o índice DXY diretamente
        price: price.toFixed(2), // Formato sem $ para índice/proxy
        change: formatPercentageChange(changePercent),
        positive: changePercent >= 0
      };
    }
    throw new Error('Dados insuficientes da API Alpha Vantage para Dollar Index (UUP)');
  } catch (error) {
    console.error('Erro ao buscar Dollar Index (UUP via Alpha Vantage):', error);
    // Não retorna null para garantir que sempre temos um valor
    return null;
  }
}

// 6. S&P 500 (Proxy SPY ETF) - Alpha Vantage API
async function fetchSP500Proxy() {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']) * 10; // Aproximação: SPY * 10 ≈ S&P 500
      const changePercent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));

      // Formatar preço com separador de milhar
      const formattedPrice = price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      });

      return {
        price: formattedPrice,
        change: formatPercentageChange(changePercent),
        positive: changePercent >= 0
      };
    }
    throw new Error('Dados insuficientes da API Alpha Vantage para S&P 500 (SPY)');
  } catch (error) {
    console.error('Erro ao buscar S&P 500 (SPY via Alpha Vantage):', error);
    // Não retorna null para garantir que sempre temos um valor
    return null;
  }
}

// --- Funções de UI e Inicialização --- //

// Função para atualizar os preços no rodapé
function updateFooterPrices(assetsData) {
  const btcPriceElement = document.getElementById('footer-btc-price');
  const goldPriceElement = document.getElementById('footer-gold-price');
  const silverPriceElement = document.getElementById('footer-silver-price');

  const btcData = assetsData.find(asset => asset.name === "Bitcoin");
  const goldData = assetsData.find(asset => asset.name === "Gold");
  const silverData = assetsData.find(asset => asset.name === "Silver");

  if (btcPriceElement && btcData) btcPriceElement.textContent = btcData.price;
  if (goldPriceElement && goldData) goldPriceElement.textContent = goldData.price;
  if (silverPriceElement && silverData) silverPriceElement.textContent = silverData.price;
}

// Função para renderizar uma citação aleatória de Satoshi
function renderSatoshiQuote() {
  const quoteContainer = document.querySelector('#satoshi-quotes .quote-container blockquote');
  if (quoteContainer) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteContainer.textContent = quotes[randomIndex];
  }
}

// Função para copiar o endereço de doação
document.getElementById('copy-address')?.addEventListener('click', () => {
  const address = document.querySelector('.donation-address-text').textContent;
  navigator.clipboard.writeText(address).then(() => {
    alert('Endereço copiado!');
  }).catch(err => {
    console.error('Erro ao copiar endereço:', err);
  });
});

// Função para alternar a visibilidade das fontes de Market Cap
document.getElementById('sources-toggle')?.addEventListener('click', function() {
  const sourcesDiv = document.getElementById('market-cap-sources');
  const isHidden = sourcesDiv.style.display === 'none' || sourcesDiv.style.display === '';
  sourcesDiv.style.display = isHidden ? 'block' : 'none';
  this.textContent = isHidden ? 'Hide sources' : 'Show sources';
});

// Função para renderizar eventos econômicos (dados estáticos como exemplo)
function renderEconomicEvents() {
  const eventsGrid = document.querySelector('#economic-calendar .events-grid');
  if (!eventsGrid) return;

  const events = [
    { date: "May 28", impact: "high", title: "US GDP Growth Rate", description: "Q1 final estimate" },
    { date: "May 29", impact: "medium", title: "Eurozone Inflation Rate", description: "May preliminary" },
    { date: "May 30", impact: "high", title: "US Nonfarm Payrolls", description: "May report" },
    { date: "Jun 01", impact: "low", title: "China Caixin Manufacturing PMI", description: "May reading" }
  ];

  eventsGrid.innerHTML = ''; // Limpar

  events.forEach(event => {
    const item = document.createElement('div');
    item.className = `event-item ${event.impact}`;
    item.innerHTML = `
      <div class="event-date">
        <span>${event.date}</span>
        <div class="event-impact">
          ${'<div class="impact-dot"></div>'.repeat(event.impact === 'high' ? 3 : event.impact === 'medium' ? 2 : 1)}
        </div>
      </div>
      <div class="event-title">${event.title}</div>
      <div class="event-description">${event.description}</div>
    `;
    eventsGrid.appendChild(item);
  });
}

// Função para renderizar Market Cap (dados estáticos como exemplo)
function renderMarketCap() {
    // A lógica de renderização do Market Cap já está no HTML como exemplo estático.
    // Se precisar tornar dinâmico, a lógica seria adicionada aqui.
    // Exemplo: buscar dados de uma API e gerar os elementos .market-cap-item
}

// Função para renderizar Notícias (dados estáticos como exemplo)
function renderNews() {
  const newsGrid = document.querySelector('#news-summary .news-grid');
  if (!newsGrid) return;

  const newsItems = [
    { img: 'https://via.placeholder.com/300x160/F7931A/FFFFFF?text=BTC+News', source: 'CoinDesk', title: 'Bitcoin Hits New All-Time High Above $110,000', description: 'Institutional adoption continues to drive prices upward.', date: 'May 27, 2025' },
    { img: 'https://via.placeholder.com/300x160/D4AF37/FFFFFF?text=Gold+News', source: 'Bloomberg', title: 'Gold Prices Surge Amidst Geopolitical Tensions', description: 'Investors seek safe-haven assets as uncertainty grows.', date: 'May 26, 2025' },
    { img: 'https://via.placeholder.com/300x160/6A5ACD/FFFFFF?text=Rates+News', source: 'Reuters', title: 'Federal Reserve Holds Interest Rates Steady', description: 'Fed signals patience on future rate hikes, citing inflation concerns.', date: 'May 25, 2025' },
    { img: 'https://via.placeholder.com/300x160/4682B4/FFFFFF?text=Market+News', source: 'Wall Street Journal', title: 'S&P 500 Approaches Record Highs Despite Volatility', description: 'Tech stocks lead the rally, but analysts remain cautious.', date: 'May 27, 2025' },
    { img: 'https://via.placeholder.com/300x160/C0C0C0/FFFFFF?text=Silver+News', source: 'Kitco News', title: 'Silver Demand Expected to Rise with Industrial Use', description: 'Green energy transition boosts silver consumption.', date: 'May 24, 2025' },
    { img: 'https://via.placeholder.com/300x160/20B2AA/FFFFFF?text=Dollar+News', source: 'Financial Times', title: 'Dollar Index Weakens as Global Growth Recovers', description: 'Risk-on sentiment weighs on the US dollar.', date: 'May 26, 2025' }
  ];

  newsGrid.innerHTML = ''; // Limpar

  newsItems.forEach(item => {
    const newsDiv = document.createElement('a');
    newsDiv.className = 'news-item';
    newsDiv.href = '#'; // Link placeholder
    newsDiv.innerHTML = `
      <img src="${item.img}" alt="${item.title}" class="news-image">
      <div class="news-content">
        <span class="news-source">${item.source}</span>
        <h3 class="news-title">${item.title}</h3>
        <p class="news-description">${item.description}</p>
        <div class="news-date">${item.date}</div>
      </div>
    `;
    newsGrid.appendChild(newsDiv);
  });
}

// Inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM carregado. Iniciando buscas...");
  // Renderiza imediatamente com valores iniciais
  renderQuotes(initialAssets); 
  renderSatoshiQuote();
  renderEconomicEvents(); // Renderiza eventos estáticos
  renderMarketCap(); // Renderiza market cap estático
  renderNews(); // Renderiza notícias estáticas

  // Busca os dados mais recentes e re-renderiza os quotes
  fetchAllLatestPrices().then(updatedAssets => {
      console.log("Busca concluída. Renderizando quotes atualizados.");
      renderQuotes(updatedAssets);
  });
});
