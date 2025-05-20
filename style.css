// Dados dos ativos e preços
const assets = [
  { name: "Bitcoin", symbol: "BTC", price: "$69,420.69", change: "+2.3%", color: "#f7931a", api: "coindesk" },
  { name: "Gold", symbol: "XAU", price: "$2,712.80", change: "+0.7%", color: "#d4af37", api: "metals" },
  { name: "Silver", symbol: "XAG", price: "$32.45", change: "+1.2%", color: "#c0c0c0", api: "metals" },
  { name: "10-Year Treasury Yield", symbol: "10Y", price: "4.31%", change: "+0.03%", color: "#6a5acd", api: "treasury", tooltip: "Reveals the cost of government debt financing and signals market expectations for inflation. Rising yields expose the unsustainable nature of endless deficit spending and currency debasement." },
  { name: "Dollar Index", symbol: "DXY", price: "102.85", change: "-0.3%", color: "#20b2aa", api: "forex", tooltip: "Measures the strength of the US dollar against a basket of major foreign currencies. Declining values reflect the erosion of purchasing power through monetary expansion." }
];

// Dados históricos para gráficos (exemplo abreviado)
const historicalData = {
  "Bitcoin": [
    { year: 2020, data: [7200, 8300, 9450, 8700, 9800, 9200, 11300, 11800, 10500, 13800, 17500, 29000] },
    { year: 2021, data: [33000, 45000, 58000, 56000, 37000, 35000, 42000, 47000, 43000, 61000, 58000, 46000] },
    { year: 2022, data: [38000, 44000, 40000, 39000, 31000, 20000, 23000, 24000, 19000, 20500, 17000, 16500] },
    { year: 2023, data: [16800, 23500, 28000, 30000, 27000, 30500, 29800, 28000, 26500, 34000, 37000, 42000] },
    { year: 2024, data: [45000, 52000, 61000, 64000, 59000, 62000, 65000, 67000, 66000, 68000, 67500, 68900] },
    { year: 2025, data: [66500, 68200, 69500, 68700, 69420] }
  ],
  "Gold": [
    { year: 2020, data: [1520, 1585, 1620, 1680, 1730, 1780, 1960, 1920, 1880, 1900, 1860, 1895] },
    { year: 2021, data: [1850, 1810, 1730, 1770, 1900, 1780, 1810, 1815, 1760, 1780, 1820, 1805] },
    { year: 2022, data: [1800, 1870, 1920, 1880, 1840, 1810, 1760, 1770, 1670, 1650, 1750, 1820] },
    { year: 2023, data: [1910, 1830, 1970, 1990, 1960, 1920, 1970, 2010, 1920, 1980, 2040, 2060] },
    { year: 2024, data: [2050, 2120, 2180, 2220, 2260, 2290, 2310, 2330, 2400, 2480, 2550, 2625] },
    { year: 2025, data: [2580, 2610, 2640, 2680, 2713] }
  ],
  "Silver": [
    { year: 2020, data: [17.8, 18.5, 14.6, 15.7, 17.9, 18.2, 24.5, 27.4, 24.2, 24.1, 23.8, 26.3] },
    { year: 2021, data: [27.0, 26.7, 25.0, 26.1, 27.4, 26.0, 25.5, 24.0, 22.5, 23.9, 23.1, 22.5] },
    { year: 2022, data: [22.4, 24.3, 24.9, 23.0, 21.6, 20.3, 19.2, 19.5, 18.8, 19.5, 21.5, 23.9] },
    { year: 2023, data: [24.1, 21.7, 24.2, 25.0, 23.5, 22.8, 24.5, 24.8, 23.0, 22.7, 24.5, 24.3] },
    { year: 2024, data: [23.8, 25.6, 26.9, 27.5, 28.2, 28.9, 29.3, 29.8, 30.2, 30.5, 31.0, 31.8] },
    { year: 2025, data: [30.9, 31.2, 31.5, 32.1, 32.45] }
  ],
  "10-Year Treasury Yield": [
    { year: 2020, data: [1.88, 1.50, 0.70, 0.66, 0.65, 0.68, 0.55, 0.72, 0.68, 0.85, 0.84, 0.93] },
    { year: 2021, data: [1.07, 1.44, 1.74, 1.65, 1.58, 1.45, 1.24, 1.30, 1.52, 1.55, 1.44, 1.51] },
    { year: 2022, data: [1.78, 1.83, 2.32, 2.89, 2.84, 3.01, 2.65, 3.19, 3.83, 4.05, 3.68, 3.88] },
    { year: 2023, data: [3.51, 3.92, 3.47, 3.45, 3.64, 3.84, 3.96, 4.10, 4.57, 4.89, 4.47, 3.88] },
    { year: 2024, data: [4.05, 4.25, 4.35, 4.50, 4.60, 4.55, 4.48, 4.42, 4.38, 4.35, 4.30, 4.28] },
    { year: 2025, data: [4.30, 4.32, 4.35, 4.30, 4.31] }
  ],
  "Dollar Index": [
    { year: 2020, data: [97.3, 98.1, 99.0, 99.5, 98.3, 97.4, 93.3, 92.1, 93.9, 94.0, 92.3, 89.9] },
    { year: 2021, data: [90.5, 90.9, 93.2, 91.3, 90.0, 92.4, 92.1, 92.5, 94.2, 94.1, 95.9, 95.7] },
    { year: 2022, data: [96.5, 96.7, 98.3, 102.9, 101.8, 104.7, 106.1, 108.7, 112.1, 111.5, 106.7, 103.5] },
    { year: 2023, data: [102.1, 104.4, 102.5, 101.9, 104.2, 102.6, 101.9, 104.1, 106.1, 106.6, 103.4, 101.9] },
    { year: 2024, data: [103.4, 104.1, 104.5, 105.2, 104.8, 104.3, 103.9, 103.7, 103.5, 103.3, 103.2, 103.1] },
    { year: 2025, data: [103.6, 103.5, 103.3, 103.0, 102.85] }
  ]
};

// Eventos futuros
const upcomingEvents = [
  { date: "May 25, 2025", title: "FOMC Meeting", description: "Federal Reserve interest rate decision", impact: "high" },
  { date: "June 02, 2025", title: "US Inflation Report", description: "Consumer Price Index (CPI) release", impact: "high" },
  { date: "June 10, 2025", title: "Bitcoin 2025 Conference", description: "Largest annual Bitcoin event in Miami", impact: "medium" },
  { date: "June 15, 2025", title: "US Employment Report", description: "US labor market data", impact: "medium" }
];

// Métricas de escassez
const scarcityMetrics = [
  { title: "Stock-to-Flow", value: "56", description: "Ratio between existing stock and annual production", comparison: [ { name: "Bitcoin", value: "56" }, { name: "Gold", value: "62" }, { name: "Silver", value: "22" } ] },
  { title: "Annual Inflation", value: "1.74%", description: "Annual issuance rate relative to total supply", comparison: [ { name: "Bitcoin", value: "1.74%" }, { name: "Gold", value: "1.60%" }, { name: "Silver", value: "4.50%" } ] },
  { title: "Bitcoins Mined", value: "19,368,750", description: "Amount of bitcoins already mined out of 21 million total", percentage: 92.23, remaining: "1,631,250" },
  { title: "Next Halving", value: "April 2028", description: "Event that cuts mining reward in half", daysRemaining: 1056 }
];

// Renderiza próximos 4 eventos lado a lado
function renderUpcomingEvents() {
  const container = document.getElementById('events-container');
  container.innerHTML = '';
  upcomingEvents.slice(0, 4).forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h3>${event.title}</h3>
      <p><strong>${event.date}</strong></p>
      <p>${event.description}</p>
    `;
    container.appendChild(card);
  });
}

// Renderiza métricas de escassez sem bordas, alinhadas na mesma linha
function renderScarcityMetrics() {
  const container = document.querySelector('.scarcity-metrics-grid');
  container.innerHTML = '';

  // Exemplo simples: mostrar Gold, Silver, Bitcoin na mesma linha
  const goldDiv = document.createElement('div');
  goldDiv.className = 'gold';
  goldDiv.textContent = `Gold: $2,712.80`;

  const silverDiv = document.createElement('div');
  silverDiv.className = 'silver';
  silverDiv.textContent = `Silver: $32.45`;

  const bitcoinDiv = document.createElement('div');
  bitcoinDiv.className = 'bitcoin';
  bitcoinDiv.textContent = `Bitcoin: $69,420.69`;

  container.appendChild(goldDiv);
  container.appendChild(silverDiv);
  container.appendChild(bitcoinDiv);
}

// Atualiza indicadores de Market Sentiment (exemplo estático)
function renderMarketSentiment() {
  // Exemplo de atualização dos gauges (pode ser substituído por dados reais)
  document.getElementById('fear-greed').querySelector('.gauge-fill').style.width = '65%';
  document.querySelector('#fear-greed .gauge-value').textContent = '65 - Greed';
  document.querySelector('#fear-greed .indicator-change').textContent = '+5% (24h)';

  document.getElementById('volatility').querySelector('.gauge-fill').style.width = '42%';
  document.querySelector('#volatility .gauge-value').textContent = '42% - Moderate';
  document.querySelector('#volatility .indicator-change').textContent = '-3% (24h)';

  document.getElementById('btc-dominance').querySelector('.gauge-fill').style.width = '53%';
  document.querySelector('#btc-dominance .gauge-value').textContent = '53%';
  document.querySelector('#btc-dominance .indicator-change').textContent = '+0.8% (24h)';

  document.getElementById('transaction-volume').querySelector('.gauge-fill').style.width = '68%';
  document.querySelector('#transaction-volume .gauge-value').textContent = '$78.5B - High';
  document.querySelector('#transaction-volume .indicator-change').textContent = '+12% (24h)';

  document.getElementById('market-cap').querySelector('.gauge-fill').style.width = '58%';
  document.querySelector('#market-cap .gauge-value').textContent = '$2.0T';
  document.querySelector('#market-cap .indicator-change').textContent = '+5.8% (24h)';

  document.getElementById('market-liquidity').querySelector('.gauge-fill').style.width = '62%';
  document.querySelector('#market-liquidity .gauge-value').textContent = 'Moderate-High';
  document.querySelector('#market-liquidity .indicator-change').textContent = '+2.3% (24h)';
}

// Renderiza gráfico para um ativo usando Chart.js com margem inferior maior para anos
function renderChart(assetName, color, canvasId) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  const assetData = historicalData[assetName];
  if (!assetData) return;

  const labels = [];
  const data = [];

  assetData.forEach(yearData => {
    yearData.data.forEach((value, monthIndex) => {
      labels.push(`${monthIndex + 1}/${yearData.year}`);
      data.push(value);
    });
  });

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: assetName,
        data,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 40 // espaço extra para labels do eixo X (anos)
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 12
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: '#eee'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: { family: "'Segoe UI', sans-serif", size: 12 },
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
          padding: 10,
          callbacks: {
            label(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += assetName === "Bitcoin" || assetName === "Gold" || assetName === "Silver"
                  ? '$' + context.parsed.y.toLocaleString()
                  : context.parsed.y.toLocaleString();
              }
              return label;
            }
          }
        }
      }
    }
  });
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  renderUpcomingEvents();
  renderMarketSentiment();
  renderScarcityMetrics();

  // Aqui você pode adicionar inicialização dos gráficos e outras funções
});
