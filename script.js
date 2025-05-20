const assets = [
  { name: "Bitcoin", symbol: "BTC", price: "$68,245.32", change: "+2.4%", color: "#f7931a", api: "coindesk" },
  { name: "Ouro", symbol: "XAU", price: "$2,342.18", change: "+0.8%", color: "#d4af37", api: "metals" },
  { name: "Prata", symbol: "XAG", price: "$30.75", change: "+1.2%", color: "#c0c0c0", api: "metals" },
  { name: "Treasury Yield", symbol: "10Y", price: "4.32%", change: "-0.05%", color: "#6a5acd", api: "treasury" },
  { name: "Dollar Index", symbol: "DXY", price: "103.42", change: "-0.3%", color: "#20b2aa", api: "forex", tooltip: "Mede a força do dólar americano em relação a uma cesta de moedas estrangeiras principais" }
];

// Dados históricos para os gráficos (5 anos)
const historicalData = {
  "Bitcoin": [
    { year: 2020, data: [7200, 8300, 9450, 8700, 9800, 9200, 11300, 11800, 10500, 13800, 17500, 29000] },
    { year: 2021, data: [33000, 45000, 58000, 56000, 37000, 35000, 42000, 47000, 43000, 61000, 58000, 46000] },
    { year: 2022, data: [38000, 44000, 40000, 39000, 31000, 20000, 23000, 24000, 19000, 20500, 17000, 16500] },
    { year: 2023, data: [16800, 23500, 28000, 30000, 27000, 30500, 29800, 28000, 26500, 34000, 37000, 42000] },
    { year: 2024, data: [45000, 52000, 61000, 64000, 59000, 62000, 65000, 67000, 66000, 68000, 69000, 68245] },
    { year: 2025, data: [67500, 69800, 72000, 70500, 68245] }
  ],
  "Ouro": [
    { year: 2020, data: [1520, 1585, 1620, 1680, 1730, 1780, 1960, 1920, 1880, 1900, 1860, 1895] },
    { year: 2021, data: [1850, 1810, 1730, 1770, 1900, 1780, 1810, 1815, 1760, 1780, 1820, 1805] },
    { year: 2022, data: [1800, 1870, 1920, 1880, 1840, 1810, 1760, 1770, 1670, 1650, 1750, 1820] },
    { year: 2023, data: [1910, 1830, 1970, 1990, 1960, 1920, 1970, 2010, 1920, 1980, 2040, 2060] },
    { year: 2024, data: [2050, 2120, 2180, 2220, 2260, 2290, 2310, 2330, 2300, 2320, 2350, 2342] },
    { year: 2025, data: [2360, 2380, 2410, 2370, 2342] }
  ],
  "Prata": [
    { year: 2020, data: [17.8, 18.5, 14.6, 15.7, 17.9, 18.2, 24.5, 27.4, 24.2, 24.1, 23.8, 26.3] },
    { year: 2021, data: [27.0, 26.7, 25.0, 26.1, 27.4, 26.0, 25.5, 24.0, 22.5, 23.9, 23.1, 22.5] },
    { year: 2022, data: [22.4, 24.3, 24.9, 23.0, 21.6, 20.3, 19.2, 19.5, 18.8, 19.5, 21.5, 23.9] },
    { year: 2023, data: [24.1, 21.7, 24.2, 25.0, 23.5, 22.8, 24.5, 24.8, 23.0, 22.7, 24.5, 24.3] },
    { year: 2024, data: [23.8, 25.6, 26.9, 27.5, 28.2, 28.9, 29.3, 29.8, 30.2, 30.5, 30.8, 30.75] },
    { year: 2025, data: [30.9, 31.2, 31.5, 31.0, 30.75] }
  ],
  "Treasury Yield": [
    { year: 2020, data: [1.88, 1.50, 0.70, 0.66, 0.65, 0.68, 0.55, 0.72, 0.68, 0.85, 0.84, 0.93] },
    { year: 2021, data: [1.07, 1.44, 1.74, 1.65, 1.58, 1.45, 1.24, 1.30, 1.52, 1.55, 1.44, 1.51] },
    { year: 2022, data: [1.78, 1.83, 2.32, 2.89, 2.84, 3.01, 2.65, 3.19, 3.83, 4.05, 3.68, 3.88] },
    { year: 2023, data: [3.51, 3.92, 3.47, 3.45, 3.64, 3.84, 3.96, 4.10, 4.57, 4.89, 4.47, 3.88] },
    { year: 2024, data: [4.05, 4.25, 4.35, 4.50, 4.60, 4.55, 4.48, 4.42, 4.38, 4.35, 4.33, 4.32] },
    { year: 2025, data: [4.30, 4.28, 4.35, 4.33, 4.32] }
  ],
  "Dollar Index": [
    { year: 2020, data: [97.3, 98.1, 99.0, 99.5, 98.3, 97.4, 93.3, 92.1, 93.9, 94.0, 92.3, 89.9] },
    { year: 2021, data: [90.5, 90.9, 93.2, 91.3, 90.0, 92.4, 92.1, 92.5, 94.2, 94.1, 95.9, 95.7] },
    { year: 2022, data: [96.5, 96.7, 98.3, 102.9, 101.8, 104.7, 106.1, 108.7, 112.1, 111.5, 106.7, 103.5] },
    { year: 2023, data: [102.1, 104.4, 102.5, 101.9, 104.2, 102.6, 101.9, 104.1, 106.1, 106.6, 103.4, 101.9] },
    { year: 2024, data: [103.4, 104.1, 104.5, 105.2, 104.8, 104.3, 103.9, 103.7, 103.5, 103.4, 103.5, 103.42] },
    { year: 2025, data: [103.6, 103.8, 103.5, 103.4, 103.42] }
  ]
};

// Dados de capitalização de mercado global
const marketCapData = [
  { name: "Real Estate", value: 326.5, color: "#4CAF50", percentage: 61.3 },
  { name: "Bonds", value: 133.0, color: "#2196F3", percentage: 25.0 },
  { name: "Equities", value: 106.0, color: "#9C27B0", percentage: 19.9 },
  { name: "Money", value: 102.9, color: "#FF9800", percentage: 19.3 },
  { name: "Gold", value: 12.5, color: "#d4af37", percentage: 2.3 },
  { name: "Art & Collectibles", value: 7.8, color: "#E91E63", percentage: 1.5 },
  { name: "Bitcoin", value: 2.0, color: "#f7931a", percentage: 0.4 }
];

// Dados de métricas de escassez
const scarcityMetrics = [
  {
    title: "Stock-to-Flow",
    value: "56",
    description: "Razão entre o estoque existente e a produção anual",
    comparison: [
      { name: "Bitcoin", value: "56" },
      { name: "Ouro", value: "62" },
      { name: "Prata", value: "22" }
    ]
  },
  {
    title: "Inflação Anual",
    value: "1.74%",
    description: "Taxa de emissão anual em relação ao estoque total",
    comparison: [
      { name: "Bitcoin", value: "1.74%" },
      { name: "Ouro", value: "1.60%" },
      { name: "Prata", value: "4.50%" }
    ]
  },
  {
    title: "Bitcoins Minerados",
    value: "19,368,750",
    description: "Quantidade de bitcoins já minerados do total de 21 milhões",
    percentage: 92.23,
    remaining: "1,631,250"
  },
  {
    title: "Próximo Halving",
    value: "Abril 2028",
    description: "Evento que reduz pela metade a recompensa de mineração",
    daysRemaining: 1056
  }
];

// Dados de próximos eventos importantes
const upcomingEvents = [
  {
    date: "25 Maio 2025",
    title: "Reunião do FOMC",
    description: "Decisão de taxa de juros pelo Federal Reserve",
    impact: "high"
  },
  {
    date: "02 Junho 2025",
    title: "Relatório de Inflação EUA",
    description: "Divulgação do CPI (Índice de Preços ao Consumidor)",
    impact: "high"
  },
  {
    date: "10 Junho 2025",
    title: "Conferência Bitcoin 2025",
    description: "Maior evento anual de Bitcoin em Miami",
    impact: "medium"
  },
  {
    date: "15 Junho 2025",
    title: "Relatório de Emprego EUA",
    description: "Dados do mercado de trabalho americano",
    impact: "medium"
  },
  {
    date: "20 Junho 2025",
    title: "Reunião do BCE",
    description: "Decisão de política monetária do Banco Central Europeu",
    impact: "high"
  },
  {
    date: "28 Junho 2025",
    title: "Vencimento de Opções BTC",
    description: "Expiração trimestral de contratos de opções de Bitcoin",
    impact: "medium"
  },
  {
    date: "05 Julho 2025",
    title: "Atualização de Protocolo ETH",
    description: "Implementação de melhorias na rede Ethereum",
    impact: "low"
  },
  {
    date: "12 Julho 2025",
    title: "Relatório PIB China",
    description: "Dados de crescimento econômico da China",
    impact: "medium"
  }
];

// Citações de Satoshi Nakamoto
const satoshiQuotes = [
  "O problema raiz com a moeda convencional é toda a confiança que é necessária para fazê-la funcionar. O banco central deve ser confiável para não desvalorizar a moeda, mas a história das moedas fiduciárias está cheia de quebras dessa confiança.",
  "O Bitcoin é muito atrativo do ponto de vista libertário, se você não gosta da ideia de que o governo pode bloquear suas contas e tomar seu dinheiro à vontade.",
  "Eu escolhi implementar a prova de trabalho em vez de provas de participação porque esta última exigiria um mecanismo de identificação, o que prejudicaria o anonimato.",
  "Perdendo uma moeda é como jogar dinheiro fora. Perdida permanentemente. Eu não acredito que devemos tornar possível recuperar moedas perdidas, pois isso prejudicaria a fungibilidade.",
  "Eu estou seguro de que daqui a 20 anos haverá um volume muito grande ou nenhum volume.",
  "Seria bom manter alguma forma de escassez, para que a riqueza total não possa ser diluída pela inflação política.",
  "O preço de qualquer commodity tende a gravitar em direção ao custo de produção. Se o preço estiver abaixo do custo, então a produção diminui. Se o preço estiver acima do custo, o lucro pode ser obtido aumentando a produção.",
  "Escrever um descrição para isso para um público geral é muito difícil. Não há nada com o que relacionar.",
  "Eu tenho certeza que em 20 anos ou haverá um volume muito grande ou não haverá volume.",
  "O Bitcoin poderia ser uma forma viável de dinheiro para compras na Internet."
];

// Fontes de notícias confiáveis
const newsSources = [
  { name: "Bloomberg", url: "https://www.bloomberg.com/" },
  { name: "Wall Street Journal", url: "https://www.wsj.com/" },
  { name: "Financial Times", url: "https://www.ft.com/" },
  { name: "Reuters", url: "https://www.reuters.com/" },
  { name: "The Economist", url: "https://www.economist.com/" },
  { name: "Bitcoin Magazine", url: "https://bitcoinmagazine.com/" },
  { name: "Cointelegraph", url: "https://cointelegraph.com/" },
  { name: "Jesse Myers", url: "https://www.onceinaspecies.com/" }
];

// Inicialização do site
document.addEventListener('DOMContentLoaded', function() {
  // Renderizar os indicadores principais
  renderQuotes();
  
  // Configurar os eventos de clique para os indicadores
  setupQuoteClickEvents();
  
  // Renderizar o sentimento de mercado
  renderMarketSentiment();
  
  // Renderizar a capitalização de mercado global
  renderMarketCap();
  
  // Renderizar as métricas de escassez
  renderScarcityMetrics();
  
  // Renderizar os próximos eventos
  renderUpcomingEvents();
  
  // Buscar e renderizar as notícias
  fetchAndRenderNews();
  
  // Renderizar a citação de Satoshi
  renderSatoshiQuote();
  
  // Configurar o botão de fontes
  setupSourcesToggle();
  
  // Configurar o botão de tema
  setupThemeToggle();
});

// Função para renderizar os indicadores principais
function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  quotesContainer.innerHTML = '';
  
  assets.forEach((asset, index) => {
    const quoteWrapper = document.createElement('div');
    quoteWrapper.className = 'quote-wrapper';
    
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    quoteElement.dataset.asset = asset.name;
    quoteElement.dataset.index = index;
    
    // Adicionar tooltip para Dollar Index
    let tooltipHtml = '';
    if (asset.tooltip) {
      tooltipHtml = `<span class="index-tooltip">ⓘ<span class="tooltip-text">${asset.tooltip}</span></span>`;
    }
    
    quoteElement.innerHTML = `
      <strong>${asset.name} ${tooltipHtml}</strong>
      <span>${asset.price} <span style="color: ${asset.change.includes('-') ? '#f44336' : '#4caf50'}">${asset.change}</span></span>
    `;
    
    quoteWrapper.appendChild(quoteElement);
    quotesContainer.appendChild(quoteWrapper);
  });
}

// Função para configurar os eventos de clique para os indicadores
function setupQuoteClickEvents() {
  const quotes = document.querySelectorAll('.quote');
  const chartArea = document.getElementById('chart-area');
  const chartContainer = document.getElementById('main-chart-container');
  let currentChart = null;
  let activeQuote = null;
  
  quotes.forEach(quote => {
    quote.addEventListener('click', function() {
      const assetName = this.dataset.asset;
      const assetIndex = parseInt(this.dataset.index);
      const asset = assets[assetIndex];
      
      // Se já estiver ativo, fechar o gráfico
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        chartArea.classList.remove('visible');
        if (currentChart) {
          currentChart.destroy();
          currentChart = null;
        }
        activeQuote = null;
        return;
      }
      
      // Remover classe ativa de todos os quotes
      quotes.forEach(q => q.classList.remove('active'));
      
      // Adicionar classe ativa ao quote clicado
      this.classList.add('active');
      activeQuote = this;
      
      // Mostrar área do gráfico
      chartArea.classList.add('visible');
      
      // Destruir gráfico anterior se existir
      if (currentChart) {
        currentChart.destroy();
      }
      
      // Adicionar botão de fechar
      if (!document.querySelector('.chart-close')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'chart-close';
        closeButton.innerHTML = '✕';
        closeButton.addEventListener('click', function() {
          chartArea.classList.remove('visible');
          if (currentChart) {
            currentChart.destroy();
            currentChart = null;
          }
          if (activeQuote) {
            activeQuote.classList.remove('active');
            activeQuote = null;
          }
        });
        chartContainer.appendChild(closeButton);
      }
      
      // Renderizar novo gráfico
      currentChart = renderChart(assetName, asset.color);
    });
  });
}

// Função para renderizar o gráfico de um ativo
function renderChart(assetName, color) {
  const ctx = document.getElementById('main-chart').getContext('2d');
  
  // Obter dados históricos do ativo
  const assetData = historicalData[assetName];
  if (!assetData) return;
  
  // Preparar dados para o gráfico
  const labels = [];
  const data = [];
  
  // Combinar todos os dados dos últimos 5 anos
  assetData.forEach(yearData => {
    yearData.data.forEach((value, monthIndex) => {
      labels.push(`${monthIndex + 1}/${yearData.year}`);
      data.push(value);
    });
  });
  
  // Criar o gráfico
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: assetName,
        data: data,
        borderColor: color,
        backgroundColor: `${color}20`,
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
          backgroundColor: '#fff',
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
          boxPadding: 5,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (assetName === 'Bitcoin') {
                  label += '$' + context.parsed.y.toLocaleString();
                } else if (assetName === 'Ouro') {
                  label += '$' + context.parsed.y.toLocaleString() + '/oz';
                } else if (assetName === 'Prata') {
                  label += '$' + context.parsed.y.toLocaleString() + '/oz';
                } else if (assetName === 'Treasury Yield') {
                  label += context.parsed.y.toFixed(2) + '%';
                } else if (assetName === 'Dollar Index') {
                  label += context.parsed.y.toFixed(2);
                } else {
                  label += context.parsed.y.toLocaleString();
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
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6,
            callback: function(value, index, values) {
              // Mostrar apenas os anos
              const label = this.getLabelForValue(value);
              if (label.endsWith('/2020') || 
                  label.endsWith('/2021') || 
                  label.endsWith('/2022') || 
                  label.endsWith('/2023') || 
                  label.endsWith('/2024') || 
                  label.endsWith('/2025')) {
                return label.split('/')[1];
              }
              return '';
            }
          }
        },
        y: {
          grid: {
            color: '#f0f0f0'
          },
          ticks: {
            callback: function(value, index, values) {
              if (assetName === 'Bitcoin') {
                return '$' + value.toLocaleString();
              } else if (assetName === 'Ouro') {
                return '$' + value.toLocaleString();
              } else if (assetName === 'Prata') {
                return '$' + value.toFixed(1);
              } else if (assetName === 'Treasury Yield') {
                return value.toFixed(2) + '%';
              } else if (assetName === 'Dollar Index') {
                return value.toFixed(1);
              }
              return value;
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      elements: {
        line: {
          tension: 0.4
        }
      }
    }
  });
  
  return chart;
}

// Função para renderizar o sentimento de mercado
function renderMarketSentiment() {
  // Já está no HTML, apenas atualizar valores se necessário
}

// Função para renderizar a capitalização de mercado global
function renderMarketCap() {
  const marketCapVisual = document.getElementById('market-cap-treemap');
  marketCapVisual.innerHTML = '';
  
  // Ordenar por valor (do maior para o menor)
  const sortedData = [...marketCapData].sort((a, b) => b.value - a.value);
  
  // Calcular o total
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);
  
  // Atualizar o total no HTML
  document.getElementById('total-market-cap').textContent = `$${total.toFixed(1)}T`;
  
  // Criar visualização em barras
  sortedData.forEach(item => {
    const marketCapItem = document.createElement('div');
    marketCapItem.className = 'market-cap-item';
    
    const marketCapItemHeader = document.createElement('div');
    marketCapItemHeader.className = 'market-cap-item-header';
    
    const marketCapItemName = document.createElement('div');
    marketCapItemName.className = 'market-cap-item-name';
    marketCapItemName.textContent = item.name;
    
    const marketCapItemValue = document.createElement('div');
    marketCapItemValue.className = 'market-cap-item-value';
    marketCapItemValue.textContent = `$${item.value.toFixed(1)}T`;
    
    marketCapItemHeader.appendChild(marketCapItemName);
    marketCapItemHeader.appendChild(marketCapItemValue);
    
    const marketCapItemBar = document.createElement('div');
    marketCapItemBar.className = 'market-cap-item-bar';
    
    const marketCapItemFill = document.createElement('div');
    marketCapItemFill.className = 'market-cap-item-fill';
    marketCapItemFill.style.width = `${item.percentage}%`;
    marketCapItemFill.style.backgroundColor = item.color;
    
    const marketCapItemPercentage = document.createElement('div');
    marketCapItemPercentage.className = 'market-cap-item-percentage';
    marketCapItemPercentage.textContent = `${item.percentage.toFixed(1)}%`;
    
    marketCapItemBar.appendChild(marketCapItemFill);
    marketCapItemBar.appendChild(marketCapItemPercentage);
    
    marketCapItem.appendChild(marketCapItemHeader);
    marketCapItem.appendChild(marketCapItemBar);
    
    marketCapVisual.appendChild(marketCapItem);
  });
}

// Função para renderizar as métricas de escassez
function renderScarcityMetrics() {
  const scarcityContainer = document.querySelector('.scarcity-metrics-grid');
  scarcityContainer.innerHTML = '';
  
  scarcityMetrics.forEach(metric => {
    const metricElement = document.createElement('div');
    metricElement.className = 'scarcity-metric';
    
    let metricContent = `
      <div class="scarcity-metric-title">${metric.title}</div>
      <div class="scarcity-metric-value">${metric.value}</div>
      <div class="scarcity-metric-description">${metric.description}</div>
    `;
    
    // Adicionar visualização específica para bitcoins minerados
    if (metric.title === "Bitcoins Minerados") {
      metricContent += `
        <div class="supply-progress">
          <div class="supply-progress-fill" style="width: ${metric.percentage}%"></div>
          <div class="supply-progress-text">${metric.percentage.toFixed(2)}% (${metric.remaining} restantes)</div>
        </div>
      `;
    } else if (metric.comparison) {
      // Adicionar comparação para outras métricas
      metricContent += `<div class="scarcity-comparison">`;
      
      metric.comparison.forEach(item => {
        metricContent += `
          <div class="scarcity-comparison-item ${item.name.toLowerCase()}">
            ${item.name}: ${item.value}
          </div>
        `;
      });
      
      metricContent += `</div>`;
    }
    
    metricElement.innerHTML = metricContent;
    scarcityContainer.appendChild(metricElement);
  });
}

// Função para renderizar os próximos eventos
function renderUpcomingEvents() {
  const eventsContainer = document.getElementById('events-container');
  eventsContainer.innerHTML = '';
  
  // Mostrar apenas os primeiros 5 eventos
  const eventsToShow = upcomingEvents.slice(0, 5);
  
  eventsToShow.forEach(event => {
    const eventElement = document.createElement('div');
    eventElement.className = `event-item ${event.impact}`;
    
    eventElement.innerHTML = `
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
    `;
    
    eventsContainer.appendChild(eventElement);
  });
}

// Função para buscar e renderizar as notícias
function fetchAndRenderNews() {
  const newsContent = document.getElementById('news-content');
  
  // Simular busca de notícias (em produção, seria uma chamada de API)
  setTimeout(() => {
    const mockNews = [
      {
        title: "Bitcoin ultrapassa $70.000 pela primeira vez em sua história",
        description: "A principal criptomoeda do mundo atingiu um novo recorde histórico impulsionada por forte demanda institucional.",
        source: "Bloomberg",
        date: "18 Maio 2025",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "FED mantém taxa de juros e sinaliza possível corte em 2025",
        description: "Banco Central americano manteve sua taxa básica de juros, mas indicou que pode iniciar ciclo de cortes ainda este ano.",
        source: "Wall Street Journal",
        date: "17 Maio 2025",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Adoção de Bitcoin por empresas Fortune 500 cresce 150% em um ano",
        description: "Relatório mostra aumento significativo no número de grandes corporações que adicionaram Bitcoin em seus balanços.",
        source: "Financial Times",
        date: "16 Maio 2025",
        image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Inflação global mostra sinais de desaceleração após 3 anos de alta",
        description: "Dados econômicos de várias economias avançadas indicam que pressões inflacionárias começam a diminuir.",
        source: "Reuters",
        date: "15 Maio 2025",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Escassez de Bitcoin: Menos de 1,7 milhão de unidades ainda a serem mineradas",
        description: "Com mais de 92% do suprimento total já em circulação, especialistas apontam para aumento da escassez do ativo digital.",
        source: "The Economist",
        date: "14 Maio 2025",
        image: "https://images.unsplash.com/photo-1591994843349-f415893b3a6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      },
      {
        title: "Banco Central da Suíça adiciona Bitcoin às suas reservas oficiais",
        description: "Em movimento histórico, a Suíça se torna o primeiro país europeu a incluir oficialmente Bitcoin em suas reservas nacionais.",
        source: "Bitcoin Magazine",
        date: "13 Maio 2025",
        image: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      }
    ];
    
    // Criar grid de notícias
    const newsGrid = document.createElement('div');
    newsGrid.className = 'news-grid';
    
    mockNews.forEach(news => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      
      newsItem.innerHTML = `
        <img src="${news.image}" alt="${news.title}" class="news-image">
        <div class="news-content">
          <div class="news-source">${news.source}</div>
          <div class="news-title">${news.title}</div>
          <div class="news-description">${news.description}</div>
          <div class="news-date">${news.date}</div>
        </div>
      `;
      
      newsGrid.appendChild(newsItem);
    });
    
    newsContent.innerHTML = '';
    newsContent.appendChild(newsGrid);
  }, 1000);
}

// Função para renderizar a citação de Satoshi
function renderSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  
  // Usar a data atual como seed para selecionar uma citação
  // Isso garante que a citação mude a cada dia, mas permaneça a mesma durante o dia
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const quoteIndex = seed % satoshiQuotes.length;
  
  quoteElement.textContent = satoshiQuotes[quoteIndex];
}

// Função para configurar o botão de fontes
function setupSourcesToggle() {
  const sourcesToggle = document.getElementById('sources-toggle');
  const marketCapSources = document.getElementById('market-cap-sources');
  
  sourcesToggle.addEventListener('click', function() {
    if (marketCapSources.style.display === 'block') {
      marketCapSources.style.display = 'none';
      sourcesToggle.textContent = 'Mostrar fontes';
    } else {
      marketCapSources.style.display = 'block';
      sourcesToggle.textContent = 'Ocultar fontes';
    }
  });
}

// Função para configurar o botão de tema
function setupThemeToggle() {
  // Verificar se já existe um tema salvo
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  
  // Criar botão de tema se não existir
  if (!document.getElementById('theme-toggle')) {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '☀️';
      } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '🌙';
      }
    });
    
    document.body.appendChild(themeToggle);
  }
}

// Função para atualizar os dados periodicamente
function setupPeriodicUpdates() {
  // Atualizar a cada 5 minutos
  setInterval(() => {
    // Atualizar preços dos ativos
    updateAssetPrices();
    
    // Atualizar sentimento de mercado
    updateMarketSentiment();
    
    // Atualizar notícias
    fetchAndRenderNews();
  }, 5 * 60 * 1000);
}

// Função para atualizar preços dos ativos
function updateAssetPrices() {
  // Em produção, isso seria uma chamada de API para obter preços atualizados
  // Aqui estamos apenas simulando uma atualização
  
  // Renderizar novamente os quotes
  renderQuotes();
}

// Função para atualizar sentimento de mercado
function updateMarketSentiment() {
  // Em produção, isso seria uma chamada de API para obter dados atualizados
  // Aqui estamos apenas simulando uma atualização
  
  // Atualizar valores no DOM
  // ...
}

// Iniciar atualizações periódicas
setupPeriodicUpdates();
