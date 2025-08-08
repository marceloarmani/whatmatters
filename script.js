// Configuração das APIs
const ALPHA_VANTAGE_API_KEY = "YXNV7ACP45FN4RZC";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Valores de fallback atualizados
const FALLBACK_VALUES = {
  bitcoin: { name: "Bitcoin", price: "$104,586.00", change: "-0.3%", positive: false },
  gold: { name: "Gold", price: "$3,433.47", change: "+1.60%", positive: true },
  silver: { name: "Silver", price: "$36.32", change: "+0.25%", positive: true },
  treasury: { name: "10-Year Treasury Yield", price: "4.46%", change: "+0.02%", positive: true },
  dollar: { name: "Dollar Index", price: "106.50", change: "+0.1%", positive: true },
  sp500: { name: "S&P 500", price: "5,950.00", change: "+0.3%", positive: true }
};

// Cache para evitar requisições desnecessárias
let dataCache = {
  events: { data: null, lastUpdate: null, updateInterval: 60 * 60 * 1000 }, // 1 hora
  news: { data: null, lastUpdate: null, updateInterval: 30 * 60 * 1000 }, // 30 minutos
  scarcity: { data: null, lastUpdate: null, updateInterval: 60 * 60 * 1000 } // 1 hora
};

// Função para verificar se precisa atualizar dados
function shouldUpdate(cacheKey) {
  const cache = dataCache[cacheKey];
  if (!cache.lastUpdate) return true;
  
  const now = Date.now();
  const timeSinceLastUpdate = now - cache.lastUpdate;
  
  return timeSinceLastUpdate >= cache.updateInterval;
}

// Função para salvar dados no cache
function saveToCache(cacheKey, data) {
  dataCache[cacheKey].data = data;
  dataCache[cacheKey].lastUpdate = Date.now();
  
  try {
    localStorage.setItem(`${cacheKey}Cache`, JSON.stringify(dataCache[cacheKey]));
  } catch (error) {
    console.warn(`Não foi possível salvar cache ${cacheKey} no localStorage:`, error);
  }
}

// Função para carregar dados do cache
function loadFromCache(cacheKey) {
  try {
    const cached = localStorage.getItem(`${cacheKey}Cache`);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      
      // Verificar se o cache não está muito antigo (máximo 4 horas)
      const maxCacheAge = 4 * 60 * 60 * 1000; // 4 horas
      const now = Date.now();
      
      if (parsedCache.lastUpdate && (now - parsedCache.lastUpdate) < maxCacheAge) {
        dataCache[cacheKey] = parsedCache;
        return parsedCache.data;
      }
    }
  } catch (error) {
    console.warn(`Erro ao carregar cache ${cacheKey} do localStorage:`, error);
  }
  
  return null;
}

// Função para formatar números no padrão americano
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Função para formatar datas
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Função para calcular dias restantes até o próximo halving
function calculateDaysToHalving() {
  // Próximo halving estimado para abril de 2028
  const nextHalving = new Date('2028-04-01');
  const now = new Date();
  const diffTime = nextHalving - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Função para buscar dados de Bitcoin em tempo real
async function fetchBitcoinData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_market_cap=true');
    const data = await response.json();
    
    if (data.bitcoin) {
      return {
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        marketCap: data.bitcoin.usd_market_cap
      };
    }
  } catch (error) {
    console.warn('Erro ao buscar dados do Bitcoin:', error);
  }
  return null;
}

// Função para buscar dados de escassez do Bitcoin
async function fetchScarcityMetrics() {
  if (!shouldUpdate('scarcity') && dataCache.scarcity.data) {
    console.log('Usando dados em cache para scarcity metrics');
    return dataCache.scarcity.data;
  }

  try {
    // Buscar dados do Bitcoin
    const bitcoinData = await fetchBitcoinData();
    
    // Calcular métricas de escassez
    const totalSupply = 21000000;
    const currentSupply = 19750000; // Aproximação atual
    const annualInflation = 1.74; // Taxa atual aproximada
    const stockToFlow = Math.round(100 / annualInflation);
    const daysToHalving = calculateDaysToHalving();
    const supplyPercentage = ((currentSupply / totalSupply) * 100).toFixed(2);
    const remaining = totalSupply - currentSupply;

    const scarcityData = {
      stockToFlow: stockToFlow,
      annualInflation: annualInflation,
      bitcoinsMined: formatNumber(currentSupply),
      supplyPercentage: supplyPercentage,
      remaining: formatNumber(remaining),
      daysToHalving: daysToHalving,
      nextHalving: "April 2028"
    };

    saveToCache('scarcity', scarcityData);
    return scarcityData;
    
  } catch (error) {
    console.error('Erro ao buscar métricas de escassez:', error);
    
    // Retornar dados de fallback
    return {
      stockToFlow: 56,
      annualInflation: 1.74,
      bitcoinsMined: "19,750,000",
      supplyPercentage: "93.81",
      remaining: "1,250,000",
      daysToHalving: calculateDaysToHalving(),
      nextHalving: "April 2028"
    };
  }
}

// Função para buscar eventos econômicos
async function fetchUpcomingEvents() {
  if (!shouldUpdate('events') && dataCache.events.data) {
    console.log('Usando dados em cache para events');
    return dataCache.events.data;
  }

  try {
    // Simular busca de eventos (em produção, usar API real)
    const events = [
      {
        date: "December 17-18, 2025",
        title: "FOMC Meeting",
        description: "Federal Reserve interest rate decision",
        impact: "high"
      },
      {
        date: "January 03, 2026",
        title: "US Employment Report",
        description: "US labor market data",
        impact: "medium"
      },
      {
        date: "February 15, 2026",
        title: "Bitcoin ETF Review",
        description: "SEC quarterly review of Bitcoin ETF applications",
        impact: "medium"
      },
      {
        date: "March 18, 2026",
        title: "Fed Rate Decision",
        description: "Federal Reserve monetary policy meeting",
        impact: "high"
      }
    ];

    saveToCache('events', events);
    return events;
    
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    
    // Retornar dados de fallback
    return [
      {
        date: "December 17-18, 2025",
        title: "FOMC Meeting",
        description: "Federal Reserve interest rate decision",
        impact: "high"
      },
      {
        date: "January 03, 2026",
        title: "US Employment Report",
        description: "US labor market data",
        impact: "medium"
      },
      {
        date: "February 15, 2026",
        title: "Bitcoin ETF Review",
        description: "SEC quarterly review of Bitcoin ETF applications",
        impact: "medium"
      },
      {
        date: "March 18, 2026",
        title: "Fed Rate Decision",
        description: "Federal Reserve monetary policy meeting",
        impact: "high"
      }
    ];
  }
}

// Função para buscar notícias
async function fetchLatestNews() {
  if (!shouldUpdate('news') && dataCache.news.data) {
    console.log('Usando dados em cache para news');
    return dataCache.news.data;
  }

  try {
    // Simular busca de notícias (em produção, usar API real de notícias Bitcoin)
    const news = [
      {
        source: "Bitcoin Magazine",
        title: "Bitcoin Surpasses $110,000 Reaching New All-Time High",
        description: "The world's largest cryptocurrency continues its bull run with institutional adoption driving demand.",
        date: "December 8, 2025 14:32 UTC",
        url: "https://bitcoinmagazine.com/"
      },
      {
        source: "Blockworks",
        title: "Central Banks Accelerate Digital Currency Development",
        description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
        date: "December 7, 2025 09:15 UTC",
        url: "https://blockworks.co/"
      },
      {
        source: "The Bitcoin Times",
        title: "Gold Reaches Record High Amid Inflation Concerns",
        description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
        date: "December 6, 2025 16:45 UTC",
        url: "https://bitcointimes.news/"
      },
      {
        source: "Bitcoin Magazine",
        title: "Institutional Adoption Drives Bitcoin to New Heights",
        description: "Major corporations and investment funds continue to allocate significant portions of their portfolios to Bitcoin.",
        date: "December 5, 2025 11:20 UTC",
        url: "https://bitcoinmagazine.com/"
      },
      {
        source: "Cointelegraph",
        title: "Lightning Network Reaches 15,000 Nodes Milestone",
        description: "Bitcoin's Layer 2 scaling solution continues to grow, enabling faster and cheaper transactions.",
        date: "December 4, 2025 08:30 UTC",
        url: "https://cointelegraph.com/"
      },
      {
        source: "Bitcoin Magazine",
        title: "Mining Difficulty Reaches All-Time High",
        description: "Bitcoin network security strengthens as mining difficulty adjusts to record levels.",
        date: "December 3, 2025 13:45 UTC",
        url: "https://bitcoinmagazine.com/"
      }
    ];

    saveToCache('news', news);
    return news;
    
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    
    // Retornar dados de fallback
    return [
      {
        source: "Bitcoin Magazine",
        title: "Bitcoin Surpasses $110,000 Reaching New All-Time High",
        description: "The world's largest cryptocurrency continues its bull run with institutional adoption driving demand.",
        date: "December 8, 2025 14:32 UTC",
        url: "https://bitcoinmagazine.com/"
      },
      {
        source: "Blockworks",
        title: "Central Banks Accelerate Digital Currency Development",
        description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
        date: "December 7, 2025 09:15 UTC",
        url: "https://blockworks.co/"
      },
      {
        source: "The Bitcoin Times",
        title: "Gold Reaches Record High Amid Inflation Concerns",
        description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
        date: "December 6, 2025 16:45 UTC",
        url: "https://bitcointimes.news/"
      },
      {
        source: "Bitcoin Magazine",
        title: "Institutional Adoption Drives Bitcoin to New Heights",
        description: "Major corporations and investment funds continue to allocate significant portions of their portfolios to Bitcoin.",
        date: "December 5, 2025 11:20 UTC",
        url: "https://bitcoinmagazine.com/"
      },
      {
        source: "Cointelegraph",
        title: "Lightning Network Reaches 15,000 Nodes Milestone",
        description: "Bitcoin's Layer 2 scaling solution continues to grow, enabling faster and cheaper transactions.",
        date: "December 4, 2025 08:30 UTC",
        url: "https://cointelegraph.com/"
      },
      {
        source: "Bitcoin Magazine",
        title: "Mining Difficulty Reaches All-Time High",
        description: "Bitcoin network security strengthens as mining difficulty adjusts to record levels.",
        date: "December 3, 2025 13:45 UTC",
        url: "https://bitcoinmagazine.com/"
      }
    ];
  }
}

// Função para renderizar eventos
function renderEvents(events) {
  const eventsGrid = document.getElementById('events-grid');
  if (!eventsGrid) return;
  
  eventsGrid.innerHTML = '';
  
  events.slice(0, 4).forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.className = `event-item ${event.impact}`;
    
    eventElement.innerHTML = `
      <div class="event-date">
        <span>${event.date}</span>
        <div class="event-impact">
          <div class="impact-dot"></div>
          <div class="impact-dot"></div>
          <div class="impact-dot"></div>
        </div>
      </div>
      <div class="event-title">${event.title}</div>
      <div class="event-description">${event.description}</div>
    `;
    
    eventsGrid.appendChild(eventElement);
  });
}

// Função para renderizar notícias
function renderNews(news) {
  const newsGrid = document.getElementById('news-grid');
  if (!newsGrid) return;
  
  newsGrid.innerHTML = '';
  
  news.slice(0, 6).forEach(article => {
    const newsElement = document.createElement('a');
    newsElement.href = article.url;
    newsElement.target = '_blank';
    newsElement.className = 'news-item';
    
    newsElement.innerHTML = `
      <div class="news-content">
        <div class="news-source">${article.source}</div>
        <div class="news-title">${article.title}</div>
        <div class="news-description">${article.description}</div>
        <div class="news-date">${article.date}</div>
      </div>
    `;
    
    newsGrid.appendChild(newsElement);
  });
}

// Função para renderizar métricas de escassez
function renderScarcityMetrics(data) {
  const scarcityGrid = document.getElementById('scarcity-metrics-grid');
  if (!scarcityGrid) return;
  
  scarcityGrid.innerHTML = `
    <div class="scarcity-metric">
      <div class="scarcity-metric-title">Stock-to-Flow</div>
      <div class="scarcity-metric-value">${data.stockToFlow}</div>
      <div class="scarcity-metric-description">Ratio between existing stock and annual production</div>
      <div class="scarcity-comparison">
        <div class="scarcity-comparison-item bitcoin">Bitcoin: ${data.stockToFlow}</div>
        <div class="scarcity-comparison-item gold">Gold: 62</div>
        <div class="scarcity-comparison-item silver">Silver: 22</div>
      </div>
    </div>
    <div class="scarcity-metric">
      <div class="scarcity-metric-title">Annual Inflation</div>
      <div class="scarcity-metric-value">${data.annualInflation}%</div>
      <div class="scarcity-metric-description">Annual issuance rate relative to total supply</div>
      <div class="scarcity-comparison">
        <div class="scarcity-comparison-item bitcoin">Bitcoin: ${data.annualInflation}%</div>
        <div class="scarcity-comparison-item gold">Gold: 1.60%</div>
        <div class="scarcity-comparison-item silver">Silver: 4.50%</div>
      </div>
    </div>
    <div class="scarcity-metric">
      <div class="scarcity-metric-title">Bitcoins Mined</div>
      <div class="scarcity-metric-value">${data.bitcoinsMined}</div>
      <div class="scarcity-metric-description">Amount of bitcoins already mined out of 21 million total</div>
      <div class="supply-progress">
        <div class="supply-progress-fill" style="width: ${data.supplyPercentage}%;"></div>
        <div class="supply-progress-text">${data.supplyPercentage}% (${data.remaining} remaining)</div>
      </div>
    </div>
    <div class="scarcity-metric">
      <div class="scarcity-metric-title">Next Halving</div>
      <div class="scarcity-metric-value">${data.nextHalving}</div>
      <div class="scarcity-metric-description">Event that cuts mining reward in half</div>
      <div class="days-remaining">${data.daysToHalving} days remaining</div>
    </div>
  `;
}

// Função para mostrar indicador de carregamento
function showLoadingIndicator(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-indicator">
      <div class="loading-spinner"></div>
      Atualizando dados...
    </div>
  `;
}

// Função para carregar todas as seções automaticamente
async function loadAllSections() {
  console.log('Carregando todas as seções...');
  
  // Carregar eventos
  try {
    showLoadingIndicator('events-grid');
    const events = await fetchUpcomingEvents();
    renderEvents(events);
    console.log('Eventos carregados com sucesso');
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }
  
  // Carregar notícias
  try {
    showLoadingIndicator('news-grid');
    const news = await fetchLatestNews();
    renderNews(news);
    console.log('Notícias carregadas com sucesso');
  } catch (error) {
    console.error('Erro ao carregar notícias:', error);
  }
  
  // Carregar métricas de escassez
  try {
    showLoadingIndicator('scarcity-metrics-grid');
    const scarcityData = await fetchScarcityMetrics();
    renderScarcityMetrics(scarcityData);
    console.log('Métricas de escassez carregadas com sucesso');
  } catch (error) {
    console.error('Erro ao carregar métricas de escassez:', error);
  }
}

// Função para carregar dados dos indicadores principais
async function loadMainIndicators() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  // Usar valores de fallback por enquanto
  const quotes = Object.values(FALLBACK_VALUES);
  
  quotesContainer.innerHTML = '';
  
  quotes.forEach(quote => {
    const quoteWrapper = document.createElement('div');
    quoteWrapper.className = 'quote-wrapper';
    
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    
    const changeClass = quote.positive ? 'positive' : 'negative';
    
    quoteElement.innerHTML = `
      <div class="quote-left">
        <strong>${quote.name}</strong>
        <span class="quote-price">${quote.price}</span>
      </div>
      <span class="quote-change ${changeClass}">${quote.change}</span>
    `;
    
    quoteWrapper.appendChild(quoteElement);
    quotesContainer.appendChild(quoteWrapper);
  });
}

// Função para atualização periódica em segundo plano
function startPeriodicUpdates() {
  // Atualizar a cada 30 minutos
  setInterval(async () => {
    console.log('Verificando atualizações em segundo plano...');
    
    // Verificar se alguma seção precisa ser atualizada
    if (shouldUpdate('events') || shouldUpdate('news') || shouldUpdate('scarcity')) {
      console.log('Atualizando dados em segundo plano...');
      await loadAllSections();
      
      // Mostrar notificação discreta
      showUpdateNotification();
    }
  }, 30 * 60 * 1000); // 30 minutos
}

// Função para mostrar notificação de atualização
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f7931a;
    color: white;
    padding: 0.8rem 1.2rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;
  notification.textContent = 'Dados atualizados!';
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', async function() {
  console.log('Scarcity Panel carregado - iniciando atualizações automáticas...');
  
  // Carregar dados do cache primeiro
  const cachedEvents = loadFromCache('events');
  const cachedNews = loadFromCache('news');
  const cachedScarcity = loadFromCache('scarcity');
  
  if (cachedEvents) renderEvents(cachedEvents);
  if (cachedNews) renderNews(cachedNews);
  if (cachedScarcity) renderScarcityMetrics(cachedScarcity);
  
  // Carregar indicadores principais
  await loadMainIndicators();
  
  // Carregar todas as seções
  await loadAllSections();
  
  // Iniciar atualizações periódicas
  startPeriodicUpdates();
  
  // Configurar botão de sources
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
  
  console.log('Scarcity Panel totalmente carregado e funcional!');
});

