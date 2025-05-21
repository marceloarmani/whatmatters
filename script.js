const assets = [
  { name: "Bitcoin", symbol: "BTC", price: "$109,485.02", change: "+6.1%", color: "#f7931a", api: "coindesk" },
  { name: "Gold", symbol: "XAU", price: "$3,309.90", change: "+4.0%", color: "#d4af37", api: "metals" },
  { name: "Silver", symbol: "XAG", price: "$33.62", change: "+4.6%", color: "#c0c0c0", api: "metals" },
  { name: "10-Year Treasury Yield", symbol: "10Y", price: "0.45%", change: "+0.01%", color: "#6a5acd", api: "treasury", tooltip: "Reveals the cost of government debt financing and signals market expectations for inflation. Rising yields expose the unsustainable nature of endless deficit spending and currency debasement." },
  { name: "Dollar Index", symbol: "DXY", price: "99.49", change: "-1.6%", color: "#20b2aa", api: "forex", tooltip: "Measures the strength of the US dollar against a basket of major foreign currencies. Declining values reflect the erosion of purchasing power through monetary expansion." }
];

// Historical data for charts (5 years)
const historicalData = {
  "Bitcoin": [
    { year: 2020, data: [7200, 8300, 9450, 8700, 9800, 9200, 11300, 11800, 10500, 13800, 17500, 29000] },
    { year: 2021, data: [33000, 45000, 58000, 56000, 37000, 35000, 42000, 47000, 43000, 61000, 58000, 46000] },
    { year: 2022, data: [38000, 44000, 40000, 39000, 31000, 20000, 23000, 24000, 19000, 20500, 17000, 16500] },
    { year: 2023, data: [16800, 23500, 28000, 30000, 27000, 30500, 29800, 28000, 26500, 34000, 37000, 42000] },
    { year: 2024, data: [45000, 52000, 61000, 64000, 59000, 62000, 65000, 67000, 66000, 68000, 67500, 68900] },
    { year: 2025, data: [66500, 78200, 89500, 95100, 109485] }
  ],
  "Gold": [
    { year: 2020, data: [1520, 1585, 1620, 1680, 1730, 1780, 1960, 1920, 1880, 1900, 1860, 1895] },
    { year: 2021, data: [1850, 1810, 1730, 1770, 1900, 1780, 1810, 1815, 1760, 1780, 1820, 1805] },
    { year: 2022, data: [1800, 1870, 1920, 1880, 1840, 1810, 1760, 1770, 1670, 1650, 1750, 1820] },
    { year: 2023, data: [1910, 1830, 1970, 1990, 1960, 1920, 1970, 2010, 1920, 1980, 2040, 2060] },
    { year: 2024, data: [2050, 2120, 2180, 2220, 2260, 2290, 2310, 2330, 2400, 2480, 2550, 2625] },
    { year: 2025, data: [2680, 2810, 2940, 3180, 3310] }
  ],
  "Silver": [
    { year: 2020, data: [17.8, 18.5, 14.6, 15.7, 17.9, 18.2, 24.5, 27.4, 24.2, 24.1, 23.8, 26.3] },
    { year: 2021, data: [27.0, 26.7, 25.0, 26.1, 27.4, 26.0, 25.5, 24.0, 22.5, 23.9, 23.1, 22.5] },
    { year: 2022, data: [22.4, 24.3, 24.9, 23.0, 21.6, 20.3, 19.2, 19.5, 18.8, 19.5, 21.5, 23.9] },
    { year: 2023, data: [24.1, 21.7, 24.2, 25.0, 23.5, 22.8, 24.5, 24.8, 23.0, 22.7, 24.5, 24.3] },
    { year: 2024, data: [23.8, 25.6, 26.9, 27.5, 28.2, 28.9, 29.3, 29.8, 30.2, 30.5, 31.0, 31.8] },
    { year: 2025, data: [30.9, 31.2, 32.5, 33.1, 33.62] }
  ],
  "10-Year Treasury Yield": [
    { year: 2020, data: [1.88, 1.50, 0.70, 0.66, 0.65, 0.68, 0.55, 0.72, 0.68, 0.85, 0.84, 0.93] },
    { year: 2021, data: [1.07, 1.44, 1.74, 1.65, 1.58, 1.45, 1.24, 1.30, 1.52, 1.55, 1.44, 1.51] },
    { year: 2022, data: [1.78, 1.83, 2.32, 2.89, 2.84, 3.01, 2.65, 3.19, 3.83, 4.05, 3.68, 3.88] },
    { year: 2023, data: [3.51, 3.92, 3.47, 3.45, 3.64, 3.84, 3.96, 4.10, 4.57, 4.89, 4.47, 3.88] },
    { year: 2024, data: [4.05, 4.25, 4.35, 4.50, 4.60, 4.55, 4.48, 4.42, 4.38, 4.35, 4.30, 4.28] },
    { year: 2025, data: [4.30, 4.32, 4.35, 0.48, 0.45] }
  ],
  "Dollar Index": [
    { year: 2020, data: [97.3, 98.1, 99.0, 99.5, 98.3, 97.4, 93.3, 92.1, 93.9, 94.0, 92.3, 89.9] },
    { year: 2021, data: [90.5, 90.9, 93.2, 91.3, 90.0, 92.4, 92.1, 92.5, 94.2, 94.1, 95.9, 95.7] },
    { year: 2022, data: [96.5, 96.7, 98.3, 102.9, 101.8, 104.7, 106.1, 108.7, 112.1, 111.5, 106.7, 103.5] },
    { year: 2023, data: [102.1, 104.4, 102.5, 101.9, 104.2, 102.6, 101.9, 104.1, 106.1, 106.6, 103.4, 101.9] },
    { year: 2024, data: [103.4, 104.1, 104.5, 105.2, 104.8, 104.3, 103.9, 103.7, 103.5, 103.3, 103.2, 103.1] },
    { year: 2025, data: [103.6, 103.5, 102.3, 101.8, 99.49] }
  ]
};

// Global market capitalization data
const marketCapData = [
  { name: "Real Estate", value: 326.5, color: "#4CAF50", percentage: 47.3 },
  { name: "Bonds", value: 133.0, color: "#2196F3", percentage: 19.3 },
  { name: "Equities", value: 106.0, color: "#9C27B0", percentage: 15.3 },
  { name: "Money", value: 102.9, color: "#FF9800", percentage: 14.9 },
  { name: "Gold", value: 12.5, color: "#d4af37", percentage: 1.8 },
  { name: "Art & Collectibles", value: 7.8, color: "#E91E63", percentage: 1.1 },
  { name: "Bitcoin", value: 2.0, color: "#f7931a", percentage: 0.3 }
];

// Scarcity metrics data
const scarcityMetrics = [
  {
    title: "Stock-to-Flow",
    value: "56",
    description: "Ratio between existing stock and annual production",
    comparison: [
      { name: "Bitcoin", value: "56" },
      { name: "Gold", value: "62" },
      { name: "Silver", value: "22" }
    ]
  },
  {
    title: "Annual Inflation",
    value: "1.74%",
    description: "Annual issuance rate relative to total supply",
    comparison: [
      { name: "Bitcoin", value: "1.74%" },
      { name: "Gold", value: "1.60%" },
      { name: "Silver", value: "4.50%" }
    ]
  },
  {
    title: "Bitcoins Mined",
    value: "19,368,750",
    description: "Amount of bitcoins already mined out of 21 million total",
    percentage: 92.23,
    remaining: "1,631,250"
  },
  {
    title: "Next Halving",
    value: "April 2028",
    description: "Event that cuts mining reward in half",
    daysRemaining: 1056
  }
];

// Important upcoming events data
const upcomingEvents = [
  {
    date: "May 25, 2025",
    title: "FOMC Meeting",
    description: "Federal Reserve interest rate decision",
    impact: "high"
  },
  {
    date: "June 02, 2025",
    title: "US Inflation Report",
    description: "Consumer Price Index (CPI) release",
    impact: "high"
  },
  {
    date: "June 10, 2025",
    title: "Bitcoin 2025 Conference",
    description: "Largest annual Bitcoin event in Miami",
    impact: "medium"
  },
  {
    date: "June 15, 2025",
    title: "US Employment Report",
    description: "US labor market data",
    impact: "medium"
  }
];

// Bitcoin adoption data
const adoptionData = {
  countries: [
    { name: "El Salvador", status: "Legal tender", adoption: 0.85 },
    { name: "United States", status: "Legal", adoption: 0.65 },
    { name: "Germany", status: "Legal", adoption: 0.58 },
    { name: "Japan", status: "Legal", adoption: 0.62 },
    { name: "Switzerland", status: "Legal", adoption: 0.72 },
    { name: "Singapore", status: "Legal", adoption: 0.70 },
    { name: "United Kingdom", status: "Legal", adoption: 0.55 },
    { name: "Canada", status: "Legal", adoption: 0.60 },
    { name: "Australia", status: "Legal", adoption: 0.52 },
    { name: "South Korea", status: "Legal", adoption: 0.58 },
    { name: "Brazil", status: "Legal", adoption: 0.45 },
    { name: "Argentina", status: "Legal", adoption: 0.50 },
    { name: "Nigeria", status: "Restricted", adoption: 0.40 },
    { name: "India", status: "Legal", adoption: 0.35 },
    { name: "Russia", status: "Restricted", adoption: 0.30 },
    { name: "China", status: "Banned", adoption: 0.15 }
  ],
  companies: [
    { name: "MicroStrategy", type: "Corporate Treasury", holdings: 140000 },
    { name: "Tesla", type: "Corporate Treasury", holdings: 43200 },
    { name: "Block", type: "Corporate Treasury", holdings: 8027 },
    { name: "Marathon Digital", type: "Mining", holdings: 12232 },
    { name: "Riot Blockchain", type: "Mining", holdings: 6952 },
    { name: "Galaxy Digital", type: "Investment", holdings: 16400 },
    { name: "Coinbase", type: "Exchange", holdings: 4487 },
    { name: "Hut 8 Mining", type: "Mining", holdings: 5242 },
    { name: "Grayscale", type: "Investment", holdings: 654000 },
    { name: "NYDIG", type: "Investment", holdings: 30000 }
  ]
};

// Bitcoin distribution data
const distributionData = [
  { category: "Long-term Holders (>1 year)", percentage: 62, color: "#2E7D32" },
  { category: "Mid-term Holders (3-12 months)", percentage: 22, color: "#1976D2" },
  { category: "Short-term Holders (<3 months)", percentage: 16, color: "#7B1FA2" },
  { category: "Exchanges", percentage: 12, color: "#C62828" },
  { category: "Corporate Treasuries", percentage: 8, color: "#F57F17" },
  { category: "ETFs and Funds", percentage: 6, color: "#00838F" },
  { category: "Lost Coins", percentage: 20, color: "#757575" }
];

// Satoshi Nakamoto quotes
const satoshiQuotes = [
  "The root problem with conventional currency is all the trust that's required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust.",
  "Bitcoin is very attractive from a libertarian viewpoint if you don't like the idea of government controlling your money and being able to freeze your accounts at will.",
  "I've chosen to implement proof-of-work over proof-of-stake because the latter would require an identification mechanism, which would hurt anonymity.",
  "Lost coins only make everyone else's coins worth slightly more. Think of it as a donation to everyone.",
  "I'm sure that in 20 years there will either be very large transaction volume or no volume.",
  "It might make sense just to get some in case it catches on. If enough people think the same way, that becomes a self fulfilling prophecy.",
  "The price of any commodity tends to gravitate toward the production cost. If the price is below cost, then production slows down. If the price is above cost, profit can be made by generating and selling more.",
  "Writing a description for this thing for general audiences is bloody hard. There's nothing to relate it to.",
  "I'm sure that in 20 years there will either be very large transaction volume or no volume.",
  "Bitcoin might make a good currency for purchases on the Internet."
];

// News data
const newsData = [
  {
    title: "Bitcoin Surpasses $100,000 for First Time in History",
    description: "The world's largest cryptocurrency has reached a new all-time high, breaking the psychological barrier of $100,000.",
    source: "Cointelegraph",
    date: "May 21, 2025",
    url: "#"
  },
  {
    title: "Central Banks Accelerate Digital Currency Development",
    description: "Major central banks are fast-tracking CBDC projects in response to growing cryptocurrency adoption.",
    source: "Financial Times",
    date: "May 20, 2025",
    url: "#"
  },
  {
    title: "Gold Reaches Record High Amid Inflation Concerns",
    description: "The precious metal continues its upward trajectory as investors seek protection from rising inflation.",
    source: "Bloomberg",
    date: "May 19, 2025",
    url: "#"
  },
  {
    title: "Bitcoin Mining Difficulty Hits All-Time High",
    description: "Network security continues to strengthen as mining difficulty adjusts upward following hashrate increases.",
    source: "Bitcoin Magazine",
    date: "May 18, 2025",
    url: "#"
  },
  {
    title: "Institutional Adoption Accelerates as Pension Funds Enter Crypto",
    description: "Major pension funds are now allocating portions of their portfolios to Bitcoin and other digital assets.",
    source: "Reuters",
    date: "May 17, 2025",
    url: "#"
  },
  {
    title: "El Salvador's Bitcoin Strategy Shows Long-term Success",
    description: "The country's Bitcoin reserves have appreciated significantly since adoption as legal tender in 2021.",
    source: "Cointelegraph",
    date: "May 16, 2025",
    url: "#"
  }
];

// Site initialization
document.addEventListener('DOMContentLoaded', function() {
  // Initialize charts array
  window.charts = {};
  
  // Render quotes (asset indicators)
  renderQuotes();
  
  // Set up click events for indicators
  setupQuoteClickEvents();
  
  // Render market sentiment
  renderMarketSentiment();
  
  // Render global market capitalization
  renderMarketCap();
  
  // Render scarcity metrics
  renderScarcityMetrics();
  
  // Render upcoming events
  renderUpcomingEvents();
  
  // Render Bitcoin adoption map
  renderBitcoinAdoption();
  
  // Render Bitcoin distribution
  renderBitcoinDistribution();
  
  // Render news
  renderNews();
  
  // Render Satoshi quote
  renderSatoshiQuote();
  
  // Set up sources toggle
  setupSourcesToggle();
  
  // Set up periodic updates
  setupPeriodicUpdates();
});

// Function to render main indicators
function renderQuotes() {
  const quotesContainer = document.getElementById('quotes');
  quotesContainer.innerHTML = '';
  
  assets.forEach((asset, index) => {
    const quoteWrapper = document.createElement('div');
    quoteWrapper.className = 'quote-wrapper';
    quoteWrapper.id = `quote-wrapper-${index}`;
    
    const quoteElement = document.createElement('div');
    quoteElement.className = 'quote';
    quoteElement.dataset.asset = asset.name;
    quoteElement.dataset.index = index;
    
    // Add tooltip for indicators with explanations
    let tooltipHtml = '';
    if (asset.tooltip) {
      tooltipHtml = `<span class="index-tooltip">ⓘ<span class="tooltip-text">${asset.tooltip}</span></span>`;
    }
    
    quoteElement.innerHTML = `
      <div class="quote-left">
        <strong>${asset.name} ${tooltipHtml}</strong>
      </div>
      <div class="quote-right">
        <span class="quote-price">${asset.price}</span>
        <span class="quote-change" style="color: ${asset.change.includes('-') ? '#f44336' : '#4caf50'}">${asset.change}</span>
      </div>
    `;
    
    // Create individual chart area for this asset
    const chartArea = document.createElement('div');
    chartArea.className = 'asset-chart-area';
    chartArea.id = `chart-area-${index}`;
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${index}`;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'chart-close';
    closeButton.innerHTML = '✕';
    closeButton.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleChart(index, false);
    });
    
    chartContainer.appendChild(closeButton);
    chartContainer.appendChild(canvas);
    chartArea.appendChild(chartContainer);
    
    quoteWrapper.appendChild(quoteElement);
    quoteWrapper.appendChild(chartArea);
    quotesContainer.appendChild(quoteWrapper);
  });
}

// Function to set up click events for indicators
function setupQuoteClickEvents() {
  document.addEventListener('click', function(e) {
    const quote = e.target.closest('.quote');
    if (!quote) return;
    
    const assetIndex = parseInt(quote.dataset.index);
    
    // Toggle chart visibility
    if (quote.classList.contains('active')) {
      toggleChart(assetIndex, false);
    } else {
      // Close any other open charts
      document.querySelectorAll('.quote.active').forEach((activeQuote) => {
        if (activeQuote !== quote) {
          const activeIndex = parseInt(activeQuote.dataset.index);
          toggleChart(activeIndex, false);
        }
      });
      
      // Open this chart
      toggleChart(assetIndex, true);
    }
  });
}

// Function to toggle chart visibility
function toggleChart(assetIndex, show) {
  const quote = document.querySelector(`.quote[data-index="${assetIndex}"]`);
  const chartArea = document.getElementById(`chart-area-${assetIndex}`);
  const asset = assets[assetIndex];
  
  if (show) {
    quote.classList.add('active');
    chartArea.classList.add('visible');
    
    // Render chart if it doesn't exist
    if (!window.charts[assetIndex]) {
      window.charts[assetIndex] = renderChart(asset.name, asset.color, `chart-${assetIndex}`);
    }
  } else {
    quote.classList.remove('active');
    chartArea.classList.remove('visible');
    
    // Destroy chart to free resources
    if (window.charts[assetIndex]) {
      window.charts[assetIndex].destroy();
      window.charts[assetIndex] = null;
    }
  }
}

// Function to render chart for an asset
function renderChart(assetName, color, canvasId) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Get historical data for the asset
  const assetData = historicalData[assetName];
  if (!assetData) return null;
  
  // Prepare data for the chart
  const labels = [];
  const data = [];
  const yearLabels = [];
  
  // Combine all data from the last 5 years
  assetData.forEach(yearData => {
    const year = yearData.year;
    yearData.data.forEach((value, monthIndex) => {
      labels.push(`${monthIndex + 1}/${year}`);
      data.push(value);
      
      // Mark the beginning of each year
      if (monthIndex === 0) {
        yearLabels.push({
          value: labels.length - 1,
          year: year
        });
      }
    });
  });
  
  // Create the chart
  return new Chart(ctx, {
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
          padding: 10,
          boxPadding: 5,
          cornerRadius: 4,
          titleFont: {
            family: "'Segoe UI', sans-serif",
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Segoe UI', sans-serif",
            size: 12
          },
          callbacks: {
            title: function(tooltipItems) {
              const item = tooltipItems[0];
              const parts = item.label.split('/');
              const month = parseInt(parts[0]);
              const year = parseInt(parts[1]);
              const date = new Date(year, month - 1);
              return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            },
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (assetName === 'Bitcoin' || assetName === 'Gold' || assetName === 'Silver') {
                  label += '$' + context.parsed.y.toLocaleString();
                } else if (assetName === '10-Year Treasury Yield') {
                  label += context.parsed.y.toFixed(2) + '%';
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
            display: true,
            drawOnChartArea: true,
            drawTicks: true,
            color: function(context) {
              // Check if this is a year boundary
              for (let i = 0; i < yearLabels.length; i++) {
                if (context.index === yearLabels[i].value) {
                  return 'rgba(200, 200, 200, 0.5)';
                }
              }
              return 'rgba(0, 0, 0, 0)';
            }
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 12,
            callback: function(value, index) {
              // Only show year labels
              for (let i = 0; i < yearLabels.length; i++) {
                if (index === yearLabels[i].value) {
                  return yearLabels[i].year;
                }
              }
              return '';
            },
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: 10
          }
        },
        y: {
          grid: {
            color: '#f0f0f0'
          },
          ticks: {
            font: {
              family: "'Segoe UI', sans-serif",
              size: 12
            },
            color: '#666',
            padding: 10,
            callback: function(value) {
              if (assetName === 'Bitcoin' || assetName === 'Gold' || assetName === 'Silver') {
                return '$' + value.toLocaleString();
              } else if (assetName === '10-Year Treasury Yield') {
                return value.toFixed(2) + '%';
              } else {
                return value.toLocaleString();
              }
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
      },
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 10
        }
      },
      animation: {
        duration: 1000
      }
    }
  });
}

// Function to render market sentiment
function renderMarketSentiment() {
  // Fear & Greed Index
  document.getElementById('fear-greed').innerHTML = `
    <div class="gauge">
      <div class="gauge-fill" style="width: 65%;"></div>
    </div>
    <div class="gauge-value">65 - Greed</div>
    <div class="indicator-change">+5% (24h)</div>
  `;
  
  // Volatility
  document.getElementById('volatility').innerHTML = `
    <div class="gauge">
      <div class="gauge-fill" style="width: 42%;"></div>
    </div>
    <div class="gauge-value">42% - Moderate</div>
    <div class="indicator-change negative">-3% (24h)</div>
  `;
  
  // BTC Dominance
  document.getElementById('btc-dominance').innerHTML = `
    <div class="gauge">
      <div class="gauge-fill" style="width: 53%;"></div>
    </div>
    <div class="gauge-value">53%</div>
    <div class="indicator-change">+0.8% (24h)</div>
  `;
  
  // Transaction Volume
  document.getElementById('transaction-volume').innerHTML = `
    <div class="gauge">
      <div class="gauge-fill" style="width: 68%;"></div>
    </div>
    <div class="gauge-value">$78.5B - High</div>
    <div class="indicator-change">+12% (24h)</div>
  `;
  
  // Market Cap
  document.getElementById('market-cap').innerHTML = `
    <div class="gauge">
      <div class="gauge-fill" style="width: 58%;"></div>
    </div>
    <div class="gauge-value">$2.0T</div>
    <div class="indicator-change">+5.8% (24h)</div>
  `;
  
  // Market Liquidity
  document.getElementById('market-liquidity').innerHTML = `
    <div class="gauge">
      <div class="gauge-fill" style="width: 62%;"></div>
    </div>
    <div class="gauge-value">Moderate-High</div>
    <div class="indicator-change">+2.3% (24h)</div>
  `;
}

// Function to render global market capitalization
function renderMarketCap() {
  const marketCapContainer = document.getElementById('market-cap-treemap');
  marketCapContainer.innerHTML = '';
  
  // Sort by value (descending)
  const sortedData = [...marketCapData].sort((a, b) => b.value - a.value);
  
  // Create bar visualization
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
    
    marketCapContainer.appendChild(marketCapItem);
  });
}

// Function to render scarcity metrics
function renderScarcityMetrics() {
  const scarcityContainer = document.querySelector('.scarcity-metrics-grid');
  scarcityContainer.innerHTML = '';
  
  scarcityMetrics.forEach(metric => {
    const metricElement = document.createElement('div');
    metricElement.className = 'scarcity-metric';
    
    const titleElement = document.createElement('div');
    titleElement.className = 'scarcity-metric-title';
    titleElement.textContent = metric.title;
    
    const valueElement = document.createElement('div');
    valueElement.className = 'scarcity-metric-value';
    valueElement.textContent = metric.value;
    
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'scarcity-metric-description';
    descriptionElement.textContent = metric.description;
    
    metricElement.appendChild(titleElement);
    metricElement.appendChild(valueElement);
    metricElement.appendChild(descriptionElement);
    
    // Add comparison if available
    if (metric.comparison) {
      const comparisonElement = document.createElement('div');
      comparisonElement.className = 'scarcity-comparison';
      
      metric.comparison.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `scarcity-comparison-item ${item.name.toLowerCase()}`;
        itemElement.textContent = `${item.name}: ${item.value}`;
        comparisonElement.appendChild(itemElement);
      });
      
      metricElement.appendChild(comparisonElement);
    }
    
    // Add progress bar for Bitcoins Mined
    if (metric.title === 'Bitcoins Mined') {
      const progressElement = document.createElement('div');
      progressElement.className = 'supply-progress';
      
      const progressFill = document.createElement('div');
      progressFill.className = 'supply-progress-fill';
      
      const progressText = document.createElement('div');
      progressText.className = 'supply-progress-text';
      progressText.textContent = `${metric.percentage.toFixed(2)}% (${metric.remaining} remaining)`;
      
      progressElement.appendChild(progressFill);
      progressElement.appendChild(progressText);
      metricElement.appendChild(progressElement);
    }
    
    // Add days remaining for Next Halving
    if (metric.title === 'Next Halving') {
      const daysElement = document.createElement('div');
      daysElement.className = 'days-remaining';
      daysElement.textContent = `${metric.daysRemaining} days remaining`;
      metricElement.appendChild(daysElement);
    }
    
    scarcityContainer.appendChild(metricElement);
  });
}

// Function to render upcoming events
function renderUpcomingEvents() {
  const eventsContainer = document.getElementById('events-container');
  
  // Create grid for events
  const eventsGrid = document.createElement('div');
  eventsGrid.className = 'events-grid';
  
  // Add events to grid
  upcomingEvents.forEach(event => {
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${event.impact}`;
    
    const eventDate = document.createElement('div');
    eventDate.className = 'event-date';
    
    const dateText = document.createElement('span');
    dateText.textContent = event.date;
    
    const impactIndicator = document.createElement('div');
    impactIndicator.className = 'event-impact';
    
    // Add impact dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'impact-dot';
      impactIndicator.appendChild(dot);
    }
    
    eventDate.appendChild(dateText);
    eventDate.appendChild(impactIndicator);
    
    const eventTitle = document.createElement('div');
    eventTitle.className = 'event-title';
    eventTitle.textContent = event.title;
    
    const eventDescription = document.createElement('div');
    eventDescription.className = 'event-description';
    eventDescription.textContent = event.description;
    
    eventItem.appendChild(eventDate);
    eventItem.appendChild(eventTitle);
    eventItem.appendChild(eventDescription);
    
    eventsGrid.appendChild(eventItem);
  });
  
  eventsContainer.innerHTML = '';
  eventsContainer.appendChild(eventsGrid);
}

// Function to render Bitcoin adoption map
function renderBitcoinAdoption() {
  const mapContainer = document.getElementById('adoption-map');
  
  // In a real implementation, this would use a mapping library like Leaflet or Google Maps
  // For this demo, we'll create a simple visualization
  
  mapContainer.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h3>Bitcoin Legal Status Worldwide</h3>
      <div style="display: flex; justify-content: space-around; margin-top: 20px;">
        <div>
          <div style="font-weight: bold; margin-bottom: 10px;">Legal Tender</div>
          <div style="color: #4CAF50;">El Salvador</div>
        </div>
        <div>
          <div style="font-weight: bold; margin-bottom: 10px;">Legal</div>
          <div style="color: #2196F3; max-width: 250px;">
            <div style="margin-bottom: 5px;">North America: United States, Canada</div>
            <div style="margin-bottom: 5px;">Europe: EU countries, UK, Switzerland</div>
            <div style="margin-bottom: 5px;">Asia: Japan, Singapore, South Korea</div>
            <div>South America: Brazil, Argentina</div>
          </div>
        </div>
        <div>
          <div style="font-weight: bold; margin-bottom: 10px;">Restricted</div>
          <div style="color: #FF9800;">Russia, Nigeria, India, Turkey</div>
        </div>
        <div>
          <div style="font-weight: bold; margin-bottom: 10px;">Banned</div>
          <div style="color: #F44336;">China, Egypt, Algeria, Bolivia</div>
        </div>
      </div>
      <div style="margin-top: 30px;">
        <h3>Major Corporate Holders</h3>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 20px;">
          ${adoptionData.companies.slice(0, 7).map(company => `
            <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; min-width: 150px; max-width: 180px;">
              <div style="font-weight: bold;">${company.name}</div>
              <div style="color: #666; font-size: 0.85rem;">${company.type}</div>
              <div style="margin-top: 5px; font-weight: 500;">${company.holdings.toLocaleString()} BTC</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// Function to render Bitcoin distribution
function renderBitcoinDistribution() {
  const distributionContainer = document.getElementById('distribution-chart');
  
  // In a real implementation, this would use a charting library
  // For this demo, we'll create a simple visualization
  
  distributionContainer.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h3>Bitcoin Distribution by Holder Type</h3>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
        ${distributionData.map(item => `
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div>${item.category}</div>
              <div>${item.percentage}%</div>
            </div>
            <div style="height: 20px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${item.percentage}%; background-color: ${item.color};"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 30px; color: #666; font-size: 0.9rem;">
        <p>Note: Some categories overlap. For example, a portion of exchange holdings may also be counted in short-term holders.</p>
      </div>
    </div>
  `;
}

// Function to render news
function renderNews() {
  const newsContainer = document.getElementById('news-content');
  
  // Create news grid
  const newsGrid = document.createElement('div');
  newsGrid.className = 'news-grid';
  
  // Add news items to grid
  newsData.forEach(news => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    
    const newsContent = document.createElement('div');
    newsContent.className = 'news-content';
    
    const newsSource = document.createElement('div');
    newsSource.className = 'news-source';
    newsSource.textContent = news.source;
    
    const newsTitle = document.createElement('div');
    newsTitle.className = 'news-title';
    newsTitle.textContent = news.title;
    
    const newsDescription = document.createElement('div');
    newsDescription.className = 'news-description';
    newsDescription.textContent = news.description;
    
    const newsDate = document.createElement('div');
    newsDate.className = 'news-date';
    newsDate.textContent = news.date;
    
    newsContent.appendChild(newsSource);
    newsContent.appendChild(newsTitle);
    newsContent.appendChild(newsDescription);
    newsContent.appendChild(newsDate);
    
    newsItem.appendChild(newsContent);
    newsGrid.appendChild(newsItem);
  });
  
  newsContainer.innerHTML = '';
  newsContainer.appendChild(newsGrid);
}

// Function to render Satoshi quote
function renderSatoshiQuote() {
  const quoteElement = document.getElementById('satoshi-quote');
  const randomIndex = Math.floor(Math.random() * satoshiQuotes.length);
  quoteElement.textContent = satoshiQuotes[randomIndex];
}

// Function to set up sources toggle
function setupSourcesToggle() {
  const sourcesToggle = document.getElementById('sources-toggle');
  const sourcesElement = document.getElementById('market-cap-sources');
  
  sourcesToggle.addEventListener('click', function() {
    if (sourcesElement.style.display === 'block') {
      sourcesElement.style.display = 'none';
      this.textContent = 'Show sources';
    } else {
      sourcesElement.style.display = 'block';
      this.textContent = 'Hide sources';
    }
  });
}

// Function to set up periodic updates
function setupPeriodicUpdates() {
  // Update prices every 5 minutes
  setInterval(function() {
    // In a real implementation, this would fetch latest prices from an API
    console.log("Updating prices...");
  }, 5 * 60 * 1000);
  
  // Update Satoshi quote every hour
  setInterval(renderSatoshiQuote, 60 * 60 * 1000);
}
