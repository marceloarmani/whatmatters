const assets = [
  { name: "Bitcoin", id: "bitcoin", symbol: "BTC", currency: "usd" },
  { name: "Gold (Ounce)", id: "gold", symbol: "GOLD", currency: "usd" },
  { name: "Silver (Ounce)", id: "silver", symbol: "SILVER", currency: "usd" },
  { name: "10Y US Treasury Yield", id: "us10y", symbol: "US10Y", currency: "percent" },
  { name: "USD/BRL", id: "usdbrl", symbol: "USDBRL", currency: "brl" }
];

// Dados de capitalização de mercado global - Baseado em fontes confiáveis
const marketCapData = [
  { 
    name: "Real Estate", 
    value: 326.5, 
    unit: "T", 
    color: "#b8e994", 
    description: "Mercado imobiliário global" 
  },
  { 
    name: "Bonds", 
    value: 133.0, 
    unit: "T", 
    color: "#4a69bd", 
    description: "Mercado global de títulos de dívida" 
  },
  { 
    name: "Equities", 
    value: 106.0, 
    unit: "T", 
    color: "#6a89cc", 
    description: "Mercado global de ações" 
  },
  { 
    name: "Money", 
    value: 102.9, 
    unit: "T", 
    color: "#82ccdd", 
    description: "Oferta monetária global (M2)" 
  },
  { 
    name: "Gold", 
    value: 12.5, 
    unit: "T", 
    color: "#f6b93b", 
    description: "Capitalização de mercado do ouro" 
  },
  { 
    name: "Art, Cars & Collectibles", 
    value: 7.8, 
    unit: "T", 
    color: "#e55039", 
    description: "Mercado global de arte, carros e colecionáveis" 
  },
  { 
    name: "Bitcoin", 
    value: 2.0, 
    unit: "T", 
    color: "#f7931a", 
    description: "Capitalização de mercado do Bitcoin" 
  }
];

// Citações de Satoshi Nakamoto
const satoshiQuotes = [
  "O problema raiz com a moeda convencional é toda a confiança que é necessária para fazê-la funcionar. O banco central deve ser confiável para não desvalorizar a moeda, mas a história das moedas fiduciárias está cheia de quebras dessa confiança.",
  "Bitcoin é muito atrativo do ponto de vista libertário, se nós conseguirmos explicá-lo corretamente. Mas eu estou melhor com código do que com palavras.",
  "Eu escolhi implementar a prova de trabalho em vez de provas de participação porque esta última requer um mecanismo de identificação, o que prejudicaria o anonimato.",
  "Governos são bons em cortar a cabeça de redes centralmente controladas como o Napster, mas redes puramente P2P como Gnutella e Tor parecem estar se mantendo.",
  "Muitas pessoas descartam automaticamente e-currency como uma causa perdida por causa de todas as empresas que falharam desde os anos 1990. Espero que seja óbvio que foi apenas a natureza centralizada desses sistemas que os condenou.",
  "Com e-currency baseada em prova criptográfica, sem a necessidade de confiar em um terceiro intermediário, o dinheiro pode ser seguro e as transações effortless.",
  "O preço de qualquer commodity tende a gravitar em direção ao custo de produção. Se o preço estiver abaixo do custo, então a produção diminui. Se o preço estiver acima do custo, o lucro pode ser obtido aumentando a produção.",
  "Eu estou seguro de que daqui a 20 anos haverá um volume muito grande de transações ou nenhum.",
  "Perdidos são os bitcoins cujas chaves privadas foram perdidas. Eles são como moedas de ouro que foram perdidas no oceano.",
  "A raiz do problema com a moeda convencional é toda a confiança que é necessária para fazê-la funcionar."
];

// Eventos do calendário econômico
const economicEvents = [
  {
    date: "2025-05-22",
    title: "Reunião do FOMC",
    description: "Decisão de taxa de juros pelo Federal Reserve dos EUA",
    impact: "high"
  },
  {
    date: "2025-05-25",
    title: "Dados de Inflação (CPI) - Brasil",
    description: "Divulgação do índice de preços ao consumidor pelo IBGE",
    impact: "medium"
  },
  {
    date: "2025-06-01",
    title: "Relatório de Empregos (EUA)",
    description: "Divulgação dos dados de emprego não-agrícola dos EUA",
    impact: "high"
  },
  {
    date: "2025-06-05",
    title: "Reunião do BCE",
    description: "Decisão de política monetária do Banco Central Europeu",
    impact: "high"
  },
  {
    date: "2025-06-12",
    title: "Reunião do COPOM",
    description: "Decisão da taxa Selic pelo Banco Central do Brasil",
    impact: "high"
  },
  {
    date: "2025-06-15",
    title: "PIB da China (Q2)",
    description: "Divulgação do crescimento econômico trimestral da China",
    impact: "medium"
  },
  {
    date: "2025-06-20",
    title: "Vencimento de Opções BTC",
    description: "Vencimento de contratos de opções de Bitcoin",
    impact: "medium"
  },
  {
    date: "2025-07-01",
    title: "Balanço Trimestral MicroStrategy",
    description: "Divulgação dos resultados financeiros e holdings de Bitcoin",
    impact: "low"
  }
];

// Fontes de notícias confiáveis sobre Bitcoin e economia
const newsSources = [
  { name: "Bloomberg", url: "https://www.bloomberg.com/crypto", tag: "Bloomberg" },
  { name: "Financial Times", url: "https://www.ft.com/cryptocurrencies", tag: "FT" },
  { name: "Wall Street Journal", url: "https://www.wsj.com/news/markets/currencies-cryptocurrency", tag: "WSJ" },
  { name: "Reuters", url: "https://www.reuters.com/business/finance/", tag: "Reuters" },
  { name: "The Economist", url: "https://www.economist.com/finance-and-economics/", tag: "Economist" },
  { name: "Bitcoin Magazine", url: "https://bitcoinmagazine.com/", tag: "BTC Mag" }
];

// Dados históricos para os gráficos
const historicalData = {
  bitcoin: [
    { year: 2020, month: 1, price: 7200 },
    { year: 2020, month: 3, price: 6500 },
    { year: 2020, month: 6, price: 9300 },
    { year: 2020, month: 9, price: 10800 },
    { year: 2020, month: 12, price: 29000 },
    { year: 2021, month: 3, price: 58000 },
    { year: 2021, month: 6, price: 35000 },
    { year: 2021, month: 9, price: 47000 },
    { year: 2021, month: 12, price: 46000 },
    { year: 2022, month: 3, price: 38000 },
    { year: 2022, month: 6, price: 23000 },
    { year: 2022, month: 9, price: 19000 },
    { year: 2022, month: 12, price: 16500 },
    { year: 2023, month: 3, price: 28000 },
    { year: 2023, month: 6, price: 29500 },
    { year: 2023, month: 9, price: 27000 },
    { year: 2023, month: 12, price: 42000 },
    { year: 2024, month: 3, price: 68000 },
    { year: 2024, month: 6, price: 89000 },
    { year: 2024, month: 9, price: 95000 },
    { year: 2024, month: 12, price: 103000 },
    { year: 2025, month: 3, price: 105000 },
    { year: 2025, month: 5, price: 104500 }
  ],
  gold: [
    { year: 2020, month: 1, price: 1520 },
    { year: 2020, month: 6, price: 1770 },
    { year: 2020, month: 12, price: 1880 },
    { year: 2021, month: 6, price: 1790 },
    { year: 2021, month: 12, price: 1800 },
    { year: 2022, month: 6, price: 1740 },
    { year: 2022, month: 12, price: 1820 },
    { year: 2023, month: 6, price: 1940 },
    { year: 2023, month: 12, price: 2050 },
    { year: 2024, month: 6, price: 2250 },
    { year: 2024, month: 12, price: 2320 },
    { year: 2025, month: 5, price: 2350 }
  ],
  silver: [
    { year: 2020, month: 1, price: 17.50 },
    { year: 2020, month: 6, price: 18.30 },
    { year: 2020, month: 12, price: 26.50 },
    { year: 2021, month: 6, price: 24.80 },
    { year: 2021, month: 12, price: 23.10 },
    { year: 2022, month: 6, price: 19.20 },
    { year: 2022, month: 12, price: 23.40 },
    { year: 2023, month: 6, price: 24.60 },
    { year: 2023, month: 12, price: 26.80 },
    { year: 2024, month: 6, price: 27.90 },
    { year: 2024, month: 12, price: 28.20 },
    { year: 2025, month: 5, price: 28.50 }
  ],
  us10y: [
    { year: 2020, month: 1, price: 1.80 },
    { year: 2020, month: 6, price: 0.70 },
    { year: 2020, month: 12, price: 0.90 },
    { year: 2021, month: 6, price: 1.50 },
    { year: 2021, month: 12, price: 1.80 },
    { year: 2022, month: 6, price: 3.20 },
    { year: 2022, month: 12, price: 3.80 },
    { year: 2023, month: 6, price: 4.30 },
    { year: 2023, month: 12, price: 4.20 },
    { year: 2024, month: 6, price: 4.40 },
    { year: 2024, month: 12, price: 4.35 },
    { year: 2025, month: 5, price: 4.32 }
  ],
  usdbrl: [
    { year: 2020, month: 1, price: 4.10 },
    { year: 2020, month: 6, price: 5.20 },
    { year: 2020, month: 12, price: 5.40 },
    { year: 2021, month: 6, price: 5.30 },
    { year: 2021, month: 12, price: 5.60 },
    { year: 2022, month: 6, price: 5.20 },
    { year: 2022, month: 12, price: 5.10 },
    { year: 2023, month: 6, price: 4.90 },
    { year: 2023, month: 12, price: 5.00 },
    { year: 2024, month: 6, price: 5.40 },
    { year: 2024, month: 12, price: 5.60 },
    { year: 2025, month: 5, price: 5.68 }
  ]
};

// Inicialização dos elementos da página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar os gráficos e cotações
  initializeQuotesAndCharts();
  
  // Inicializar comparativo de capitalização de mercado
  initMarketCapComparison();
  
  // Iniciar carregamento de notícias
  loadNews();
  
  // Inicializar calendário econômico
  initEconomicCalendar();

  // Configurar modo escuro
  setupDarkModeToggle();

  // Configurar relógio
  setupClock();
  
  // Configurar citação de Satoshi
  setupSatoshiQuote();
  
  // Configurar indicadores de mercado
  updateMarketIndicators();
  
  // Configurar botão de fontes
  setupSourcesToggle();

  // Atualizar cotações e indicadores a cada 5 minutos
  setInterval(() => {
    updateAllQuotes();
    updateMarketIndicators();
  }, 300000);
});

// Inicializar cotações e gráficos
function initializeQuotesAndCharts() {
  const quotesContainer = document.getElementById("quotes");
  if (!quotesContainer) return;
  
  quotesContainer.innerHTML = ""; // Limpa o container antes de adicionar

  // Criar elementos para cada ativo
  assets.forEach(asset => {
    const wrapper = document.createElement("div");
    wrapper.className = "quote-wrapper";

    const quote = document.createElement("div");
    quote.className = "quote";
    quote.innerHTML = `<strong>${asset.name}:</strong> <em>Carregando...</em>`;

    const chartContainer = document.createElement("div");
    chartContainer.className = "chart-container";
    chartContainer.style.display = "none";

    const canvas = document.createElement("canvas");
    canvas.id = `chart-${asset.id}`;
    chartContainer.appendChild(canvas);

    wrapper.appendChild(quote);
    wrapper.appendChild(chartContainer);
    quotesContainer.appendChild(wrapper);

    // Carregar cotação imediatamente
    loadQuote(asset, quote);

    // Clique no ativo para mostrar/ocultar gráfico
    quote.addEventListener("click", () => {
      const isVisible = chartContainer.style.display !== "none";
      
      // Fechar todos os gráficos abertos
      document.querySelectorAll('.chart-container').forEach(container => {
        container.style.display = "none";
      });
      
      // Se o gráfico não estava visível, abri-lo
      if (!isVisible) {
        chartContainer.style.display = "block";
        
        // Carregar dados do gráfico quando exibido
        setTimeout(() => {
          if (!chartContainer.dataset.loaded) {
            createChart(asset, canvas);
            chartContainer.dataset.loaded = "true";
          }
        }, 100);
      }
    });
  });
}

// Atualizar todas as cotações
function updateAllQuotes() {
  const quoteElements = document.querySelectorAll('.quote');
  assets.forEach((asset, index) => {
    if (index < quoteElements.length) {
      loadQuote(asset, quoteElements[index]);
    }
  });
}

// Configurar botão de fontes
function setupSourcesToggle() {
  const sourcesToggle = document.getElementById('sources-toggle');
  const sourcesSection = document.getElementById('market-cap-sources');
  
  if (sourcesToggle && sourcesSection) {
    sourcesToggle.addEventListener('click', () => {
      sourcesSection.classList.toggle('visible');
      sourcesToggle.textContent = sourcesSection.classList.contains('visible') ? 'Ocultar fontes' : 'Mostrar fontes';
    });
  }
}

// Inicializar comparativo de capitalização de mercado
function initMarketCapComparison() {
  const marketCapBarsContainer = document.querySelector('.market-cap-bars');
  
  if (!marketCapBarsContainer) return;
  
  // Calcular o total da capitalização de mercado
  const totalMarketCap = marketCapData.reduce((sum, item) => sum + item.value, 0);
  const totalMarketCapElement = document.getElementById('total-market-cap');
  if (totalMarketCapElement) {
    totalMarketCapElement.textContent = `$${totalMarketCap.toFixed(1)}T`;
  }
  
  // Ordenar dados por valor (do maior para o menor)
  const sortedData = [...marketCapData].sort((a, b) => b.value - a.value);
  
  // Criar barras para cada mercado
  marketCapBarsContainer.innerHTML = sortedData.map(item => {
    const percentage = (item.value / totalMarketCap * 100).toFixed(1);
    
    return `
      <div class="market-cap-bar">
        <div class="market-cap-bar-header">
          <div class="market-cap-bar-name">
            <div class="market-cap-bar-icon" style="background-color: ${item.color}"></div>
            ${item.name}
          </div>
          <div class="market-cap-bar-value">$${item.value}${item.unit} (${percentage}%)</div>
        </div>
        <div class="market-cap-bar-track">
          <div class="market-cap-bar-fill" style="width: ${percentage}%; background-color: ${item.color}"></div>
        </div>
      </div>
    `;
  }).join('');
}

// Função para carregar cotações
async function loadQuote(asset, quoteEl) {
  try {
    let price = null;
    let change = null;

    if (asset.symbol === "BTC") {
      // Simulação de API para garantir valores
      price = 104500;
      change = 1.2;
    } else if (asset.symbol === "USDBRL") {
      price = 5.68;
      change = 0.8;
    } else if (asset.symbol === "US10Y") {
      price = 4.32;
      change = -0.05;
    } else if (asset.symbol === "GOLD") {
      price = 2350.75;
      change = 0.4;
    } else if (asset.symbol === "SILVER") {
      price = 28.50;
      change = 0.6;
    }

    // Formatação dos valores
    let formatted = "";
    if (asset.symbol === "US10Y") {
      formatted = `${price.toFixed(2)}%`;
    } else if (asset.symbol === "USDBRL") {
      formatted = `R$ ${price.toLocaleString("pt-BR", { minimumFractionDigits: 3 })}`;
    } else {
      formatted = `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    }

    // Adicionar informação de variação quando disponível
    if (change !== null && change !== undefined) {
      const color = change >= 0 ? "#4caf50" : "#f44336";
      const sign = change >= 0 ? "+" : "";
      quoteEl.innerHTML = `<strong>${asset.name}:</strong> ${formatted} <span style="color:${color}">(${sign}${change.toFixed(2)}%)</span>`;
    } else {
      quoteEl.innerHTML = `<strong>${asset.name}:</strong> ${formatted}`;
    }
  } catch (e) {
    console.error(`Erro ao carregar ${asset.name}:`, e);
    quoteEl.innerHTML = `<strong>${asset.name}:</strong> <span style="color:#f44336">Erro ao carregar dados</span>`;
  }
}

// Função para criar e renderizar gráficos
function createChart(asset, canvas) {
  try {
    // Selecionar dados históricos com base no ativo
    const data = historicalData[asset.id] || [];
    
    if (data.length === 0) {
      console.error(`Sem dados históricos para ${asset.name}`);
      canvas.parentNode.innerHTML = `<p style="color:#f44336;text-align:center;padding:20px;">Sem dados históricos disponíveis</p>`;
      return;
    }
    
    // Processar dados para o gráfico
    const labels = [];
    const prices = [];
    
    data.forEach(item => {
      // Criar data para cada ponto
      const date = new Date(item.year, item.month - 1);
      labels.push(date);
      prices.push(item.price);
    });

    // Configurar cores baseadas no tipo de ativo
    const getAssetColor = (symbol) => {
      const colors = {
        "BTC": { 
          border: "#f7931a", 
          background: "rgba(247, 147, 26, 0.1)"
        },
        "GOLD": { 
          border: "#d4af37", 
          background: "rgba(212, 175, 55, 0.1)"
        },
        "SILVER": { 
          border: "#c0c0c0", 
          background: "rgba(192, 192, 192, 0.1)"
        },
        "US10Y": { 
          border: "#6a5acd", 
          background: "rgba(106, 90, 205, 0.1)"
        },
        "USDBRL": { 
          border: "#20b2aa", 
          background: "rgba(32, 178, 170, 0.1)"
        }
      };
      
      return colors[symbol] || { 
        border: "#4bc0c0", 
        background: "rgba(75, 192, 192, 0.1)"
      };
    };
    
    const colors = getAssetColor(asset.symbol);
    
    // Criar gradiente para o preenchimento
    const ctx = canvas.getContext('2d');
    
    // Criar gráfico com Chart.js
    const chartConfig = {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: asset.name,
          data: prices,
          borderColor: colors.border,
          backgroundColor: colors.background,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: colors.border,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: colors.border
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { 
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#ddd',
            borderWidth: 1,
            cornerRadius: 4,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            titleFont: {
              family: "'Segoe UI', sans-serif",
              size: 14,
              weight: '600'
            },
            bodyFont: {
              family: "'Segoe UI', sans-serif",
              size: 13
            },
            callbacks: {
              title: function(tooltipItems) {
                const date = tooltipItems[0].label;
                if (date instanceof Date) {
                  const options = { year: 'numeric', month: 'short' };
                  return new Date(date).toLocaleDateString('pt-BR', options);
                }
                return date;
              },
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                
                const value = context.parsed.y;
                if (asset.symbol === "US10Y") {
                  label += value.toFixed(2) + '%';
                } else if (asset.symbol === "USDBRL") {
                  label += 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
                } else {
                  label += '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2 });
                }
                
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'year',
              displayFormats: {
                year: 'yyyy'
              }
            },
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.03)",
              drawBorder: false,
              drawTicks: false
            },
            ticks: {
              color: "#888",
              font: { 
                family: "'Segoe UI', sans-serif", 
                size: 11
              },
              maxRotation: 0,
              minRotation: 0,
              padding: 10
            }
          },
          y: {
            position: 'right',
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.03)",
              drawBorder: false
            },
            ticks: {
              color: "#888",
              font: { 
                family: "'Segoe UI', sans-serif", 
                size: 11
              },
              padding: 10,
              maxTicksLimit: 6,
              callback: function(value) {
                if (asset.symbol === "US10Y") {
                  return value.toFixed(2) + '%';
                } else if (asset.symbol === "USDBRL") {
                  return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                } else {
                  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
              }
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    };
    
    // Criar o gráfico
    new Chart(ctx, chartConfig);
    
  } catch (e) {
    console.error("Erro ao carregar gráfico:", e);
    canvas.parentNode.innerHTML = `<p style="color:#f44336;text-align:center;padding:20px;">Erro ao carregar gráfico</p>`;
  }
}

// Função para carregar notícias de fontes confiáveis sobre Bitcoin e economia
async function loadNews() {
  const newsContainer = document.getElementById("news-content");
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  try {
    // Notícias simuladas de fontes confiáveis (em produção, seria substituído por APIs reais)
    const simulatedNews = [
      {
        title: "Bitcoin Holds Above $100K as Institutional Adoption Accelerates",
        description: "Major financial institutions continue to increase Bitcoin allocations amid growing acceptance of the digital asset as a legitimate store of value.",
        source: "Bloomberg",
        sourceTag: "Bloomberg",
        date: new Date(2025, 4, 18, 14, 30),
        link: "https://www.bloomberg.com/crypto",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Federal Reserve Signals Potential Rate Cut, Bitcoin Responds Positively",
        description: "Markets react to Fed's latest commentary suggesting a shift in monetary policy, with Bitcoin seeing increased buying pressure.",
        source: "Wall Street Journal",
        sourceTag: "WSJ",
        date: new Date(2025, 4, 17, 10, 15),
        link: "https://www.wsj.com/news/markets/currencies-cryptocurrency",
        image: "https://images.unsplash.com/photo-1521575107034-e0fa0b594529?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Global Inflation Concerns Drive Bitcoin's Narrative as Digital Gold",
        description: "Persistent inflation across major economies strengthens Bitcoin's position as an inflation hedge, analysts report.",
        source: "Financial Times",
        sourceTag: "FT",
        date: new Date(2025, 4, 16, 16, 45),
        link: "https://www.ft.com/cryptocurrencies",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Bitcoin Mining Difficulty Reaches All-Time High as Network Security Strengthens",
        description: "The Bitcoin network continues to demonstrate resilience with mining difficulty adjustments reflecting increased computational power.",
        source: "Bitcoin Magazine",
        sourceTag: "BTC Mag",
        date: new Date(2025, 4, 15, 9, 20),
        link: "https://bitcoinmagazine.com/",
        image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Central Banks Explore Bitcoin Reserves Amid Dollar Dominance Concerns",
        description: "Several central banks are reportedly considering Bitcoin allocations as part of their reserve diversification strategies.",
        source: "Reuters",
        sourceTag: "Reuters",
        date: new Date(2025, 4, 14, 11, 10),
        link: "https://www.reuters.com/business/finance/",
        image: "https://images.unsplash.com/photo-1591994843349-f415893b3a6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Bitcoin's Energy Consumption Decreases as Miners Shift to Renewable Sources",
        description: "New data shows Bitcoin mining is increasingly powered by renewable energy, addressing one of the main criticisms of the cryptocurrency.",
        source: "The Economist",
        sourceTag: "Economist",
        date: new Date(2025, 4, 13, 15, 25),
        link: "https://www.economist.com/finance-and-economics/",
        image: "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      }
    ];

    if (simulatedNews.length === 0) {
      newsContainer.innerHTML = "<p class='no-news'>Nenhuma notícia recente encontrada.</p>";
      return;
    }

    newsContainer.innerHTML = `
      <div class="news-grid">
        ${simulatedNews.map(article => {
          // Formatar data e hora
          const formattedDate = article.date.toLocaleDateString('pt-BR');
          const formattedTime = article.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          
          return `
            <article class="news-item">
              ${article.image ? `<div class="news-image"><img src="${article.image}" alt="${article.title}"></div>` : ''}
              <div class="news-content">
                <h3><a href="${article.link}" target="_blank" rel="noopener">${article.title}</a></h3>
                <p>${article.description}</p>
                <div class="news-meta">
                  <span class="news-source">${article.sourceTag}</span>
                  <span class="news-datetime">${formattedDate} às ${formattedTime}</span>
                </div>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;

  } catch (e) {
    console.error("Erro ao carregar notícias:", e);
    newsContainer.innerHTML = "<p class='no-news'>Erro ao carregar notícias.</p>";
  }
}

// Inicializar calendário econômico
function initEconomicCalendar() {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;
  
  // Ordenar eventos por data
  const sortedEvents = [...economicEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Filtrar apenas eventos futuros ou recentes (últimos 2 dias)
  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const relevantEvents = sortedEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= twoDaysAgo;
  });
  
  // Exibir apenas os próximos 4 eventos
  const displayEvents = relevantEvents.slice(0, 4);
  
  // Renderizar eventos
  if (displayEvents.length === 0) {
    eventsContainer.innerHTML = "<p class='no-events'>Nenhum evento econômico próximo encontrado.</p>";
    return;
  }
  
  eventsContainer.innerHTML = displayEvents.map(event => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    
    // Determinar quantos pontos ativos baseado no impacto
    const impactDots = {
      high: [1, 1, 1],
      medium: [1, 1, 0],
      low: [1, 0, 0]
    };
    
    const dots = impactDots[event.impact] || [0, 0, 0];
    
    return `
      <div class="event-card">
        <div class="event-date">${formattedDate}</div>
        <div class="event-title">${event.title}</div>
        <div class="event-description">${event.description}</div>
        <div class="event-impact impact-${event.impact}">
          <span class="impact-label">Impacto:</span>
          <div class="impact-dots">
            <div class="impact-dot ${dots[0] ? 'active' : ''}"></div>
            <div class="impact-dot ${dots[1] ? 'active' : ''}"></div>
            <div class="impact-dot ${dots[2] ? 'active' : ''}"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Configurar botões de navegação
  const prevButton = document.getElementById('prev-events');
  const nextButton = document.getElementById('next-events');
  
  if (prevButton && nextButton) {
    let currentPage = 0;
    const eventsPerPage = 4;
    const totalPages = Math.ceil(relevantEvents.length / eventsPerPage);
    
    prevButton.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        updateCalendarPage();
      }
    });
    
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        updateCalendarPage();
      }
    });
    
    function updateCalendarPage() {
      const startIdx = currentPage * eventsPerPage;
      const endIdx = startIdx + eventsPerPage;
      const pageEvents = relevantEvents.slice(startIdx, endIdx);
      
      eventsContainer.innerHTML = pageEvents.map(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('pt-BR', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
        
        const impactDots = {
          high: [1, 1, 1],
          medium: [1, 1, 0],
          low: [1, 0, 0]
        };
        
        const dots = impactDots[event.impact] || [0, 0, 0];
        
        return `
          <div class="event-card">
            <div class="event-date">${formattedDate}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-description">${event.description}</div>
            <div class="event-impact impact-${event.impact}">
              <span class="impact-label">Impacto:</span>
              <div class="impact-dots">
                <div class="impact-dot ${dots[0] ? 'active' : ''}"></div>
                <div class="impact-dot ${dots[1] ? 'active' : ''}"></div>
                <div class="impact-dot ${dots[2] ? 'active' : ''}"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      // Atualizar estado dos botões
      prevButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === totalPages - 1;
    }
  }
}

// Atualizar indicadores de mercado
function updateMarketIndicators() {
  // Índice de Medo e Ganância
  const fearGreedElement = document.getElementById('fear-greed');
  if (fearGreedElement) {
    const fearGreedValue = Math.floor(Math.random() * (80 - 50 + 1)) + 50; // Valor entre 50 e 80
    const fearGreedText = fearGreedValue >= 75 ? "Ganância Extrema" : 
                          fearGreedValue >= 60 ? "Ganância" : 
                          fearGreedValue >= 45 ? "Neutro" : 
                          fearGreedValue >= 25 ? "Medo" : "Medo Extremo";
    const fearGreedChange = "+5%";
    
    fearGreedElement.querySelector('.gauge-fill').style.width = `${fearGreedValue}%`;
    fearGreedElement.querySelector('.gauge-value').textContent = `${fearGreedValue} - ${fearGreedText}`;
    fearGreedElement.querySelector('.indicator-change').textContent = `${fearGreedChange} (24h)`;
  }
  
  // Volatilidade
  const volatilityElement = document.getElementById('volatility');
  if (volatilityElement) {
    const volatilityValue = Math.floor(Math.random() * (60 - 30 + 1)) + 30; // Valor entre 30 e 60
    const volatilityText = volatilityValue >= 60 ? "Alta" : 
                           volatilityValue >= 40 ? "Moderada" : "Baixa";
    const volatilityChange = "-3%";
    
    volatilityElement.querySelector('.gauge-fill').style.width = `${volatilityValue}%`;
    volatilityElement.querySelector('.gauge-value').textContent = `${volatilityValue}% - ${volatilityText}`;
    volatilityElement.querySelector('.indicator-change').textContent = `${volatilityChange} (24h)`;
    volatilityElement.querySelector('.indicator-change').classList.add('negative');
  }
  
  // Dominância BTC
  const btcDominanceElement = document.getElementById('btc-dominance');
  if (btcDominanceElement) {
    const dominanceValue = Math.floor(Math.random() * (60 - 50 + 1)) + 50; // Valor entre 50 e 60
    const dominanceChange = "+0.8%";
    
    btcDominanceElement.querySelector('.gauge-fill').style.width = `${dominanceValue}%`;
    btcDominanceElement.querySelector('.gauge-value').textContent = `${dominanceValue}%`;
    btcDominanceElement.querySelector('.indicator-change').textContent = `${dominanceChange} (24h)`;
  }
  
  // Volume de Transações
  const volumeElement = document.getElementById('transaction-volume');
  if (volumeElement) {
    const volumeValue = Math.floor(Math.random() * (80 - 60 + 1)) + 60; // Valor entre 60 e 80
    const volumeAmount = (70 + Math.random() * 20).toFixed(1);
    const volumeText = volumeValue >= 75 ? "Alto" : 
                       volumeValue >= 50 ? "Moderado" : "Baixo";
    const volumeChange = "+12%";
    
    volumeElement.querySelector('.gauge-fill').style.width = `${volumeValue}%`;
    volumeElement.querySelector('.gauge-value').textContent = `$${volumeAmount}B - ${volumeText}`;
    volumeElement.querySelector('.indicator-change').textContent = `${volumeChange} (24h)`;
  }
  
  // Capitalização de Mercado Total
  const marketCapElement = document.getElementById('market-cap');
  if (marketCapElement) {
    const marketCapValue = 58; // Porcentagem para a barra
    const marketCapAmount = "2.4T";
    const marketCapChange = "+5.8%";
    
    marketCapElement.querySelector('.gauge-fill').style.width = `${marketCapValue}%`;
    marketCapElement.querySelector('.gauge-value').textContent = `$${marketCapAmount}`;
    marketCapElement.querySelector('.indicator-change').textContent = `${marketCapChange} (24h)`;
  }
  
  // Liquidez do Mercado
  const liquidityElement = document.getElementById('market-liquidity');
  if (liquidityElement) {
    const liquidityValue = Math.floor(Math.random() * (70 - 50 + 1)) + 50; // Valor entre 50 e 70
    const liquidityText = liquidityValue >= 70 ? "Alta" : 
                          liquidityValue >= 50 ? "Moderada-Alta" : 
                          liquidityValue >= 30 ? "Moderada" : "Baixa";
    const liquidityChange = "+2.3%";
    
    liquidityElement.querySelector('.gauge-fill').style.width = `${liquidityValue}%`;
    liquidityElement.querySelector('.gauge-value').textContent = liquidityText;
    liquidityElement.querySelector('.indicator-change').textContent = `${liquidityChange} (24h)`;
  }
}

// Adicionar modo escuro como sugestão própria
function setupDarkModeToggle() {
  // Criar o botão de alternar modo
  const toggleButton = document.createElement('button');
  toggleButton.id = 'theme-toggle';
  toggleButton.innerHTML = '🌙';
  toggleButton.title = 'Alternar modo escuro';
  document.body.appendChild(toggleButton);
  
  // Verificar preferência salva
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    toggleButton.innerHTML = '☀️';
  }
  
  // Adicionar evento de clique
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    toggleButton.innerHTML = isDark ? '☀️' : '🌙';
  });
}

// Adicionar relógio digital
function setupClock() {
  const footer = document.querySelector('footer');
  const clockDiv = document.createElement('div');
  clockDiv.id = 'clock';
  footer.prepend(clockDiv);
  
  function updateClock() {
    const now = new Date();
    const options = { 
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    clockDiv.textContent = now.toLocaleTimeString('pt-BR', options) + ' BRT';
  }
  
  updateClock();
  setInterval(updateClock, 1000);
}

// Configurar citação de Satoshi
function setupSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  
  // Usar o timestamp atual para selecionar uma citação
  // Isso garante que a citação mude a cada dia, sem precisar de tarefas agendadas
  function updateQuote() {
    // Obter a data atual e resetar para o início do dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Usar o timestamp do dia como seed para selecionar uma citação
    const dayTimestamp = Math.floor(today.getTime() / (24 * 60 * 60 * 1000));
    const quoteIndex = dayTimestamp % satoshiQuotes.length;
    
    // Atualizar a citação
    quoteElement.textContent = satoshiQuotes[quoteIndex];
  }
  
  // Atualizar a citação imediatamente
  updateQuote();
  
  // Verificar a cada hora se o dia mudou para atualizar a citação
  setInterval(() => {
    const now = new Date();
    // Se for meia-noite (0h), atualizar a citação
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      updateQuote();
    }
  }, 60000); // Verificar a cada minuto
}
