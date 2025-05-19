const assets = [
  { name: "Bitcoin", symbol: "BTC", color: "#f7931a", api: "coindesk" },
  { name: "Ouro", symbol: "XAU", color: "#d4af37", api: "metals" },
  { name: "Prata", symbol: "XAG", color: "#c0c0c0", api: "metals" },
  { name: "Treasury Yield", symbol: "10Y", color: "#6a5acd", api: "treasury" },
  { name: "Dollar Index", symbol: "DXY", color: "#20b2aa", api: "dollar" }
];

// Dados históricos para os gráficos (5 anos)
const historicalData = {
  BTC: {
    labels: generateYearLabels(5),
    prices: [
      8900, 9200, 10500, 11200, 12800, 16000, 19000, 17500, 16800, 19500, 23000, 29000,
      32000, 38000, 42000, 47000, 52000, 58000, 64000, 57000, 48000, 42000, 37000, 39000,
      42000, 45000, 48000, 52000, 56000, 58000, 62000, 65000, 68000, 72000, 75000, 78000,
      82000, 85000, 88000, 92000, 95000, 98000, 102000, 105000, 108000, 112000, 115000, 118000,
      122000, 125000, 128000, 132000, 135000, 138000, 142000
    ]
  },
  XAU: {
    labels: generateYearLabels(5),
    prices: [
      1500, 1520, 1540, 1560, 1580, 1600, 1620, 1640, 1660, 1680, 1700, 1720,
      1740, 1760, 1780, 1800, 1820, 1840, 1860, 1880, 1900, 1920, 1940, 1960,
      1980, 2000, 2020, 2040, 2060, 2080, 2100, 2120, 2140, 2160, 2180, 2200,
      2220, 2240, 2260, 2280, 2300, 2320, 2340, 2360, 2380, 2400, 2420, 2440,
      2460, 2480, 2500, 2520, 2540, 2560, 2580
    ]
  },
  XAG: {
    labels: generateYearLabels(5),
    prices: [
      17.5, 17.8, 18.1, 18.4, 18.7, 19.0, 19.3, 19.6, 19.9, 20.2, 20.5, 20.8,
      21.1, 21.4, 21.7, 22.0, 22.3, 22.6, 22.9, 23.2, 23.5, 23.8, 24.1, 24.4,
      24.7, 25.0, 25.3, 25.6, 25.9, 26.2, 26.5, 26.8, 27.1, 27.4, 27.7, 28.0,
      28.3, 28.6, 28.9, 29.2, 29.5, 29.8, 30.1, 30.4, 30.7, 31.0, 31.3, 31.6,
      31.9, 32.2, 32.5, 32.8, 33.1, 33.4, 33.7
    ]
  },
  "10Y": {
    labels: generateYearLabels(5),
    prices: [
      0.65, 0.68, 0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
      1.01, 1.04, 1.07, 1.10, 1.13, 1.16, 1.19, 1.22, 1.25, 1.28, 1.31, 1.34,
      1.37, 1.40, 1.43, 1.46, 1.49, 1.52, 1.55, 1.58, 1.61, 1.64, 1.67, 1.70,
      1.73, 1.76, 1.79, 1.82, 1.85, 1.88, 1.91, 1.94, 1.97, 2.00, 2.03, 2.06,
      2.09, 2.12, 2.15, 2.18, 2.21, 2.24, 2.27
    ]
  },
  DXY: {
    labels: generateYearLabels(5),
    prices: [
      96.5, 96.8, 97.1, 97.4, 97.7, 98.0, 98.3, 98.6, 98.9, 99.2, 99.5, 99.8,
      100.1, 100.4, 100.7, 101.0, 101.3, 101.6, 101.9, 102.2, 102.5, 102.8, 103.1, 103.4,
      103.7, 104.0, 104.3, 104.6, 104.9, 105.2, 105.5, 105.8, 106.1, 106.4, 106.7, 107.0,
      107.3, 107.6, 107.9, 108.2, 108.5, 108.8, 109.1, 109.4, 109.7, 110.0, 110.3, 110.6,
      110.9, 111.2, 111.5, 111.8, 112.1, 112.4, 112.7
    ]
  }
};

// Gerar rótulos de anos para os gráficos (5 anos)
function generateYearLabels(years) {
  const labels = [];
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - years;
  
  for (let year = startYear; year <= currentYear; year++) {
    labels.push(year.toString());
  }
  
  // Preencher com mais pontos entre os anos para suavizar o gráfico
  const expandedLabels = [];
  for (let i = 0; i < labels.length - 1; i++) {
    expandedLabels.push(labels[i]);
    for (let j = 1; j < 10; j++) {
      expandedLabels.push("");
    }
  }
  expandedLabels.push(labels[labels.length - 1]);
  
  return expandedLabels;
}

// Dados de capitalização de mercado global
const marketCapData = [
  { name: "Real Estate", value: 326.5, color: "#4CAF50", percentage: "61.3%" },
  { name: "Bonds", value: 133.0, color: "#2196F3", percentage: "25.0%" },
  { name: "Equities", value: 106.0, color: "#9C27B0", percentage: "19.9%" },
  { name: "Money", value: 102.9, color: "#FF9800", percentage: "19.3%" },
  { name: "Gold", value: 12.5, color: "#d4af37", percentage: "2.3%" },
  { name: "Art & Collectibles", value: 7.8, color: "#E91E63", percentage: "1.5%" },
  { name: "Bitcoin", value: 2.0, color: "#f7931a", percentage: "0.4%" }
];

// Dados de métricas de escassez
const scarcityMetrics = [
  {
    title: "Stock-to-Flow",
    values: {
      bitcoin: "56",
      gold: "62",
      silver: "22"
    },
    description: "Razão entre o estoque existente e a produção anual. Valores mais altos indicam maior escassez."
  },
  {
    title: "Inflação Anual",
    values: {
      bitcoin: "1.8%",
      gold: "1.6%",
      silver: "4.5%"
    },
    description: "Taxa de crescimento anual da oferta. Valores mais baixos indicam maior escassez."
  },
  {
    title: "Halving Countdown",
    values: {
      bitcoin: "324 dias",
      gold: "N/A",
      silver: "N/A"
    },
    description: "Tempo até a próxima redução de 50% na emissão de Bitcoin, aumentando sua escassez."
  },
  {
    title: "Reserva Monetária",
    values: {
      bitcoin: "Em crescimento",
      gold: "Estabelecida",
      silver: "Secundária"
    },
    description: "Status como reserva de valor no sistema financeiro global."
  }
];

// Próximos eventos importantes
const upcomingEvents = [
  {
    date: "25 Mai 2025",
    title: "Reunião do FOMC",
    description: "Decisão de taxa de juros pelo Federal Reserve dos EUA.",
    impact: "high"
  },
  {
    date: "02 Jun 2025",
    title: "Relatório de Inflação EUA",
    description: "Divulgação do CPI (Índice de Preços ao Consumidor) dos EUA.",
    impact: "high"
  },
  {
    date: "10 Jun 2025",
    title: "Conferência Bitcoin 2025",
    description: "Maior evento anual de Bitcoin com anúncios importantes.",
    impact: "medium"
  },
  {
    date: "15 Jun 2025",
    title: "Relatório de Emprego EUA",
    description: "Dados do mercado de trabalho americano (Non-Farm Payrolls).",
    impact: "medium"
  },
  {
    date: "22 Jun 2025",
    title: "Reunião do BCE",
    description: "Decisão de política monetária do Banco Central Europeu.",
    impact: "high"
  },
  {
    date: "30 Jun 2025",
    title: "Fechamento Trimestral",
    description: "Fim do segundo trimestre com rebalanceamento de portfólios.",
    impact: "medium"
  },
  {
    date: "04 Jul 2025",
    title: "Feriado EUA",
    description: "Mercados americanos fechados, possível baixa liquidez.",
    impact: "low"
  },
  {
    date: "15 Jul 2025",
    title: "Relatório de Varejo EUA",
    description: "Dados de vendas no varejo dos Estados Unidos.",
    impact: "medium"
  }
];

// Citações de Satoshi Nakamoto
const satoshiQuotes = [
  "O problema raiz com a moeda convencional é toda a confiança que é necessária para fazê-la funcionar. O banco central deve ser confiável para não desvalorizar a moeda, mas a história das moedas fiduciárias está cheia de quebras dessa confiança.",
  "Bitcoin é muito atrativo do ponto de vista libertário, se você não gosta da ideia de que o governo pode bloquear suas contas e tomar seu dinheiro à vontade.",
  "Perdido no ruído da discussão está o fato de que a inflação é um imposto. O dólar que você tem hoje compra menos do que o dólar que você tinha ontem. E a única razão para isso é porque o governo imprimiu mais dólares. Eles estão tirando seu dinheiro de uma forma que você não consegue ver.",
  "Eu escolhi implementar proof-of-work para substituir o servidor central. O sistema é seguro enquanto nós honestos controlarem coletivamente mais poder de CPU do que qualquer grupo de atacantes.",
  "A raiz do problema com a moeda convencional é toda a confiança que é necessária para fazê-la funcionar. É preciso confiar no banco central para não desvalorizar a moeda, mas a história das moedas fiduciárias está cheia de violações dessa confiança.",
  "Com e-currency baseada em prova criptográfica, sem a necessidade de confiar em um terceiro intermediário, o dinheiro pode ser seguro e as transações efetivadas.",
  "O Bitcoin é um novo design de sistema de pagamento eletrônico que é puramente peer-to-peer, sem nenhuma terceira parte confiável.",
  "Governos são bons em cortar a cabeça de redes centralmente controladas como o Napster, mas redes puramente P2P como Gnutella e Tor parecem estar se mantendo.",
  "Muitas pessoas descartam automaticamente e-currency como um caso perdido por causa de todas as empresas que falharam desde os anos 1990. Espero que seja óbvio que foi apenas a natureza centralizada desses sistemas que os condenou.",
  "O preço de qualquer commodity tende a se estabilizar em seu custo de produção. Se o preço estiver abaixo do custo, então a produção diminui. Se o preço estiver acima do custo, o lucro pode ser obtido aumentando a produção. Em nosso caso, o custo de produção é a eletricidade usada."
];

// Inicialização do documento
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar os componentes
  initializeQuotes();
  initializeMarketCap();
  initializeScarcityMetrics();
  initializeEvents();
  initializeNews();
  initializeSatoshiQuote();
  initializeThemeToggle();
  initializeClock();
  
  // Atualizar dados periodicamente
  setInterval(updateQuotes, 300000); // 5 minutos
});

// Inicializar os indicadores principais
function initializeQuotes() {
  const quotesContainer = document.getElementById('quotes');
  if (!quotesContainer) return;
  
  let html = '';
  
  assets.forEach((asset, index) => {
    html += `
      <div class="quote-wrapper">
        <div class="quote" data-symbol="${asset.symbol}" onclick="showChart('${asset.symbol}')">
          <strong>${asset.name}</strong>
          <span id="${asset.symbol}-price">Carregando...</span>
          <span id="${asset.symbol}-change" class="change"></span>
        </div>
      </div>
    `;
  });
  
  quotesContainer.innerHTML = html;
  
  // Carregar dados iniciais
  updateQuotes();
}

// Atualizar os preços dos ativos
function updateQuotes() {
  // Simulação de atualização de preços via API
  // Em um ambiente real, isso seria substituído por chamadas de API reais
  
  // Bitcoin (via CoinDesk API)
  const btcPrice = 118500 + Math.random() * 2000;
  const btcChange = 2.5 + Math.random() * 2;
  updateQuoteDisplay('BTC', formatCurrency(btcPrice), formatPercentage(btcChange));
  
  // Ouro (via Metals API)
  const goldPrice = 2580 + Math.random() * 50;
  const goldChange = 0.8 + Math.random() * 1;
  updateQuoteDisplay('XAU', formatCurrency(goldPrice), formatPercentage(goldChange));
  
  // Prata (via Metals API)
  const silverPrice = 33.7 + Math.random() * 1.5;
  const silverChange = 1.2 + Math.random() * 1.5;
  updateQuoteDisplay('XAG', formatCurrency(silverPrice), formatPercentage(silverChange));
  
  // Treasury Yield (via Treasury API)
  const treasuryYield = 2.27 + Math.random() * 0.1;
  const treasuryChange = -0.05 + Math.random() * 0.1;
  updateQuoteDisplay('10Y', treasuryYield.toFixed(2) + '%', formatPercentage(treasuryChange));
  
  // Dollar Index (via Forex API)
  const dollarIndex = 112.7 + Math.random() * 0.5;
  const dollarChange = 0.3 + Math.random() * 0.4;
  updateQuoteDisplay('DXY', dollarIndex.toFixed(2), formatPercentage(dollarChange));
}

// Atualizar a exibição de um ativo específico
function updateQuoteDisplay(symbol, price, change) {
  const priceElement = document.getElementById(`${symbol}-price`);
  const changeElement = document.getElementById(`${symbol}-change`);
  
  if (priceElement) priceElement.textContent = price;
  
  if (changeElement) {
    changeElement.textContent = change;
    
    // Adicionar classe para cor (verde/vermelho)
    if (change.includes('+')) {
      changeElement.className = 'change positive';
    } else if (change.includes('-')) {
      changeElement.className = 'change negative';
    } else {
      changeElement.className = 'change';
    }
  }
}

// Mostrar gráfico para o ativo selecionado
function showChart(symbol) {
  // Remover classe ativa de todos os botões
  document.querySelectorAll('.quote').forEach(quote => {
    quote.classList.remove('active');
  });
  
  // Adicionar classe ativa ao botão clicado
  document.querySelector(`.quote[data-symbol="${symbol}"]`).classList.add('active');
  
  // Mostrar área do gráfico
  const chartArea = document.getElementById('chart-area');
  chartArea.classList.add('visible');
  
  // Obter dados históricos para o ativo
  const data = historicalData[symbol];
  
  // Verificar se já existe um gráfico
  let chartInstance = Chart.getChart('main-chart');
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  // Obter o contexto do canvas
  const ctx = document.getElementById('main-chart').getContext('2d');
  
  // Encontrar o ativo correspondente para obter a cor
  const asset = assets.find(a => a.symbol === symbol);
  const color = asset ? asset.color : '#3498db';
  
  // Criar o gráfico
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: asset ? asset.name : symbol,
        data: data.prices,
        borderColor: color,
        backgroundColor: hexToRGBA(color, 0.1),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              family: "'Segoe UI', sans-serif",
              size: 12
            },
            color: '#666'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#ddd',
          borderWidth: 1,
          titleFont: {
            family: "'Segoe UI', sans-serif",
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Segoe UI', sans-serif",
            size: 13
          },
          padding: 10,
          displayColors: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (symbol === 'BTC' || symbol === 'XAU' || symbol === 'XAG') {
                  label += formatCurrency(context.parsed.y);
                } else if (symbol === '10Y') {
                  label += context.parsed.y.toFixed(2) + '%';
                } else {
                  label += context.parsed.y.toFixed(2);
                }
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 6,
            callback: function(value, index, values) {
              // Mostrar apenas os anos
              return data.labels[value] || '';
            },
            font: {
              family: "'Segoe UI', sans-serif",
              size: 11
            },
            color: '#888'
          }
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              family: "'Segoe UI', sans-serif",
              size: 11
            },
            color: '#888',
            callback: function(value, index, values) {
              if (symbol === 'BTC' || symbol === 'XAU' || symbol === 'XAG') {
                return formatCurrencyShort(value);
              } else if (symbol === '10Y') {
                return value.toFixed(2) + '%';
              } else {
                return value.toFixed(1);
              }
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
}

// Inicializar a visualização de capitalização de mercado
function initializeMarketCap() {
  const marketCapContainer = document.getElementById('market-cap-treemap');
  if (!marketCapContainer) return;
  
  // Calcular o tamanho total para proporção
  const totalMarketCap = marketCapData.reduce((sum, item) => sum + item.value, 0);
  
  // Ordenar por valor (maior para menor)
  const sortedData = [...marketCapData].sort((a, b) => b.value - a.value);
  
  let html = '';
  
  // Criar os quadrados proporcionais
  sortedData.forEach(item => {
    // Calcular o tamanho proporcional (área)
    const proportion = Math.sqrt(item.value / totalMarketCap) * 100;
    const size = Math.max(proportion * 2, 10); // Garantir um tamanho mínimo
    
    html += `
      <div class="market-cap-box" style="background-color: ${item.color}; width: ${size}px; height: ${size}px;">
        <div class="market-cap-box-name">${item.name}</div>
        <div class="market-cap-box-value">$${item.value}T</div>
        <div class="market-cap-box-percentage">${item.percentage}</div>
      </div>
    `;
  });
  
  marketCapContainer.innerHTML = html;
  
  // Configurar o botão de fontes
  const sourcesToggle = document.getElementById('sources-toggle');
  const sourcesList = document.getElementById('market-cap-sources');
  
  if (sourcesToggle && sourcesList) {
    sourcesToggle.addEventListener('click', function() {
      if (sourcesList.classList.contains('visible')) {
        sourcesList.classList.remove('visible');
        sourcesToggle.textContent = 'Mostrar fontes';
      } else {
        sourcesList.classList.add('visible');
        sourcesToggle.textContent = 'Ocultar fontes';
      }
    });
  }
}

// Inicializar as métricas de escassez
function initializeScarcityMetrics() {
  const scarcityContainer = document.querySelector('.scarcity-metrics-grid');
  if (!scarcityContainer) return;
  
  let html = '';
  
  scarcityMetrics.forEach(metric => {
    html += `
      <div class="scarcity-metric">
        <div class="scarcity-metric-title">${metric.title}</div>
        <div class="scarcity-metric-value">${metric.values.bitcoin}</div>
        <div class="scarcity-metric-description">${metric.description}</div>
        <div class="scarcity-comparison">
          <div class="scarcity-comparison-item bitcoin">Bitcoin: ${metric.values.bitcoin}</div>
          <div class="scarcity-comparison-item gold">Ouro: ${metric.values.gold}</div>
          <div class="scarcity-comparison-item silver">Prata: ${metric.values.silver}</div>
        </div>
      </div>
    `;
  });
  
  scarcityContainer.innerHTML = html;
}

// Inicializar os próximos eventos
function initializeEvents() {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;
  
  let html = '';
  
  // Mostrar apenas os primeiros 5 eventos
  upcomingEvents.slice(0, 5).forEach(event => {
    html += `
      <div class="event-item ${event.impact}">
        <div class="event-date">
          ${event.date}
          <div class="event-impact">
            <span class="impact-dot"></span>
            <span class="impact-dot"></span>
            <span class="impact-dot"></span>
          </div>
        </div>
        <div class="event-title">${event.title}</div>
        <div class="event-description">${event.description}</div>
      </div>
    `;
  });
  
  eventsContainer.innerHTML = html;
}

// Inicializar as notícias
function initializeNews() {
  const newsContainer = document.getElementById('news-content');
  if (!newsContainer) return;
  
  // Simulação de notícias (em um ambiente real, seriam obtidas via API)
  const news = [
    {
      title: "Bitcoin ultrapassa US$ 120.000 pela primeira vez na história",
      source: "Bloomberg",
      date: "19/05/2025",
      time: "14:30",
      description: "A principal criptomoeda do mundo atingiu novo recorde histórico impulsionada por forte demanda institucional.",
      url: "#",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Banco Central dos EUA sinaliza possível corte nas taxas de juros",
      source: "Wall Street Journal",
      date: "18/05/2025",
      time: "16:45",
      description: "Fed indica que inflação está sob controle e pode iniciar ciclo de afrouxamento monetário nos próximos meses.",
      url: "#",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Ouro atinge novo recorde com tensões geopolíticas crescentes",
      source: "Financial Times",
      date: "17/05/2025",
      time: "09:15",
      description: "Metal precioso valoriza 2,3% em um único dia, refletindo busca por ativos seguros em meio a incertezas globais.",
      url: "#",
      image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Grandes empresas adicionam Bitcoin ao balanço patrimonial",
      source: "Reuters",
      date: "16/05/2025",
      time: "11:20",
      description: "Cinco empresas do Fortune 500 anunciaram aquisições significativas de Bitcoin como reserva de valor corporativa.",
      url: "#",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Inflação global mostra sinais de desaceleração após anos de alta",
      source: "The Economist",
      date: "15/05/2025",
      time: "13:40",
      description: "Dados econômicos indicam que pressões inflacionárias começam a ceder em economias desenvolvidas e emergentes.",
      url: "#",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Análise: Por que ativos escassos continuam superando o mercado",
      source: "Jesse Myers",
      date: "14/05/2025",
      time: "10:05",
      description: "Estudo aprofundado sobre como Bitcoin, ouro e outros ativos com oferta limitada têm se comportado no atual cenário econômico.",
      url: "#",
      image: "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    }
  ];
  
  let html = '<div class="news-grid">';
  
  news.forEach(item => {
    html += `
      <div class="news-item">
        <div class="news-image">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="news-content">
          <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
          <p>${item.description}</p>
          <div class="news-meta">
            <span class="news-source">${item.source}</span>
            <span class="news-datetime">${item.date} às ${item.time}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  newsContainer.innerHTML = html;
}

// Inicializar a citação de Satoshi
function initializeSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  if (!quoteElement) return;
  
  // Usar a data atual como seed para selecionar uma citação
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  // Selecionar uma citação com base no dia do ano
  const quoteIndex = dayOfYear % satoshiQuotes.length;
  quoteElement.textContent = satoshiQuotes[quoteIndex];
}

// Inicializar o botão de alternar tema
function initializeThemeToggle() {
  // Verificar se já existe um botão
  if (document.getElementById('theme-toggle')) return;
  
  // Criar o botão
  const button = document.createElement('button');
  button.id = 'theme-toggle';
  button.innerHTML = '☀️';
  button.title = 'Alternar tema claro/escuro';
  document.body.appendChild(button);
  
  // Verificar preferência salva
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
    button.innerHTML = '🌙';
  }
  
  // Adicionar evento de clique
  button.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    button.innerHTML = isDarkMode ? '🌙' : '☀️';
  });
}

// Inicializar o relógio digital
function initializeClock() {
  // Verificar se já existe um relógio
  if (document.getElementById('clock')) return;
  
  // Criar o elemento do relógio
  const clock = document.createElement('div');
  clock.id = 'clock';
  
  // Adicionar o relógio ao rodapé
  const footer = document.querySelector('footer');
  if (footer) {
    footer.prepend(clock);
    
    // Atualizar o relógio
    function updateClock() {
      const now = new Date();
      const options = { 
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      };
      clock.textContent = `${now.toLocaleTimeString('pt-BR', options)} BRT`;
    }
    
    // Atualizar imediatamente e a cada segundo
    updateClock();
    setInterval(updateClock, 1000);
  }
}

// Funções utilitárias
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatCurrencyShort(value) {
  if (value >= 1000) {
    return '$' + (value / 1000).toFixed(1) + 'k';
  }
  return '$' + value.toFixed(0);
}

function formatPercentage(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
